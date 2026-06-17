import { prisma } from "@/lib/db/client";
import { AnimatedSection } from "@/components/site/animated-section";
import { MoodboardHexHero } from "@/components/site/moodboard-hex-hero";
import { SectionHeader } from "@/components/site/page-shell";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { DeveloperCard, InitiativeCard, ProjectCard, ResourceCard } from "@/components/site/content-cards";
import { getPlatformSettings } from "@/lib/site/settings";
import { Code2, GitPullRequestArrow, ShieldCheck, Sparkles, Users } from "lucide-react";

const pillars = [
  ["Community First", "Built by developers, for developers.", Users],
  ["Open & Transparent", "Open source, open development, open future.", Code2],
  ["Build Together", "Collaborate, contribute and create impact.", GitPullRequestArrow],
  ["Trust & Integrity", "Quality, security and respect in everything.", ShieldCheck],
  ["Innovate Continuously", "Pushing the boundaries of what is possible.", Sparkles]
];

export default async function HomePage() {
  const [projects, developers, initiatives, resources] = await Promise.all([
    prisma.project.findMany({ where: { approvalStatus: "APPROVED", featured: true }, include: { tags: { include: { tag: true } } }, take: 3 }),
    prisma.developerProfile.findMany({ where: { approvalStatus: "APPROVED", featured: true }, include: { skills: true }, take: 3 }),
    prisma.initiative.findMany({ where: { featured: true }, take: 3 }),
    prisma.resource.findMany({ where: { status: "PUBLISHED", featured: true }, take: 3 })
  ]);
  const settings = await getPlatformSettings();

  return (
    <>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 grid-mask opacity-60" />
        <div className="mx-auto grid min-h-[calc(100vh-80px)] max-w-7xl items-center gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[1fr_0.95fr] lg:px-8">
          <AnimatedSection className="relative">
            <Badge tone="cyan">Independent Minecraft Developer Network</Badge>
            <h1 className="mt-6 max-w-4xl text-5xl font-semibold tracking-tight text-white sm:text-7xl">
              Building the future of Minecraft development.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-muted">
              Valtis builds its own projects and reviews community submissions for plugins, mods, resource packs, servers, tooling and more.
              We list projects that meet quality, safety and Minecraft EULA expectations, while offering guidance to developers who want to build better.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button href="/projects">Explore Projects</Button>
              <Button href="/projects/submit" variant="secondary">
                Submit Your Project
              </Button>
              <Button href={settings.discordUrl} variant="secondary">
                Join Discord
              </Button>
            </div>
          </AnimatedSection>
          <AnimatedSection className="relative">
            <MoodboardHexHero />
          </AnimatedSection>
        </div>
      </section>

      <AnimatedSection className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="What is Valtis?"
          title="A serious platform for technical Minecraft communities."
          text="Valtis is an independent network for Minecraft developers, creators and technical communities. We maintain our own projects, accept community submissions, review listings against quality and policy standards, and provide guidance so developers can ship work they are proud of."
        />
      </AnimatedSection>

      <AnimatedSection className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <SectionHeader eyebrow="Platform Pillars" title="Built around quality, trust and collaboration." />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          {pillars.map(([title, text, Icon]) => (
            <Card key={title as string}>
              <Icon className="h-6 w-6 text-cyan" />
              <h3 className="mt-5 font-semibold">{title as string}</h3>
              <p className="mt-2 text-sm leading-6 text-muted">{text as string}</p>
            </Card>
          ))}
        </div>
      </AnimatedSection>

      <AnimatedSection className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <SectionHeader eyebrow="Featured Projects" title="Polished tools, libraries and community infrastructure." />
        <div className="grid gap-4 md:grid-cols-3">{projects.map((project) => <ProjectCard key={project.id} project={project} />)}</div>
      </AnimatedSection>

      <AnimatedSection className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <SectionHeader eyebrow="Developer Network" title="Find maintainers, engineers and creators." />
        <div className="grid gap-4 md:grid-cols-3">{developers.map((developer) => <DeveloperCard key={developer.id} developer={developer} />)}</div>
      </AnimatedSection>

      <AnimatedSection className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <SectionHeader eyebrow="Initiatives" title="Community-backed programmes with visible progress." />
        <div className="grid gap-4 md:grid-cols-3">{initiatives.map((initiative) => <InitiativeCard key={initiative.id} initiative={initiative} />)}</div>
      </AnimatedSection>

      <AnimatedSection className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <SectionHeader eyebrow="Resources" title="Guides, notes and operational playbooks." />
        <div className="grid gap-4 md:grid-cols-3">{resources.map((resource) => <ResourceCard key={resource.id} resource={resource} />)}</div>
      </AnimatedSection>

      <AnimatedSection className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="glass rounded-lg p-8 md:p-12">
          <h2 className="text-3xl font-semibold sm:text-5xl">Build something with Valtis.</h2>
          <p className="mt-4 max-w-2xl text-muted">
            Join a network of developers, creators and technical communities shaping the future of Minecraft development.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button href="/projects/submit">Submit a Project</Button>
            <Button href="/developers/submit" variant="secondary">
              Join the Network
            </Button>
            <Button href={settings.discordUrl} variant="secondary">
              Join Discord
            </Button>
          </div>
        </div>
      </AnimatedSection>
    </>
  );
}
