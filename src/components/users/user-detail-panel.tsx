"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  resetPasswordSchema,
  updateUserSchema,
  type ResetPasswordFormValues,
  type UpdateUserFormValues,
} from "@/features/users/users.schema";
import type { User } from "@/types/api.types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { FormField } from "@/components/ui/label";
import { formatDate } from "@/lib/utils";
import {
  useDeactivateUserMutation,
  useReactivateUserMutation,
  useResetPasswordMutation,
  useUpdateUserMutation,
} from "@/features/users/use-users";
import { getApiErrorMessage } from "@/lib/api-client";
import { Alert } from "@/components/ui/feedback";

export function UserDetailPanel({ user }: { user: User }) {
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const updateMutation = useUpdateUserMutation(user.id);
  const deactivateMutation = useDeactivateUserMutation();
  const reactivateMutation = useReactivateUserMutation();
  const resetPasswordMutation = useResetPasswordMutation(user.id);

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<UpdateUserFormValues>({
    resolver: zodResolver(updateUserSchema),
    defaultValues: { name: user.name, email: user.email },
  });

  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    reset: resetPasswordForm,
    formState: { errors: passwordErrors },
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { newPassword: "" },
  });

  const onUpdate = async (values: UpdateUserFormValues) => {
    setError(null);
    setMessage(null);
    try {
      await updateMutation.mutateAsync(values);
      setMessage("User details updated successfully.");
    } catch (err) {
      setError(getApiErrorMessage(err));
    }
  };

  const onDeactivate = async () => {
    if (!confirm(`Deactivate ${user.name}? They will not be able to sign in.`)) return;
    setError(null);
    setMessage(null);
    try {
      await deactivateMutation.mutateAsync(user.id);
      setMessage(`${user.name} has been deactivated.`);
    } catch (err) {
      setError(getApiErrorMessage(err));
    }
  };

  const onReactivate = async () => {
    setError(null);
    setMessage(null);
    try {
      await reactivateMutation.mutateAsync(user.id);
      setMessage(`${user.name} has been reactivated.`);
    } catch (err) {
      setError(getApiErrorMessage(err));
    }
  };

  const onResetPassword = async (values: ResetPasswordFormValues) => {
    setError(null);
    setMessage(null);
    try {
      await resetPasswordMutation.mutateAsync(values.newPassword);
      resetPasswordForm();
      setMessage("Password reset successfully.");
    } catch (err) {
      setError(getApiErrorMessage(err));
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between gap-4">
            <CardTitle>Profile</CardTitle>
            <Badge variant={user.isActive ? "success" : "destructive"}>
              {user.isActive ? "Active" : "Inactive"}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {message && <Alert variant="success">{message}</Alert>}
          {error && <Alert variant="destructive">{error}</Alert>}

          <div className="grid gap-3 text-sm sm:grid-cols-2">
            <div>
              <p className="text-muted-foreground">Role</p>
              <p className="font-medium capitalize">{user.role.toLowerCase()}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Joined</p>
              <p className="font-medium">{formatDate(user.createdAt)}</p>
            </div>
          </div>

          <form onSubmit={handleSubmit(onUpdate)} className="space-y-4" noValidate>
            <FormField label="Full name" htmlFor="name" error={errors.name?.message}>
              <Input id="name" disabled={!user.isActive} {...register("name")} />
            </FormField>

            <FormField label="Email address" htmlFor="email" error={errors.email?.message}>
              <Input id="email" type="email" disabled={!user.isActive} {...register("email")} />
            </FormField>

            {user.isActive && (
              <Button type="submit" disabled={!isDirty} isLoading={updateMutation.isPending}>
                Save changes
              </Button>
            )}
          </form>
        </CardContent>
      </Card>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Account actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {user.isActive ? (
              <Button variant="destructive" onClick={onDeactivate} isLoading={deactivateMutation.isPending}>
                Deactivate user
              </Button>
            ) : (
              <Button onClick={onReactivate} isLoading={reactivateMutation.isPending}>
                Reactivate user
              </Button>
            )}
          </CardContent>
        </Card>

        {user.isActive && (
          <Card>
            <CardHeader>
              <CardTitle>Reset password</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handlePasswordSubmit(onResetPassword)} className="space-y-4" noValidate>
                <FormField
                  label="New password"
                  htmlFor="newPassword"
                  error={passwordErrors.newPassword?.message}
                >
                  <Input
                    id="newPassword"
                    type="password"
                    autoComplete="new-password"
                    {...registerPassword("newPassword")}
                  />
                </FormField>
                <Button type="submit" variant="secondary" isLoading={resetPasswordMutation.isPending}>
                  Reset password
                </Button>
              </form>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
