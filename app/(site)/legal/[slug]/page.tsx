import ReactMarkdown from "react-markdown";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db/client";
import { PageHero } from "@/components/site/page-shell";
import { Badge } from "@/components/ui/badge";

export default async function LegalPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const doc = await prisma.legalDocument.findUnique({ where: { slug } });
  if (!doc || doc.status !== "PUBLISHED") notFound();
  return (
    <>
      <PageHero eyebrow="Legal" title={doc.title} description="Versioned policy document for the Valtis platform.">
        <Badge tone="slate">Version {doc.version} {doc.publishedAt ? `- Updated ${doc.publishedAt.toLocaleDateString()}` : ""}</Badge>
      </PageHero>
      <article className="prose prose-invert mx-auto max-w-4xl px-4 py-12 prose-p:text-muted prose-li:text-muted sm:px-6 lg:px-8">
        <ReactMarkdown>{doc.content}</ReactMarkdown>
      </article>
    </>
  );
}
