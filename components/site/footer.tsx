import Link from "next/link";
import { ValtisLogo } from "@/components/site/valtis-logo";
import type { PlatformSettings } from "@/lib/site/settings";

function platformLinks(settings: PlatformSettings) {
  return [
  ["Home", "/home"],
  ["Projects", "/projects"],
  ["Developers", "/developers"],
  ["Resources", "/resources"],
  ["Initiatives", "/initiatives"],
  ["Contact", "/contact"],
  ["Report", "/report"],
  ["Join Discord", settings.discordUrl],
  ["GitHub", settings.githubUrl]
  ];
}

const legal = [
  ["Terms", "/legal/terms"],
  ["Privacy", "/legal/privacy"],
  ["Cookies", "/legal/cookies"],
  ["Safeguarding", "/legal/safeguarding"],
  ["Community Guidelines", "/legal/community-guidelines"],
  ["Acceptable Use", "/legal/acceptable-use"],
  ["Discord", "/legal/discord"]
];

export function SiteFooter({ settings }: { settings: PlatformSettings }) {
  return (
    <footer className="border-t border-white/10">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-[1.5fr_1fr_1fr] lg:px-8">
        <div className="grid gap-4">
          <ValtisLogo />
          <p className="max-w-md text-sm leading-6 text-muted">
            Valtis is an independent network for Minecraft developers, creators and technical communities.
          </p>
          <p className="text-xs text-muted">Valtis is independent and is not affiliated with Mojang Studios or Microsoft.</p>
        </div>
        <div className="grid gap-2 text-sm">
          <strong>Platform</strong>
          {platformLinks(settings).map(([label, href]) => (
            <Link key={href} href={href} className="text-muted hover:text-text">
              {label}
            </Link>
          ))}
        </div>
        <div className="grid gap-2 text-sm">
          <strong>Legal</strong>
          {legal.map(([label, href]) => (
            <Link key={href} href={href} className="text-muted hover:text-text">
              {label}
            </Link>
          ))}
          <button data-cookie-settings className="w-fit text-left text-muted hover:text-text">
            Cookie Settings
          </button>
        </div>
      </div>
      <div className="border-t border-white/10 px-4 py-4 text-center text-xs text-muted">© Valtis | All rights reserved.</div>
    </footer>
  );
}
