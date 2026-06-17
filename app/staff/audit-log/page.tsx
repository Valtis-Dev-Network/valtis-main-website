import { requireUser } from "@/lib/auth/session";
import { prisma } from "@/lib/db/client";
import { Card } from "@/components/ui/card";
import { StaffHeader } from "@/components/staff/staff-shell";

export default async function StaffAuditPage() {
  await requireUser("audit:view");
  const events = await prisma.auditLog.findMany({ include: { user: true }, orderBy: { createdAt: "desc" }, take: 100 });
  return (
    <>
      <StaffHeader title="Audit Log" text="Administrative actions recorded with user, entity, action and timestamp." />
      <div className="grid gap-3">{events.map((event) => <Card key={event.id}><div className="flex flex-wrap items-center justify-between gap-2"><h2 className="font-semibold">{event.action}</h2><span className="text-xs text-muted">{event.createdAt.toLocaleString()}</span></div><p className="mt-2 text-sm text-muted">{event.user?.email ?? "System"} - {event.entityType} - {event.entityName ?? event.entityId ?? "n/a"}</p></Card>)}</div>
    </>
  );
}
