"use server";

import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createHash } from "node:crypto";
import { headers } from "next/headers";
import { prisma } from "@/lib/db/client";
import { clearSession, getCurrentUser, setSession } from "@/lib/auth/session";
import { assertCan } from "@/lib/permissions/roles";
import {
  contactSchema,
  developerSubmissionSchema,
  legalUpdateSchema,
  loginSchema,
  projectSubmissionSchema,
  reportSchema
} from "@/lib/validation/forms";

type ApprovalStatus = "PENDING" | "APPROVED" | "REJECTED" | "ARCHIVED";
type ResourceStatus = "DRAFT" | "PUBLISHED" | "ARCHIVED";
type LegalDocumentStatus = "DRAFT" | "PUBLISHED" | "ARCHIVED";
const allowedStaffEmail = "alfiepineapple@gmail.com";

function value(formData: FormData, key: string) {
  return String(formData.get(key) ?? "");
}

function slugify(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

async function audit(action: string, entityType: string, entityId?: string, entityName?: string, newValues?: unknown) {
  const user = await getCurrentUser();
  await prisma.auditLog.create({
    data: {
      userId: user?.id,
      action,
      entityType,
      entityId,
      entityName,
      newValues: newValues ? JSON.stringify(newValues) : null
    }
  });
}

export async function loginAction(formData: FormData) {
  const parsed = loginSchema.safeParse({ email: value(formData, "email"), password: value(formData, "password") });
  if (!parsed.success) redirect("/login?error=invalid");
  const email = parsed.data.email.toLowerCase();
  if (email !== allowedStaffEmail) redirect("/login?error=invalid");
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || user.disabled) redirect("/login?error=invalid");
  const valid = await bcrypt.compare(parsed.data.password, user.passwordHash);
  if (!valid) redirect("/login?error=invalid");
  await prisma.user.update({ where: { id: user.id }, data: { lastLoginAt: new Date() } });
  await setSession(user.id);
  await audit("auth.login", "User", user.id, user.email);
  redirect("/staff");
}

export async function logoutAction() {
  await audit("auth.logout", "User");
  await clearSession();
  redirect("/");
}

export async function submitProjectAction(formData: FormData) {
  const parsed = projectSubmissionSchema.safeParse({
    name: value(formData, "name"),
    shortDescription: value(formData, "shortDescription"),
    category: value(formData, "category"),
    ownerName: value(formData, "ownerName"),
    websiteUrl: value(formData, "websiteUrl"),
    githubUrl: value(formData, "githubUrl"),
    discordUrl: value(formData, "discordUrl"),
    fullDescription: value(formData, "fullDescription")
  });
  if (!parsed.success) redirect("/projects/submit?error=validation");
  await prisma.project.create({
    data: {
      name: parsed.data.name,
      slug: `${slugify(parsed.data.name)}-${Date.now().toString(36)}`,
      shortDescription: parsed.data.shortDescription,
      fullDescription: parsed.data.fullDescription,
      category: parsed.data.category,
      ownerName: parsed.data.ownerName,
      websiteUrl: parsed.data.websiteUrl || null,
      githubUrl: parsed.data.githubUrl || null,
      discordUrl: parsed.data.discordUrl || null,
      status: "CONCEPT",
      approvalStatus: "PENDING"
    }
  });
  redirect("/projects/submit?submitted=1");
}

export async function submitDeveloperAction(formData: FormData) {
  const parsed = developerSubmissionSchema.safeParse({
    displayName: value(formData, "displayName"),
    roleTitle: value(formData, "roleTitle"),
    bio: value(formData, "bio"),
    skills: value(formData, "skills"),
    availability: value(formData, "availability"),
    github: value(formData, "github"),
    website: value(formData, "website"),
    discordUsername: value(formData, "discordUsername")
  });
  if (!parsed.success) redirect("/developers/submit?error=validation");
  await prisma.developerProfile.create({
    data: {
      displayName: parsed.data.displayName,
      slug: `${slugify(parsed.data.displayName)}-${Date.now().toString(36)}`,
      roleTitle: parsed.data.roleTitle,
      bio: parsed.data.bio,
      specialisations: parsed.data.skills,
      availability: parsed.data.availability,
      github: parsed.data.github || null,
      website: parsed.data.website || null,
      discordUsername: parsed.data.discordUsername || null,
      approvalStatus: "PENDING",
      skills: { create: parsed.data.skills.split(",").map((name) => ({ name: name.trim() })).filter((item) => item.name) }
    }
  });
  redirect("/developers/submit?submitted=1");
}

export async function changePasswordAction(formData: FormData) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const currentPassword = value(formData, "currentPassword");
  const newPassword = value(formData, "newPassword");
  const confirmPassword = value(formData, "confirmPassword");

  if (newPassword.length < 12 || newPassword !== confirmPassword) {
    redirect("/staff/account?error=password");
  }

  const valid = await bcrypt.compare(currentPassword, user.passwordHash);
  if (!valid) redirect("/staff/account?error=current");

  await prisma.user.update({
    where: { id: user.id },
    data: { passwordHash: await bcrypt.hash(newPassword, 12) }
  });
  await audit("user.password.changed", "User", user.id, user.email);
  redirect("/staff/account?updated=1");
}

export async function submitContactAction(formData: FormData) {
  const parsed = contactSchema.safeParse({
    name: value(formData, "name"),
    email: value(formData, "email"),
    topic: value(formData, "topic"),
    message: value(formData, "message")
  });
  if (!parsed.success) redirect("/contact?error=validation");
  await prisma.contactMessage.create({ data: parsed.data });
  redirect("/contact?submitted=1");
}

