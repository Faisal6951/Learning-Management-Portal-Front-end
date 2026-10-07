import { Suspense } from "react";
import { LoginForm } from "@/components/forms/login-form";
import { LoadingSkeleton } from "@/components/ui/feedback";

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <LoadingSkeleton className="h-10 w-64" />
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
