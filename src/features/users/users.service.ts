import { apiClient } from "@/lib/api-client";
import type {
  ApiResponse,
  CreateUserInput,
  UpdateUserInput,
  User,
} from "@/types/api.types";

export async function getUsers(): Promise<User[]> {
  const { data } = await apiClient.get<ApiResponse<User[]>>("/api/admin/users");
  if (!data.success || !data.data) throw new Error(data.message);
  return data.data;
}

export async function getUserById(id: number): Promise<User> {
  const { data } = await apiClient.get<ApiResponse<User>>(`/api/admin/users/${id}`);
  if (!data.success || !data.data) throw new Error(data.message);
  return data.data;
}

export async function createUser(input: CreateUserInput): Promise<User> {
  const { data } = await apiClient.post<ApiResponse<User>>("/api/admin/users", input);
  if (!data.success || !data.data) throw new Error(data.message);
  return data.data;
}

export async function updateUser(id: number, input: UpdateUserInput): Promise<User> {
  const { data } = await apiClient.put<ApiResponse<User>>(
    `/api/admin/users/${id}`,
    input,
  );
  if (!data.success || !data.data) throw new Error(data.message);
  return data.data;
}

export async function deactivateUser(id: number): Promise<void> {
  const { data } = await apiClient.delete<ApiResponse>(`/api/admin/users/${id}`);
  if (!data.success) throw new Error(data.message);
}

export async function reactivateUser(id: number): Promise<void> {
  const { data } = await apiClient.patch<ApiResponse>(
    `/api/admin/users/${id}/reactivate`,
  );
  if (!data.success) throw new Error(data.message);
}

export async function resetUserPassword(id: number, newPassword: string): Promise<void> {
  const { data } = await apiClient.patch<ApiResponse>(
    `/api/admin/users/${id}/reset-password`,
    { newPassword },
  );
  if (!data.success) throw new Error(data.message);
}
