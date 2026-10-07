"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { PageHeader } from "@/components/layout/app-shell";
import { CreateUserForm } from "@/components/forms/create-user-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import type { CreateUserFormValues } from "@/features/users/users.schema";
import { useCreateUserMutation } from "@/features/users/use-users";
import { getApiErrorMessage } from "@/lib/api-client";
import { cn } from "@/lib/utils";

export default function CreateUserPage() {
  const router = useRouter();
  const createMutation = useCreateUserMutation();
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (values: CreateUserFormValues) => {
    setError(null);
    try {
      const user = await createMutation.mutateAsync(values);
      router.push(`/admin/users/${user.id}`);
    } catch (err) {
      setError(getApiErrorMessage(err));
    }
  };

  return (
    <>
      <PageHeader
        title="Add user"
        description="Create a new teacher or student account."
        action={
          <Link href="/admin/users" className={cn(buttonVariants({ variant: "outline" }))}>
            Back to users
          </Link>
        }
      />

      <Card className="max-w-xl">
        <CardHeader>
          <CardTitle>User details</CardTitle>
        </CardHeader>
        <CardContent>
          <CreateUserForm
            onSubmit={onSubmit}
            isLoading={createMutation.isPending}
            error={error}
          />
        </CardContent>
      </Card>
    </>
  );
}
