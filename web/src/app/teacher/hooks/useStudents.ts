import { useMemo } from "react";
import type { DbStudent, Student } from "../types";

export function formatDateTime(value: string | null | undefined) {
  if (!value) return "—";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return "—";
  return new Intl.DateTimeFormat("uk-UA", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(parsed);
}

export function toLocalStudent(row: DbStudent): Student {
  return {
    id: row.id,
    name: row.full_name,
    group: row.group_name || "Без групи",
    email: row.email,
    phone: row.phone || "—",
    telegram: row.telegram || "—",
    note: row.note,
    status: row.status,
    lastLogin: formatDateTime(row.last_login_at),
    progress: row.progress,
  };
}

export function useStudents(dbStudents: DbStudent[], fallback: Student[]) {
  const students = useMemo(() => {
    if (dbStudents.length > 0) return dbStudents.map((student) => toLocalStudent(student));
    return fallback;
  }, [dbStudents, fallback]);

  const studentsBehind = useMemo(
    () => students.filter((student) => student.progress < 60 || student.status !== "active").length,
    [students],
  );

  return { students, studentsBehind };
}
