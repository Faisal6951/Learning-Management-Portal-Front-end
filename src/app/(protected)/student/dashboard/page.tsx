"use client";

import Link from "next/link";
import { PageHeader } from "@/components/layout/app-shell";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState, LoadingSkeleton } from "@/components/ui/feedback";
import { PercentageBar } from "@/components/ui/percentage-bar";
import { useStudentCoursesQuery } from "@/features/courses/use-courses";
import { useStudentAttendanceQuery } from "@/features/attendance/use-attendance";
import { cn } from "@/lib/utils";

export default function StudentDashboardPage() {
  const { data: courses, isLoading: coursesLoading } = useStudentCoursesQuery();
  const { data: attendance, isLoading: attendanceLoading } = useStudentAttendanceQuery();

  const isLoading = coursesLoading || attendanceLoading;
  const attendanceMap = new Map(attendance?.map((a) => [a.course.id, a]) ?? []);

  return (
    <>
      <PageHeader
        title="Student dashboard"
        description="Your enrolled courses and attendance overview."
      />

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2">
          {Array.from({ length: 2 }).map((_, i) => (
            <LoadingSkeleton key={i} className="h-44 rounded-xl" />
          ))}
        </div>
      ) : !courses || courses.length === 0 ? (
        <EmptyState
          title="No courses enrolled"
          description="An administrator will enroll you in courses."
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {courses.map((course) => {
            const stats = attendanceMap.get(course.id);
            return (
              <Card key={course.id}>
                <CardHeader>
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="text-lg">{course.name}</CardTitle>
                    {stats?.lowAttendance && <Badge variant="warning">Low</Badge>}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    {course.teacher?.name ?? "Teacher TBA"}
                  </p>
                  {stats ? (
                    <PercentageBar
                      percentage={stats.percentage}
                      lowAttendance={stats.lowAttendance}
                    />
                  ) : (
                    <p className="text-sm text-muted-foreground">No attendance recorded yet</p>
                  )}
                  <Link
                    href={`/student/courses/${course.id}`}
                    className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
                  >
                    View details
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
