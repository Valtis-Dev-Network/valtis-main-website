import { SiteFooter } from "@/components/site/footer";
import { SiteNav } from "@/components/site/nav";
import { getPlatformSettings } from "@/lib/site/settings";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const settings = await getPlatformSettings();
  return (
    <>
      <SiteNav discordUrl={settings.discordUrl} />
      <main>{children}</main>
      <SiteFooter settings={settings} />
    </>
  );
}
