"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { PageHeader } from "@/components/layout/app-shell";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState, LoadingSkeleton } from "@/components/ui/feedback";
import { PercentageBar } from "@/components/ui/percentage-bar";
import { Tabs } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useStudentCoursesQuery } from "@/features/courses/use-courses";
import { useStudentCourseAttendanceQuery } from "@/features/attendance/use-attendance";
import { cn, formatDate } from "@/lib/utils";
import { useState } from "react";

export default function StudentCourseDetailPage() {
  const params = useParams();
  const courseId = Number(params.id);
  const [tab, setTab] = useState("overview");

  const { data: courses, isLoading: coursesLoading } = useStudentCoursesQuery();
  const { data: attendance, isLoading: attendanceLoading } =
    useStudentCourseAttendanceQuery(courseId);

  const course = courses?.find((c) => c.id === courseId);
  const isLoading = coursesLoading || attendanceLoading;

  if (isLoading) return <LoadingSkeleton className="h-64 w-full rounded-xl" />;

  if (!course) {
    return (
      <EmptyState
        title="Course not found"
        action={
          <Link href="/student/courses" className={cn(buttonVariants())}>
            Back to courses
          </Link>
        }
      />
    );
  }

  return (
    <>
      <PageHeader
        title={course.name}
        description={`Taught by ${course.teacher?.name ?? "TBA"}`}
        action={
          <Link href="/student/courses" className={cn(buttonVariants({ variant: "outline" }))}>
            Back to courses
          </Link>
        }
      />

      <Tabs
        tabs={[
          { id: "overview", label: "Overview" },
          { id: "attendance", label: "Attendance" },
        ]}
        active={tab}
        onChange={setTab}
      />

      <div className="mt-6">
        {tab === "overview" && (
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Course info</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                {course.description && <p>{course.description}</p>}
                <p>
                  <span className="text-muted-foreground">Dates: </span>
                  {formatDate(course.startDate)} – {formatDate(course.endDate)}
                </p>
                <p>
                  <span className="text-muted-foreground">Teacher: </span>
                  {course.teacher?.name ?? "TBA"}
                </p>
              </CardContent>
            </Card>
            {course.outline && (
              <Card>
                <CardHeader>
                  <CardTitle>Syllabus</CardTitle>
                </CardHeader>
                <CardContent>
                  <pre className="whitespace-pre-wrap text-sm text-muted-foreground">
                    {course.outline.content}
                  </pre>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {tab === "attendance" && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between gap-4">
                <CardTitle>Attendance history</CardTitle>
                {attendance?.lowAttendance && <Badge variant="warning">Below 70%</Badge>}
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {attendance && (
                <div className="max-w-xs">
                  <PercentageBar
                    percentage={attendance.percentage}
                    lowAttendance={attendance.lowAttendance}
                  />
                  <p className="mt-2 text-sm text-muted-foreground">
                    {attendance.present} present, {attendance.absent} absent ({attendance.totalSessions} sessions)
                  </p>
                </div>
              )}

              {attendance && attendance.records.length > 0 ? (
                <Table aria-label="Attendance records">
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {attendance.records.map((record) => (
                      <TableRow key={record.id}>
                        <TableCell>{formatDate(record.date)}</TableCell>
                        <TableCell>
                          <Badge variant={record.present ? "success" : "destructive"}>
                            {record.present ? "Present" : "Absent"}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <p className="text-sm text-muted-foreground">No attendance recorded yet.</p>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </>
  );
}
