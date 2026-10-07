"use client";

import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { Course } from "@/types/api.types";
import {
  outlineSchema,
  updateCourseSchema,
  type OutlineFormValues,
  type UpdateCourseFormValues,
} from "@/features/courses/courses.schema";
import {
  useAssignTeacherMutation,
  useDeactivateCourseMutation,
  useEnrollStudentMutation,
  useReactivateCourseMutation,
  useUpdateCourseMutation,
  useUpsertOutlineMutation,
} from "@/features/courses/use-courses";
import { useUsersQuery } from "@/features/users/use-users";
import { getApiErrorMessage } from "@/lib/api-client";
import { formatDate } from "@/lib/utils";
import { Alert } from "@/components/ui/feedback";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input, Select, Textarea } from "@/components/ui/input";
import { FormField } from "@/components/ui/label";
import { Tabs } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export function CourseDetailPanel({ course }: { course: Course }) {
  const [tab, setTab] = useState("overview");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedTeacher, setSelectedTeacher] = useState(
    course.teacherId?.toString() ?? "",
  );
  const [selectedStudent, setSelectedStudent] = useState("");

  const { data: users } = useUsersQuery();
  const updateMutation = useUpdateCourseMutation(course.id);
  const deactivateMutation = useDeactivateCourseMutation();
  const reactivateMutation = useReactivateCourseMutation(course.id);
  const assignMutation = useAssignTeacherMutation(course.id);
  const outlineMutation = useUpsertOutlineMutation(course.id);
  const enrollMutation = useEnrollStudentMutation(course.id);

  const teachers = users?.filter((u) => u.role === "TEACHER" && u.isActive) ?? [];
  const enrolledIds = new Set(course.enrollments?.map((e) => e.studentId) ?? []);
  const availableStudents =
    users?.filter((u) => u.role === "STUDENT" && u.isActive && !enrolledIds.has(u.id)) ?? [];

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<UpdateCourseFormValues>({
    resolver: zodResolver(updateCourseSchema),
    defaultValues: {
      name: course.name,
      description: course.description ?? "",
      startDate: course.startDate.split("T")[0],
      endDate: course.endDate.split("T")[0],
    },
  });

  const {
    register: registerOutline,
    handleSubmit: handleOutlineSubmit,
    formState: { errors: outlineErrors },
  } = useForm<OutlineFormValues>({
    resolver: zodResolver(outlineSchema),
    defaultValues: { content: course.outline?.content ?? "" },
  });

  const tabs = useMemo(
    () => [
      { id: "overview", label: "Overview" },
      { id: "enrollments", label: "Enrollments" },
      { id: "outline", label: "Outline" },
      { id: "settings", label: "Settings" },
    ],
    [],
  );

  const onUpdate = async (values: UpdateCourseFormValues) => {
    setError(null);
    setMessage(null);
    try {
      await updateMutation.mutateAsync(values);
      setMessage("Course updated successfully.");
    } catch (err) {
      setError(getApiErrorMessage(err));
    }
  };

  const onAssignTeacher = async () => {
    if (!selectedTeacher) return;
    setError(null);
    setMessage(null);
    try {
      await assignMutation.mutateAsync(Number(selectedTeacher));
      setMessage("Teacher assigned successfully.");
    } catch (err) {
      setError(getApiErrorMessage(err));
    }
  };

  const onEnroll = async () => {
    if (!selectedStudent) return;
    setError(null);
    setMessage(null);
    try {
      await enrollMutation.mutateAsync(Number(selectedStudent));
      setSelectedStudent("");
      setMessage("Student enrolled successfully.");
    } catch (err) {
      setError(getApiErrorMessage(err));
    }
  };

  const onSaveOutline = async (values: OutlineFormValues) => {
    setError(null);
    setMessage(null);
    try {
      await outlineMutation.mutateAsync(values.content);
      setMessage("Outline saved successfully.");
    } catch (err) {
      setError(getApiErrorMessage(err));
    }
  };

  const onDeactivate = async () => {
    if (!confirm(`Deactivate ${course.name}?`)) return;
    setError(null);
    setMessage(null);
    try {
      await deactivateMutation.mutateAsync(course.id);
      setMessage("Course deactivated.");
    } catch (err) {
      setError(getApiErrorMessage(err));
    }
  };

  const onReactivate = async () => {
    setError(null);
    setMessage(null);
    try {
      await reactivateMutation.mutateAsync();
      setMessage("Course reactivated.");
    } catch (err) {
      setError(getApiErrorMessage(err));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Badge variant={course.isActive ? "success" : "destructive"}>
          {course.isActive ? "Active" : "Inactive"}
        </Badge>
        <span className="text-sm text-muted-foreground">
          {course._count?.enrollments ?? course.enrollments?.length ?? 0} students enrolled
        </span>
      </div>

      {message && <Alert variant="success">{message}</Alert>}
      {error && <Alert variant="destructive">{error}</Alert>}

      <Tabs tabs={tabs} active={tab} onChange={setTab} />

      {tab === "overview" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Course details</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onUpdate)} className="space-y-4" noValidate>
                <FormField label="Course name" htmlFor="name" error={errors.name?.message}>
                  <Input id="name" disabled={!course.isActive} {...register("name")} />
                </FormField>
                <FormField label="Description" htmlFor="description">
                  <Textarea id="description" disabled={!course.isActive} {...register("description")} />
                </FormField>
                <div className="grid gap-4 sm:grid-cols-2">
                  <FormField label="Start date" htmlFor="startDate">
                    <Input id="startDate" type="date" disabled={!course.isActive} {...register("startDate")} />
                  </FormField>
                  <FormField label="End date" htmlFor="endDate">
                    <Input id="endDate" type="date" disabled={!course.isActive} {...register("endDate")} />
                  </FormField>
                </div>
                {course.isActive && (
                  <Button type="submit" disabled={!isDirty} isLoading={updateMutation.isPending}>
                    Save changes
                  </Button>
                )}
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Assigned teacher</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {course.teacher ? (
                <div>
                  <p className="font-medium">{course.teacher.name}</p>
                  <p className="text-sm text-muted-foreground">{course.teacher.email}</p>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No teacher assigned yet.</p>
              )}
              {course.isActive && (
                <div className="flex gap-2">
                  <Select
                    value={selectedTeacher}
                    onChange={(e) => setSelectedTeacher(e.target.value)}
                    aria-label="Select teacher"
                    className="flex-1"
                  >
                    <option value="">Select teacher</option>
                    {teachers.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.name}
                      </option>
                    ))}
                  </Select>
                  <Button
                    type="button"
                    onClick={onAssignTeacher}
                    disabled={!selectedTeacher}
                    isLoading={assignMutation.isPending}
                  >
                    Assign
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {tab === "enrollments" && (
        <Card>
          <CardHeader>
            <CardTitle>Enrolled students</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {course.isActive && (
              <div className="flex gap-2">
                <Select
                  value={selectedStudent}
                  onChange={(e) => setSelectedStudent(e.target.value)}
                  aria-label="Select student to enroll"
                  className="flex-1"
                >
                  <option value="">Select student</option>
                  {availableStudents.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.email})
                    </option>
                  ))}
                </Select>
                <Button
                  type="button"
                  onClick={onEnroll}
                  disabled={!selectedStudent}
                  isLoading={enrollMutation.isPending}
                >
                  Enroll
                </Button>
              </div>
            )}

            {course.enrollments && course.enrollments.length > 0 ? (
              <Table aria-label="Enrolled students">
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Enrolled</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {course.enrollments.map((e) => (
                    <TableRow key={e.id}>
                      <TableCell className="font-medium">{e.student.name}</TableCell>
                      <TableCell>{e.student.email}</TableCell>
                      <TableCell>{formatDate(e.createdAt)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <p className="text-sm text-muted-foreground">No students enrolled yet.</p>
            )}
          </CardContent>
        </Card>
      )}

      {tab === "outline" && (
        <Card>
          <CardHeader>
            <CardTitle>Course outline</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleOutlineSubmit(onSaveOutline)} className="space-y-4" noValidate>
              <FormField
                label="Syllabus content"
                htmlFor="content"
                error={outlineErrors.content?.message}
              >
                <Textarea
                  id="content"
                  rows={8}
                  disabled={!course.isActive}
                  placeholder="Week 1: Introduction&#10;Week 2: Core concepts..."
                  {...registerOutline("content")}
                />
              </FormField>
              {course.isActive && (
                <Button type="submit" isLoading={outlineMutation.isPending}>
                  Save outline
                </Button>
              )}
            </form>
          </CardContent>
        </Card>
      )}

      {tab === "settings" && (
        <Card>
          <CardHeader>
            <CardTitle>Course status</CardTitle>
          </CardHeader>
          <CardContent>
            {course.isActive ? (
              <Button variant="destructive" onClick={onDeactivate} isLoading={deactivateMutation.isPending}>
                Deactivate course
              </Button>
            ) : (
              <Button onClick={onReactivate} isLoading={reactivateMutation.isPending}>
                Reactivate course
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
