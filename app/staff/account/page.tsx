import { changePasswordAction } from "@/app/actions";
import { requireUser } from "@/lib/auth/session";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/form-fields";
import { StaffHeader } from "@/components/staff/staff-shell";

export default async function StaffAccountPage({ searchParams }: { searchParams?: Promise<Record<string, string | undefined>> }) {
  const user = await requireUser("dashboard:view");
  const params = await searchParams;
  return (
    <>
      <StaffHeader title="Account" text="Manage your staff login details. Password changes are hashed with bcrypt before saving." />
      <section className="grid max-w-2xl gap-6">
        <div className="glass rounded-lg p-5">
          <h2 className="font-semibold">Signed in as</h2>
          <p className="mt-2 text-sm text-muted">{user.email} - {user.role.replaceAll("_", " ")}</p>
        </div>
        <form action={changePasswordAction} className="glass grid gap-5 rounded-lg p-6">
          <h2 className="text-xl font-semibold">Change password</h2>
          {params?.updated && <Badge tone="green">Password updated.</Badge>}
          {params?.error === "current" && <Badge tone="red">Current password was not correct.</Badge>}
          {params?.error === "password" && <Badge tone="red">New passwords must match and be at least 12 characters.</Badge>}
          <Field label="Current password" name="currentPassword">
            <Input id="currentPassword" name="currentPassword" type="password" autoComplete="current-password" required />
          </Field>
          <Field label="New password" name="newPassword">
            <Input id="newPassword" name="newPassword" type="password" minLength={12} autoComplete="new-password" required />
          </Field>
          <Field label="Confirm new password" name="confirmPassword">
            <Input id="confirmPassword" name="confirmPassword" type="password" minLength={12} autoComplete="new-password" required />
          </Field>
          <Button type="submit">Update Password</Button>
        </form>
      </section>
    </>
  );
}
