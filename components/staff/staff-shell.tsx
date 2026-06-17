import Link from "next/link";
import { logoutAction } from "@/app/actions";
import { ValtisLogo } from "@/components/site/valtis-logo";
import { Button } from "@/components/ui/button";
import type { User } from "@prisma/client";
import {
  BarChart3,
  BookOpen,
  Cookie,
  FileText,
  FolderKanban,
  Gavel,
  Home,
  Inbox,
  LifeBuoy,
  ScrollText,
  Settings,
  ShieldAlert,
  Users
} from "lucide-react";

const nav = [
  ["Overview", "/staff", Home],
  ["Projects", "/staff/projects", FolderKanban],
  ["Developers", "/staff/developers", Users],
  ["Resources", "/staff/resources", BookOpen],
  ["Initiatives", "/staff/initiatives", BarChart3],
  ["Messages", "/staff/messages", Inbox],
  ["Reports", "/staff/reports", ShieldAlert],
  ["Safeguarding", "/staff/safeguarding", LifeBuoy],
  ["Users", "/staff/users", Users],
  ["Audit Log", "/staff/audit-log", ScrollText],
  ["Legal", "/staff/legal", Gavel],
  ["Cookie Consent", "/staff/cookie-consent", Cookie],
  ["Settings", "/staff/settings", Settings]
];

export function StaffShell({ user, children }: { user: User; children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-72 border-r border-white/10 bg-surface/70 p-4 backdrop-blur-xl lg:block">
        <ValtisLogo href="/staff" />
        <nav className="mt-8 grid gap-1">
          {nav.map(([label, href, Icon]) => (
            <Link key={href as string} href={href as string} className="focus-ring flex items-center gap-3 rounded-md px-3 py-2 text-sm text-muted transition hover:bg-white/6 hover:text-text">
              <Icon className="h-4 w-4" />
              {label as string}
            </Link>
          ))}
        </nav>
      </aside>
      <div className="lg:pl-72">
        <header className="sticky top-0 z-20 border-b border-white/10 bg-background/80 px-4 py-4 backdrop-blur-xl sm:px-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-cyan">Staff Platform</p>
              <p className="text-sm text-muted">{user.name} - {user.role.replaceAll("_", " ")}</p>
            </div>
            <div className="flex items-center gap-2">
              <Button href="/staff/account" variant="secondary">Account</Button>
              <form action={logoutAction}>
                <Button type="submit" variant="secondary">Logout</Button>
              </form>
            </div>
          </div>
        </header>
        <div className="p-4 sm:p-6">{children}</div>
      </div>
    </div>
  );
}

export function StaffHeader({ title, text }: { title: string; text: string }) {
  return (
    <div className="mb-6">
      <h1 className="text-3xl font-semibold tracking-tight">{title}</h1>
      <p className="mt-2 max-w-3xl text-sm leading-6 text-muted">{text}</p>
    </div>
  );
}

export function StaffTable({ children }: { children: React.ReactNode }) {
  return <div className="overflow-hidden rounded-lg border border-white/10 bg-surface/65">{children}</div>;
}

export function StaffIcon() {
  return <FileText className="h-4 w-4 text-cyan" />;
}
