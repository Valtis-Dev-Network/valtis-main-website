import { requireUser } from "@/lib/auth/session";
import { StaffShell } from "@/components/staff/staff-shell";

export default async function StaffLayout({ children }: { children: React.ReactNode }) {
  const user = await requireUser("dashboard:view");
  return <StaffShell user={user}>{children}</StaffShell>;
}
