"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  formatTimeAgo,
  readTeacherAssignments,
  writeTeacherAssignments,
  type TeacherAssignment,
} from "@/lib/teacher/assignments";

export default function TeacherAssignmentsPage() {
  const [items, setItems] = useState<TeacherAssignment[]>(() => {
    if (typeof window === "undefined") return [];
    return readTeacherAssignments();
  });

  useEffect(() => {
    const syncAssignments = () => setItems(readTeacherAssignments());
    window.addEventListener("teacher-assignments-updated", syncAssignments);
    window.addEventListener("storage", syncAssignments);
    return () => {
      window.removeEventListener("teacher-assignments-updated", syncAssignments);
      window.removeEventListener("storage", syncAssignments);
    };
  }, []);

  const markReviewed = (id: string) => {
    const next = items.map((item) =>
      item.id === id ? { ...item, status: "reviewed" as const } : item
    );
    setItems(next);
    writeTeacherAssignments(next);
  };

  return (
    <main className="mx-auto max-w-5xl px-6 py-12 text-[var(--text-light,#f5efe6)]">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-[rgba(138,116,68,0.8)]">
            Кабінет вчителя
          </p>
          <h1 className="mt-3 font-serif text-4xl">Роботи на перевірку</h1>
        </div>
        <div className="flex gap-2">
          <Link href="/teacher" className="inline-flex rounded-xl border border-[rgba(201,169,110,0.2)] px-4 py-2 text-xs uppercase tracking-[0.14em]">
            ← Дашборд
          </Link>
          <Link href="/teacher/assignments/new" className="inline-flex rounded-xl border border-[rgba(201,169,110,0.45)] bg-[rgba(201,169,110,0.08)] px-4 py-2 text-xs uppercase tracking-[0.14em] text-[var(--gold-light,#e2c992)]">
            + Нове завдання
          </Link>
        </div>
      </div>

      {items.length === 0 ? (
        <div className="rounded-2xl border border-[rgba(201,169,110,0.16)] p-8 text-sm text-[rgba(232,228,221,0.72)]">
          Поки що робіт немає. Створіть перше завдання, щоб воно зʼявилося тут.
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {items.map((item) => (
            <article key={item.id} className="rounded-2xl border border-[rgba(201,169,110,0.16)] bg-[rgba(16,14,15,0.85)] p-5">
              <div className="mb-3 flex items-center justify-between gap-2">
                <span className="inline-flex items-center rounded-full border border-[rgba(201,169,110,0.2)] px-2 py-1 text-[11px] uppercase tracking-[0.12em] text-[rgba(201,169,110,0.86)]">
                  {item.status === "pending" ? "Чекає перевірки" : "Перевірено"}
                </span>
                <span className="text-xs text-[rgba(154,149,141,0.55)]">{formatTimeAgo(item.submittedAt)}</span>
              </div>

              <p className="text-lg text-[rgba(232,228,221,0.92)]">{item.title}</p>
              <p className="mt-2 text-sm text-[rgba(154,149,141,0.75)]">{item.lesson}</p>
              <p className="mt-3 text-sm text-[rgba(232,228,221,0.8)]">{item.studentName}</p>

              {item.status === "pending" && (
                <button
                  type="button"
                  onClick={() => markReviewed(item.id)}
                  className="mt-4 inline-flex rounded-xl border border-[rgba(52,168,83,0.4)] px-3 py-2 text-xs uppercase tracking-[0.12em] text-[rgba(116,208,140,0.9)]"
                >
                  Позначити як перевірено
                </button>
              )}
            </article>
          ))}
        </div>
      )}
    </main>
  );
}
