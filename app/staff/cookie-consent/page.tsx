import { requireUser } from "@/lib/auth/session";
import { prisma } from "@/lib/db/client";
import { Card } from "@/components/ui/card";
import { StaffHeader } from "@/components/staff/staff-shell";

export default async function StaffCookieConsentPage() {
  await requireUser("settings:manage");
  const [total, preferences, analytics, marketing] = await Promise.all([
    prisma.cookieConsent.count(),
    prisma.cookieConsent.count({ where: { preferences: true } }),
    prisma.cookieConsent.count({ where: { analytics: true } }),
    prisma.cookieConsent.count({ where: { marketing: true } })
  ]);
  return (
    <>
      <StaffHeader title="Cookie Consent" text="Aggregate consent stats only. Raw sensitive identifiers are not exposed." />
      <div className="grid gap-4 md:grid-cols-4">
        {[["Total", total], ["Preferences", preferences], ["Analytics", analytics], ["Marketing", marketing]].map(([label, value]) => <Card key={label as string}><p className="text-sm text-muted">{label as string}</p><p className="mt-2 text-3xl font-semibold">{value as number}</p></Card>)}
      </div>
    </>
  );
}
