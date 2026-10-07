"use client";

import Link from "next/link";
import { PageHeader } from "@/components/layout/app-shell";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState, LoadingSkeleton } from "@/components/ui/feedback";
import { useTeacherCoursesQuery } from "@/features/courses/use-courses";
import { cn } from "@/lib/utils";

export default function TeacherCoursesPage() {
  const { data: courses, isLoading, isError } = useTeacherCoursesQuery();

  return (
    <>
      <PageHeader title="My courses" description="Courses assigned to you for teaching." />

      {isLoading ? (
        <LoadingSkeleton className="h-48 w-full rounded-xl" />
      ) : isError ? (
        <EmptyState title="Unable to load courses" />
      ) : !courses || courses.length === 0 ? (
        <EmptyState title="No courses assigned" description="Contact your administrator." />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {courses.map((course) => (
            <Card key={course.id}>
              <CardHeader>
                <CardTitle>{course.name}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {course.description && (
                  <p className="text-sm text-muted-foreground">{course.description}</p>
                )}
                <p className="text-sm">{course._count?.enrollments ?? 0} students</p>
                <div className="flex gap-2">
                  <Link
                    href={`/teacher/courses/${course.id}/attendance/mark`}
                    className={cn(buttonVariants({ size: "sm" }))}
                  >
                    Mark attendance
                  </Link>
                  <Link
                    href={`/teacher/courses/${course.id}/attendance/report`}
                    className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
                  >
                    Report
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </>
  );
}
