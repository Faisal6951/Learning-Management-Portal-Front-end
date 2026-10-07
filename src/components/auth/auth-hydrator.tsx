"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/features/auth/auth.store";

export function AuthHydrator({ children }: { children: React.ReactNode }) {
  const hydrate = useAuthStore((state) => state.hydrate);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  return <>{children}</>;
}
