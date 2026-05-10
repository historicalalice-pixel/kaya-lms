import type { DbStudent, Student } from "@/lib/types/teacher";

/**
 * Format an ISO datetime string for the Ukrainian locale (UA).
 * Returns "—" for null and the raw input for unparseable values.
 */
export function formatDateTime(value: string | null): string {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString("uk-UA", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/**
 * Normalise a DB row into the local Student shape used by the UI.
 */
export function toLocalStudent(student: DbStudent): Student {
  return {
    id: student.id,
    name: student.full_name,
    group: student.group_name || "Без групи",
    email: student.email,
    phone: student.phone ?? "—",
    telegram: student.telegram ?? "—",
    note: student.note,
    status: student.status,
    lastLogin: formatDateTime(student.last_login_at),
    progress: student.progress ?? 0,
  };
}
