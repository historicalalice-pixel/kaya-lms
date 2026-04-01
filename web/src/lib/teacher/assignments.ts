export type TeacherAssignment = {
  id: string;
  studentName: string;
  studentInitials: string;
  lesson: string;
  title: string;
  submittedAt: string;
  status: "pending" | "reviewed";
};

export const TEACHER_ASSIGNMENTS_KEY = "kaya.teacher.assignments";

export const defaultTeacherAssignments: TeacherAssignment[] = [
  {
    id: "seed-dk-1",
    studentName: "Дмитро Коваль",
    studentInitials: "ДК",
    lesson: "Урок 3 · Козацька держава",
    title: "ДЗ: Козацька держава",
    submittedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    status: "pending",
  },
  {
    id: "seed-as-1",
    studentName: "Аліна Савченко",
    studentInitials: "АС",
    lesson: "Урок 2 · Київська Русь",
    title: "Тест: Київська Русь",
    submittedAt: new Date(Date.now() - 26 * 60 * 60 * 1000).toISOString(),
    status: "pending",
  },
  {
    id: "seed-mp-1",
    studentName: "Максим Петренко",
    studentInitials: "МП",
    lesson: "Урок 4 · УНР та ЗУНР",
    title: "Есе: УНР та ЗУНР",
    submittedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    status: "pending",
  },
];

export function getInitials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export function readTeacherAssignments(): TeacherAssignment[] {
  if (typeof window === "undefined") return defaultTeacherAssignments;

  const raw = window.localStorage.getItem(TEACHER_ASSIGNMENTS_KEY);
  if (!raw) {
    window.localStorage.setItem(
      TEACHER_ASSIGNMENTS_KEY,
      JSON.stringify(defaultTeacherAssignments)
    );
    return defaultTeacherAssignments;
  }

  try {
    const parsed = JSON.parse(raw) as TeacherAssignment[];
    if (!Array.isArray(parsed)) return defaultTeacherAssignments;
    return parsed;
  } catch {
    return defaultTeacherAssignments;
  }
}

export function writeTeacherAssignments(items: TeacherAssignment[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(TEACHER_ASSIGNMENTS_KEY, JSON.stringify(items));
  window.dispatchEvent(new Event("teacher-assignments-updated"));
}

export function formatTimeAgo(dateISO: string): string {
  const diffMs = Date.now() - new Date(dateISO).getTime();
  const minute = 60 * 1000;
  const hour = 60 * minute;
  const day = 24 * hour;

  if (diffMs < hour) {
    const minutes = Math.max(1, Math.round(diffMs / minute));
    return `${minutes} хв тому`;
  }

  if (diffMs < day) {
    const hours = Math.max(1, Math.round(diffMs / hour));
    return `${hours} год тому`;
  }

  const days = Math.max(1, Math.round(diffMs / day));
  if (days === 1) return "вчора";
  return `${days} дні тому`;
}
