"use client";

import Link from "next/link";
import { PageHeader } from "@/components/layout/app-shell";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { EmptyState, LoadingSkeleton } from "@/components/ui/feedback";
import { PercentageBar } from "@/components/ui/percentage-bar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useStudentAttendanceQuery } from "@/features/attendance/use-attendance";
import { cn } from "@/lib/utils";

export default function StudentAttendancePage() {
  const { data: attendance, isLoading, isError } = useStudentAttendanceQuery();

  return (
    <>
      <PageHeader
        title="Attendance"
        description="Your attendance summary across all enrolled courses."
      />

      {isLoading ? (
        <LoadingSkeleton className="h-64 w-full rounded-xl" />
      ) : isError ? (
        <EmptyState title="Unable to load attendance" />
      ) : !attendance || attendance.length === 0 ? (
        <EmptyState title="No attendance data" description="You may not be enrolled in any courses yet." />
      ) : (
        <div className="rounded-xl border border-border bg-card">
          <Table aria-label="Attendance summary">
            <TableHeader>
              <TableRow>
                <TableHead>Course</TableHead>
                <TableHead>Present</TableHead>
                <TableHead>Absent</TableHead>
                <TableHead>Attendance</TableHead>
                <TableHead>Status</TableHead>
                <TableHead><span className="sr-only">Actions</span></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {attendance.map((row) => (
                <TableRow key={row.course.id}>
                  <TableCell className="font-medium">{row.course.name}</TableCell>
                  <TableCell>{row.present}</TableCell>
                  <TableCell>{row.absent}</TableCell>
                  <TableCell className="min-w-[140px]">
                    <PercentageBar percentage={row.percentage} lowAttendance={row.lowAttendance} />
                  </TableCell>
                  <TableCell>
                    {row.lowAttendance ? (
                      <Badge variant="warning">Low</Badge>
                    ) : (
                      <Badge variant="success">OK</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <Link
                      href={`/student/courses/${row.course.id}`}
                      className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}
                    >
                      Details
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
