import { prisma } from "@/lib/db/client";
import { DeveloperCard } from "@/components/site/content-cards";
import { EmptyState, PageHero } from "@/components/site/page-shell";
import { Button } from "@/components/ui/button";
import { Input, Select } from "@/components/ui/form-fields";

export default async function DevelopersPage({ searchParams }: { searchParams?: Promise<Record<string, string | undefined>> }) {
  const params = (await searchParams) ?? {};
  const q = params.q?.trim();
  const availability = params.availability || undefined;
  const developers = await prisma.developerProfile.findMany({
    where: {
      approvalStatus: "APPROVED",
      ...(availability ? { availability } : {}),
      ...(q ? { OR: [{ displayName: { contains: q } }, { roleTitle: { contains: q } }, { specialisations: { contains: q } }] } : {})
    },
    include: { skills: true },
    orderBy: [{ featured: "desc" }, { updatedAt: "desc" }]
  });
  return (
    <>
      <PageHero eyebrow="Developer Network" title="Find people building the ecosystem." description="Browse verified creators, maintainers, infrastructure engineers, documentation writers and technical community operators.">
        <Button href="/developers/submit">Submit Developer Profile</Button>
      </PageHero>
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <form className="glass mb-8 grid gap-3 rounded-lg p-4 md:grid-cols-[1fr_240px_auto]">
          <Input name="q" placeholder="Search skills or names" defaultValue={q} />
          <Select name="availability" defaultValue={availability ?? ""}>
            <option value="">All availability</option>
            {["Available", "Limited", "Not Available", "Open to Collaborations", "Open to Paid Work", "Open Source Only"].map((item) => <option key={item}>{item}</option>)}
          </Select>
          <Button type="submit" variant="secondary">Filter</Button>
        </form>
        {developers.length ? <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">{developers.map((developer) => <DeveloperCard key={developer.id} developer={developer} />)}</div> : <EmptyState title="No developers found" text="Try another filter or submit your profile for review." />}
      </section>
    </>
  );
}
