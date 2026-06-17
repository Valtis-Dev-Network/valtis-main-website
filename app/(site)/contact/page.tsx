import { submitContactAction } from "@/app/actions";
import { PageHero } from "@/components/site/page-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Field, Input, Select, Textarea } from "@/components/ui/form-fields";

export default async function ContactPage({ searchParams }: { searchParams?: Promise<Record<string, string | undefined>> }) {
  const params = await searchParams;
  const submitted = params?.submitted;
  const error = params?.error;
  return (
    <>
      <PageHero eyebrow="Contact" title="Talk to Valtis." description="Send a message about projects, profiles, partnerships, safety, legal questions or the platform itself." />
      <section className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
        {submitted && <div className="mb-6"><Badge tone="green">Message received.</Badge></div>}
        {error && <div className="mb-6"><Badge tone="red">Please check your email and enter a message of at least 20 characters.</Badge></div>}
        <form action={submitContactAction} className="glass grid gap-5 rounded-lg p-6">
          <Field label="Name" name="name"><Input id="name" name="name" minLength={2} required /></Field>
          <Field label="Email" name="email"><Input id="email" name="email" type="email" required /></Field>
          <Field label="Topic" name="topic"><Select id="topic" name="topic">{["General", "Project Submission", "Developer Profile", "Partnership", "Safety Concern", "Legal", "Other"].map((item) => <option key={item}>{item}</option>)}</Select></Field>
          <Field label="Message (at least 20 characters)" name="message"><Textarea id="message" name="message" minLength={20} required /></Field>
          <Button type="submit">Send Message</Button>
        </form>
      </section>
    </>
  );
}
