"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/features/auth/auth.store";
import type { Role } from "@/types/auth.types";
import { getRoleHomePath } from "@/lib/utils";
import { LoadingSkeleton } from "@/components/ui/feedback";

export function RoleGuard({
  allowedRoles,
  children,
}: {
  allowedRoles: Role[];
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { user, isHydrated, hydrate } = useAuthStore();

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  useEffect(() => {
    if (!isHydrated) return;
    if (!user) {
      router.replace("/login");
      return;
    }
    if (!allowedRoles.includes(user.role)) {
      router.replace(getRoleHomePath(user.role));
    }
  }, [allowedRoles, isHydrated, router, user]);

  if (!isHydrated || !user || !allowedRoles.includes(user.role)) {
    return (
      <div className="flex min-h-screen items-center justify-center p-8">
        <LoadingSkeleton className="h-8 w-48" />
      </div>
    );
  }

  return <>{children}</>;
}
