"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { PageHeader } from "@/components/layout/app-shell";
import { CourseDetailPanel } from "@/components/courses/course-detail-panel";
import { buttonVariants } from "@/components/ui/button";
import { EmptyState, LoadingSkeleton } from "@/components/ui/feedback";
import { useAdminCourseQuery } from "@/features/courses/use-courses";
import { cn } from "@/lib/utils";

export default function AdminCourseDetailPage() {
  const params = useParams();
  const id = Number(params.id);
  const { data: course, isLoading, isError } = useAdminCourseQuery(id);

  if (isLoading) return <LoadingSkeleton className="h-64 w-full rounded-xl" />;

  if (isError || !course) {
    return (
      <EmptyState
        title="Course not found"
        description="This course may have been removed or is inactive."
        action={
          <Link href="/admin/courses" className={cn(buttonVariants())}>
            Back to courses
          </Link>
        }
      />
    );
  }

  return (
    <>
      <PageHeader
        title={course.name}
        description={course.description ?? "Manage course details, enrollments, and outline."}
        action={
          <Link href="/admin/courses" className={cn(buttonVariants({ variant: "outline" }))}>
            Back to courses
          </Link>
        }
      />
      <CourseDetailPanel course={course} />
    </>
  );
}
