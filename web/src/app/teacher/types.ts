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

export type CourseStatus = "draft" | "scheduled" | "published" | "hidden" | "archived";
export type StudentStatus = "active" | "inactive" | "blocked";
export type AssignmentStatus = "missing" | "submitted" | "checked";

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

export type Assignment = {
  id: string;
  title: string;
  target: string;
  deadline: string;
  status: AssignmentStatus;
  comment: string;
};

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

export type DbAssignment = {
  id: string;
  title: string;
  target: string;
  deadline_at: string | null;
  status: AssignmentStatus;
  comment: string;
  lesson_id: string | null;
  created_at: string;
};
