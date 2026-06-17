import { updateLegalDocumentAction } from "@/app/actions";
import { requireUser } from "@/lib/auth/session";
import { prisma } from "@/lib/db/client";
import { Button } from "@/components/ui/button";
import { Input, Select, Textarea } from "@/components/ui/form-fields";
import { Card } from "@/components/ui/card";
import { StaffHeader } from "@/components/staff/staff-shell";

export default async function StaffLegalPage() {
  await requireUser("legal:manage");
  const docs = await prisma.legalDocument.findMany({ orderBy: { slug: "asc" } });
  return (
    <>
      <StaffHeader title="Legal Documents" text="Edit Terms, Privacy Policy, Cookies, Safeguarding, Community Guidelines, Acceptable Use and Discord policy content, then publish versioned updates." />
      <div className="grid gap-4">
        {docs.map((doc) => (
          <Card key={doc.id}>
            <form action={updateLegalDocumentAction} className="grid gap-3">
              <input type="hidden" name="id" value={doc.id} />
              <Input name="title" defaultValue={doc.title} />
              <div className="grid gap-3 md:grid-cols-2">
                <Input name="version" defaultValue={doc.version} />
                <Select name="status" defaultValue={doc.status}>{["DRAFT", "PUBLISHED", "ARCHIVED"].map((item) => <option key={item}>{item}</option>)}</Select>
              </div>
              <Textarea name="content" defaultValue={doc.content} className="min-h-48 font-mono" />
              <Button type="submit" variant="secondary">Save Legal Document</Button>
            </form>
          </Card>
        ))}
      </div>
    </>
  );
}
