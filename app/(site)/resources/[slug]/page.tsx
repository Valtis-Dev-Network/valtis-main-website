import ReactMarkdown from "react-markdown";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db/client";
import { PageHero } from "@/components/site/page-shell";
import { Badge } from "@/components/ui/badge";

export default async function ResourceDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const resource = await prisma.resource.findUnique({ where: { slug } });
  if (!resource || resource.status !== "PUBLISHED") notFound();
  const related = await prisma.resource.findMany({ where: { status: "PUBLISHED", id: { not: resource.id }, category: resource.category }, take: 3 });
  return (
    <>
      <PageHero eyebrow={resource.type.replaceAll("_", " ")} title={resource.title} description={resource.excerpt}>
        <Badge tone="slate">{resource.readTime} min read by {resource.author}</Badge>
      </PageHero>
      <section className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[1fr_280px] lg:px-8">
        <article className="prose prose-invert max-w-none prose-headings:scroll-mt-24 prose-p:text-muted">
          <ReactMarkdown>{resource.content}</ReactMarkdown>
        </article>
        <aside className="glass h-fit rounded-lg p-5">
          <h2 className="font-semibold">Related resources</h2>
          <div className="mt-4 grid gap-3 text-sm text-muted">{related.map((item) => <a key={item.id} className="hover:text-text" href={`/resources/${item.slug}`}>{item.title}</a>)}</div>
        </aside>
      </section>
    </>
  );
}
