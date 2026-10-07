"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { format } from "date-fns";
import { PageHeader } from "@/components/layout/app-shell";
import { Alert, EmptyState, LoadingSkeleton } from "@/components/ui/feedback";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useMarkAttendanceMutation, useTeacherAttendanceReportQuery } from "@/features/attendance/use-attendance";
import { getApiErrorMessage } from "@/lib/api-client";
import { cn } from "@/lib/utils";

export default function MarkAttendancePage() {
  const params = useParams();
  const courseId = Number(params.id);
  const today = format(new Date(), "yyyy-MM-dd");

  const { data: report, isLoading, isError } = useTeacherAttendanceReportQuery(courseId);
  const markMutation = useMarkAttendanceMutation(courseId);

  const [date, setDate] = useState(today);
  const [attendance, setAttendance] = useState<Record<number, boolean>>({});
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (report?.report) {
      const initial: Record<number, boolean> = {};
      report.report.forEach((r) => {
        initial[r.student.id] = true;
      });
      setAttendance(initial);
    }
  }, [report]);

  const markAllPresent = () => {
    if (!report) return;
    const next: Record<number, boolean> = {};
    report.report.forEach((r) => {
      next[r.student.id] = true;
    });
    setAttendance(next);
  };

  const onSubmit = async () => {
    if (!report || report.report.length === 0) return;
    setError(null);
    setMessage(null);
    try {
      const result = await markMutation.mutateAsync({
        courseId,
        date,
        records: report.report.map((r) => ({
          studentId: r.student.id,
          present: attendance[r.student.id] ?? true,
        })),
      });
      setMessage(`Attendance recorded for ${result?.total ?? report.report.length} students.`);
    } catch (err) {
      setError(getApiErrorMessage(err));
    }
  };

  if (isLoading) return <LoadingSkeleton className="h-64 w-full rounded-xl" />;

  if (isError || !report) {
    return (
      <EmptyState
        title="Unable to load course"
        action={
          <Link href="/teacher/courses" className={cn(buttonVariants())}>
            Back to courses
          </Link>
        }
      />
    );
  }

  return (
    <>
      <PageHeader
        title={`Mark attendance — ${report.course}`}
        description="Record present or absent status for each student."
        action={
          <Link
            href={`/teacher/courses/${courseId}/attendance/report`}
            className={cn(buttonVariants({ variant: "outline" }))}
          >
            View report
          </Link>
        }
      />

      {message && <Alert variant="success" className="mb-4">{message}</Alert>}
      {error && <Alert variant="destructive" className="mb-4">{error}</Alert>}

      <Card>
        <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <CardTitle>Session</CardTitle>
          <div className="flex flex-wrap items-center gap-3">
            <Input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              aria-label="Attendance date"
              className="w-auto"
            />
            <Button type="button" variant="secondary" onClick={markAllPresent}>
              Mark all present
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {report.report.length === 0 ? (
            <EmptyState
              title="No students enrolled"
              description="Ask an administrator to enroll students in this course."
            />
          ) : (
            <>
              <Table aria-label="Mark attendance">
                <TableHeader>
                  <TableRow>
                    <TableHead>Student</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {report.report.map((row) => (
                    <TableRow key={row.student.id}>
                      <TableCell>
                        <p className="font-medium">{row.student.name}</p>
                        <p className="text-xs text-muted-foreground">{row.student.email}</p>
                      </TableCell>
                      <TableCell>
                        <fieldset className="flex gap-4">
                          <legend className="sr-only">Attendance for {row.student.name}</legend>
                          <label className="flex items-center gap-2 text-sm">
                            <input
                              type="radio"
                              name={`attendance-${row.student.id}`}
                              checked={attendance[row.student.id] === true}
                              onChange={() =>
                                setAttendance((prev) => ({ ...prev, [row.student.id]: true }))
                              }
                            />
                            Present
                          </label>
                          <label className="flex items-center gap-2 text-sm">
                            <input
                              type="radio"
                              name={`attendance-${row.student.id}`}
                              checked={attendance[row.student.id] === false}
                              onChange={() =>
                                setAttendance((prev) => ({ ...prev, [row.student.id]: false }))
                              }
                            />
                            Absent
                          </label>
                        </fieldset>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <div className="mt-6 flex justify-end">
                <Button onClick={onSubmit} isLoading={markMutation.isPending}>
                  Submit attendance
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </>
  );
}
