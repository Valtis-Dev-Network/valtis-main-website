import { submitContactAction } from "@/app/actions";
import { PageHero } from "@/components/site/page-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Field, Input, Select, Textarea } from "@/components/ui/form-fields";

export default async function ContactPage({ searchParams }: { searchParams?: Promise<Record<string, string | undefined>> }) {
  const submitted = (await searchParams)?.submitted;
  return (
    <>
      <PageHero eyebrow="Contact" title="Talk to Valtis." description="Send a message about projects, profiles, partnerships, safety, legal questions or the platform itself." />
      <section className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
        {submitted && <div className="mb-6"><Badge tone="green">Message received.</Badge></div>}
        <form action={submitContactAction} className="glass grid gap-5 rounded-lg p-6">
          <Field label="Name" name="name"><Input id="name" name="name" required /></Field>
          <Field label="Email" name="email"><Input id="email" name="email" type="email" required /></Field>
          <Field label="Topic" name="topic"><Select id="topic" name="topic">{["General", "Project Submission", "Developer Profile", "Partnership", "Safety Concern", "Legal", "Other"].map((item) => <option key={item}>{item}</option>)}</Select></Field>
          <Field label="Message" name="message"><Textarea id="message" name="message" required /></Field>
          <Button type="submit">Send Message</Button>
        </form>
      </section>
    </>
  );
}
