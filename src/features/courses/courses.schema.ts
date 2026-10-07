import { z } from "zod";

export const createCourseSchema = z
  .object({
    name: z
      .string()
      .min(3, "Course name must be at least 3 characters")
      .max(100, "Course name cannot exceed 100 characters"),
    description: z.string().max(500, "Description cannot exceed 500 characters").optional(),
    startDate: z.string().min(1, "Start date is required"),
    endDate: z.string().min(1, "End date is required"),
    teacherId: z.string().optional(),
  })
  .refine((data) => new Date(data.endDate) > new Date(data.startDate), {
    message: "End date must be after start date",
    path: ["endDate"],
  });

export const updateCourseSchema = z.object({
  name: z.string().min(3).max(100).optional(),
  description: z.string().max(500).optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});

export const outlineSchema = z.object({
  content: z.string().min(10, "Outline content must be at least 10 characters"),
});

export const markAttendanceSchema = z.object({
  courseId: z.number(),
  date: z.string().min(1, "Date is required"),
  records: z
    .array(
      z.object({
        studentId: z.number(),
        present: z.boolean(),
      }),
    )
    .min(1, "At least one student is required"),
});

export type CreateCourseFormValues = z.infer<typeof createCourseSchema>;
export type UpdateCourseFormValues = z.infer<typeof updateCourseSchema>;
export type OutlineFormValues = z.infer<typeof outlineSchema>;
