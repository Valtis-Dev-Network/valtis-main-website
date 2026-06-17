import { requireUser } from "@/lib/auth/session";
import { prisma } from "@/lib/db/client";
import { Card } from "@/components/ui/card";
import { StaffHeader } from "@/components/staff/staff-shell";

export default async function StaffUsersPage() {
  await requireUser("users:manage");
  const users = await prisma.user.findMany({ orderBy: { createdAt: "desc" } });
  return (
    <>
      <StaffHeader title="Staff Users" text="ADMIN and DIRECTOR area. The active staff account can change its own password from Staff Account." />
      <div className="grid gap-3">{users.map((user) => <Card key={user.id}><h2 className="font-semibold">{user.name}</h2><p className="text-sm text-muted">{user.email} - {user.role} - {user.disabled ? "Disabled" : "Active"}</p></Card>)}</div>
    </>
  );
}
