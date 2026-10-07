"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { PageHeader } from "@/components/layout/app-shell";
import { UserDetailPanel } from "@/components/users/user-detail-panel";
import { buttonVariants } from "@/components/ui/button";
import { EmptyState, LoadingSkeleton } from "@/components/ui/feedback";
import { useUserQuery } from "@/features/users/use-users";
import { cn } from "@/lib/utils";

export default function UserDetailPage() {
  const params = useParams();
  const id = Number(params.id);
  const { data: user, isLoading, isError } = useUserQuery(id);

  if (isLoading) {
    return <LoadingSkeleton className="h-64 w-full rounded-xl" />;
  }

  if (isError || !user) {
    return (
      <EmptyState
        title="User not found"
        description="This user may have been removed or the link is incorrect."
        action={
          <Link href="/admin/users" className={cn(buttonVariants())}>
            Back to users
          </Link>
        }
      />
    );
  }

  return (
    <>
      <PageHeader
        title={user.name}
        description={user.email}
        action={
          <Link href="/admin/users" className={cn(buttonVariants({ variant: "outline" }))}>
            Back to users
          </Link>
        }
      />
      <UserDetailPanel user={user} />
    </>
  );
}
