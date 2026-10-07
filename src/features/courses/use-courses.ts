import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query-keys";
import {
  assignTeacher,
  createCourse,
  deactivateCourse,
  enrollStudent,
  getAdminCourseById,
  getAdminCourses,
  getStudentCourses,
  getTeacherCourses,
  reactivateCourse,
  updateCourse,
  upsertOutline,
} from "@/features/courses/courses.service";
import type { CreateCourseInput, UpdateCourseInput } from "@/types/api.types";

export function useAdminCoursesQuery() {
  return useQuery({
    queryKey: queryKeys.courses.admin,
    queryFn: getAdminCourses,
  });
}

export function useAdminCourseQuery(id: number) {
  return useQuery({
    queryKey: queryKeys.courses.adminDetail(id),
    queryFn: () => getAdminCourseById(id),
    enabled: Number.isFinite(id),
  });
}

export function useTeacherCoursesQuery() {
  return useQuery({
    queryKey: queryKeys.courses.teacher,
    queryFn: getTeacherCourses,
  });
}

export function useStudentCoursesQuery() {
  return useQuery({
    queryKey: queryKeys.courses.student,
    queryFn: getStudentCourses,
  });
}

export function useCreateCourseMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateCourseInput) => createCourse(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.courses.admin });
    },
  });
}

export function useUpdateCourseMutation(id: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: UpdateCourseInput) => updateCourse(id, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.courses.admin });
      queryClient.invalidateQueries({ queryKey: queryKeys.courses.adminDetail(id) });
    },
  });
}

export function useDeactivateCourseMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deactivateCourse,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.courses.admin });
    },
  });
}

export function useReactivateCourseMutation(id: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => reactivateCourse(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.courses.admin });
      queryClient.invalidateQueries({ queryKey: queryKeys.courses.adminDetail(id) });
    },
  });
}

export function useAssignTeacherMutation(courseId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (teacherId: number) => assignTeacher(courseId, teacherId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.courses.adminDetail(courseId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.courses.admin });
    },
  });
}

export function useUpsertOutlineMutation(courseId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (content: string) => upsertOutline(courseId, content),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.courses.adminDetail(courseId) });
    },
  });
}

export function useEnrollStudentMutation(courseId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (studentId: number) => enrollStudent(courseId, studentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.courses.adminDetail(courseId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.courses.admin });
    },
  });
}
