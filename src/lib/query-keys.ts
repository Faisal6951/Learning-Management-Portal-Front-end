export const queryKeys = {
  users: {
    all: ["users"] as const,
    detail: (id: number) => ["users", id] as const,
  },
  courses: {
    admin: ["courses", "admin"] as const,
    adminDetail: (id: number) => ["courses", "admin", id] as const,
    teacher: ["courses", "teacher"] as const,
    student: ["courses", "student"] as const,
  },
  attendance: {
    teacher: (courseId: number) => ["attendance", "teacher", courseId] as const,
    student: ["attendance", "student"] as const,
    studentCourse: (courseId: number) =>
      ["attendance", "student", courseId] as const,
  },
};
