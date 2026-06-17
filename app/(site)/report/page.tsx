import { submitReportAction } from "@/app/actions";
import { PageHero } from "@/components/site/page-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Field, Input, Select, Textarea } from "@/components/ui/form-fields";

export default async function ReportPage({ searchParams }: { searchParams?: Promise<Record<string, string | undefined>> }) {
  const params = await searchParams;
  const submitted = params?.submitted;
  const error = params?.error;
  return (
    <>
      <PageHero eyebrow="Report" title="Report a concern." description="Use this form for project, developer, resource, community, safeguarding or security concerns." />
      <section className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-6 rounded-lg border border-warning/25 bg-warning/10 p-4 text-sm leading-6 text-amber-100">
          Urgent danger should be reported to emergency or local authorities immediately, not only through Valtis.
        </div>
        {submitted && <div className="mb-6"><Badge tone="green">Report received. Safeguarding reports are flagged for authorised staff.</Badge></div>}
        {error && <div className="mb-6"><Badge tone="red">Please check the report details and enter a message of at least 30 characters.</Badge></div>}
        <form action={submitReportAction} className="glass grid gap-5 rounded-lg p-6">
          <Field label="Report type" name="type"><Select id="type" name="type">{["PROJECT", "DEVELOPER", "RESOURCE", "COMMUNITY", "SAFEGUARDING", "SECURITY", "OTHER"].map((item) => <option key={item}>{item}</option>)}</Select></Field>
          <Field label="Related URL/entity" name="relatedUrl"><Input id="relatedUrl" name="relatedUrl" type="url" /></Field>
          <Field label="Name" name="name"><Input id="name" name="name" /></Field>
          <Field label="Email" name="email"><Input id="email" name="email" type="email" /></Field>
          <Field label="Urgency" name="urgency"><Select id="urgency" name="urgency">{["LOW", "NORMAL", "HIGH", "URGENT"].map((item) => <option key={item}>{item}</option>)}</Select></Field>
          <Field label="Message (at least 30 characters)" name="message"><Textarea id="message" name="message" minLength={30} required /></Field>
          <label className="flex items-center gap-2 text-sm text-muted"><input name="anonymous" type="checkbox" /> Submit anonymously</label>
          <label className="flex items-center gap-2 text-sm text-muted"><input name="consentToContact" type="checkbox" /> I consent to being contacted about this report</label>
          <Button type="submit">Submit Report</Button>
        </form>
      </section>
    </>
  );
}
