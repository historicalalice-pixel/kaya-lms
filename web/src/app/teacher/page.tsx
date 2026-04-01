"use client";

import { useState, useEffect, type CSSProperties } from "react";
import Link from "next/link";
import {
  defaultTeacherAssignments,
  formatTimeAgo,
  readTeacherAssignments,
  type TeacherAssignment,
} from "@/lib/teacher/assignments";

// ─────────────────────────────────────────────────────────────────────────────
// Типи
// ─────────────────────────────────────────────────────────────────────────────

type Student = {
  initials: string;
  name: string;
  progress: number;
  status: "active" | "behind";
};

type Lesson = {
  when: string;
  time: string;
  title: string;
  sub: string;
  soon?: boolean;
};

type Deadline = {
  type: "assignment" | "test" | "lesson" | "reminder";
  title: string;
  date: string;
  group?: string;
};

type ActivityItem = {
  initials: string;
  name: string;
  action: string;
  time: string;
};

type BlockId =
  | "stats"
  | "todayLessons"
  | "pendingReview"
  | "studentActivity"
  | "recentActions"
  | "deadlines";

type BlockConfig = {
  id: BlockId;
  label: string;
  visible: boolean;
};

// ─────────────────────────────────────────────────────────────────────────────
// Тимчасові дані (заглушки до підключення Supabase)
// ─────────────────────────────────────────────────────────────────────────────

const mockStudents: Student[] = [
  { initials: "ДК", name: "Дмитро Коваль", progress: 72, status: "active" },
  { initials: "АС", name: "Аліна Савченко", progress: 45, status: "behind" },
  { initials: "МП", name: "Максим Петренко", progress: 88, status: "active" },
  { initials: "ІБ", name: "Ірина Бондар", progress: 20, status: "behind" },
];

const mockTodayLessons: Lesson[] = [
  {
    when: "Сьогодні",
    time: "18:00",
    title: "Група А — Козацька держава",
    sub: "4 учні · Zoom",
    soon: true,
  },
  {
    when: "Сьогодні",
    time: "20:00",
    title: "Індивідуально — Дмитро К.",
    sub: "Підготовка до НМТ · Zoom",
  },
];

const mockUpcomingLessons: Lesson[] = [
  {
    when: "Завтра",
    time: "16:00",
    title: "Група Б — Київська Русь",
    sub: "5 учнів · Google Meet",
  },
  {
    when: "Ср",
    time: "17:30",
    title: "Індивідуально — Аліна С.",
    sub: "Підготовка до НМТ",
  },
  {
    when: "Пт",
    time: "18:00",
    title: "Група А — Гетьманщина",
    sub: "4 учні · Zoom",
  },
];

const mockDeadlines: Deadline[] = [
  { type: "assignment", title: "ДЗ: Козацька держава", date: "Сьогодні, 23:59", group: "Група А" },
  { type: "test", title: "Тест: Київська Русь", date: "Завтра, 18:00", group: "Група Б" },
  { type: "lesson", title: "Zoom-урок: Гетьманщина", date: "Пт, 18:00", group: "Група А" },
  { type: "reminder", title: "Перевірити ДЗ Аліни С.", date: "Завтра", },
];

const mockRecentActions: ActivityItem[] = [
  { initials: "ДК", name: "Дмитро Коваль", action: "здав ДЗ «Козацька держава»", time: "2 год тому" },
  { initials: "АС", name: "Аліна Савченко", action: "пройшла тест «Київська Русь» — 78%", time: "вчора" },
  { initials: "МП", name: "Максим Петренко", action: "переглянув урок «УНР та ЗУНР»", time: "вчора" },
  { initials: "НЛ", name: "Настя Лисенко", action: "приєдналась до Групи А", time: "2 дні тому" },
  { initials: "ІБ", name: "Ірина Бондар", action: "увійшла в систему", time: "3 дні тому" },
];

