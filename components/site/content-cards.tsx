import Link from "next/link";
import type { DeveloperProfile, Initiative, Project, Resource } from "@prisma/client";
import { ArrowUpRight, Code2, Cuboid, FileText, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

type ProjectWithTags = Project & { tags?: { tag: { name: string } }[] };
type DeveloperWithSkills = DeveloperProfile & { skills?: { name: string }[] };

function Tags({ items }: { items: string[] }) {
  return (
    <div className="flex flex-wrap gap-2">
      {items.slice(0, 4).map((tag) => (
        <Badge key={tag} tone="slate">
          {tag}
        </Badge>
      ))}
    </div>
  );
}

export function ProjectCard({ project }: { project: ProjectWithTags }) {
  return (
    <Link href={`/projects/${project.slug}`} className="group block">
      <Card className="h-full">
        <div className="mb-5 flex items-center justify-between">
          <span className="rounded-md bg-primary/12 p-2 text-cyan">
            <Cuboid className="h-5 w-5" />
          </span>
          <ArrowUpRight className="h-4 w-4 text-muted transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-cyan" />
        </div>
        <h3 className="text-lg font-semibold">{project.name}</h3>
        <p className="mt-2 line-clamp-3 text-sm leading-6 text-muted">{project.shortDescription}</p>
        <div className="mt-5 flex items-center gap-2">
          <Badge tone="blue">{project.category.replaceAll("_", " ")}</Badge>
          <Badge tone={project.featured ? "cyan" : "slate"}>{project.status.replaceAll("_", " ")}</Badge>
        </div>
        <div className="mt-4">
          <Tags items={project.tags?.map((item) => item.tag.name) ?? []} />
        </div>
      </Card>
    </Link>
  );
}

export function DeveloperCard({ developer }: { developer: DeveloperWithSkills }) {
  return (
    <Link href={`/developers/${developer.slug}`} className="group block">
      <Card className="h-full">
        <div className="mb-5 flex items-center justify-between">
          <span className="rounded-md bg-cyan/10 p-2 text-cyan">
            <Users className="h-5 w-5" />
          </span>
          <Badge tone={developer.verified ? "green" : "slate"}>{developer.verified ? "Verified" : "Profile"}</Badge>
        </div>
        <h3 className="text-lg font-semibold">{developer.displayName}</h3>
        <p className="text-sm text-cyan">{developer.roleTitle}</p>
        <p className="mt-3 line-clamp-3 text-sm leading-6 text-muted">{developer.bio}</p>
        <div className="mt-4">
          <Tags items={developer.skills?.map((skill) => skill.name) ?? []} />
        </div>
      </Card>
    </Link>
  );
}

export function ResourceCard({ resource }: { resource: Resource }) {
  return (
    <Link href={`/resources/${resource.slug}`} className="group block">
      <Card className="h-full">
        <div className="mb-5 flex items-center justify-between">
          <span className="rounded-md bg-indigo/10 p-2 text-indigo">
            <FileText className="h-5 w-5" />
          </span>
          <span className="text-xs text-muted">{resource.readTime} min read</span>
        </div>
        <h3 className="text-lg font-semibold">{resource.title}</h3>
        <p className="mt-2 line-clamp-3 text-sm leading-6 text-muted">{resource.excerpt}</p>
        <div className="mt-5 flex gap-2">
          <Badge tone="cyan">{resource.type.replaceAll("_", " ")}</Badge>
          <Badge tone="slate">{resource.category}</Badge>
        </div>
      </Card>
    </Link>
  );
}

export function InitiativeCard({ initiative }: { initiative: Initiative }) {
  return (
    <Link href={`/initiatives/${initiative.slug}`} className="group block">
      <Card className="h-full">
        <div className="mb-5 flex items-center justify-between">
          <span className="rounded-md bg-primary/12 p-2 text-primary">
            <Code2 className="h-5 w-5" />
          </span>
          <Badge tone="blue">{initiative.status}</Badge>
        </div>
        <h3 className="text-lg font-semibold">{initiative.name}</h3>
        <p className="mt-2 line-clamp-3 text-sm leading-6 text-muted">{initiative.summary}</p>
        <div className="mt-5 h-2 overflow-hidden rounded-full bg-white/8">
          <div className="h-full rounded-full bg-gradient-to-r from-primary to-cyan" style={{ width: `${initiative.progress}%` }} />
        </div>
        <p className="mt-2 text-xs text-muted">{initiative.progress}% progress</p>
      </Card>
    </Link>
  );
}
