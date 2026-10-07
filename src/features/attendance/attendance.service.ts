import { apiClient } from "@/lib/api-client";
import type {
  ApiResponse,
  StudentAttendanceSummary,
  StudentCourseAttendance,
  TeacherAttendanceReport,
} from "@/types/api.types";

export async function markAttendance(payload: {
  courseId: number;
  date: string;
  records: { studentId: number; present: boolean }[];
}) {
  const { data } = await apiClient.post<ApiResponse & { total?: number }>(
    "/api/attendance/teacher",
    payload,
  );
  if (!data.success) throw new Error(data.message);
  return { total: data.total ?? payload.records.length };
}

export async function getTeacherCourseAttendance(
  courseId: number,
): Promise<TeacherAttendanceReport> {
  const { data } = await apiClient.get<ApiResponse<TeacherAttendanceReport>>(
    `/api/attendance/teacher/course/${courseId}`,
  );
  if (!data.success || !data.data) throw new Error(data.message);
  return data.data;
}

export async function getStudentAttendance(): Promise<StudentAttendanceSummary[]> {
  const { data } = await apiClient.get<ApiResponse<StudentAttendanceSummary[]>>(
    "/api/attendance/student",
  );
  if (!data.success || !data.data) throw new Error(data.message);
  return data.data;
}

export async function getStudentCourseAttendance(
  courseId: number,
): Promise<StudentCourseAttendance> {
  const { data } = await apiClient.get<ApiResponse<StudentCourseAttendance>>(
    `/api/attendance/student/course/${courseId}`,
  );
  if (!data.success || !data.data) throw new Error(data.message);
  return data.data;
}
