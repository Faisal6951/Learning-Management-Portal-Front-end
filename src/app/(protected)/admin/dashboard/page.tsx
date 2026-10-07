"use client";

import Link from "next/link";
import { BookOpen, UserPlus, Users } from "lucide-react";
import { PageHeader } from "@/components/layout/app-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { LoadingSkeleton } from "@/components/ui/feedback";
import { useUsersQuery } from "@/features/users/use-users";
import { cn } from "@/lib/utils";

export default function AdminDashboardPage() {
  const { data: users, isLoading } = useUsersQuery();

  const teachers = users?.filter((u) => u.role === "TEACHER" && u.isActive).length ?? 0;
  const students = users?.filter((u) => u.role === "STUDENT" && u.isActive).length ?? 0;
  const inactive = users?.filter((u) => !u.isActive).length ?? 0;

  return (
    <>
      <PageHeader
        title="Admin dashboard"
        description="Overview of portal users and quick administrative actions."
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <LoadingSkeleton key={i} className="h-28 rounded-xl" />
          ))
        ) : (
          <>
            <StatCard title="Total users" value={users?.length ?? 0} />
            <StatCard title="Active teachers" value={teachers} />
            <StatCard title="Active students" value={students} />
            <StatCard title="Inactive accounts" value={inactive} />
          </>
        )}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Quick actions</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-3">
            <Link href="/admin/users/new" className={cn(buttonVariants())}>
              <UserPlus className="h-4 w-4" aria-hidden="true" />
              Add user
            </Link>
            <Link href="/admin/users" className={cn(buttonVariants({ variant: "secondary" }))}>
              <Users className="h-4 w-4" aria-hidden="true" />
              Manage users
            </Link>
            <Link href="/admin/courses" className={cn(buttonVariants({ variant: "outline" }))}>
              <BookOpen className="h-4 w-4" aria-hidden="true" />
              Manage courses
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent users</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <LoadingSkeleton className="h-32 w-full" />
            ) : users && users.length > 0 ? (
              <ul className="divide-y divide-border">
                {users.slice(0, 5).map((user) => (
                  <li key={user.id} className="flex items-center justify-between py-3 text-sm">
                    <div>
                      <p className="font-medium">{user.name}</p>
                      <p className="text-muted-foreground">{user.email}</p>
                    </div>
                    <span className="capitalize text-muted-foreground">{user.role.toLowerCase()}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">No users yet. Create your first user to get started.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}

function StatCard({ title, value }: { title: string; value: number }) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-3xl font-semibold">{value}</p>
      </CardContent>
    </Card>
  );
}
