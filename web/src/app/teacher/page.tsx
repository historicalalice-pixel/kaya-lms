"use client";

import { useEffect, useMemo, useState, type CSSProperties } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { AssignmentsSection } from "./sections/AssignmentsSection";
import { CoursesSection } from "./sections/CoursesSection";
import { StudentsSection } from "./sections/StudentsSection";
import { useStudents } from "./hooks/useStudents";
import { useTeacherEntities } from "./hooks/useTeacherEntities";
import type { AssignmentStatus, CourseStatus, SectionKey, StudentStatus } from "./types";

const sections: Array<{ key: SectionKey; label: string; note: string }> = [
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

const PAGE_MAX_WIDTH = 1680;

const panel: CSSProperties = {
  borderRadius: 26,
  border: "1px solid rgba(201,169,110,0.20)",
  background: "linear-gradient(180deg, rgba(22,18,16,0.98) 0%, rgba(13,11,12,0.97) 100%)",
  boxShadow: "0 18px 40px rgba(0,0,0,0.34), inset 0 1px 0 rgba(255,255,255,0.04)",
};

const inset: CSSProperties = {
  borderRadius: 18,
  border: "1px solid rgba(201,169,110,0.16)",
  background: "rgba(23,19,17,0.72)",
};

const sectionTitle: CSSProperties = {
  fontSize: "0.68rem",
  textTransform: "uppercase",
  letterSpacing: "0.22em",
  color: "rgba(162,141,96,0.78)",
};

const button: CSSProperties = {
  minHeight: 38,
  borderRadius: 12,
  border: "1px solid rgba(201,169,110,0.18)",
  background: "rgba(255,255,255,0.02)",
  color: "rgba(223,217,207,0.82)",
  padding: "0 14px",
  fontSize: "0.72rem",
  letterSpacing: "0.10em",
  textTransform: "uppercase",
};

const inputStyle: CSSProperties = {
  width: "100%",
  minHeight: 42,
  borderRadius: 12,
  border: "1px solid rgba(201,169,110,0.22)",
  background: "rgba(11,10,11,0.72)",
  color: "rgba(235,230,223,0.90)",
  padding: "0 12px",
  fontSize: "0.82rem",
};

const table: CSSProperties = { width: "100%", borderCollapse: "separate", borderSpacing: "0 10px" };
const th: CSSProperties = {
  textAlign: "left",
  padding: "0 12px",
  fontSize: "0.66rem",
  letterSpacing: "0.14em",
  textTransform: "uppercase",
  color: "rgba(165,145,103,0.78)",
  fontWeight: 500,
};
const row: CSSProperties = { background: "rgba(23,19,17,0.72)" };
const td: CSSProperties = {
  padding: "14px 12px",
  fontSize: "0.78rem",
  lineHeight: 1.45,
  color: "rgba(217,210,198,0.82)",
  verticalAlign: "top",
};

const tones = {
  gold: { bg: "rgba(201,169,110,0.10)", border: "1px solid rgba(201,169,110,0.22)", color: "rgba(230,202,148,0.95)" },
  green: { bg: "rgba(52,168,83,0.12)", border: "1px solid rgba(52,168,83,0.24)", color: "rgba(129,221,155,0.95)" },
  blue: { bg: "rgba(52,130,200,0.12)", border: "1px solid rgba(52,130,200,0.24)", color: "rgba(144,200,255,0.95)" },
  red: { bg: "rgba(220,80,60,0.12)", border: "1px solid rgba(220,80,60,0.24)", color: "rgba(244,150,138,0.96)" },
  gray: { bg: "rgba(150,145,136,0.12)", border: "1px solid rgba(150,145,136,0.22)", color: "rgba(206,202,195,0.90)" },
};

type Tone = keyof typeof tones;

const statusTone = {
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
} as const;

const statusLabel = {
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
} as const;

const studentsSeed = [
  { id: "seed-1", name: "Учень без БД", group: "Група A", email: "seed@example.com", phone: "—", telegram: "—", note: "", status: "active" as const, lastLogin: "—", progress: 0 },
];

export default function TeacherCabinetPage() {
  const [activeSection, setActiveSection] = useState<SectionKey>("dashboard");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(() => (typeof window === "undefined" ? true : window.matchMedia("(min-width: 1280px)").matches));
  const [userRole, setUserRole] = useState<string | null>(null);

  const {
    dbCourses,
    dbLessons,
    dbGroups,
    dbStudents,
    dbAssignments,
    dbLoading,
    dbError,
    setDbError,
    isSavingCourse,
    isSavingStudent,
    isSavingAssignment,
    isSavingLesson,
    isSavingGroup,
    loadTeacherEntities,
    createCourse,
    updateCourse,
    deleteCourse,
    createLesson,
    updateLesson,
    deleteLesson,
    createGroup,
    updateGroup,
    deleteGroup,
    createStudent,
    updateStudentStatus,
    deleteStudent,
    createAssignment,
    updateAssignment,
    deleteAssignment,
  } = useTeacherEntities();

  const { students, studentsBehind } = useStudents(dbStudents, studentsSeed);

  const [newCourseTitle, setNewCourseTitle] = useState("");
  const [newCourseTopic, setNewCourseTopic] = useState("");
  const [newCourseStatus, setNewCourseStatus] = useState<CourseStatus>("draft");

  const [newStudentName, setNewStudentName] = useState("");
  const [newStudentEmail, setNewStudentEmail] = useState("");
  const [newStudentPhone, setNewStudentPhone] = useState("");
  const [newStudentTelegram, setNewStudentTelegram] = useState("");
  const [newStudentNote, setNewStudentNote] = useState("");
  const [newStudentGroupId, setNewStudentGroupId] = useState("");

  const [newAssignmentTitle, setNewAssignmentTitle] = useState("");
  const [newAssignmentTarget, setNewAssignmentTarget] = useState("");
  const [newAssignmentStatus, setNewAssignmentStatus] = useState<AssignmentStatus>("submitted");
  const [newAssignmentComment, setNewAssignmentComment] = useState("");
  const [newAssignmentDeadline, setNewAssignmentDeadline] = useState("");
  const [newAssignmentLessonId, setNewAssignmentLessonId] = useState("");
  const [newLessonTitle, setNewLessonTitle] = useState("");
  const [newLessonCourseId, setNewLessonCourseId] = useState("");
  const [newLessonGroupName, setNewLessonGroupName] = useState("");
  const [newLessonStatus, setNewLessonStatus] = useState<CourseStatus>("draft");
  const [newGroupName, setNewGroupName] = useState("");

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) return;
      supabase.from("profiles").select("role").eq("id", data.user.id).single().then(({ data: profile }) => {
        setUserRole(profile?.role ?? null);
      });
    });
  }, []);

  useEffect(() => {
    void loadTeacherEntities();
  }, [loadTeacherEntities]);

  useEffect(() => {
    const media = window.matchMedia("(min-width: 1280px)");
    const onChange = (event: MediaQueryListEvent) => setIsDesktop(event.matches);
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);

  const activeMeta = useMemo(() => sections.find((section) => section.key === activeSection), [activeSection]);

  const chip = (tone: Tone): CSSProperties => ({
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    borderRadius: 999,
    padding: "4px 10px",
    fontSize: "0.68rem",
    ...tones[tone],
  });

  const handleCreateCourse = async () => {
    const title = newCourseTitle.trim();
    if (!title) return setDbError("Вкажіть назву курсу");
    await createCourse({ title, topic: newCourseTopic.trim(), status: newCourseStatus });
    setNewCourseTitle("");
    setNewCourseTopic("");
    setNewCourseStatus("draft");
  };

  const handleEditCourse = async (course: { id: string; title: string; topic: string; status: CourseStatus }) => {
    const title = window.prompt("Нова назва курсу", course.title)?.trim();
    if (!title) return;
    const topic = window.prompt("Нова тема", course.topic || "") ?? "";
    await updateCourse({ id: course.id, title, topic: topic.trim(), status: course.status });
  };

  const handleDeleteCourse = async (course: { id: string; title: string }) => {
    if (!window.confirm(`Видалити курс «${course.title}»?`)) return;
    await deleteCourse(course.id);
  };

  const handleCreateStudent = async () => {
    const fullName = newStudentName.trim();
    const email = newStudentEmail.trim().toLowerCase();
    if (!fullName || !email) return setDbError("Для учня обов'язкові ім'я та email");
    await createStudent({
      fullName,
      email,
      phone: newStudentPhone,
      telegram: newStudentTelegram,
      note: newStudentNote,
      groupId: newStudentGroupId || null,
    });
    setNewStudentName("");
    setNewStudentEmail("");
    setNewStudentPhone("");
    setNewStudentTelegram("");
    setNewStudentNote("");
    setNewStudentGroupId("");
  };

  const handleCreateLesson = async () => {
    const title = newLessonTitle.trim();
    if (!title) return setDbError("Вкажіть назву уроку");
    await createLesson({
      title,
      courseId: newLessonCourseId || null,
      groupName: newLessonGroupName.trim() || "Без групи",
      status: newLessonStatus,
    });
    setNewLessonTitle("");
    setNewLessonCourseId("");
    setNewLessonGroupName("");
    setNewLessonStatus("draft");
  };

  const handleEditLesson = async (lesson: { id: string; title: string; group_name: string; status: CourseStatus; course_id: string | null }) => {
    const title = window.prompt("Назва уроку", lesson.title)?.trim();
    if (!title) return;
    const groupName = window.prompt("Група", lesson.group_name || "Без групи") ?? lesson.group_name;
    await updateLesson({
      id: lesson.id,
      title,
      courseId: lesson.course_id,
      groupName,
      status: lesson.status,
    });
  };

  const handleDeleteLesson = async (lessonId: string) => {
    if (!window.confirm("Видалити урок?")) return;
    await deleteLesson(lessonId);
  };

  const handleCreateGroup = async () => {
    const name = newGroupName.trim();
    if (!name) return setDbError("Вкажіть назву групи");
    await createGroup({ name });
    setNewGroupName("");
  };

  const handleEditGroup = async (group: { id: string; name: string }) => {
    const name = window.prompt("Нова назва групи", group.name)?.trim();
    if (!name) return;
    await updateGroup({ id: group.id, name });
  };

  const handleDeleteGroup = async (groupId: string) => {
    if (!window.confirm("Видалити групу?")) return;
    await deleteGroup(groupId);
  };

  const toggleStudentBlock = async (id: string, status: StudentStatus) => {
    const nextStatus: StudentStatus = status === "blocked" ? "active" : "blocked";
    await updateStudentStatus({ id, status: nextStatus });
  };

  const handleDeleteStudent = async (id: string) => {
    if (!window.confirm("Видалити учня?")) return;
    await deleteStudent(id);
  };

  const handleCreateAssignment = async () => {
    const title = newAssignmentTitle.trim();
    if (!title) return setDbError("Вкажіть назву завдання");
    await createAssignment({
      title,
      target: newAssignmentTarget.trim() || "Без цілі",
      status: newAssignmentStatus,
      comment: newAssignmentComment.trim(),
      deadlineAt: newAssignmentDeadline ? new Date(newAssignmentDeadline).toISOString() : null,
      lessonId: newAssignmentLessonId || null,
    });

    setNewAssignmentTitle("");
    setNewAssignmentTarget("");
    setNewAssignmentStatus("submitted");
    setNewAssignmentComment("");
    setNewAssignmentDeadline("");
    setNewAssignmentLessonId("");
  };

  const handleEditAssignment = async (assignment: {
    id: string;
    title: string;
    target: string;
    status: AssignmentStatus;
    comment: string;
    deadline_at: string | null;
  }) => {
    const title = window.prompt("Назва завдання", assignment.title)?.trim();
    if (!title) return;
    const target = window.prompt("Ціль", assignment.target) ?? assignment.target;
    const comment = window.prompt("Коментар", assignment.comment) ?? assignment.comment;
    await updateAssignment({
      id: assignment.id,
      title,
      target,
      status: assignment.status,
      comment,
      deadlineAt: assignment.deadline_at,
    });
  };

  const handleDeleteAssignment = async (id: string) => {
    if (!window.confirm("Видалити завдання?")) return;
    await deleteAssignment(id);
  };

  const renderSection = () => {
    if (activeSection === "courses") {
      return (
        <CoursesSection
          panel={panel}
          inset={inset}
          sectionTitle={sectionTitle}
          inputStyle={inputStyle}
          button={button}
          table={table}
          th={th}
          row={row}
          td={td}
          chip={chip}
          statusTone={{
            draft: statusTone.draft,
            scheduled: statusTone.scheduled,
            published: statusTone.published,
            hidden: statusTone.hidden,
            archived: statusTone.archived,
          }}
          statusLabel={{
            draft: statusLabel.draft,
            scheduled: statusLabel.scheduled,
            published: statusLabel.published,
            hidden: statusLabel.hidden,
            archived: statusLabel.archived,
          }}
          isDesktop={isDesktop}
          dbCourses={dbCourses}
          newCourseTitle={newCourseTitle}
          setNewCourseTitle={setNewCourseTitle}
          newCourseTopic={newCourseTopic}
          setNewCourseTopic={setNewCourseTopic}
          newCourseStatus={newCourseStatus}
          setNewCourseStatus={setNewCourseStatus}
          isSavingCourse={isSavingCourse}
          onCreate={handleCreateCourse}
          onEdit={handleEditCourse}
          onDelete={handleDeleteCourse}
        />
      );
    }

    if (activeSection === "students") {
      return (
        <StudentsSection
          panel={panel}
          inset={inset}
          sectionTitle={sectionTitle}
          inputStyle={inputStyle}
          button={button}
          table={table}
          th={th}
          row={row}
          td={td}
          chip={chip}
          statusTone={{ active: statusTone.active, inactive: statusTone.inactive, blocked: statusTone.blocked }}
          statusLabel={{ active: statusLabel.active, inactive: statusLabel.inactive, blocked: statusLabel.blocked }}
          isDesktop={isDesktop}
          students={students}
          dbGroups={dbGroups}
          newStudentName={newStudentName}
          setNewStudentName={setNewStudentName}
          newStudentEmail={newStudentEmail}
          setNewStudentEmail={setNewStudentEmail}
          newStudentPhone={newStudentPhone}
          setNewStudentPhone={setNewStudentPhone}
          newStudentTelegram={newStudentTelegram}
          setNewStudentTelegram={setNewStudentTelegram}
          newStudentGroupId={newStudentGroupId}
          setNewStudentGroupId={setNewStudentGroupId}
          newStudentNote={newStudentNote}
          setNewStudentNote={setNewStudentNote}
          isSavingStudent={isSavingStudent}
          onCreate={handleCreateStudent}
          onToggleBlock={toggleStudentBlock}
          onDelete={handleDeleteStudent}
        />
      );
    }

    if (activeSection === "lessons") {
      return (
        <section className="p-5 sm:p-6" style={panel}>
          <p style={{ ...sectionTitle, marginBottom: 8 }}>Уроки</p>
          <div className="mt-4 p-4" style={inset}>
            <p style={sectionTitle}>Створити урок</p>
            <div style={{ marginTop: 10, display: "grid", gridTemplateColumns: isDesktop ? "repeat(2, minmax(0,1fr))" : "1fr", gap: 10 }}>
              <input value={newLessonTitle} onChange={(event) => setNewLessonTitle(event.target.value)} placeholder="Назва уроку" style={inputStyle} />
              <select value={newLessonCourseId} onChange={(event) => setNewLessonCourseId(event.target.value)} style={inputStyle}>
                <option value="">Без курсу</option>
                {dbCourses.map((course) => <option key={course.id} value={course.id}>{course.title}</option>)}
              </select>
              <input value={newLessonGroupName} onChange={(event) => setNewLessonGroupName(event.target.value)} placeholder="Група" style={inputStyle} />
              <select value={newLessonStatus} onChange={(event) => setNewLessonStatus(event.target.value as CourseStatus)} style={inputStyle}>
                <option value="draft">Чернетка</option>
                <option value="scheduled">Заплановано</option>
                <option value="published">Опубліковано</option>
                <option value="hidden">Приховано</option>
                <option value="archived">Архів</option>
              </select>
              <button style={button} onClick={handleCreateLesson} disabled={isSavingLesson}>{isSavingLesson ? "Створення..." : "Створити"}</button>
            </div>
          </div>
          <div className="mt-4 overflow-x-auto">
            <table style={table}>
              <thead><tr><th style={th}>Назва</th><th style={th}>Група</th><th style={th}>Статус</th><th style={th}>Дії</th></tr></thead>
              <tbody>
                {dbLessons.map((lesson) => (
                  <tr key={lesson.id} style={row}>
                    <td style={td}>{lesson.title}</td>
                    <td style={td}>{lesson.group_name || "Без групи"}</td>
                    <td style={td}><span style={chip(statusTone[lesson.status])}>{statusLabel[lesson.status]}</span></td>
                    <td style={td}><div style={{ display: "flex", gap: 8 }}><button style={button} onClick={() => void handleEditLesson(lesson)}>Редагувати</button><button style={button} onClick={() => void handleDeleteLesson(lesson.id)}>Видалити</button></div></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      );
    }

    if (activeSection === "groups") {
      return (
        <section className="p-5 sm:p-6" style={panel}>
          <p style={{ ...sectionTitle, marginBottom: 8 }}>Групи</p>
          <div className="mt-4 p-4" style={inset}>
            <p style={sectionTitle}>Створити групу</p>
            <div style={{ marginTop: 10, display: "grid", gridTemplateColumns: isDesktop ? "2fr auto" : "1fr", gap: 10 }}>
              <input value={newGroupName} onChange={(event) => setNewGroupName(event.target.value)} placeholder="Назва групи" style={inputStyle} />
              <button style={button} onClick={handleCreateGroup} disabled={isSavingGroup}>{isSavingGroup ? "Створення..." : "Створити"}</button>
            </div>
          </div>
          <div className="mt-4 overflow-x-auto">
            <table style={table}>
              <thead><tr><th style={th}>Назва</th><th style={th}>Код</th><th style={th}>Посилання</th><th style={th}>Дії</th></tr></thead>
              <tbody>
                {dbGroups.map((group) => (
                  <tr key={group.id} style={row}>
                    <td style={td}>{group.name}</td>
                    <td style={td}>{group.invite_code}</td>
                    <td style={td}>{group.invite_url}</td>
                    <td style={td}><div style={{ display: "flex", gap: 8 }}><button style={button} onClick={() => void handleEditGroup(group)}>Редагувати</button><button style={button} onClick={() => void handleDeleteGroup(group.id)}>Видалити</button></div></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      );
    }

    if (activeSection === "assignments") {
      return (
        <AssignmentsSection
          panel={panel}
          inset={inset}
          sectionTitle={sectionTitle}
          inputStyle={inputStyle}
          button={button}
          table={table}
          th={th}
          row={row}
          td={td}
          chip={chip}
          statusTone={{ missing: statusTone.missing, submitted: statusTone.submitted, checked: statusTone.checked }}
          statusLabel={{ missing: statusLabel.missing, submitted: statusLabel.submitted, checked: statusLabel.checked }}
          dbAssignments={dbAssignments}
          dbLessons={dbLessons}
          isDesktop={isDesktop}
          isSavingAssignment={isSavingAssignment}
          newAssignmentTitle={newAssignmentTitle}
          setNewAssignmentTitle={setNewAssignmentTitle}
          newAssignmentTarget={newAssignmentTarget}
          setNewAssignmentTarget={setNewAssignmentTarget}
          newAssignmentStatus={newAssignmentStatus}
          setNewAssignmentStatus={setNewAssignmentStatus}
          newAssignmentComment={newAssignmentComment}
          setNewAssignmentComment={setNewAssignmentComment}
          newAssignmentDeadline={newAssignmentDeadline}
          setNewAssignmentDeadline={setNewAssignmentDeadline}
          newAssignmentLessonId={newAssignmentLessonId}
          setNewAssignmentLessonId={setNewAssignmentLessonId}
          onCreate={handleCreateAssignment}
          onEdit={handleEditAssignment}
          onDelete={handleDeleteAssignment}
        />
      );
    }

    return (
      <section className="p-5 sm:p-6" style={panel}>
        <p style={sectionTitle}>{sections.find((s) => s.key === activeSection)?.label}</p>
        <p style={{ marginTop: 8, color: "rgba(231,226,216,0.70)" }}>Розділ в процесі модульної міграції.</p>
      </section>
    );
  };

  return (
    <div className="mx-auto w-full px-4 pb-14 pt-4 sm:px-6 lg:px-8" style={{ maxWidth: `${PAGE_MAX_WIDTH}px` }}>
      <section className="mb-6 p-5 sm:p-6" style={{ ...panel, background: "linear-gradient(180deg, rgba(201,169,110,0.10) 0%, rgba(16,13,14,0.96) 100%)" }}>
        <p style={{ ...sectionTitle, letterSpacing: "0.30em" }}>Кабінет вчителя</p>
        <h1 className="font-serif" style={{ marginTop: 10, fontSize: isDesktop ? "2.3rem" : "1.8rem", color: "rgba(245,239,230,0.96)" }}>LMS з історії України</h1>
        <div style={{ marginTop: 12, display: "flex", flexWrap: "wrap", gap: 8 }}>
          <span style={chip("blue")}>Курси: {dbCourses.length}</span>
          <span style={chip("blue")}>Уроки: {dbLessons.length}</span>
          <span style={chip("blue")}>Групи: {dbGroups.length}</span>
          <span style={chip("blue")}>Учні: {dbStudents.length}</span>
          <span style={chip("blue")}>Завдання: {dbAssignments.length}</span>
          <span style={chip("red")}>Відстають: {studentsBehind}</span>
          {dbLoading ? <span style={chip("gold")}>Синхронізація...</span> : null}
          {dbError ? <span style={chip("red")}>{dbError}</span> : null}
          <button style={button} onClick={() => void loadTeacherEntities()}>Оновити дані</button>
        </div>
      </section>

      <section className="mb-6 grid gap-6 xl:grid-cols-[290px_minmax(0,1fr)]">
        <aside className="p-4 sm:p-5" style={{ ...panel, height: "fit-content", ...(isDesktop ? { position: "sticky", top: 16 } : {}) }}>
          <p style={sectionTitle}>Розділи кабінету</p>
          <p style={{ marginTop: 8, fontSize: "0.76rem", color: "rgba(175,165,149,0.74)", lineHeight: 1.45 }}>{activeMeta?.note}</p>
          <div style={{ marginTop: 12, display: "grid", gap: 8 }}>
            {sections.map((section) => {
              const active = section.key === activeSection;
              return (
                <button
                  key={section.key}
                  onClick={() => setActiveSection(section.key)}
                  style={{
                    ...button,
                    textAlign: "left",
                    border: active ? "1px solid rgba(201,169,110,0.44)" : button.border,
                    background: active ? "rgba(201,169,110,0.14)" : button.background,
                  }}
                >
                  {section.label}
                </button>
              );
            })}
          </div>
          {userRole === "admin" && (
            <Link href="/dashboard" style={{ display: "block", marginTop: 16, ...button, textAlign: "center", textDecoration: "none" }}>
              Перейти в кабінет учня
            </Link>
          )}
          {!isDesktop && (
            <button style={{ ...button, width: "100%", marginTop: 12 }} onClick={() => setIsMobileMenuOpen((v) => !v)}>
              {isMobileMenuOpen ? "Закрити меню" : "Меню розділів"}
            </button>
          )}
        </aside>

        <div className="space-y-6">{renderSection()}</div>
      </section>
    </div>
  );
}
