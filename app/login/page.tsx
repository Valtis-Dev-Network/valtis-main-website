import { loginAction } from "@/app/actions";
import { ValtisLogo } from "@/components/site/valtis-logo";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/form-fields";
import { Badge } from "@/components/ui/badge";

export default async function LoginPage({ searchParams }: { searchParams?: Promise<Record<string, string | undefined>> }) {
  const error = (await searchParams)?.error;
  return (
    <main className="grid min-h-screen place-items-center px-4">
      <form action={loginAction} className="glass w-full max-w-md rounded-lg p-6">
        <ValtisLogo />
        <h1 className="mt-8 text-2xl font-semibold">Staff login</h1>
        <p className="mt-2 text-sm leading-6 text-muted">Protected access for Valtis staff moderation, legal and safeguarding workflows.</p>
        {error && <div className="mt-5"><Badge tone="red">Invalid staff credentials.</Badge></div>}
        <div className="mt-6 grid gap-4">
          <Field label="Email" name="email"><Input id="email" name="email" type="email" autoComplete="username" required /></Field>
          <Field label="Password" name="password"><Input id="password" name="password" type="password" autoComplete="current-password" required /></Field>
          <Button type="submit">Sign in</Button>
        </div>
      </form>
    </main>
  );
}
