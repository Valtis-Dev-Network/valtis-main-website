import { prisma } from "@/lib/db/client";
import { InitiativeCard } from "@/components/site/content-cards";
import { EmptyState, PageHero } from "@/components/site/page-shell";
import { Button } from "@/components/ui/button";
import { Input, Select } from "@/components/ui/form-fields";

export default async function InitiativesPage({ searchParams }: { searchParams?: Promise<Record<string, string | undefined>> }) {
  const params = (await searchParams) ?? {};
  const q = params.q?.trim();
  const status = params.status || undefined;
  const initiatives = await prisma.initiative.findMany({
    where: {
      ...(status ? { status: status as never } : {}),
      ...(q ? { OR: [{ name: { contains: q } }, { summary: { contains: q } }] } : {})
    },
    orderBy: [{ featured: "desc" }, { updatedAt: "desc" }]
  });
  return (
    <>
      <PageHero eyebrow="Initiatives" title="Community-backed efforts with visible progress." description="Programmes, working groups and collaborations that help developers ship, document and maintain better Minecraft ecosystem projects." />
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <form className="glass mb-8 grid gap-3 rounded-lg p-4 md:grid-cols-[1fr_240px_auto]">
          <Input name="q" placeholder="Search initiatives" defaultValue={q} />
          <Select name="status" defaultValue={status ?? ""}>
            <option value="">All statuses</option>
            {["PLANNED", "ACTIVE", "PAUSED", "COMPLETED", "ARCHIVED"].map((item) => <option key={item}>{item}</option>)}
          </Select>
          <Button type="submit" variant="secondary">Filter</Button>
        </form>
        {initiatives.length ? <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">{initiatives.map((initiative) => <InitiativeCard key={initiative.id} initiative={initiative} />)}</div> : <EmptyState title="No initiatives found" text="Try another search." />}
      </section>
    </>
  );
}
