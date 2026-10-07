import { apiClient } from "@/lib/api-client";
import type {
  ApiResponse,
  Course,
  CreateCourseInput,
  UpdateCourseInput,
} from "@/types/api.types";

export async function getAdminCourses(): Promise<Course[]> {
  const { data } = await apiClient.get<ApiResponse<Course[]>>("/api/courses/admin");
  if (!data.success || !data.data) throw new Error(data.message);
  return data.data;
}

export async function getAdminCourseById(id: number): Promise<Course> {
  const { data } = await apiClient.get<ApiResponse<Course>>(`/api/courses/admin/${id}`);
  if (!data.success || !data.data) throw new Error(data.message);
  return data.data;
}

export async function createCourse(input: CreateCourseInput): Promise<Course> {
  const { data } = await apiClient.post<ApiResponse<Course>>("/api/courses/admin", input);
  if (!data.success || !data.data) throw new Error(data.message);
  return data.data;
}

export async function updateCourse(id: number, input: UpdateCourseInput): Promise<Course> {
  const { data } = await apiClient.put<ApiResponse<Course>>(
    `/api/courses/admin/${id}`,
    input,
  );
  if (!data.success || !data.data) throw new Error(data.message);
  return data.data;
}

export async function deactivateCourse(id: number): Promise<void> {
  const { data } = await apiClient.delete<ApiResponse>(`/api/courses/admin/${id}`);
  if (!data.success) throw new Error(data.message);
}

export async function reactivateCourse(id: number): Promise<void> {
  const { data } = await apiClient.patch<ApiResponse>(`/api/courses/admin/${id}/reactivate`);
  if (!data.success) throw new Error(data.message);
}

export async function assignTeacher(courseId: number, teacherId: number): Promise<Course> {
  const { data } = await apiClient.post<ApiResponse<Course>>(
    `/api/courses/admin/${courseId}/assign`,
    { teacherId },
  );
  if (!data.success || !data.data) throw new Error(data.message);
  return data.data;
}

export async function upsertOutline(courseId: number, content: string) {
  const { data } = await apiClient.post<ApiResponse>(
    `/api/courses/admin/${courseId}/outline`,
    { content },
  );
  if (!data.success) throw new Error(data.message);
  return data.data;
}

export async function enrollStudent(courseId: number, studentId: number) {
  const { data } = await apiClient.post<ApiResponse>(
    `/api/courses/admin/${courseId}/enroll`,
    { studentId },
  );
  if (!data.success) throw new Error(data.message);
  return data.data;
}

export async function getTeacherCourses(): Promise<Course[]> {
  const { data } = await apiClient.get<ApiResponse<Course[]>>("/api/courses/teacher");
  if (!data.success || !data.data) throw new Error(data.message);
  return data.data;
}

export async function getStudentCourses(): Promise<Course[]> {
  const { data } = await apiClient.get<ApiResponse<Course[]>>("/api/courses/student");
  if (!data.success || !data.data) throw new Error(data.message);
  return data.data;
}
