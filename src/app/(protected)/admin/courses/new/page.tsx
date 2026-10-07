"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { PageHeader } from "@/components/layout/app-shell";
import { CreateCourseForm } from "@/components/forms/create-course-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import type { CreateCourseFormValues } from "@/features/courses/courses.schema";
import { useCreateCourseMutation } from "@/features/courses/use-courses";
import { getApiErrorMessage } from "@/lib/api-client";
import { cn } from "@/lib/utils";

export default function CreateCoursePage() {
  const router = useRouter();
  const createMutation = useCreateCourseMutation();
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (values: CreateCourseFormValues) => {
    setError(null);
    try {
      const course = await createMutation.mutateAsync({
        name: values.name,
        description: values.description || undefined,
        startDate: values.startDate,
        endDate: values.endDate,
        teacherId: values.teacherId ? Number(values.teacherId) : undefined,
      });
      router.push(`/admin/courses/${course.id}`);
    } catch (err) {
      setError(getApiErrorMessage(err));
    }
  };

  return (
    <>
      <PageHeader
        title="Create course"
        description="Add a new course to the portal."
        action={
          <Link href="/admin/courses" className={cn(buttonVariants({ variant: "outline" }))}>
            Back to courses
          </Link>
        }
      />
      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Course details</CardTitle>
        </CardHeader>
        <CardContent>
          <CreateCourseForm
            onSubmit={onSubmit}
            isLoading={createMutation.isPending}
            error={error}
          />
        </CardContent>
      </Card>
    </>
  );
}
