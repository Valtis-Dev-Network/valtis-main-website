import { notFound } from "next/navigation";
import { prisma } from "@/lib/db/client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PageHero } from "@/components/site/page-shell";

export default async function DeveloperDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const developer = await prisma.developerProfile.findUnique({ where: { slug }, include: { skills: true } });
  if (!developer || developer.approvalStatus !== "APPROVED") notFound();
  return (
    <>
      <PageHero eyebrow={developer.verified ? "Verified Developer" : "Developer Profile"} title={developer.displayName} description={developer.bio}>
        <div className="flex flex-wrap gap-2">{developer.skills.map((skill) => <Badge key={skill.id} tone="slate">{skill.name}</Badge>)}</div>
      </PageHero>
      <section className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[1fr_320px] lg:px-8">
        <article className="prose prose-invert max-w-none prose-p:text-muted">
          <h2>{developer.roleTitle}</h2>
          <p>{developer.specialisations}</p>
          <h2>Availability</h2>
          <p>{developer.availability}</p>
        </article>
        <aside className="glass h-fit rounded-lg p-5">
          <h2 className="font-semibold">Links</h2>
          <div className="mt-4 grid gap-2">
            {developer.github && <Button href={developer.github} variant="secondary">GitHub</Button>}
            {developer.website && <Button href={developer.website} variant="secondary">Website</Button>}
            <Button href="/report" variant="danger">Report profile</Button>
          </div>
        </aside>
      </section>
    </>
  );
}
