import { updateLegalDocumentAction } from "@/app/actions";
import { requireUser } from "@/lib/auth/session";
import { prisma } from "@/lib/db/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input, Select, Textarea } from "@/components/ui/form-fields";
import { Card } from "@/components/ui/card";
import { StaffHeader } from "@/components/staff/staff-shell";

export default async function StaffLegalPage({ searchParams }: { searchParams?: Promise<Record<string, string | undefined>> }) {
  await requireUser("legal:manage");
  const params = await searchParams;
  const docs = await prisma.legalDocument.findMany({ orderBy: { slug: "asc" } });
  return (
    <>
      <StaffHeader title="Legal Documents" text="Edit Terms, Privacy Policy, Cookies, Safeguarding, Community Guidelines, Acceptable Use and Discord policy content, then publish versioned updates." />
      {params?.error && <div className="mb-6"><Badge tone="red">Please check the title, version and content before saving. Content must be at least 80 characters.</Badge></div>}
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
