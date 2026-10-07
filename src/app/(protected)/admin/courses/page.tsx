"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { BookOpen, Plus } from "lucide-react";
import { PageHeader } from "@/components/layout/app-shell";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { EmptyState, LoadingSkeleton } from "@/components/ui/feedback";
import { Input, Select } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAdminCoursesQuery } from "@/features/courses/use-courses";
import { cn, formatDate } from "@/lib/utils";

export default function AdminCoursesPage() {
  const { data: courses, isLoading, isError } = useAdminCoursesQuery();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "ACTIVE" | "INACTIVE">("ALL");

  const filtered = useMemo(() => {
    if (!courses) return [];
    return courses.filter((c) => {
      const matchesSearch = c.name.toLowerCase().includes(search.toLowerCase());
      const matchesStatus =
        statusFilter === "ALL" ||
        (statusFilter === "ACTIVE" ? c.isActive : !c.isActive);
      return matchesSearch && matchesStatus;
    });
  }, [courses, search, statusFilter]);

  return (
    <>
      <PageHeader
        title="Courses"
        description="Manage courses, assign teachers, and enroll students."
        action={
          <Link href="/admin/courses/new" className={cn(buttonVariants())}>
            <Plus className="h-4 w-4" aria-hidden="true" />
            Create course
          </Link>
        }
      />

      <div className="mb-6 flex flex-col gap-3 sm:flex-row">
        <Input
          placeholder="Search courses…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          aria-label="Search courses"
          className="sm:max-w-xs"
        />
        <Select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)}
          aria-label="Filter by status"
          className="sm:max-w-[160px]"
        >
          <option value="ALL">All statuses</option>
          <option value="ACTIVE">Active</option>
          <option value="INACTIVE">Inactive</option>
        </Select>
      </div>

      {isLoading ? (
        <LoadingSkeleton className="h-64 w-full rounded-xl" />
      ) : isError ? (
        <EmptyState title="Unable to load courses" description="Check that the backend is running." />
      ) : filtered.length === 0 ? (
        <EmptyState
          title="No courses found"
          description="Create your first course to get started."
          action={
            <Link href="/admin/courses/new" className={cn(buttonVariants())}>
              <BookOpen className="h-4 w-4" aria-hidden="true" />
              Create course
            </Link>
          }
        />
      ) : (
        <div className="rounded-xl border border-border bg-card">
          <Table aria-label="Courses list">
            <TableHeader>
              <TableRow>
                <TableHead>Course</TableHead>
                <TableHead>Teacher</TableHead>
                <TableHead>Students</TableHead>
                <TableHead>Dates</TableHead>
                <TableHead>Status</TableHead>
                <TableHead><span className="sr-only">Actions</span></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((course) => (
                <TableRow key={course.id}>
                  <TableCell>
                    <p className="font-medium">{course.name}</p>
                    {course.description && (
                      <p className="text-xs text-muted-foreground line-clamp-1">{course.description}</p>
                    )}
                  </TableCell>
                  <TableCell>{course.teacher?.name ?? "—"}</TableCell>
                  <TableCell>{course._count?.enrollments ?? 0}</TableCell>
                  <TableCell className="text-sm">
                    {formatDate(course.startDate)} – {formatDate(course.endDate)}
                  </TableCell>
                  <TableCell>
                    <Badge variant={course.isActive ? "success" : "destructive"}>
                      {course.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Link
                      href={`/admin/courses/${course.id}`}
                      className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}
                    >
                      Manage
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </>
  );
}
