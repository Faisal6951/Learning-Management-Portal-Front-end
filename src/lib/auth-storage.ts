import type { Role } from "@/types/auth.types";

const ROLE_COOKIE = "lmp_role";

export function setAuthCookies(role: Role) {
  document.cookie = `${ROLE_COOKIE}=${role}; path=/; SameSite=Lax`;
}

export function clearAuthCookies() {
  document.cookie = `${ROLE_COOKIE}=; path=/; max-age=0`;
}

export function persistSession(token: string, user: { id: number; name: string; email: string; role: Role }) {
  sessionStorage.setItem("lmp_token", token);
  sessionStorage.setItem("lmp_user", JSON.stringify(user));
  setAuthCookies(user.role);
}

export function clearSession() {
  sessionStorage.removeItem("lmp_token");
  sessionStorage.removeItem("lmp_user");
  clearAuthCookies();
}

export function getStoredSession() {
  if (typeof window === "undefined") return null;
  const token = sessionStorage.getItem("lmp_token");
  const userRaw = sessionStorage.getItem("lmp_user");
  if (!token || !userRaw) return null;
  try {
    return { token, user: JSON.parse(userRaw) as { id: number; name: string; email: string; role: Role } };
  } catch {
    return null;
  }
}