export async function submitReportAction(formData: FormData) {
  const parsed = reportSchema.safeParse({
    type: value(formData, "type"),
    relatedUrl: value(formData, "relatedUrl"),
    name: value(formData, "name"),
    email: value(formData, "email"),
    message: value(formData, "message"),
    urgency: value(formData, "urgency"),
    consentToContact: formData.get("consentToContact") === "on",
    anonymous: formData.get("anonymous") === "on"
  });
  if (!parsed.success) redirect("/report?error=validation");
  await prisma.report.create({
    data: {
      type: parsed.data.type,
      relatedUrl: parsed.data.relatedUrl || null,
      name: parsed.data.anonymous ? null : parsed.data.name || null,
      email: parsed.data.anonymous ? null : parsed.data.email || null,
      message: parsed.data.message,
      urgency: parsed.data.urgency,
      consentToContact: parsed.data.consentToContact,
      anonymous: parsed.data.anonymous,
      safeguardingFlag: parsed.data.type === "SAFEGUARDING"
    }
  });
  redirect("/report?submitted=1");
}

export async function saveCookieConsentAction(preferences: {
  consentId: string;
  necessary: boolean;
  preferences: boolean;
  analytics: boolean;
  marketing: boolean;
}) {
  const headerStore = await headers();
  const userAgent = headerStore.get("user-agent") || "";
  const userAgentHash = createHash("sha256").update(userAgent).digest("hex");
  await prisma.cookieConsent.upsert({
    where: { consentId: preferences.consentId },
    update: { ...preferences, userAgentHash },
    create: { ...preferences, userAgentHash }
  });
}

export async function updateProjectModerationAction(formData: FormData) {
  const user = await getCurrentUser();
  assertCan(user?.role, "projects:moderate");
  const id = value(formData, "id");
  const approvalStatus = value(formData, "approvalStatus") as ApprovalStatus;
  const featured = formData.get("featured") === "on";
  const project = await prisma.project.update({ where: { id }, data: { approvalStatus, featured } });
  await audit("project.moderated", "Project", project.id, project.name, { approvalStatus, featured });
  revalidatePath("/staff/projects");
}

export async function updateDeveloperModerationAction(formData: FormData) {
  const user = await getCurrentUser();
  assertCan(user?.role, "developers:moderate");
  const id = value(formData, "id");
  const approvalStatus = value(formData, "approvalStatus") as ApprovalStatus;
  const verified = formData.get("verified") === "on";
  const featured = formData.get("featured") === "on";
  const profile = await prisma.developerProfile.update({ where: { id }, data: { approvalStatus, verified, featured } });
  await audit("developer.moderated", "DeveloperProfile", profile.id, profile.displayName, { approvalStatus, verified, featured });
  revalidatePath("/staff/developers");
}

export async function updateResourceStatusAction(formData: FormData) {
  const user = await getCurrentUser();
  assertCan(user?.role, "resources:edit");
  const id = value(formData, "id");
  const status = value(formData, "status") as ResourceStatus;
  const resource = await prisma.resource.update({ where: { id }, data: { status, publishedAt: status === "PUBLISHED" ? new Date() : null } });
  await audit("resource.status", "Resource", resource.id, resource.title, { status });
  revalidatePath("/staff/resources");
}

export async function updateReportStatusAction(formData: FormData) {
  const user = await getCurrentUser();
  assertCan(user?.role, "reports:manage");
  const id = value(formData, "id");
  const status = value(formData, "status");
  const report = await prisma.report.update({ where: { id }, data: { status } });
  await audit("report.status", "Report", report.id, report.type, { status });
  revalidatePath("/staff/reports");
}

export async function addSafeguardingNoteAction(formData: FormData) {
  const user = await getCurrentUser();
  assertCan(user?.role, "safeguarding:manage");
  const caseId = value(formData, "caseId");
  const body = value(formData, "body");
  await prisma.safeguardingNote.create({ data: { caseId, body, author: user?.name || "Staff" } });
  await audit("safeguarding.note.created", "SafeguardingCase", caseId);
  revalidatePath("/staff/safeguarding");
}

export async function updateLegalDocumentAction(formData: FormData) {
  const user = await getCurrentUser();
  assertCan(user?.role, "legal:manage");
  const parsed = legalUpdateSchema.safeParse({
    id: value(formData, "id"),
    title: value(formData, "title"),
    version: value(formData, "version"),
    content: value(formData, "content"),
    status: value(formData, "status")
  });
  if (!parsed.success) redirect("/staff/legal?error=validation");
  const doc = await prisma.legalDocument.update({
    where: { id: parsed.data.id },
    data: {
      title: parsed.data.title,
      version: parsed.data.version,
      content: parsed.data.content,
      status: parsed.data.status as LegalDocumentStatus,
      publishedAt: parsed.data.status === "PUBLISHED" ? new Date() : null,
      updatedById: user?.id
    }
  });
  await audit("legal.updated", "LegalDocument", doc.id, doc.title, { status: doc.status, version: doc.version });
  revalidatePath("/staff/legal");
  revalidatePath(`/legal/${doc.slug}`);
}

export async function updatePlatformSettingsAction(formData: FormData) {
  const user = await getCurrentUser();
  assertCan(user?.role, "settings:manage");
  const discordUrl = value(formData, "discordUrl");
  const githubUrl = value(formData, "githubUrl");
  const payload = JSON.stringify({ discordUrl, githubUrl });
  await prisma.siteSetting.upsert({
    where: { key: "platform" },
    update: { value: payload },
    create: { key: "platform", value: payload }
  });
  await audit("settings.platform.updated", "SiteSetting", "platform", "Platform settings", { discordUrl, githubUrl });
  revalidatePath("/");
  revalidatePath("/home");
  revalidatePath("/staff/settings");
}