// ─────────────────────────────────────────────────────────────────────────────
// Стилі
// ─────────────────────────────────────────────────────────────────────────────

const pageMaxWidth = 1680;

const sectionPanel: CSSProperties = {
  borderRadius: 28,
  border: "1px solid rgba(201,169,110,0.20)",
  background:
    "linear-gradient(180deg, rgba(22,18,16,0.98) 0%, rgba(13,11,12,0.97) 100%)",
  boxShadow:
    "0 18px 40px rgba(0,0,0,0.34), inset 0 1px 0 rgba(255,255,255,0.04)",
};

const heroPanel: CSSProperties = {
  ...sectionPanel,
  background:
    "linear-gradient(180deg, rgba(201,169,110,0.08) 0%, rgba(201,169,110,0.03) 100%)",
};

const statCard: CSSProperties = {
  borderRadius: 26,
  border: "1px solid rgba(201,169,110,0.20)",
  background:
    "linear-gradient(180deg, rgba(24,20,18,0.98) 0%, rgba(14,12,13,0.96) 100%)",
  boxShadow:
    "0 16px 34px rgba(0,0,0,0.30), inset 0 1px 0 rgba(255,255,255,0.04)",
  minHeight: 160,
};

const innerRowCard: CSSProperties = {
  borderRadius: 20,
  border: "1px solid rgba(201,169,110,0.16)",
  background:
    "linear-gradient(180deg, rgba(28,23,20,0.72) 0%, rgba(16,14,15,0.78) 100%)",
  boxShadow: "0 10px 24px rgba(0,0,0,0.18)",
};

const chipBase: CSSProperties = {
  fontSize: "0.60rem",
  letterSpacing: "0.08em",
  padding: "4px 9px",
  borderRadius: 999,
  flexShrink: 0,
};

const avatarBase: CSSProperties = {
  width: 36,
  height: 36,
  borderRadius: "50%",
  border: "1px solid rgba(201,169,110,0.18)",
  background: "rgba(201,169,110,0.06)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "rgba(201,169,110,0.76)",
  flexShrink: 0,
  fontSize: "0.68rem",
};

const sectionTitle: CSSProperties = {
  fontSize: "0.66rem",
  textTransform: "uppercase" as const,
  letterSpacing: "0.24em",
  color: "rgba(138,116,68,0.82)",
};

const sectionLink: CSSProperties = {
  fontSize: "0.66rem",
  textTransform: "uppercase" as const,
  letterSpacing: "0.15em",
  color: "rgba(138,116,68,0.55)",
  textDecoration: "none",
  transition: "color 0.2s",
};

const topActions = [
  { label: "+ Курс", href: "/teacher/courses/new" },
  { label: "+ Урок", href: "/teacher/lessons/new" },
  { label: "+ Завдання", href: "/teacher/assignments/new" },
  { label: "Календар", href: "/teacher/calendar" },
];

const defaultBlocks: BlockConfig[] = [
  { id: "stats", label: "Статистика", visible: true },
  { id: "todayLessons", label: "Уроки сьогодні", visible: true },
  { id: "pendingReview", label: "Роботи на перевірку", visible: true },
  { id: "studentActivity", label: "Активність учнів", visible: true },
  { id: "recentActions", label: "Останні дії учнів", visible: true },
  { id: "deadlines", label: "Нагадування й дедлайни", visible: true },
];

// ─────────────────────────────────────────────────────────────────────────────
// Допоміжні іконки для дедлайнів
// ─────────────────────────────────────────────────────────────────────────────

