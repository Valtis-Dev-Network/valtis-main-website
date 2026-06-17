import { requireUser } from "@/lib/auth/session";
import { prisma } from "@/lib/db/client";
import { Card } from "@/components/ui/card";
import { StaffHeader } from "@/components/staff/staff-shell";

export default async function StaffInitiativesPage() {
  await requireUser("initiatives:edit");
  const initiatives = await prisma.initiative.findMany({ include: { members: true, updates: true }, orderBy: { updatedAt: "desc" } });
  return (
    <>
      <StaffHeader title="Initiative Management" text="Track initiative status, members, updates and progress." />
      <div className="grid gap-4 md:grid-cols-2">
        {initiatives.map((initiative) => (
          <Card key={initiative.id}>
            <div className="flex items-center justify-between gap-3"><h2 className="font-semibold">{initiative.name}</h2><span className="text-sm text-cyan">{initiative.status}</span></div>
            <p className="mt-2 text-sm leading-6 text-muted">{initiative.summary}</p>
            <div className="mt-4 h-2 rounded-full bg-white/8"><div className="h-2 rounded-full bg-gradient-to-r from-primary to-cyan" style={{ width: `${initiative.progress}%` }} /></div>
            <p className="mt-3 text-xs text-muted">{initiative.members.length} members - {initiative.updates.length} updates</p>
          </Card>
        ))}
      </div>
    </>
  );
}
