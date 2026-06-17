import { PageHero, SectionHeader } from "@/components/site/page-shell";
import { Card } from "@/components/ui/card";

export default function AboutPage() {
  return (
    <>
      <PageHero eyebrow="About Valtis" title="An independent network for builders." description="Valtis exists for the people who build, maintain, support, document and improve Minecraft-related projects." />
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <SectionHeader eyebrow="Positioning" title="Not a server. Not a plugin dump. A developer platform." text="Valtis supports developers and technical communities with project discovery, profiles, initiatives, resources, reporting and staff moderation workflows." />
        <div className="grid gap-4 md:grid-cols-2">
          {["Quality", "Transparency", "Safety", "Independence"].map((item) => (
            <Card key={item}><h2 className="text-xl font-semibold">{item}</h2><p className="mt-2 text-sm leading-6 text-muted">Valtis is built around mature, documented and respectful community practice.</p></Card>
          ))}
        </div>
        <p className="mt-8 text-sm text-muted">Valtis is independent and is not affiliated with Mojang Studios or Microsoft.</p>
      </section>
    </>
  );
}
