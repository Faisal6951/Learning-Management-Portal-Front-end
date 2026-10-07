import { create } from "zustand";
import type { AuthSession, AuthUser } from "@/types/auth.types";
import { clearSession, getStoredSession, persistSession } from "@/lib/auth-storage";

interface AuthState {
  token: string | null;
  user: AuthUser | null;
  isHydrated: boolean;
  hydrate: () => void;
  setSession: (session: AuthSession) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  user: null,
  isHydrated: false,
  hydrate: () => {
    const session = getStoredSession();
    set({
      token: session?.token ?? null,
      user: session?.user ?? null,
      isHydrated: true,
    });
  },
  setSession: ({ token, user }) => {
    persistSession(token, user);
    set({ token, user });
  },
  logout: () => {
    clearSession();
    set({ token: null, user: null });
  },
}));
