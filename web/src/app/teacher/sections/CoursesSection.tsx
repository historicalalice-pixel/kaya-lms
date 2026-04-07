import type { CSSProperties } from "react";
import type { CourseStatus, DbCourse } from "../types";
import { formatDateTime } from "../hooks/useStudents";

type Props = {
  panel: CSSProperties;
  inset: CSSProperties;
  sectionTitle: CSSProperties;
  inputStyle: CSSProperties;
  button: CSSProperties;
  table: CSSProperties;
  th: CSSProperties;
  row: CSSProperties;
  td: CSSProperties;
  chip: (tone: "gold" | "green" | "blue" | "red" | "gray") => CSSProperties;
  statusTone: Record<CourseStatus, "gold" | "green" | "blue" | "red" | "gray">;
  statusLabel: Record<CourseStatus, string>;
  isDesktop: boolean;
  dbCourses: DbCourse[];
  newCourseTitle: string;
  setNewCourseTitle: (value: string) => void;
  newCourseTopic: string;
  setNewCourseTopic: (value: string) => void;
  newCourseStatus: CourseStatus;
  setNewCourseStatus: (value: CourseStatus) => void;
  isSavingCourse: boolean;
  onCreate: () => void;
  onEdit: (course: DbCourse) => void;
  onDelete: (course: DbCourse) => void;
};

export function CoursesSection(props: Props) {
  const {
    panel,
    inset,
    sectionTitle,
    inputStyle,
    button,
    table,
    th,
    row,
    td,
    chip,
    statusTone,
    statusLabel,
    isDesktop,
    dbCourses,
    newCourseTitle,
    setNewCourseTitle,
    newCourseTopic,
    setNewCourseTopic,
    newCourseStatus,
    setNewCourseStatus,
    isSavingCourse,
    onCreate,
    onEdit,
    onDelete,
  } = props;

  return (
    <section className="p-5 sm:p-6" style={panel}>
      <p style={{ ...sectionTitle, marginBottom: 8 }}>Курси</p>
      <div className="mt-4 p-4" style={inset}>
        <p style={sectionTitle}>Створити курс (реальні дані)</p>
        <div style={{ marginTop: 10, display: "grid", gridTemplateColumns: isDesktop ? "repeat(2, minmax(0,1fr))" : "1fr", gap: 10 }}>
          <input value={newCourseTitle} onChange={(event) => setNewCourseTitle(event.target.value)} placeholder="Назва курсу" style={inputStyle} />
          <input value={newCourseTopic} onChange={(event) => setNewCourseTopic(event.target.value)} placeholder="Тема" style={inputStyle} />
          <select value={newCourseStatus} onChange={(event) => setNewCourseStatus(event.target.value as CourseStatus)} style={inputStyle}>
            <option value="draft">Чернетка</option>
            <option value="scheduled">Заплановано</option>
            <option value="published">Опубліковано</option>
            <option value="hidden">Приховано</option>
            <option value="archived">Архів</option>
          </select>
          <button style={button} onClick={onCreate} disabled={isSavingCourse}>{isSavingCourse ? "Створення..." : "Створити"}</button>
        </div>
      </div>

      <div className="mt-4 overflow-x-auto">
        <table style={table}>
          <thead>
            <tr>
              <th style={th}>Курс</th>
              <th style={th}>Тема</th>
              <th style={th}>Уроків</th>
              <th style={th}>Публікація</th>
              <th style={th}>Статус</th>
              <th style={th}>Дії</th>
            </tr>
          </thead>
          <tbody>
            {dbCourses.map((course) => (
              <tr key={course.id} style={row}>
                <td style={td}>{course.title}</td>
                <td style={td}>{course.topic || "—"}</td>
                <td style={td}>{course.lessons_count ?? 0}</td>
                <td style={td}>{formatDateTime(course.publish_at)}</td>
                <td style={td}><span style={chip(statusTone[course.status])}>{statusLabel[course.status]}</span></td>
                <td style={td}>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    <button style={button} onClick={() => onEdit(course)}>Редагувати</button>
                    <button style={button} onClick={() => onDelete(course)}>Видалити</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
