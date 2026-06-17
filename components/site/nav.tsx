"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { ValtisLogo } from "@/components/site/valtis-logo";
import { Button } from "@/components/ui/button";
import { clsx } from "clsx";

const links = [
  ["Home", "/home"],
  ["Projects", "/projects"],
  ["Developers", "/developers"],
  ["Resources", "/resources"],
  ["Initiatives", "/initiatives"],
  ["About", "/about"]
];

export function SiteNav({ discordUrl }: { discordUrl: string }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={clsx("sticky top-0 z-40 transition", scrolled && "border-b border-white/10 bg-background/80 backdrop-blur-xl")}>
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <ValtisLogo />
        <nav className="hidden items-center gap-1 md:flex">
          {links.map(([label, href]) => (
            <Link key={href} href={href} className="focus-ring rounded-md px-3 py-2 text-sm font-medium text-muted transition hover:bg-white/6 hover:text-text">
              {label}
            </Link>
          ))}
        </nav>
        <div className="hidden items-center gap-2 md:flex">
          <Button href={discordUrl} variant="ghost">
            Join Discord
          </Button>
          <Button href="/projects/submit" variant="secondary">
            Submit
          </Button>
          <Button href="/login" variant="primary">
            Staff Login
          </Button>
        </div>
        <button className="focus-ring rounded-md p-2 md:hidden" onClick={() => setOpen((value) => !value)} aria-label="Toggle navigation">
          {open ? <X /> : <Menu />}
        </button>
      </div>
      {open && (
        <div className="mx-4 mb-4 grid gap-2 rounded-lg border border-white/10 bg-surface p-4 md:hidden">
          {links.map(([label, href]) => (
            <Link key={href} href={href} onClick={() => setOpen(false)} className="rounded-md px-3 py-2 text-sm text-muted hover:bg-white/6 hover:text-text">
              {label}
            </Link>
          ))}
          <Button href="/projects/submit" variant="secondary">
            Submit a Project
          </Button>
          <Button href={discordUrl} variant="primary">
            Join Discord
          </Button>
        </div>
      )}
    </header>
  );
}
