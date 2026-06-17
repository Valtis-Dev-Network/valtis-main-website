import { updateResourceStatusAction } from "@/app/actions";
import { requireUser } from "@/lib/auth/session";
import { prisma } from "@/lib/db/client";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/form-fields";
import { StaffHeader, StaffTable } from "@/components/staff/staff-shell";

export default async function StaffResourcesPage() {
  await requireUser("resources:edit");
  const resources = await prisma.resource.findMany({ orderBy: { updatedAt: "desc" }, take: 50 });
  return (
    <>
      <StaffHeader title="Resource Management" text="Publish, unpublish or archive resource content. Markdown editing is available through the seedable resource records." />
      <StaffTable>
        {resources.map((resource) => (
          <form key={resource.id} action={updateResourceStatusAction} className="grid gap-4 border-b border-white/5 p-4 text-sm md:grid-cols-[1.6fr_1fr_auto] md:items-center">
            <input type="hidden" name="id" value={resource.id} />
            <span><strong>{resource.title}</strong><br /><span className="text-muted">{resource.excerpt}</span></span>
            <Select name="status" defaultValue={resource.status}>{["DRAFT", "PUBLISHED", "ARCHIVED"].map((item) => <option key={item}>{item}</option>)}</Select>
            <Button type="submit" variant="secondary">Save</Button>
          </form>
        ))}
      </StaffTable>
    </>
  );
}
