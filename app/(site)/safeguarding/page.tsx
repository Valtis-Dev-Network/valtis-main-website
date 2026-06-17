import Link from "next/link";
import { prisma } from "@/lib/db/client";
import { PageHero } from "@/components/site/page-shell";

export default async function SafeguardingPage() {
  const doc = await prisma.legalDocument.findUnique({ where: { slug: "safeguarding" } });
  return (
    <>
      <PageHero eyebrow="Safeguarding" title="Safety first, handled carefully." description="Valtis may include younger users because Minecraft communities often include younger people. Concerns are restricted to authorised staff." />
      <section className="mx-auto max-w-4xl px-4 py-12 leading-7 text-muted sm:px-6 lg:px-8">
        <p>{doc?.content.split("\n").slice(6, 12).join(" ")}</p>
        <p className="mt-6">Use <Link className="text-cyan" href="/report">the report form</Link> for safeguarding concerns. Urgent danger should be reported to emergency or local authorities immediately.</p>
      </section>
    </>
  );
}
