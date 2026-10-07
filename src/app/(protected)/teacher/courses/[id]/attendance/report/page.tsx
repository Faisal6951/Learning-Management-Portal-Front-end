"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
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
import { useTeacherAttendanceReportQuery } from "@/features/attendance/use-attendance";
import { cn } from "@/lib/utils";

export default function AttendanceReportPage() {
  const params = useParams();
  const courseId = Number(params.id);
  const { data: report, isLoading, isError } = useTeacherAttendanceReportQuery(courseId);

  if (isLoading) return <LoadingSkeleton className="h-64 w-full rounded-xl" />;

  if (isError || !report) {
    return (
      <EmptyState
        title="Unable to load report"
        action={
          <Link href="/teacher/courses" className={cn(buttonVariants())}>
            Back to courses
          </Link>
        }
      />
    );
  }

  const sorted = [...report.report].sort((a, b) => a.percentage - b.percentage);

  return (
    <>
      <PageHeader
        title={`Attendance report — ${report.course}`}
        description="Per-student attendance summary. Students below 70% are flagged."
        action={
          <Link
            href={`/teacher/courses/${courseId}/attendance/mark`}
            className={cn(buttonVariants())}
          >
            Mark attendance
          </Link>
        }
      />

      {sorted.length === 0 ? (
        <EmptyState title="No students enrolled" />
      ) : (
        <div className="rounded-xl border border-border bg-card">
          <Table aria-label="Attendance report">
            <TableHeader>
              <TableRow>
                <TableHead>Student</TableHead>
                <TableHead>Present</TableHead>
                <TableHead>Absent</TableHead>
                <TableHead>Attendance</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sorted.map((row) => (
                <TableRow key={row.student.id}>
                  <TableCell>
                    <p className="font-medium">{row.student.name}</p>
                    <p className="text-xs text-muted-foreground">{row.student.email}</p>
                  </TableCell>
                  <TableCell>{row.present}</TableCell>
                  <TableCell>{row.absent}</TableCell>
                  <TableCell className="min-w-[140px]">
                    <PercentageBar percentage={row.percentage} lowAttendance={row.lowAttendance} />
                  </TableCell>
                  <TableCell>
                    {row.lowAttendance ? (
                      <Badge variant="warning">Low attendance</Badge>
                    ) : (
                      <Badge variant="success">OK</Badge>
                    )}
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
