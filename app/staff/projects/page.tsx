import { updateProjectModerationAction } from "@/app/actions";
import { requireUser } from "@/lib/auth/session";
import { prisma } from "@/lib/db/client";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/form-fields";
import { StaffHeader, StaffTable } from "@/components/staff/staff-shell";

export default async function StaffProjectsPage() {
  await requireUser("projects:moderate");
  const projects = await prisma.project.findMany({ orderBy: { updatedAt: "desc" }, take: 50 });
  return (
    <>
      <StaffHeader title="Project Moderation" text="Approve, reject, feature and archive submitted projects. All changes are audited server-side." />
      <StaffTable>
        <div className="grid min-w-[820px] grid-cols-[1.5fr_1fr_1fr_1.2fr] gap-4 border-b border-white/10 p-4 text-xs font-semibold uppercase tracking-wide text-muted">
          <span>Project</span><span>Category</span><span>Status</span><span>Action</span>
        </div>
        {projects.map((project) => (
          <form key={project.id} action={updateProjectModerationAction} className="grid min-w-[820px] grid-cols-[1.5fr_1fr_1fr_1.2fr] items-center gap-4 border-b border-white/5 p-4 text-sm">
            <input type="hidden" name="id" value={project.id} />
            <span><strong>{project.name}</strong><br /><span className="text-muted">{project.shortDescription}</span></span>
            <span>{project.category.replaceAll("_", " ")}</span>
            <Select name="approvalStatus" defaultValue={project.approvalStatus}>{["PENDING", "APPROVED", "REJECTED", "ARCHIVED"].map((item) => <option key={item}>{item}</option>)}</Select>
            <span className="flex items-center gap-3"><label className="text-muted"><input name="featured" type="checkbox" defaultChecked={project.featured} /> Featured</label><Button type="submit" variant="secondary">Save</Button></span>
          </form>
        ))}
      </StaffTable>
    </>
  );
}
