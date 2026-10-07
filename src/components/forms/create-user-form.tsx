"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createUserSchema,
  type CreateUserFormValues,
} from "@/features/users/users.schema";
import { Button } from "@/components/ui/button";
import { Input, Select } from "@/components/ui/input";
import { FormField } from "@/components/ui/label";

export function CreateUserForm({
  onSubmit,
  isLoading,
  error,
}: {
  onSubmit: (values: CreateUserFormValues) => Promise<void>;
  isLoading?: boolean;
  error?: string | null;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateUserFormValues>({
    resolver: zodResolver(createUserSchema),
    defaultValues: { name: "", email: "", password: "", role: "STUDENT" },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      {error && (
        <p className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive" role="alert">
          {error}
        </p>
      )}

      <FormField label="Full name" htmlFor="name" error={errors.name?.message}>
        <Input id="name" placeholder="Jane Doe" {...register("name")} />
      </FormField>

      <FormField label="Email address" htmlFor="email" error={errors.email?.message}>
        <Input id="email" type="email" placeholder="jane@college.edu" {...register("email")} />
      </FormField>

      <FormField label="Password" htmlFor="password" error={errors.password?.message}>
        <Input id="password" type="password" autoComplete="new-password" {...register("password")} />
      </FormField>

      <FormField label="Role" htmlFor="role" error={errors.role?.message}>
        <Select id="role" {...register("role")}>
          <option value="STUDENT">Student</option>
          <option value="TEACHER">Teacher</option>
        </Select>
      </FormField>

      <Button type="submit" isLoading={isLoading}>
        Create user
      </Button>
    </form>
  );
}
