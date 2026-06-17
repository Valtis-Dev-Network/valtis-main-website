import { submitDeveloperAction } from "@/app/actions";
import { PageHero } from "@/components/site/page-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Field, Input, Select, Textarea } from "@/components/ui/form-fields";

export default async function SubmitDeveloperPage({ searchParams }: { searchParams?: Promise<Record<string, string | undefined>> }) {
  const params = await searchParams;
  const submitted = params?.submitted;
  const error = params?.error;
  return (
    <>
      <PageHero eyebrow="Join the Network" title="Submit a developer profile." description="Profiles are reviewed before publication to keep the directory focused, safe and high-signal." />
      <section className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
        {submitted && <div className="mb-6"><Badge tone="green">Profile received. Staff will review it before publication.</Badge></div>}
        {error && <div className="mb-6"><Badge tone="red">Please add a fuller bio and required profile details before submitting.</Badge></div>}
        <form action={submitDeveloperAction} className="glass grid gap-5 rounded-lg p-6">
          <Field label="Display name" name="displayName"><Input id="displayName" name="displayName" required /></Field>
          <Field label="Role/title" name="roleTitle"><Input id="roleTitle" name="roleTitle" required /></Field>
          <Field label="Bio" name="bio"><Textarea id="bio" name="bio" required /></Field>
          <Field label="Skills, comma separated" name="skills"><Input id="skills" name="skills" placeholder="Java, Paper, Documentation" required /></Field>
          <Field label="Availability" name="availability">
            <Select id="availability" name="availability">{["Available", "Limited", "Not Available", "Open to Collaborations", "Open to Paid Work", "Open Source Only"].map((item) => <option key={item}>{item}</option>)}</Select>
          </Field>
          <Field label="GitHub" name="github"><Input id="github" name="github" type="url" /></Field>
          <Field label="Website" name="website"><Input id="website" name="website" type="url" /></Field>
          <Field label="Discord username" name="discordUsername"><Input id="discordUsername" name="discordUsername" /></Field>
          <Button type="submit">Submit for Review</Button>
        </form>
      </section>
    </>
  );
}
