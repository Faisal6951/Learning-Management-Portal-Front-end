"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createCourseSchema,
  type CreateCourseFormValues,
} from "@/features/courses/courses.schema";
import { useUsersQuery } from "@/features/users/use-users";
import { Button } from "@/components/ui/button";
import { Input, Select, Textarea } from "@/components/ui/input";
import { FormField } from "@/components/ui/label";

export function CreateCourseForm({
  onSubmit,
  isLoading,
  error,
}: {
  onSubmit: (values: CreateCourseFormValues) => Promise<void>;
  isLoading?: boolean;
  error?: string | null;
}) {
  const { data: users } = useUsersQuery();
  const teachers = users?.filter((u) => u.role === "TEACHER" && u.isActive) ?? [];

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateCourseFormValues>({
    resolver: zodResolver(createCourseSchema),
    defaultValues: {
      name: "",
      description: "",
      startDate: "",
      endDate: "",
      teacherId: "",
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      {error && (
        <p className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive" role="alert">
          {error}
        </p>
      )}

      <FormField label="Course name" htmlFor="name" error={errors.name?.message}>
        <Input id="name" placeholder="Mathematics 101" {...register("name")} />
      </FormField>

      <FormField label="Description" htmlFor="description" error={errors.description?.message}>
        <Textarea id="description" placeholder="Brief course description" {...register("description")} />
      </FormField>

      <div className="grid gap-4 sm:grid-cols-2">
        <FormField label="Start date" htmlFor="startDate" error={errors.startDate?.message}>
          <Input id="startDate" type="date" {...register("startDate")} />
        </FormField>
        <FormField label="End date" htmlFor="endDate" error={errors.endDate?.message}>
          <Input id="endDate" type="date" {...register("endDate")} />
        </FormField>
      </div>

      <FormField label="Teacher (optional)" htmlFor="teacherId">
        <Select id="teacherId" {...register("teacherId")}>
          <option value="">Unassigned</option>
          {teachers.map((t) => (
            <option key={t.id} value={t.id}>
              {t.name}
            </option>
          ))}
        </Select>
      </FormField>

      <Button type="submit" isLoading={isLoading}>
        Create course
      </Button>
    </form>
  );
}
