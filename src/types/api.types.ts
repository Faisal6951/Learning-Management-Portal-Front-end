import type { Role } from "./auth.types";

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  errors?: ApiFieldError[];
}

export interface ApiFieldError {
  field: string;
  message: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: Role;
  isActive: boolean;
  createdAt: string;
}

export interface CreateUserInput {
  name: string;
  email: string;
  password: string;
  role: "TEACHER" | "STUDENT";
}

export interface UpdateUserInput {
  name?: string;
  email?: string;
}

export interface CourseTeacher {
  id: number;
  name: string;
  email: string;
}

export interface CourseOutline {
  id: number;
  content: string;
  courseId: number;
  createdAt: string;
  updatedAt: string;
}

export interface Enrollment {
  id: number;
  studentId: number;
  courseId: number;
  createdAt: string;
  student: { id: number; name: string; email: string };
}

export interface Course {
  id: number;
  name: string;
  description: string | null;
  startDate: string;
  endDate: string;
  isActive: boolean;
  teacherId: number | null;
  teacher?: CourseTeacher | null;
  outline?: CourseOutline | null;
  enrollments?: Enrollment[];
  _count?: { enrollments: number };
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateCourseInput {
  name: string;
  description?: string;
  startDate: string;
  endDate: string;
  teacherId?: number;
}

export interface UpdateCourseInput {
  name?: string;
  description?: string;
  startDate?: string;
  endDate?: string;
}

export interface AttendanceRecord {
  id: number;
  date: string;
  present: boolean;
  studentId: number;
  courseId: number;
  createdAt: string;
}

export interface TeacherAttendanceReportItem {
  student: { id: number; name: string; email: string };
  totalSessions: number;
  present: number;
  absent: number;
  percentage: number;
  lowAttendance: boolean;
}

export interface TeacherAttendanceReport {
  course: string;
  report: TeacherAttendanceReportItem[];
}

export interface StudentAttendanceSummary {
  course: { id: number; name: string };
  totalSessions: number;
  present: number;
  absent: number;
  percentage: number;
  lowAttendance: boolean;
}

export interface StudentCourseAttendance {
  courseId: number;
  totalSessions: number;
  present: number;
  absent: number;
  percentage: number;
  lowAttendance: boolean;
  records: AttendanceRecord[];
}
