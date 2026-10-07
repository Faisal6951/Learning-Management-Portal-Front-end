"use client";

import Link from "next/link";
import { PageHeader } from "@/components/layout/app-shell";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState, LoadingSkeleton } from "@/components/ui/feedback";
import { PercentageBar } from "@/components/ui/percentage-bar";
import { useStudentCoursesQuery } from "@/features/courses/use-courses";
import { useStudentAttendanceQuery } from "@/features/attendance/use-attendance";
import { cn, formatDate } from "@/lib/utils";

export default function StudentCoursesPage() {
  const { data: courses, isLoading } = useStudentCoursesQuery();
  const { data: attendance } = useStudentAttendanceQuery();
  const attendanceMap = new Map(attendance?.map((a) => [a.course.id, a]) ?? []);

  return (
    <>
      <PageHeader title="My courses" description="Courses you are enrolled in." />

      {isLoading ? (
        <LoadingSkeleton className="h-48 w-full rounded-xl" />
      ) : !courses || courses.length === 0 ? (
        <EmptyState title="No courses enrolled" />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {courses.map((course) => {
            const stats = attendanceMap.get(course.id);
            return (
              <Card key={course.id}>
                <CardHeader>
                  <CardTitle>{course.name}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-muted-foreground">
                    {course.teacher?.name ?? "Teacher TBA"}
                  </p>
                  <p className="text-sm">
                    {formatDate(course.startDate)} – {formatDate(course.endDate)}
                  </p>
                  {stats && (
                    <PercentageBar
                      percentage={stats.percentage}
                      lowAttendance={stats.lowAttendance}
                    />
                  )}
                  <Link
                    href={`/student/courses/${course.id}`}
                    className={cn(buttonVariants({ size: "sm" }))}
                  >
                    View course
                  </Link>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </>
  );
}
