import { addSafeguardingNoteAction } from "@/app/actions";
import { requireUser } from "@/lib/auth/session";
import { prisma } from "@/lib/db/client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/form-fields";
import { Card } from "@/components/ui/card";
import { StaffHeader } from "@/components/staff/staff-shell";

export default async function StaffSafeguardingPage() {
  await requireUser("safeguarding:manage");
  const cases = await prisma.safeguardingCase.findMany({ include: { notes: true, assignedTo: true }, orderBy: { updatedAt: "desc" } });
  return (
    <>
      <StaffHeader title="Safeguarding Cases" text="Sensitive data area. Access is restricted to ADMIN, DIRECTOR and SAFEGUARDING_LEAD roles with server-side checks." />
      <div className="mb-6 rounded-lg border border-warning/25 bg-warning/10 p-4 text-sm text-amber-100">Do not send safeguarding details to public pages. Escalate urgent danger to appropriate local authorities.</div>
      <div className="grid gap-4">
        {cases.map((item) => (
          <Card key={item.id}>
            <div className="flex flex-wrap items-center justify-between gap-3"><h2 className="font-semibold">{item.caseNumber} - {item.title}</h2><span className="text-sm text-cyan">{item.status} / {item.riskLevel}</span></div>
            <p className="mt-3 text-sm leading-6 text-muted">{item.summary}</p>
            <div className="mt-4 grid gap-2">{item.notes.map((note) => <p key={note.id} className="rounded-md bg-white/5 p-3 text-sm text-muted">{note.author}: {note.body}</p>)}</div>
            <form action={addSafeguardingNoteAction} className="mt-4 grid gap-3">
              <input type="hidden" name="caseId" value={item.id} />
              <Textarea name="body" placeholder="Add internal note" required />
              <Button type="submit" variant="secondary">Add Note</Button>
            </form>
          </Card>
        ))}
      </div>
    </>
  );
}
