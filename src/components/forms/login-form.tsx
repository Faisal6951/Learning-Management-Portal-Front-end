"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { GraduationCap } from "lucide-react";
import { loginSchema, type LoginFormValues } from "@/features/auth/auth.schema";
import { login } from "@/features/auth/auth.service";
import { useAuthStore } from "@/features/auth/auth.store";
import { getApiErrorMessage } from "@/lib/api-client";
import { getRoleHomePath } from "@/lib/utils";
import { Alert } from "@/components/ui/feedback";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { FormField } from "@/components/ui/label";
import { BackendStatusBanner } from "@/components/auth/backend-status-banner";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const setSession = useAuthStore((state) => state.setSession);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const sessionExpired = searchParams.get("session") === "expired";

  const onSubmit = async (values: LoginFormValues) => {
    setError(null);
    try {
      const session = await login(values);
      setSession(session);
      const redirect = searchParams.get("redirect");
      router.replace(redirect ?? getRoleHomePath(session.user.role));
    } catch (err) {
      setError(getApiErrorMessage(err, "Unable to sign in. Please try again."));
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-linear-to-br from-slate-50 via-white to-teal-50 px-4 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg">
            <GraduationCap className="h-7 w-7" aria-hidden="true" />
          </div>
          <h1 className="text-2xl font-semibold text-foreground">
            Learning Management Portal
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Sign in to manage courses, users, and attendance
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Sign in to your account</CardTitle>
            <CardDescription>
              Use your college portal credentials
            </CardDescription>
          </CardHeader>
          <CardContent>
            <BackendStatusBanner />
            {(sessionExpired || error) && (
              <div className="mb-4 space-y-2">
                {sessionExpired && (
                  <Alert variant="destructive">
                    Your session has expired. Please sign in again.
                  </Alert>
                )}
                {error && <Alert variant="destructive">{error}</Alert>}
              </div>
            )}

            <form
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-4"
              noValidate
            >
              <FormField
                label="Email address"
                htmlFor="email"
                error={errors.email?.message}
              >
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@college.edu"
                  aria-invalid={!!errors.email}
                  suppressHydrationWarning
                  {...register("email")}
                />
              </FormField>

              <FormField
                label="Password"
                htmlFor="password"
                error={errors.password?.message}
              >
                <Input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  aria-invalid={!!errors.password}
                  {...register("password")}
                />
              </FormField>

              <Button type="submit" className="w-full" isLoading={isSubmitting}>
                Sign in
              </Button>
            </form>
          </CardContent>
        </Card>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          Need help? Contact your IT administrator.
        </p>
      </div>
    </div>
  );
}
