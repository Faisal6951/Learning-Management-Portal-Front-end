export type Role = "ADMIN" | "TEACHER" | "STUDENT";

export interface AuthUser {
  id: number;
  name: string;
  email: string;
  role: Role;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthSession {
  token: string;
  user: AuthUser;
}