function DeadlineIcon({ type }: { type: Deadline["type"] }) {
  const colors: Record<Deadline["type"], string> = {
    assignment: "rgba(220,170,60,0.7)",
    test: "rgba(100,170,240,0.7)",
    lesson: "rgba(52,168,83,0.7)",
    reminder: "rgba(201,169,110,0.5)",
  };
  const c = colors[type];

  if (type === "assignment") {
    return (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
      </svg>
    );
  }
  if (type === "test") {
    return (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 11l3 3L22 4" />
        <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
      </svg>
    );
  }
  if (type === "lesson") {
    return (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M15.05 5A5 5 0 0 1 19 8.95M15.05 1A9 9 0 0 1 23 8.94M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
      </svg>
    );
  }
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Компоненти
// ─────────────────────────────────────────────────────────────────────────────

function StatCard({
  label,
  value,
  hint,
  alert = false,
}: {
  label: string;
  value: string;
  hint: string;
  alert?: boolean;
}) {
  return (
    <article className="p-5 sm:p-6" style={statCard}>
      <p style={{ fontSize: "0.62rem", textTransform: "uppercase", letterSpacing: "0.24em", color: "rgba(138,116,68,0.84)" }}>
        {label}
      </p>
      <p
        className="font-serif"
        style={{
          marginTop: 16,
          fontSize: "2.4rem",
          lineHeight: 1,
          color: alert ? "rgba(220,80,60,0.88)" : "var(--gold-light, #e2c992)",
        }}
      >
        {value}
      </p>
      <p style={{ marginTop: 10, fontSize: "0.84rem", lineHeight: "1.25rem", color: "rgba(232,228,221,0.52)" }}>
        {hint}
      </p>
    </article>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Сторінка дашборду
// ─────────────────────────────────────────────────────────────────────────────

export default function TeacherDashboard() {
  const [blocks, setBlocks] = useState<BlockConfig[]>(defaultBlocks);
  const [showSettings, setShowSettings] = useState(false);
  const [works, setWorks] = useState<TeacherAssignment[]>(defaultTeacherAssignments);
  const [isDesktop, setIsDesktop] = useState(() => {
    if (typeof window === "undefined") return true;
    return window.matchMedia("(min-width: 1280px)").matches;
  });

  useEffect(() => {
    const syncAssignments = () => setWorks(readTeacherAssignments());
    syncAssignments();
    window.addEventListener("teacher-assignments-updated", syncAssignments);
    window.addEventListener("storage", syncAssignments);
    return () => {
      window.removeEventListener("teacher-assignments-updated", syncAssignments);
      window.removeEventListener("storage", syncAssignments);
    };
  }, []);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1280px)");
    const handler = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  const toggleBlock = (id: BlockId) => {
    setBlocks((prev) =>
      prev.map((b) => (b.id === id ? { ...b, visible: !b.visible } : b))
    );
  };

  const moveBlock = (id: BlockId, direction: "up" | "down") => {
    setBlocks((prev) => {
      const idx = prev.findIndex((b) => b.id === id);
      if (idx < 0) return prev;
      const swap = direction === "up" ? idx - 1 : idx + 1;
      if (swap < 0 || swap >= prev.length) return prev;
      const next = [...prev];
      [next[idx], next[swap]] = [next[swap], next[idx]];
      return next;
    });
  };

  // Рендер блоків у порядку, заданому користувачем
  const renderBlock = (block: BlockConfig) => {
    if (!block.visible) return null;

    switch (block.id) {
      case "stats":
        return <StatsBlock key="stats" isDesktop={isDesktop} />;
      case "todayLessons":
        return <TodayLessonsBlock key="todayLessons" isDesktop={isDesktop} />;
      case "pendingReview":
        return <PendingReviewBlock key="pendingReview" isDesktop={isDesktop} works={works} />;
      case "studentActivity":
        return <StudentActivityBlock key="studentActivity" isDesktop={isDesktop} />;
      case "recentActions":
        return <RecentActionsBlock key="recentActions" isDesktop={isDesktop} />;
      case "deadlines":
        return <DeadlinesBlock key="deadlines" isDesktop={isDesktop} />;
      default:
        return null;
    }
  };

  return (
    <div
      className="mx-auto w-full"
      style={{
        maxWidth: `${pageMaxWidth}px`,
        height: isDesktop ? "calc(100vh - 24px)" : "auto",
        overflow: "hidden",
      }}
    >
      {/* Hero */}
      <section className="mb-4 p-5 sm:p-6 lg:p-6" style={heroPanel}>
        <div
          style={{
            display: "flex",
            flexDirection: isDesktop ? "row" : "column",
            gap: 24,
            alignItems: isDesktop ? "flex-end" : "flex-start",
            justifyContent: isDesktop ? "space-between" : "flex-start",
          }}
        >
          <div>
            <p style={{ marginBottom: 10, fontSize: "0.68rem", textTransform: "uppercase", letterSpacing: "0.30em", color: "rgba(138,116,68,0.82)" }}>
              Кабінет вчителя
            </p>
            <h1
              className="font-serif"
              style={{
                maxWidth: 640,
                fontSize: isDesktop ? "2.65rem" : "1.85rem",
                lineHeight: 0.96,
                color: "rgba(245,239,230,0.96)",
              }}
            >
              Дашборд
            </h1>
          </div>

          <div style={{ display: "flex", flexWrap: "wrap", gap: 10, alignItems: "center" }}>
            {topActions.map((btn) => {
              const isPrimary = btn.label.startsWith("+");
              return (
                <Link
                  key={btn.href}
                  href={btn.href}
                  style={{
                    display: "inline-flex",
                    minHeight: 42,
                    alignItems: "center",
                    borderRadius: 15,
                    padding: "0 16px",
                    fontSize: "0.72rem",
                    textTransform: "uppercase",
                    letterSpacing: "0.18em",
                    textDecoration: "none",
                    transition: "all 0.2s",
                    border: isPrimary
                      ? "1px solid rgba(201,169,110,0.40)"
                      : "1px solid rgba(201,169,110,0.16)",
                    background: isPrimary
                      ? "rgba(201,169,110,0.08)"
                      : "rgba(255,255,255,0.015)",
                    color: isPrimary
                      ? "var(--gold-light, #e2c992)"
                      : "rgba(232,228,221,0.72)",
                    boxShadow: isPrimary
                      ? "inset 0 1px 0 rgba(255,255,255,0.03)"
                      : "none",
                  }}
                >
                  {btn.label}
                </Link>
              );
            })}

            {/* Кнопка налаштувань блоків */}
            <button
              onClick={() => setShowSettings(!showSettings)}
              style={{
                display: "inline-flex",
                minHeight: 42,
                alignItems: "center",
                borderRadius: 15,
                padding: "0 14px",
                fontSize: "0.72rem",
                letterSpacing: "0.10em",
                border: showSettings
                  ? "1px solid rgba(201,169,110,0.40)"
                  : "1px solid rgba(201,169,110,0.12)",
                background: showSettings
                  ? "rgba(201,169,110,0.10)"
                  : "rgba(255,255,255,0.015)",
                color: showSettings
                  ? "var(--gold-light, #e2c992)"
                  : "rgba(232,228,221,0.50)",
                cursor: "pointer",
                transition: "all 0.2s",
              }}
              title="Налаштувати блоки"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="3" />
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
              </svg>
            </button>
          </div>
        </div>

        {/* Панель налаштувань блоків */}
        {showSettings && (
          <div
            style={{
              marginTop: 20,
              padding: "16px 20px",
              borderRadius: 20,
              border: "1px solid rgba(201,169,110,0.16)",
              background: "rgba(16,14,15,0.80)",
            }}
          >
            <p style={{ fontSize: "0.62rem", textTransform: "uppercase", letterSpacing: "0.20em", color: "rgba(138,116,68,0.70)", marginBottom: 12 }}>
              Налаштування блоків
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {blocks.map((block, idx) => (
                <div
                  key={block.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    padding: "6px 10px",
                    borderRadius: 12,
                    background: block.visible ? "rgba(201,169,110,0.04)" : "transparent",
                  }}
                >
                  {/* Стрілки вгору/вниз */}
                  <div style={{ display: "flex", flexDirection: "column", gap: 1 }}>
                    <button
                      onClick={() => moveBlock(block.id, "up")}
                      disabled={idx === 0}
                      style={{
                        background: "none",
                        border: "none",
                        color: idx === 0 ? "rgba(138,116,68,0.20)" : "rgba(138,116,68,0.60)",
                        cursor: idx === 0 ? "default" : "pointer",
                        padding: 0,
                        lineHeight: 1,
                        fontSize: "0.7rem",
                      }}
                    >
                      ▲
                    </button>
                    <button
                      onClick={() => moveBlock(block.id, "down")}
                      disabled={idx === blocks.length - 1}
                      style={{
                        background: "none",
                        border: "none",
                        color: idx === blocks.length - 1 ? "rgba(138,116,68,0.20)" : "rgba(138,116,68,0.60)",
                        cursor: idx === blocks.length - 1 ? "default" : "pointer",
                        padding: 0,
                        lineHeight: 1,
                        fontSize: "0.7rem",
                      }}
                    >
                      ▼
                    </button>
                  </div>

                  {/* Тогл видимості */}
                  <button
                    onClick={() => toggleBlock(block.id)}
                    style={{
                      width: 36,
                      height: 20,
                      borderRadius: 10,
                      border: "1px solid rgba(201,169,110,0.20)",
                      background: block.visible
                        ? "rgba(201,169,110,0.30)"
                        : "rgba(255,255,255,0.05)",
                      cursor: "pointer",
                      position: "relative",
                      padding: 0,
                      transition: "background 0.2s",
                      flexShrink: 0,
                    }}
                  >
                    <div
                      style={{
                        width: 14,
                        height: 14,
                        borderRadius: "50%",
                        background: block.visible
                          ? "var(--gold-light, #e2c992)"
                          : "rgba(154,149,141,0.40)",
                        position: "absolute",
                        top: 2,
                        left: block.visible ? 19 : 2,
                        transition: "left 0.2s, background 0.2s",
                      }}
                    />
                  </button>

                  <span
                    style={{
                      fontSize: "0.78rem",
                      color: block.visible
                        ? "rgba(232,228,221,0.80)"
                        : "rgba(154,149,141,0.44)",
                    }}
                  >
                    {block.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* Блоки в порядку користувача */}
      <div
        style={{
          height: isDesktop ? "calc(100vh - 300px)" : "auto",
          overflowY: isDesktop ? "auto" : "visible",
          paddingRight: isDesktop ? 6 : 0,
        }}
      >
        {blocks.map((block) => renderBlock(block))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Блок: Статистика (стат-картки)
// ─────────────────────────────────────────────────────────────────────────────

function StatsBlock({ isDesktop }: { isDesktop: boolean }) {
  return (
    <section
      className="mb-4 lg:mb-5"
      style={{
        display: "grid",
        gridTemplateColumns: isDesktop
          ? "repeat(4, 1fr)"
          : "repeat(2, 1fr)",
        gap: isDesktop ? 12 : 20,
      }}
    >
      <StatCard label="Учні" value="12" hint="3 активні групи" />
      <StatCard label="Перевірка ДЗ" value="5" hint="робіт чекають" alert />
      <StatCard label="Годин цього тижня" value="8" hint="4 уроки проведено" />
      <StatCard label="Заплановано" value="6" hint="3 уроки наступного тижня" />
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Блок: Уроки сьогодні + Найближчі заняття
// ─────────────────────────────────────────────────────────────────────────────

function TodayLessonsBlock({ isDesktop }: { isDesktop: boolean }) {
  return (
    <section
      className="mb-4 lg:mb-5"
      style={{
        display: "grid",
        gridTemplateColumns: isDesktop ? "1.18fr 0.92fr" : "1fr",
        gap: isDesktop ? 12 : 20,
      }}
    >
      {/* Уроки сьогодні */}
      <article className="p-4 sm:p-5" style={sectionPanel}>
        <div style={{ marginBottom: 18, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <p style={sectionTitle}>Уроки сьогодні</p>
          <Link href="/teacher/calendar" style={sectionLink}>
            Розклад →
          </Link>
        </div>

        {mockTodayLessons.length === 0 ? (
          <p style={{ fontSize: "0.84rem", color: "rgba(154,149,141,0.50)", padding: "20px 0" }}>
            Сьогодні уроків немає
          </p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {mockTodayLessons.map((lesson, index) => (
              <div
                key={`today-${index}`}
                style={{ ...innerRowCard, display: "flex", gap: 14, padding: "12px 16px" }}
              >
                <div style={{ minWidth: 60, flexShrink: 0, textAlign: "right" }}>
                  <p style={{ fontSize: "0.60rem", textTransform: "uppercase", letterSpacing: "0.08em", color: "rgba(138,116,68,0.62)" }}>
                    {lesson.when}
                  </p>
                  <p className="font-serif" style={{ fontSize: "0.98rem", color: "rgba(201,169,110,0.82)" }}>
                    {lesson.time}
                  </p>
                </div>
                <div style={{ minWidth: 0, flex: 1 }}>
                  <p style={{ fontSize: "0.84rem", color: "rgba(232,228,221,0.86)" }}>
                    {lesson.title}
                  </p>
                  <p style={{ marginTop: 4, fontSize: "0.70rem", color: "rgba(154,149,141,0.58)" }}>
                    {lesson.sub}
                  </p>
                </div>
                {lesson.soon && (
                  <span
                    style={{
                      ...chipBase,
                      background: "rgba(52,130,200,0.12)",
                      color: "rgba(100,170,240,0.86)",
                      border: "1px solid rgba(52,130,200,0.20)",
                      height: "fit-content",
                    }}
                  >
                    Скоро
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </article>

      {/* Найближчі заняття */}
      <article className="p-4 sm:p-5" style={sectionPanel}>
        <div style={{ marginBottom: 18, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <p style={sectionTitle}>Найближчі заняття</p>
          <Link href="/teacher/calendar" style={sectionLink}>
            Всі →
          </Link>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {mockUpcomingLessons.map((lesson, index) => (
            <div
              key={`upcoming-${index}`}
              style={{ ...innerRowCard, display: "flex", gap: 14, padding: "12px 16px" }}
            >
              <div style={{ minWidth: 60, flexShrink: 0, textAlign: "right" }}>
                <p style={{ fontSize: "0.60rem", textTransform: "uppercase", letterSpacing: "0.08em", color: "rgba(138,116,68,0.62)" }}>
                  {lesson.when}
                </p>
                <p className="font-serif" style={{ fontSize: "0.98rem", color: "rgba(201,169,110,0.82)" }}>
                  {lesson.time}
                </p>
              </div>
              <div style={{ minWidth: 0, flex: 1 }}>
                <p style={{ fontSize: "0.84rem", color: "rgba(232,228,221,0.86)" }}>
                  {lesson.title}
                </p>
                <p style={{ marginTop: 4, fontSize: "0.70rem", color: "rgba(154,149,141,0.58)" }}>
                  {lesson.sub}
                </p>
              </div>
            </div>
          ))}
        </div>
      </article>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Блок: Роботи на перевірку
// ─────────────────────────────────────────────────────────────────────────────

function PendingReviewBlock({
  isDesktop,
  works,
}: {
  isDesktop: boolean;
  works: TeacherAssignment[];
}) {
  return (
    <section className="mb-4 lg:mb-5 p-4 sm:p-5" style={sectionPanel}>
      <div style={{ marginBottom: 18, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <p style={{ ...sectionTitle, display: "flex", alignItems: "center", gap: 8 }}>
          <span>Роботи на перевірку</span>
          <span
            style={{
              fontSize: "0.58rem",
              background: "rgba(192,57,43,0.16)",
              color: "#e67464",
              border: "1px solid rgba(192,57,43,0.26)",
              borderRadius: 999,
              padding: "2px 8px",
            }}
          >
            {works.length}
          </span>
        </p>
        <Link href="/teacher/assignments" style={sectionLink}>
          Всі →
        </Link>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: isDesktop
            ? "repeat(3, 1fr)"
            : "repeat(1, 1fr)",
          gap: 16,
        }}
      >
        {works.slice(0, isDesktop ? 3 : 6).map((work) => (
          <Link
            key={work.id}
            href="/teacher/assignments"
            style={{
              ...innerRowCard,
              display: "flex",
              flexDirection: "column",
              gap: 14,
              padding: 20,
              minHeight: 160,
              textDecoration: "none",
              transition: "all 0.2s",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={avatarBase}>{work.studentInitials}</div>
              <span style={{ fontSize: "0.84rem", fontWeight: 500, color: "rgba(232,228,221,0.86)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {work.studentName}
              </span>
            </div>

            <p style={{ fontSize: "0.75rem", color: "rgba(154,149,141,0.62)" }}>
              {work.lesson}
            </p>

            <div style={{ marginTop: "auto", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span
                style={{
                  ...chipBase,
                  background: "rgba(220,170,60,0.10)",
                  color: "rgba(220,170,60,0.84)",
                  border: "1px solid rgba(220,170,60,0.18)",
                }}
              >
                Чекає
              </span>
              <span style={{ fontSize: "0.66rem", color: "rgba(154,149,141,0.44)" }}>
                {formatTimeAgo(work.submittedAt)}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Блок: Активність учнів (прогрес)
// ─────────────────────────────────────────────────────────────────────────────

function StudentActivityBlock({ isDesktop }: { isDesktop: boolean }) {
  return (
    <section className="mb-4 lg:mb-5 p-4 sm:p-5" style={sectionPanel}>
      <div style={{ marginBottom: 18, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <p style={sectionTitle}>Активність учнів</p>
        <Link href="/teacher/students" style={sectionLink}>
          Всі →
        </Link>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {mockStudents.slice(0, isDesktop ? 4 : mockStudents.length).map((student) => (
          <div
            key={student.name}
            style={{
              ...innerRowCard,
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              gap: 14,
              padding: "12px 16px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 12, minWidth: 200 }}>
              <div style={avatarBase}>{student.initials}</div>
              <p style={{ fontSize: "0.85rem", color: "rgba(232,228,221,0.84)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {student.name}
              </p>
            </div>

            <div style={{ display: "flex", flex: 1, alignItems: "center", gap: 12, minWidth: 120 }}>
              <div style={{ height: 4, flex: 1, overflow: "hidden", borderRadius: 9999, background: "rgba(255,255,255,0.06)" }}>
                <div
                  style={{
                    width: `${student.progress}%`,
                    height: "100%",
                    background:
                      student.status === "active"
                        ? "rgba(201,169,110,0.64)"
                        : "rgba(220,80,60,0.56)",
                    borderRadius: 9999,
                  }}
                />
              </div>
              <span style={{ width: 36, textAlign: "right", fontSize: "0.72rem", color: "rgba(154,149,141,0.64)" }}>
                {student.progress}%
              </span>
            </div>

            <span
              style={{
                ...chipBase,
                background:
                  student.status === "active"
                    ? "rgba(52,168,83,0.12)"
                    : "rgba(220,80,60,0.12)",
                color:
                  student.status === "active"
                    ? "rgba(52,168,83,0.86)"
                    : "rgba(220,80,60,0.88)",
                border:
                  student.status === "active"
                    ? "1px solid rgba(52,168,83,0.20)"
                    : "1px solid rgba(220,80,60,0.20)",
                width: "fit-content",
              }}
            >
              {student.status === "active" ? "Активний" : "Відстає"}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Блок: Останні дії учнів
// ─────────────────────────────────────────────────────────────────────────────

function RecentActionsBlock({ isDesktop }: { isDesktop: boolean }) {
  return (
    <section className="mb-4 lg:mb-5 p-4 sm:p-5" style={sectionPanel}>
      <div style={{ marginBottom: 18, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <p style={sectionTitle}>Останні дії учнів</p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {mockRecentActions.slice(0, isDesktop ? 3 : mockRecentActions.length).map((item, index) => (
          <div
            key={`action-${index}`}
            style={{
              ...innerRowCard,
              display: "flex",
              alignItems: "center",
              gap: 14,
              padding: "10px 16px",
            }}
          >
            <div style={avatarBase}>{item.initials}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontSize: "0.82rem", color: "rgba(232,228,221,0.80)" }}>
                <span style={{ fontWeight: 500 }}>{item.name}</span>
                {" "}
                <span style={{ color: "rgba(154,149,141,0.64)" }}>{item.action}</span>
              </p>
            </div>
            <span style={{ fontSize: "0.66rem", color: "rgba(154,149,141,0.44)", flexShrink: 0 }}>
              {item.time}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Блок: Нагадування й дедлайни
// ─────────────────────────────────────────────────────────────────────────────

function DeadlinesBlock({ isDesktop }: { isDesktop: boolean }) {
  const typeLabels: Record<Deadline["type"], string> = {
    assignment: "ДЗ",
    test: "Тест",
    lesson: "Урок",
    reminder: "Нагадування",
  };

  const typeColors: Record<Deadline["type"], { bg: string; color: string; border: string }> = {
    assignment: {
      bg: "rgba(220,170,60,0.10)",
      color: "rgba(220,170,60,0.84)",
      border: "1px solid rgba(220,170,60,0.18)",
    },
    test: {
      bg: "rgba(52,130,200,0.10)",
      color: "rgba(100,170,240,0.84)",
      border: "1px solid rgba(52,130,200,0.18)",
    },
    lesson: {
      bg: "rgba(52,168,83,0.10)",
      color: "rgba(52,168,83,0.84)",
      border: "1px solid rgba(52,168,83,0.18)",
    },
    reminder: {
      bg: "rgba(201,169,110,0.08)",
      color: "rgba(201,169,110,0.70)",
      border: "1px solid rgba(201,169,110,0.14)",
    },
  };

  return (
    <section className="mb-4 lg:mb-5 p-4 sm:p-5" style={sectionPanel}>
      <div style={{ marginBottom: 18, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <p style={sectionTitle}>Нагадування й дедлайни</p>
        <Link href="/teacher/calendar" style={sectionLink}>
          Календар →
        </Link>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {mockDeadlines.slice(0, isDesktop ? 3 : mockDeadlines.length).map((item, index) => {
          const tc = typeColors[item.type];
          return (
            <div
              key={`deadline-${index}`}
              style={{
                ...innerRowCard,
                display: "flex",
                alignItems: "center",
                gap: 14,
                padding: "12px 16px",
              }}
            >
              <div
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: 10,
                  background: tc.bg,
                  border: tc.border,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <DeadlineIcon type={item.type} />
              </div>

              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: "0.84rem", color: "rgba(232,228,221,0.84)" }}>
                  {item.title}
                </p>
                {item.group && (
                  <p style={{ marginTop: 2, fontSize: "0.70rem", color: "rgba(154,149,141,0.52)" }}>
                    {item.group}
                  </p>
                )}
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
                <span
                  style={{
                    ...chipBase,
                    background: tc.bg,
                    color: tc.color,
                    border: tc.border,
                  }}
                >
                  {typeLabels[item.type]}
                </span>
                <span style={{ fontSize: "0.70rem", color: "rgba(154,149,141,0.58)" }}>
                  {item.date}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
