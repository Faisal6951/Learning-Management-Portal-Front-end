import { RoleGuard } from "@/components/auth/role-guard";
import { AppShell } from "@/components/layout/app-shell";

export default function TeacherLayout({ children }: { children: React.ReactNode }) {
  return (
    <RoleGuard allowedRoles={["TEACHER"]}>
      <AppShell role="TEACHER">{children}</AppShell>
    </RoleGuard>
  );
}
