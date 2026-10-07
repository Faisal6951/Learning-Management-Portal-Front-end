"use client";

import Link from "next/link";
import { ClipboardCheck } from "lucide-react";
import { PageHeader } from "@/components/layout/app-shell";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState, LoadingSkeleton } from "@/components/ui/feedback";
import { useTeacherCoursesQuery } from "@/features/courses/use-courses";
import { useTeacherAttendanceReportQuery } from "@/features/attendance/use-attendance";
import { cn } from "@/lib/utils";

export default function TeacherDashboardPage() {
  const { data: courses, isLoading } = useTeacherCoursesQuery();

  return (
    <>
      <PageHeader
        title="Teacher dashboard"
        description="View your assigned courses and manage attendance."
      />

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2">
          {Array.from({ length: 2 }).map((_, i) => (
            <LoadingSkeleton key={i} className="h-40 rounded-xl" />
          ))}
        </div>
      ) : !courses || courses.length === 0 ? (
        <EmptyState
          title="No courses assigned"
          description="An administrator will assign courses to you."
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {courses.map((course) => (
            <CourseCard key={course.id} courseId={course.id} name={course.name} count={course._count?.enrollments ?? 0} />
          ))}
        </div>
      )}
    </>
  );
}

function CourseCard({
  courseId,
  name,
  count,
}: {
  courseId: number;
  name: string;
  count: number;
}) {
  const { data: report } = useTeacherAttendanceReportQuery(courseId);
  const lowCount = report?.report.filter((r) => r.lowAttendance).length ?? 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{name}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">{count} students enrolled</p>
        {lowCount > 0 && (
          <p className="text-sm text-amber-700">{lowCount} student(s) below 70% attendance</p>
        )}
        <div className="flex flex-wrap gap-2">
          <Link
            href={`/teacher/courses/${courseId}/attendance/mark`}
            className={cn(buttonVariants({ size: "sm" }))}
          >
            <ClipboardCheck className="h-4 w-4" aria-hidden="true" />
            Mark attendance
          </Link>
          <Link
            href={`/teacher/courses/${courseId}/attendance/report`}
            className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
          >
            View report
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
