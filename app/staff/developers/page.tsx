import { updateDeveloperModerationAction } from "@/app/actions";
import { requireUser } from "@/lib/auth/session";
import { prisma } from "@/lib/db/client";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/form-fields";
import { StaffHeader, StaffTable } from "@/components/staff/staff-shell";

export default async function StaffDevelopersPage() {
  await requireUser("developers:moderate");
  const developers = await prisma.developerProfile.findMany({ include: { skills: true }, orderBy: { updatedAt: "desc" }, take: 50 });
  return (
    <>
      <StaffHeader title="Developer Moderation" text="Review profiles, verification state and directory featuring." />
      <StaffTable>
        {developers.map((developer) => (
          <form key={developer.id} action={updateDeveloperModerationAction} className="grid gap-4 border-b border-white/5 p-4 text-sm md:grid-cols-[1.3fr_1fr_1.4fr] md:items-center">
            <input type="hidden" name="id" value={developer.id} />
            <span><strong>{developer.displayName}</strong><br /><span className="text-muted">{developer.roleTitle}</span></span>
            <Select name="approvalStatus" defaultValue={developer.approvalStatus}>{["PENDING", "APPROVED", "REJECTED", "ARCHIVED"].map((item) => <option key={item}>{item}</option>)}</Select>
            <span className="flex flex-wrap items-center gap-3"><label className="text-muted"><input name="verified" type="checkbox" defaultChecked={developer.verified} /> Verified</label><label className="text-muted"><input name="featured" type="checkbox" defaultChecked={developer.featured} /> Featured</label><Button type="submit" variant="secondary">Save</Button></span>
          </form>
        ))}
      </StaffTable>
    </>
  );
}
