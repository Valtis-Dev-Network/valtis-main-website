import { notFound } from "next/navigation";
import { prisma } from "@/lib/db/client";
import { PageHero } from "@/components/site/page-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default async function InitiativeDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const initiative = await prisma.initiative.findUnique({ where: { slug }, include: { members: true, updates: true } });
  if (!initiative) notFound();
  const goals = JSON.parse(initiative.goals) as string[];
  return (
    <>
      <PageHero eyebrow={initiative.status} title={initiative.name} description={initiative.summary}>
        <Badge tone="cyan">{initiative.progress}% progress</Badge>
      </PageHero>
      <section className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[1fr_320px] lg:px-8">
        <article className="prose prose-invert max-w-none prose-p:text-muted">
          <p>{initiative.description}</p>
          <h2>Goals</h2>
          <ul>{goals.map((goal) => <li key={goal}>{goal}</li>)}</ul>
          <h2>Updates</h2>
          {initiative.updates.map((update) => <section key={update.id}><h3>{update.title}</h3><p>{update.body}</p></section>)}
        </article>
        <aside className="glass h-fit rounded-lg p-5">
          <h2 className="font-semibold">Members</h2>
          <div className="mt-4 grid gap-3 text-sm text-muted">{initiative.members.map((member) => <p key={member.id}>{member.name} - {member.role}</p>)}</div>
          <div className="mt-5"><Button href="/contact">Get involved</Button></div>
        </aside>
      </section>
    </>
  );
}
