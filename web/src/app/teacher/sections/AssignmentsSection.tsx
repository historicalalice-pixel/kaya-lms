import type { CSSProperties } from "react";
import type { AssignmentStatus, DbAssignment, DbLesson } from "../types";
import { formatDateTime } from "../hooks/useStudents";

type Tone = "gold" | "green" | "blue" | "red" | "gray";

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
  chip: (tone: Tone) => CSSProperties;
  statusTone: Record<AssignmentStatus, Tone>;
  statusLabel: Record<AssignmentStatus, string>;
  dbAssignments: DbAssignment[];
  dbLessons: DbLesson[];
  isDesktop: boolean;
  isSavingAssignment: boolean;
  newAssignmentTitle: string;
  setNewAssignmentTitle: (value: string) => void;
  newAssignmentTarget: string;
  setNewAssignmentTarget: (value: string) => void;
  newAssignmentStatus: AssignmentStatus;
  setNewAssignmentStatus: (value: AssignmentStatus) => void;
  newAssignmentComment: string;
  setNewAssignmentComment: (value: string) => void;
  newAssignmentDeadline: string;
  setNewAssignmentDeadline: (value: string) => void;
  newAssignmentLessonId: string;
  setNewAssignmentLessonId: (value: string) => void;
  onCreate: () => void;
  onEdit: (assignment: DbAssignment) => void;
  onDelete: (assignmentId: string) => void;
};

export function AssignmentsSection(props: Props) {
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
    dbAssignments,
    dbLessons,
    isDesktop,
    isSavingAssignment,
    newAssignmentTitle,
    setNewAssignmentTitle,
    newAssignmentTarget,
    setNewAssignmentTarget,
    newAssignmentStatus,
    setNewAssignmentStatus,
    newAssignmentComment,
    setNewAssignmentComment,
    newAssignmentDeadline,
    setNewAssignmentDeadline,
    newAssignmentLessonId,
    setNewAssignmentLessonId,
    onCreate,
    onEdit,
    onDelete,
  } = props;

  return (
    <section className="p-5 sm:p-6" style={panel}>
      <p style={{ ...sectionTitle, marginBottom: 8 }}>Завдання</p>
      <div className="mt-4 p-4" style={inset}>
        <p style={sectionTitle}>Створити завдання (реальні дані)</p>
        <div style={{ marginTop: 10, display: "grid", gridTemplateColumns: isDesktop ? "repeat(2, minmax(0,1fr))" : "1fr", gap: 10 }}>
          <input value={newAssignmentTitle} onChange={(event) => setNewAssignmentTitle(event.target.value)} placeholder="Назва завдання" style={inputStyle} />
          <input value={newAssignmentTarget} onChange={(event) => setNewAssignmentTarget(event.target.value)} placeholder="Ціль (група або учень)" style={inputStyle} />
          <select value={newAssignmentLessonId} onChange={(event) => setNewAssignmentLessonId(event.target.value)} style={inputStyle}>
            <option value="">Без уроку</option>
            {dbLessons.map((lesson) => (
              <option key={lesson.id} value={lesson.id}>{lesson.title}</option>
            ))}
          </select>
          <input type="datetime-local" value={newAssignmentDeadline} onChange={(event) => setNewAssignmentDeadline(event.target.value)} style={inputStyle} />
          <select value={newAssignmentStatus} onChange={(event) => setNewAssignmentStatus(event.target.value as AssignmentStatus)} style={inputStyle}>
            <option value="submitted">На перевірці</option>
            <option value="missing">Не здано</option>
            <option value="checked">Перевірено</option>
          </select>
          <button style={button} onClick={onCreate} disabled={isSavingAssignment}>{isSavingAssignment ? "Створення..." : "Створити"}</button>
        </div>
        <textarea
          value={newAssignmentComment}
          onChange={(event) => setNewAssignmentComment(event.target.value)}
          placeholder="Коментар"
          style={{ ...inputStyle, marginTop: 8, minHeight: 74, paddingTop: 10 }}
        />
      </div>

      <div className="mt-4 overflow-x-auto">
        <table style={table}>
          <thead>
            <tr>
              <th style={th}>Назва</th>
              <th style={th}>Ціль</th>
              <th style={th}>Дедлайн</th>
              <th style={th}>Статус</th>
              <th style={th}>Коментар</th>
              <th style={th}>Дії</th>
            </tr>
          </thead>
          <tbody>
            {dbAssignments.map((assignment) => (
              <tr key={assignment.id} style={row}>
                <td style={td}>{assignment.title}</td>
                <td style={td}>{assignment.target}</td>
                <td style={td}>{formatDateTime(assignment.deadline_at)}</td>
                <td style={td}><span style={chip(statusTone[assignment.status])}>{statusLabel[assignment.status]}</span></td>
                <td style={td}>{assignment.comment || "—"}</td>
                <td style={td}>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    <button style={button} onClick={() => onEdit(assignment)}>Редагувати</button>
                    <button style={button} onClick={() => onDelete(assignment.id)}>Видалити</button>
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
