import "server-only";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createHmac, timingSafeEqual } from "node:crypto";
import { prisma } from "@/lib/db/client";
import type { Permission } from "@/lib/permissions/roles";
import { can } from "@/lib/permissions/roles";

const COOKIE_NAME = "valtis_staff_session";
const MAX_AGE_SECONDS = 60 * 60 * 8;

function secret() {
  return process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET || "development-only-secret";
}

function sign(payload: string) {
  return createHmac("sha256", secret()).update(payload).digest("base64url");
}

export function createSessionValue(userId: string) {
  const expires = Math.floor(Date.now() / 1000) + MAX_AGE_SECONDS;
  const payload = Buffer.from(JSON.stringify({ userId, expires })).toString("base64url");
  return `${payload}.${sign(payload)}`;
}

export function verifySessionValue(value?: string) {
  if (!value?.includes(".")) return null;
  const [payload, signature] = value.split(".");
  const expected = sign(payload);
  const actualBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expected);
  if (actualBuffer.length !== expectedBuffer.length || !timingSafeEqual(actualBuffer, expectedBuffer)) return null;
  try {
    const decoded = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as { userId: string; expires: number };
    if (!decoded.userId || decoded.expires < Math.floor(Date.now() / 1000)) return null;
    return decoded;
  } catch {
    return null;
  }
}

export async function setSession(userId: string) {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, createSessionValue(userId), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: MAX_AGE_SECONDS,
    path: "/"
  });
}

export async function clearSession() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

export async function getCurrentUser() {
  const cookieStore = await cookies();
  const verified = verifySessionValue(cookieStore.get(COOKIE_NAME)?.value);
  if (!verified) return null;
  const user = await prisma.user.findUnique({ where: { id: verified.userId } });
  if (!user || user.disabled) return null;
  return user;
}

export async function requireUser(permission?: Permission) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  if (permission && !can(user.role, permission)) redirect("/staff");
  return user;
}
