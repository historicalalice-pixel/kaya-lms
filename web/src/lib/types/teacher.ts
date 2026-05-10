/**
 * Shared types for the teacher cabinet.
 *
 * Single source of truth between:
 *   - app/teacher/page.tsx (top-level state)
 *   - app/teacher/sections/* (per-section components)
 *   - app/api/teacher/* (server routes — DB row shapes)
 *
 * Keep this file free of React imports so it can be used both client and server.
 */

// =====================================================
// Section keys (sidebar / routing)
// =====================================================

export type SectionKey =
  | "dashboard"
  | "courses"
  | "lessons"
  | "groups"
  | "students"
  | "assignments"
  | "tests"
  | "gradebook"
  | "attendance"
  | "analytics"
  | "messages"
  | "files"
  | "calendar"
  | "drafts"
  | "archive"
  | "settings";

export const SECTIONS: Array<{ key: SectionKey; label: string; note: string }> = [
  { key: "dashboard", label: "Дашборд", note: "Ключові події та навантаження" },
  { key: "courses", label: "Курси", note: "Створення, публікація, архів" },
  { key: "lessons", label: "Уроки", note: "Контент, Zoom, графік" },
  { key: "groups", label: "Групи", note: "Запрошення, призначення" },
  { key: "students", label: "Учні", note: "Картки, статуси, доступ" },
  { key: "assignments", label: "Завдання", note: "Призначення та перевірка" },
  { key: "tests", label: "Тести", note: "Імпорт із zno.osvita.ua" },
  { key: "gradebook", label: "Журнал оцінок", note: "Оцінки та експорт" },
  { key: "attendance", label: "Відвідуваність", note: "Присутність і причини" },
  { key: "analytics", label: "Аналітика", note: "Прогрес і динаміка" },
  { key: "messages", label: "Повідомлення", note: "LMS + Telegram" },
  { key: "files", label: "Файли", note: "Матеріали та фільтри" },
  { key: "calendar", label: "Календар", note: "Уроки й дедлайни" },
  { key: "drafts", label: "Чернетки", note: "Повернення до редагування" },
  { key: "archive", label: "Архів", note: "Відновлення і видалення" },
  { key: "settings", label: "Налаштування", note: "Профіль та інтеграції" },
];

// =====================================================
// Tones (visual variant for chips/pills)
// =====================================================

export type Tone = "gold" | "green" | "blue" | "red" | "gray";

// =====================================================
// Statuses
// =====================================================

export type CourseStatus = "draft" | "scheduled" | "published" | "hidden" | "archived";
export type StudentStatus = "active" | "inactive" | "blocked";
export type AssignmentStatus = "missing" | "submitted" | "checked";
export type FileType = "pdf" | "presentation" | "doc" | "video" | "other";
export type MessageChannel = "lms" | "telegram";

export const COURSE_STATUSES: CourseStatus[] = [
  "draft",
  "scheduled",
  "published",
  "hidden",
  "archived",
];

export const STATUS_TONE: Record<
  CourseStatus | StudentStatus | AssignmentStatus,
  Tone
> = {
  draft: "gray",
  scheduled: "blue",
  published: "green",
  hidden: "gold",
  archived: "red",
  active: "green",
  inactive: "gray",
  blocked: "red",
  missing: "red",
  submitted: "blue",
  checked: "green",
};

export const STATUS_LABEL: Record<
  CourseStatus | StudentStatus | AssignmentStatus,
  string
> = {
  draft: "Чернетка",
  scheduled: "Заплановано",
  published: "Опубліковано",
  hidden: "Приховано",
  archived: "Архів",
  active: "Активний",
  inactive: "Неактивний",
  blocked: "Заблокований",
  missing: "Не здано",
  submitted: "На перевірці",
  checked: "Перевірено",
};

// =====================================================
// Local (UI-friendly) shapes
// =====================================================

export type Student = {
  id: string;
  name: string;
  group: string;
  email: string;
  phone: string;
  telegram: string;
  note: string;
  status: StudentStatus;
  lastLogin: string;
  progress: number;
};

export type Course = {
  id: string;
  title: string;
  topic: string;
  lessons: number;
  status: CourseStatus;
  publishAt: string;
};

export type Assignment = {
  id: string;
  title: string;
  target: string;
  deadline: string;
  status: AssignmentStatus;
  comment: string;
};

export type SearchResult = {
  id: string;
  kind: string;
  title: string;
  subtitle: string;
  section: SectionKey;
};

export type FileItem = {
  id: string;
  name: string;
  type: FileType;
  target: string;
  updated: string;
};

export type MessageThread = {
  id: string;
  target: string;
  channel: MessageChannel;
  text: string;
  status: "отримано" | "відкрито" | "Zoom";
  time: string;
};

// =====================================================
// DB row shapes (mirror Supabase tables)
// Match `web/supabase/migrations/20260330_teacher_cabinet.sql`.
// =====================================================

export type DbCourse = {
  id: string;
  title: string;
  topic: string;
  status: CourseStatus;
  publish_at: string | null;
  lessons_count: number;
  created_at: string;
};

export type DbLesson = {
  id: string;
  title: string;
  course_id: string | null;
  group_name: string;
  status: CourseStatus;
  publish_at: string | null;
  zoom_link: string | null;
  content_summary: string;
  created_at: string;
};

export type DbGroup = {
  id: string;
  name: string;
  invite_code: string;
  invite_url: string;
  archived: boolean;
  created_at: string;
};

export type DbStudent = {
  id: string;
  full_name: string;
  phone: string | null;
  email: string;
  telegram: string | null;
  note: string;
  status: StudentStatus;
  last_login_at: string | null;
  progress: number;
  group_id: string | null;
  group_name: string;
  created_at: string;
};
