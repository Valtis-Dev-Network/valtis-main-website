import { prisma } from "@/lib/db/client";
import { Card } from "@/components/ui/card";
import { StaffHeader } from "@/components/staff/staff-shell";

export default async function StaffOverviewPage() {
  const [projects, pendingProjects, developers, resources, initiatives, messages, reports, cases, audit] = await Promise.all([
    prisma.project.count(),
    prisma.project.count({ where: { approvalStatus: "PENDING" } }),
    prisma.developerProfile.count({ where: { approvalStatus: "APPROVED" } }),
    prisma.resource.count({ where: { status: "PUBLISHED" } }),
    prisma.initiative.count({ where: { status: "ACTIVE" } }),
    prisma.contactMessage.count({ where: { archived: false } }),
    prisma.report.count({ where: { status: { not: "ARCHIVED" } } }),
    prisma.safeguardingCase.count({ where: { status: { in: ["OPEN", "REVIEWING", "ESCALATED"] } } }),
    prisma.auditLog.findMany({ orderBy: { createdAt: "desc" }, take: 8 })
  ]);
  const stats = [
    ["Total projects", projects],
    ["Pending projects", pendingProjects],
    ["Approved developers", developers],
    ["Published resources", resources],
    ["Active initiatives", initiatives],
    ["Contact messages", messages],
    ["Open reports", reports],
    ["Open safeguarding cases", cases]
  ];
  return (
    <>
      <StaffHeader title="Dashboard" text="Operational overview for moderation, publishing, reporting, safety and platform health." />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {stats.map(([label, value]) => <Card key={label as string}><p className="text-sm text-muted">{label as string}</p><p className="mt-3 text-3xl font-semibold">{value as number}</p></Card>)}
      </div>
      <section className="mt-8">
        <h2 className="mb-4 text-xl font-semibold">Recent audit events</h2>
        <div className="grid gap-3">{audit.map((item) => <Card key={item.id}><p className="text-sm font-medium">{item.action}</p><p className="text-xs text-muted">{item.entityType} - {item.entityName ?? item.entityId} - {item.createdAt.toLocaleString()}</p></Card>)}</div>
      </section>
    </>
  );
}
