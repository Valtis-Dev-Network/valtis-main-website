import { requireUser } from "@/lib/auth/session";
import { prisma } from "@/lib/db/client";
import { Card } from "@/components/ui/card";
import { StaffHeader } from "@/components/staff/staff-shell";

export default async function StaffMessagesPage() {
  await requireUser("messages:manage");
  const messages = await prisma.contactMessage.findMany({ orderBy: { createdAt: "desc" }, take: 50 });
  return (
    <>
      <StaffHeader title="Contact Messages" text="Review inbound contact messages. These can be converted into reports in a future email/workflow integration." />
      <div className="grid gap-3">
        {messages.map((message) => (
          <Card key={message.id}><div className="flex flex-wrap items-center justify-between gap-2"><h2 className="font-semibold">{message.topic} - {message.name}</h2><span className="text-xs text-muted">{message.createdAt.toLocaleString()}</span></div><p className="mt-2 text-sm text-muted">{message.email}</p><p className="mt-3 text-sm leading-6">{message.message}</p></Card>
        ))}
      </div>
    </>
  );
}
