import { updateReportStatusAction } from "@/app/actions";
import { requireUser } from "@/lib/auth/session";
import { prisma } from "@/lib/db/client";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/form-fields";
import { StaffHeader, StaffTable } from "@/components/staff/staff-shell";

export default async function StaffReportsPage() {
  await requireUser("reports:manage");
  const reports = await prisma.report.findMany({ orderBy: { createdAt: "desc" }, take: 50 });
  return (
    <>
      <StaffHeader title="Report Management" text="Review reports, change status and identify safeguarding/security concerns." />
      <StaffTable>
        {reports.map((report) => (
          <form key={report.id} action={updateReportStatusAction} className="grid gap-4 border-b border-white/5 p-4 text-sm md:grid-cols-[1fr_1.5fr_1fr_auto] md:items-center">
            <input type="hidden" name="id" value={report.id} />
            <span><strong>{report.type}</strong><br /><span className={report.safeguardingFlag ? "text-warning" : "text-muted"}>{report.urgency}</span></span>
            <span className="text-muted">{report.message}</span>
            <Select name="status" defaultValue={report.status}>{["OPEN", "REVIEWING", "RESOLVED", "ARCHIVED"].map((item) => <option key={item}>{item}</option>)}</Select>
            <Button type="submit" variant="secondary">Save</Button>
          </form>
        ))}
      </StaffTable>
    </>
  );
}
