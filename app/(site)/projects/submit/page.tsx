import { submitProjectAction } from "@/app/actions";
import { PageHero } from "@/components/site/page-shell";
import { Button } from "@/components/ui/button";
import { Field, Input, Select, Textarea } from "@/components/ui/form-fields";
import { Badge } from "@/components/ui/badge";

const projectCategories = ["PLUGIN", "MOD", "RESOURCE_PACK", "SERVER", "SERVER_NETWORK", "INFRASTRUCTURE", "WEBSITE", "TOOLING", "LIBRARY", "COMMUNITY", "OTHER"];

export default async function SubmitProjectPage({ searchParams }: { searchParams?: Promise<Record<string, string | undefined>> }) {
  const params = await searchParams;
  const submitted = params?.submitted;
  const error = params?.error;
  return (
    <>
      <PageHero eyebrow="Submit a Project" title="Share a project with the Valtis network." description="Submit plugins, mods, resource packs, servers, networks, tooling and community projects. Valtis reviews submissions for quality, safety and Minecraft EULA compatibility before listing." />
      <section className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
        {submitted && <div className="mb-6"><Badge tone="green">Submission received. Staff will review it before publication.</Badge></div>}
        {error && <div className="mb-6"><Badge tone="red">Please add a fuller short description and full description before submitting.</Badge></div>}
        <form action={submitProjectAction} className="glass grid gap-5 rounded-lg p-6">
          <Field label="Project name" name="name"><Input id="name" name="name" required /></Field>
          <Field label="Short description (at least 20 characters)" name="shortDescription"><Input id="shortDescription" name="shortDescription" minLength={20} required /></Field>
          <Field label="Category" name="category">
            <Select id="category" name="category" required>{projectCategories.map((item) => <option key={item} value={item}>{item.replaceAll("_", " ")}</option>)}</Select>
          </Field>
          <Field label="Owner name" name="ownerName"><Input id="ownerName" name="ownerName" required /></Field>
          <Field label="Website URL" name="websiteUrl"><Input id="websiteUrl" name="websiteUrl" type="url" /></Field>
          <Field label="GitHub URL" name="githubUrl"><Input id="githubUrl" name="githubUrl" type="url" /></Field>
          <Field label="Discord URL" name="discordUrl"><Input id="discordUrl" name="discordUrl" type="url" /></Field>
          <Field label="Full description (at least 80 characters)" name="fullDescription"><Textarea id="fullDescription" name="fullDescription" minLength={80} required /></Field>
          <Button type="submit">Submit for Review</Button>
        </form>
      </section>
    </>
  );
}
