import { apiClient } from "@/lib/api-client";
import type { ApiResponse } from "@/types/api.types";
import type { AuthSession, LoginCredentials } from "@/types/auth.types";

export async function login(credentials: LoginCredentials): Promise<AuthSession> {
  const { data } = await apiClient.post<ApiResponse<AuthSession>>(
    "/api/auth/login",
    credentials,
  );
  if (!data.success || !data.data) {
    throw new Error(data.message || "Login failed");
  }
  return data.data;
}
