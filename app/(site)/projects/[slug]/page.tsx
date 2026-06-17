import { notFound } from "next/navigation";
import { prisma } from "@/lib/db/client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PageHero } from "@/components/site/page-shell";

export default async function ProjectDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = await prisma.project.findUnique({ where: { slug }, include: { tags: { include: { tag: true } } } });
  if (!project || project.approvalStatus !== "APPROVED") notFound();
  const related = await prisma.project.findMany({ where: { approvalStatus: "APPROVED", id: { not: project.id }, category: project.category }, take: 3 });
  return (
    <>
      <PageHero eyebrow={project.category.replaceAll("_", " ")} title={project.name} description={project.shortDescription}>
        <div className="flex flex-wrap gap-2">
          <Badge tone="blue">{project.status.replaceAll("_", " ")}</Badge>
          {project.tags.map((item) => <Badge key={item.tagId} tone="slate">{item.tag.name}</Badge>)}
        </div>
      </PageHero>
      <section className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[1fr_320px] lg:px-8">
        <article className="prose prose-invert max-w-none prose-p:text-muted">
          <p>{project.fullDescription}</p>
          <h2>Owner</h2>
          <p>{project.ownerName}</p>
          <h2>Related projects</h2>
          <ul>{related.map((item) => <li key={item.id}>{item.name}</li>)}</ul>
        </article>
        <aside className="glass h-fit rounded-lg p-5">
          <h2 className="font-semibold">Project links</h2>
          <div className="mt-4 grid gap-2">
            {project.websiteUrl && <Button href={project.websiteUrl} variant="secondary">Website</Button>}
            {project.githubUrl && <Button href={project.githubUrl} variant="secondary">GitHub</Button>}
            {project.documentationUrl && <Button href={project.documentationUrl} variant="secondary">Documentation</Button>}
            <Button href="/report" variant="danger">Report project</Button>
          </div>
        </aside>
      </section>
    </>
  );
}
