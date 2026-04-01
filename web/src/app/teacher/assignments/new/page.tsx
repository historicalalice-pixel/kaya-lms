"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import {
  getInitials,
  readTeacherAssignments,
  writeTeacherAssignments,
  type TeacherAssignment,
} from "@/lib/teacher/assignments";

export default function TeacherCreateAssignmentPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [lesson, setLesson] = useState("");
  const [studentName, setStudentName] = useState("");

  const canSubmit = title.trim().length > 2 && lesson.trim().length > 2 && studentName.trim().length > 2;

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!canSubmit) return;

    const nextItem: TeacherAssignment = {
      id: crypto.randomUUID(),
      title: title.trim(),
      lesson: lesson.trim(),
      studentName: studentName.trim(),
      studentInitials: getInitials(studentName) || "У",
      submittedAt: new Date().toISOString(),
      status: "pending",
    };

    const current = readTeacherAssignments();
    writeTeacherAssignments([nextItem, ...current]);
    router.push("/teacher/assignments");
  };

  return (
    <main className="mx-auto max-w-3xl px-6 py-12 text-[var(--text-light,#f5efe6)]">
      <p className="text-xs uppercase tracking-[0.24em] text-[rgba(138,116,68,0.8)]">Кабінет вчителя</p>
      <h1 className="mt-3 font-serif text-4xl">Створення завдання</h1>
      <p className="mt-4 text-sm text-[rgba(232,228,221,0.7)]">
        Додайте нове завдання — після збереження воно зʼявиться в розділі «Роботи на перевірку» та на дашборді.
      </p>

      <form onSubmit={onSubmit} className="mt-8 space-y-4 rounded-2xl border border-[rgba(201,169,110,0.16)] bg-[rgba(16,14,15,0.85)] p-6">
        <label className="block">
          <span className="mb-2 block text-xs uppercase tracking-[0.14em] text-[rgba(138,116,68,0.82)]">Назва завдання</span>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Наприклад: ДЗ з теми «Київська Русь»"
            className="w-full rounded-xl border border-[rgba(201,169,110,0.24)] bg-[rgba(12,11,12,0.88)] px-4 py-3 text-sm outline-none"
          />
        </label>

        <label className="block">
          <span className="mb-2 block text-xs uppercase tracking-[0.14em] text-[rgba(138,116,68,0.82)]">Урок / модуль</span>
          <input
            value={lesson}
            onChange={(e) => setLesson(e.target.value)}
            placeholder="Наприклад: Урок 2 · Київська Русь"
            className="w-full rounded-xl border border-[rgba(201,169,110,0.24)] bg-[rgba(12,11,12,0.88)] px-4 py-3 text-sm outline-none"
          />
        </label>

        <label className="block">
          <span className="mb-2 block text-xs uppercase tracking-[0.14em] text-[rgba(138,116,68,0.82)]">Учень</span>
          <input
            value={studentName}
            onChange={(e) => setStudentName(e.target.value)}
            placeholder="Імʼя та прізвище"
            className="w-full rounded-xl border border-[rgba(201,169,110,0.24)] bg-[rgba(12,11,12,0.88)] px-4 py-3 text-sm outline-none"
          />
        </label>

        <div className="flex flex-wrap gap-2 pt-2">
          <button
            type="submit"
            disabled={!canSubmit}
            className="inline-flex rounded-xl border border-[rgba(201,169,110,0.45)] bg-[rgba(201,169,110,0.08)] px-4 py-2 text-xs uppercase tracking-[0.14em] text-[var(--gold-light,#e2c992)] disabled:cursor-not-allowed disabled:opacity-40"
          >
            Зберегти
          </button>
          <Link href="/teacher/assignments" className="inline-flex rounded-xl border border-[rgba(201,169,110,0.2)] px-4 py-2 text-xs uppercase tracking-[0.14em]">
            Скасувати
          </Link>
        </div>
      </form>
    </main>
  );
}
