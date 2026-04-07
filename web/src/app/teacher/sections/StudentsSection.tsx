import type { CSSProperties } from "react";
import type { DbGroup, Student, StudentStatus } from "../types";

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
  statusTone: Record<StudentStatus, Tone>;
  statusLabel: Record<StudentStatus, string>;
  isDesktop: boolean;
  students: Student[];
  dbGroups: DbGroup[];
  newStudentName: string;
  setNewStudentName: (value: string) => void;
  newStudentEmail: string;
  setNewStudentEmail: (value: string) => void;
  newStudentPhone: string;
  setNewStudentPhone: (value: string) => void;
  newStudentTelegram: string;
  setNewStudentTelegram: (value: string) => void;
  newStudentGroupId: string;
  setNewStudentGroupId: (value: string) => void;
  newStudentNote: string;
  setNewStudentNote: (value: string) => void;
  isSavingStudent: boolean;
  onCreate: () => void;
  onToggleBlock: (id: string, status: StudentStatus) => void;
  onDelete: (id: string) => void;
};

export function StudentsSection(props: Props) {
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
    students,
    dbGroups,
    newStudentName,
    setNewStudentName,
    newStudentEmail,
    setNewStudentEmail,
    newStudentPhone,
    setNewStudentPhone,
    newStudentTelegram,
    setNewStudentTelegram,
    newStudentGroupId,
    setNewStudentGroupId,
    newStudentNote,
    setNewStudentNote,
    isSavingStudent,
    onCreate,
    onToggleBlock,
    onDelete,
  } = props;

  return (
    <section className="p-5 sm:p-6" style={panel}>
      <p style={{ ...sectionTitle, marginBottom: 8 }}>Учні</p>
      <div className="mt-4 p-4" style={inset}>
        <p style={sectionTitle}>Створити учня (реальні дані)</p>
        <div style={{ marginTop: 10, display: "grid", gridTemplateColumns: isDesktop ? "repeat(2, minmax(0,1fr))" : "1fr", gap: 10 }}>
          <input value={newStudentName} onChange={(event) => setNewStudentName(event.target.value)} placeholder="Ім'я та прізвище" style={inputStyle} />
          <input value={newStudentEmail} onChange={(event) => setNewStudentEmail(event.target.value)} placeholder="Email" style={inputStyle} />
          <input value={newStudentPhone} onChange={(event) => setNewStudentPhone(event.target.value)} placeholder="Телефон" style={inputStyle} />
          <input value={newStudentTelegram} onChange={(event) => setNewStudentTelegram(event.target.value)} placeholder="Telegram" style={inputStyle} />
          <select value={newStudentGroupId} onChange={(event) => setNewStudentGroupId(event.target.value)} style={inputStyle}>
            <option value="">Без групи</option>
            {dbGroups.map((group) => (
              <option key={group.id} value={group.id}>{group.name}</option>
            ))}
          </select>
          <button style={button} onClick={onCreate} disabled={isSavingStudent}>{isSavingStudent ? "Створення..." : "Створити учня"}</button>
        </div>
        <textarea
          value={newStudentNote}
          onChange={(event) => setNewStudentNote(event.target.value)}
          placeholder="Внутрішня примітка (видима тільки викладачу)"
          style={{ ...inputStyle, marginTop: 8, minHeight: 74, paddingTop: 10 }}
        />
      </div>

      <div className="mt-4 overflow-x-auto">
        <table style={table}>
          <thead>
            <tr>
              <th style={th}>Учень</th>
              <th style={th}>Контакти</th>
              <th style={th}>Група</th>
              <th style={th}>Статус</th>
              <th style={th}>Останній вхід</th>
              <th style={th}>Внутрішня нотатка</th>
              <th style={th}>Дія</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr key={student.id} style={row}>
                <td style={td}>{student.name}<br /><span style={{ fontSize: "0.68rem", color: "rgba(175,165,149,0.74)" }}>{student.telegram}</span></td>
                <td style={td}>{student.phone}<br />{student.email}</td>
                <td style={td}>{student.group}</td>
                <td style={td}><span style={chip(statusTone[student.status])}>{statusLabel[student.status]}</span></td>
                <td style={td}>{student.lastLogin}</td>
                <td style={td}>{student.note}</td>
                <td style={td}>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    <button style={button} onClick={() => onToggleBlock(student.id, student.status)}>{student.status === "blocked" ? "Розблокувати" : "Заблокувати"}</button>
                    <button style={button} onClick={() => onDelete(student.id)}>Видалити</button>
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
