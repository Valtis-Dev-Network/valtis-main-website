import { prisma } from "@/lib/db/client";
import { ProjectCard } from "@/components/site/content-cards";
import { PageHero, EmptyState } from "@/components/site/page-shell";
import { Button } from "@/components/ui/button";
import { Input, Select } from "@/components/ui/form-fields";

export default async function ProjectsPage({ searchParams }: { searchParams?: Promise<Record<string, string | undefined>> }) {
  const params = (await searchParams) ?? {};
  const q = params.q?.trim();
  const category = params.category || undefined;
  const status = params.status || undefined;
  const projects = await prisma.project.findMany({
    where: {
      approvalStatus: "APPROVED",
      ...(q ? { OR: [{ name: { contains: q } }, { shortDescription: { contains: q } }] } : {}),
      ...(category ? { category: category as never } : {}),
      ...(status ? { status: status as never } : {})
    },
    include: { tags: { include: { tag: true } } },
    orderBy: [{ featured: "desc" }, { updatedAt: "desc" }]
  });

  return (
    <>
      <PageHero eyebrow="Project Directory" title="Explore the Valtis project network." description="Discover plugins, mods, libraries, infrastructure tools, dashboards and documentation projects reviewed for quality." >
        <Button href="/projects/submit">Submit a Project</Button>
      </PageHero>
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <form className="glass mb-8 grid gap-3 rounded-lg p-4 md:grid-cols-[1fr_220px_220px_auto]">
          <Input name="q" placeholder="Search projects" defaultValue={q} />
          <Select name="category" defaultValue={category ?? ""}>
            <option value="">All categories</option>
            {["PLUGIN", "MOD", "RESOURCE_PACK", "SERVER", "SERVER_NETWORK", "INFRASTRUCTURE", "WEBSITE", "TOOLING", "LIBRARY", "COMMUNITY", "OTHER"].map((item) => (
              <option key={item} value={item}>{item.replaceAll("_", " ")}</option>
            ))}
          </Select>
          <Select name="status" defaultValue={status ?? ""}>
            <option value="">All statuses</option>
            {["CONCEPT", "IN_DEVELOPMENT", "ACTIVE", "MAINTAINED", "PAUSED", "ARCHIVED"].map((item) => (
              <option key={item} value={item}>{item.replaceAll("_", " ")}</option>
            ))}
          </Select>
          <Button type="submit" variant="secondary">Filter</Button>
        </form>
        {projects.length ? <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">{projects.map((project) => <ProjectCard key={project.id} project={project} />)}</div> : <EmptyState title="No projects found" text="Try a different search or submit a new project for review." />}
      </section>
    </>
  );
}
