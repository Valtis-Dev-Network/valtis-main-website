import { prisma } from "@/lib/db/client";
import { ResourceCard } from "@/components/site/content-cards";
import { EmptyState, PageHero } from "@/components/site/page-shell";
import { Button } from "@/components/ui/button";
import { Input, Select } from "@/components/ui/form-fields";

export default async function ResourcesPage({ searchParams }: { searchParams?: Promise<Record<string, string | undefined>> }) {
  const params = (await searchParams) ?? {};
  const q = params.q?.trim();
  const type = params.type || undefined;
  const resources = await prisma.resource.findMany({
    where: {
      status: "PUBLISHED",
      ...(type ? { type: type as never } : {}),
      ...(q ? { OR: [{ title: { contains: q } }, { excerpt: { contains: q } }, { category: { contains: q } }] } : {})
    },
    orderBy: [{ featured: "desc" }, { publishedAt: "desc" }]
  });
  return (
    <>
      <PageHero eyebrow="Resources" title="Guides for building better projects." description="Security notes, documentation practice, technical tutorials and opinionated operational guidance for Minecraft development communities." />
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <form className="glass mb-8 grid gap-3 rounded-lg p-4 md:grid-cols-[1fr_240px_auto]">
          <Input name="q" placeholder="Search resources" defaultValue={q} />
          <Select name="type" defaultValue={type ?? ""}>
            <option value="">All types</option>
            {["GUIDE", "ARTICLE", "DOCUMENTATION", "TUTORIAL", "OPINION", "ANNOUNCEMENT", "SECURITY_NOTE", "BEST_PRACTICE"].map((item) => <option key={item} value={item}>{item.replaceAll("_", " ")}</option>)}
          </Select>
          <Button type="submit" variant="secondary">Filter</Button>
        </form>
        {resources.length ? <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">{resources.map((resource) => <ResourceCard key={resource.id} resource={resource} />)}</div> : <EmptyState title="No resources found" text="Try another search." />}
      </section>
    </>
  );
}
