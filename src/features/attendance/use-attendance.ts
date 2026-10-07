import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query-keys";
import {
  getStudentAttendance,
  getStudentCourseAttendance,
  getTeacherCourseAttendance,
  markAttendance,
} from "@/features/attendance/attendance.service";

export function useTeacherAttendanceReportQuery(courseId: number) {
  return useQuery({
    queryKey: queryKeys.attendance.teacher(courseId),
    queryFn: () => getTeacherCourseAttendance(courseId),
    enabled: Number.isFinite(courseId),
  });
}

export function useStudentAttendanceQuery() {
  return useQuery({
    queryKey: queryKeys.attendance.student,
    queryFn: getStudentAttendance,
  });
}

export function useStudentCourseAttendanceQuery(courseId: number) {
  return useQuery({
    queryKey: queryKeys.attendance.studentCourse(courseId),
    queryFn: () => getStudentCourseAttendance(courseId),
    enabled: Number.isFinite(courseId),
  });
}

export function useMarkAttendanceMutation(courseId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: markAttendance,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.attendance.teacher(courseId) });
    },
  });
}
