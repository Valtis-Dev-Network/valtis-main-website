import { updatePlatformSettingsAction } from "@/app/actions";
import { requireUser } from "@/lib/auth/session";
import { prisma } from "@/lib/db/client";
import { getPlatformSettings } from "@/lib/site/settings";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/form-fields";
import { StaffHeader } from "@/components/staff/staff-shell";

export default async function StaffSettingsPage() {
  await requireUser("settings:manage");
  const settings = await prisma.siteSetting.findMany();
  const platform = await getPlatformSettings();
  return (
    <>
      <StaffHeader title="Settings" text="Critical platform settings. Keep production secrets in environment variables rather than the database." />
      <form action={updatePlatformSettingsAction} className="glass mb-6 grid max-w-2xl gap-5 rounded-lg p-6">
        <h2 className="text-xl font-semibold">Public links</h2>
        <p className="text-sm leading-6 text-muted">These control the Join Discord and GitHub links shown in the public navigation/footer.</p>
        <Field label="Discord invite URL" name="discordUrl">
          <Input id="discordUrl" name="discordUrl" type="url" defaultValue={platform.discordUrl} required />
        </Field>
        <Field label="GitHub URL" name="githubUrl">
          <Input id="githubUrl" name="githubUrl" type="url" defaultValue={platform.githubUrl} required />
        </Field>
        <Button type="submit">Save Public Links</Button>
      </form>
      <div className="grid gap-3">{settings.map((setting) => <Card key={setting.id}><h2 className="font-semibold">{setting.key}</h2><pre className="mt-3 overflow-auto rounded-md bg-background p-3 text-xs text-muted">{JSON.stringify(setting.value, null, 2)}</pre></Card>)}</div>
    </>
  );
}
