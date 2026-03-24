"use client";

import type { CSSProperties, ReactNode } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";

// ─────────────────────────────────────────────────────────────────────────────
// Типи
// ─────────────────────────────────────────────────────────────────────────────

type NavGroup = {
  label: string;
  items: NavItem[];
};

type NavItem = {
  label: string;
  href: string;
  badge?: number;
  isActive?: boolean;
  icon: ReactNode;
};

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

type Work = {
  initials: string;
  name: string;
  lesson: string;
  ago: string;
};

// ─────────────────────────────────────────────────────────────────────────────
// Тимчасові дані
// ─────────────────────────────────────────────────────────────────────────────

const students: Student[] = [
  { initials: "ДК", name: "Дмитро Коваль", progress: 72, status: "active" },
  { initials: "АС", name: "Аліна Савченко", progress: 45, status: "behind" },
  { initials: "МП", name: "Максим Петренко", progress: 88, status: "active" },
  { initials: "ІБ", name: "Ірина Бондар", progress: 20, status: "behind" },
];

const lessons: Lesson[] = [
  {
    when: "Сьогодні",
    time: "18:00",
    title: "Група А — Козацька держава",
    sub: "4 учні · Zoom",
    soon: true,
  },
  {
    when: "Завтра",
    time: "16:00",
    title: "Група Б — Київська Русь",
    sub: "5 учнів · Google Meet",
  },
  {
    when: "Пт",
    time: "17:30",
    title: "Індивідуально — Аліна С.",
    sub: "Підготовка до НМТ",
  },
];

const works: Work[] = [
  {
    initials: "ДК",
    name: "Дмитро Коваль",
    lesson: "Урок 3 · Козацька держава",
    ago: "2 год тому",
  },
  {
    initials: "АС",
    name: "Аліна Савченко",
    lesson: "Урок 2 · Київська Русь",
    ago: "вчора",
  },
  {
    initials: "МП",
    name: "Максим Петренко",
    lesson: "Урок 4 · УНР та ЗУНР",
    ago: "3 дні тому",
  },
  {
    initials: "ІБ",
    name: "Ірина Бондар",
    lesson: "Урок 1 · Вступ",
    ago: "тиждень тому",
  },
  {
    initials: "НЛ",
    name: "Настя Лисенко",
    lesson: "Урок 3 · Козацька держава",
    ago: "4 дні тому",
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// Візуальні стилі
// ─────────────────────────────────────────────────────────────────────────────

const pageMaxWidth = 1680;

const shellPanel: CSSProperties = {
  borderRadius: 28,
  border: "1px solid rgba(201,169,110,0.16)",
  background:
    "linear-gradient(180deg, rgba(15,13,12,0.96) 0%, rgba(9,9,11,0.95) 100%)",
  boxShadow:
    "0 14px 34px rgba(0,0,0,0.28), inset 0 1px 0 rgba(255,255,255,0.03)",
  backdropFilter: "blur(12px)",
};

const sectionPanel: CSSProperties = {
  borderRadius: 26,
  border: "1px solid rgba(201,169,110,0.15)",
  background:
    "linear-gradient(180deg, rgba(16,14,13,0.96) 0%, rgba(10,10,12,0.94) 100%)",
  boxShadow:
    "0 12px 30px rgba(0,0,0,0.24), inset 0 1px 0 rgba(255,255,255,0.025)",
};

const heroPanel: CSSProperties = {
  ...sectionPanel,
  background:
    "linear-gradient(180deg, rgba(201,169,110,0.055) 0%, rgba(201,169,110,0.02) 100%)",
};

const statCard: CSSProperties = {
  borderRadius: 24,
  border: "1px solid rgba(201,169,110,0.16)",
  background:
    "linear-gradient(180deg, rgba(18,16,14,0.96) 0%, rgba(10,10,12,0.94) 100%)",
  boxShadow:
    "0 12px 28px rgba(0,0,0,0.26), inset 0 1px 0 rgba(255,255,255,0.03)",
  minHeight: 168,
};

const innerRowCard: CSSProperties = {
  borderRadius: 18,
  border: "1px solid rgba(201,169,110,0.11)",
  background:
    "linear-gradient(180deg, rgba(255,255,255,0.02) 0%, rgba(255,255,255,0.012) 100%)",
  boxShadow: "0 8px 18px rgba(0,0,0,0.14)",
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
};

const topActions = [
  { label: "+ Урок", href: "/teacher/lessons/new" },
  { label: "+ Завдання", href: "/teacher/tasks/new" },
  { label: "Групи", href: "/teacher/groups" },
  { label: "Курси", href: "/teacher/courses" },
];

// ─────────────────────────────────────────────────────────────────────────────
// Іконки
// ─────────────────────────────────────────────────────────────────────────────

const icons = {
  overview: (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
      <rect
        x="1"
        y="1"
        width="5.5"
        height="5.5"
        rx="1.2"
        stroke="currentColor"
        strokeWidth="1.2"
      />
      <rect
        x="8.5"
        y="1"
        width="5.5"
        height="5.5"
        rx="1.2"
        stroke="currentColor"
        strokeWidth="1.2"
        opacity=".5"
      />
      <rect
        x="1"
        y="8.5"
        width="5.5"
        height="5.5"
        rx="1.2"
        stroke="currentColor"
        strokeWidth="1.2"
        opacity=".5"
      />
      <rect
        x="8.5"
        y="8.5"
        width="5.5"
        height="5.5"
        rx="1.2"
        stroke="currentColor"
        strokeWidth="1.2"
        opacity=".5"
      />
    </svg>
  ),
  courses: (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
      <rect
        x="1.5"
        y="2"
        width="12"
        height="10"
        rx="1.5"
        stroke="currentColor"
        strokeWidth="1.2"
      />
      <path
        d="M4.5 5.5h6M4.5 7.5h4"
        stroke="currentColor"
        strokeWidth="1.1"
        strokeLinecap="round"
      />
    </svg>
  ),
  lessons: (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
      <path
        d="M2 2h11v11H2z"
        stroke="currentColor"
        strokeWidth="1.2"
      />
      <path
        d="M5 5h5M5 7.5h3M5 10h4"
        stroke="currentColor"
        strokeWidth="1.1"
        strokeLinecap="round"
      />
    </svg>
  ),
  groups: (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
      <circle cx="5" cy="5" r="2.5" stroke="currentColor" strokeWidth="1.2" />
      <circle
        cx="10"
        cy="5"
        r="2.5"
        stroke="currentColor"
        strokeWidth="1.2"
        opacity=".5"
      />
      <path
        d="M1 13c0-2.2 1.8-4 4-4s4 1.8 4 4"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      <path
        d="M10 9c1.7.3 3 1.8 3 4"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        opacity=".5"
      />
    </svg>
  ),
  students: (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
      <circle cx="7.5" cy="5" r="2.8" stroke="currentColor" strokeWidth="1.2" />
      <path
        d="M2 13c0-3 2.5-5 5.5-5s5.5 2 5.5 5"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </svg>
  ),
  tasks: (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
      <rect
        x="2"
        y="2"
        width="11"
        height="11"
        rx="1.5"
        stroke="currentColor"
        strokeWidth="1.2"
      />
      <path
        d="M5 7.5l2 2 3.5-3.5"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  review: (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
      <path
        d="M2 3h11v8H9l-2 2-2-2H2V3z"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
      <path
        d="M5 6h5M5 8.5h3"
        stroke="currentColor"
        strokeWidth="1.1"
        strokeLinecap="round"
      />
    </svg>
  ),
  tests: (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
      <circle cx="7.5" cy="7.5" r="5.5" stroke="currentColor" strokeWidth="1.2" />
      <path
        d="M7.5 4.5v3l2 2"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </svg>
  ),
  schedule: (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
      <rect
        x="1.5"
        y="2.5"
        width="12"
        height="11"
        rx="1.5"
        stroke="currentColor"
        strokeWidth="1.2"
      />
      <path
        d="M4.5 1v3M10.5 1v3M1.5 6.5h12"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </svg>
  ),
  messages: (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
      <path
        d="M2 2h11v8H9l-3 2.5V10H2V2z"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
    </svg>
  ),
  profile: (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
      <circle cx="7.5" cy="5" r="2.8" stroke="currentColor" strokeWidth="1.2" />
      <path
        d="M2 13c0-3 2.5-5 5.5-5s5.5 2 5.5 5"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </svg>
  ),
  logout: (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
      <path
        d="M6 2H3a1 1 0 00-1 1v9a1 1 0 001 1h3M10 10l3-2.5L10 5M13 7.5H6"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
};

const navGroups: NavGroup[] = [
  {
    label: "Навчання",
    items: [
      {
        label: "Огляд",
        href: "/teacher",
        icon: icons.overview,
        isActive: true,
      },
      { label: "Курси", href: "/teacher/courses", icon: icons.courses },
      { label: "Уроки", href: "/teacher/lessons", icon: icons.lessons },
      { label: "Групи", href: "/teacher/groups", icon: icons.groups },
      { label: "Учні", href: "/teacher/students", icon: icons.students },
    ],
  },
  {
    label: "Робота",
    items: [
      { label: "Завдання", href: "/teacher/tasks", icon: icons.tasks },
      {
        label: "Перевірка",
        href: "/teacher/review",
        icon: icons.review,
        badge: 5,
      },
      { label: "Тести", href: "/teacher/tests", icon: icons.tests },
    ],
  },
  {
    label: "Інше",
    items: [
      { label: "Розклад", href: "/teacher/schedule", icon: icons.schedule },
      {
        label: "Повідомлення",
        href: "/teacher/messages",
        icon: icons.messages,
      },
      { label: "Профіль", href: "/teacher/profile", icon: icons.profile },
    ],
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// Компоненти
// ─────────────────────────────────────────────────────────────────────────────

function NavLink({
  item,
  onClick,
}: {
  item: NavItem;
  onClick?: () => void;
}) {
  return (
    <Link
      href={item.href}
      onClick={onClick}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "11px 12px",
        borderRadius: 14,
        textDecoration: "none",
        fontSize: "0.84rem",
        letterSpacing: "0.02em",
        color: item.isActive
          ? "var(--gold-light, #e2c992)"
          : "rgba(232,228,221,0.72)",
        background: item.isActive ? "rgba(201,169,110,0.09)" : "transparent",
        border: item.isActive
          ? "1px solid rgba(201,169,110,0.17)"
          : "1px solid transparent",
        transition: "all 0.18s ease",
      }}
    >
      <span
        style={{
          color: item.isActive
            ? "var(--gold-dim, #8a7444)"
            : "rgba(154,149,141,0.42)",
          flexShrink: 0,
        }}
      >
        {item.icon}
      </span>

      <span style={{ flex: 1 }}>{item.label}</span>

      {item.badge ? (
        <span
          style={{
            fontSize: "0.62rem",
            background: "rgba(192,57,43,0.18)",
            color: "#e67464",
            border: "1px solid rgba(192,57,43,0.30)",
            borderRadius: 999,
            padding: "2px 7px",
          }}
        >
          {item.badge}
        </span>
      ) : null}
    </Link>
  );
}

function SidebarContent({
  displayName,
  onNavigate,
  onLogout,
  isSigningOut,
}: {
  displayName: string;
  onNavigate?: () => void;
  onLogout: () => void;
  isSigningOut: boolean;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <div
        style={{
          padding: "24px 18px 16px",
          borderBottom: "1px solid rgba(201,169,110,0.10)",
        }}
      >
        <Link
          href="/home"
          onClick={onNavigate}
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: "1.95rem",
            fontWeight: 300,
            letterSpacing: "0.28em",
            color: "rgba(245,239,230,0.94)",
            textDecoration: "none",
            display: "block",
          }}
        >
          KAYA
        </Link>

        <p
          style={{
            fontSize: "0.54rem",
            letterSpacing: "0.28em",
            textTransform: "uppercase",
            color: "rgba(138,116,68,0.60)",
            marginTop: 6,
          }}
        >
          Кабінет вчителя
        </p>
      </div>

      <nav
        style={{
          flex: 1,
          padding: "14px 10px",
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          gap: 8,
        }}
      >
        {navGroups.map((group) => (
          <div key={group.label}>
            <p
              style={{
                fontSize: "0.54rem",
                letterSpacing: "0.26em",
                textTransform: "uppercase",
                color: "rgba(138,116,68,0.42)",
                padding: "8px 10px 7px",
              }}
            >
              {group.label}
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              {group.items.map((item) => (
                <NavLink key={item.href} item={item} onClick={onNavigate} />
              ))}
            </div>
          </div>
        ))}
      </nav>

      <div
        style={{
          padding: "12px 10px 14px",
          borderTop: "1px solid rgba(201,169,110,0.08)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "10px 12px",
            borderRadius: 16,
            background: "rgba(255,255,255,0.018)",
            border: "1px solid rgba(201,169,110,0.08)",
            marginBottom: 8,
          }}
        >
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: "50%",
              border: "1px solid rgba(201,169,110,0.25)",
              background: "rgba(201,169,110,0.07)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "1rem",
              color: "var(--gold-dim, #8a7444)",
              flexShrink: 0,
            }}
          >
            {displayName.charAt(0).toUpperCase()}
          </div>

          <div style={{ minWidth: 0 }}>
            <p
              style={{
                fontSize: "0.82rem",
                color: "rgba(232,228,221,0.76)",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {displayName}
            </p>
            <p
              style={{
                fontSize: "0.58rem",
                color: "rgba(138,116,68,0.55)",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
              }}
            >
              Вчитель
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onLogout}
          disabled={isSigningOut}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            width: "100%",
            padding: "10px 12px",
            background: "transparent",
            border: "1px solid rgba(201,169,110,0.08)",
            cursor: "pointer",
            color: "rgba(154,149,141,0.72)",
            fontSize: "0.76rem",
            borderRadius: 14,
            transition: "all 0.18s ease",
          }}
        >
          <span style={{ color: "rgba(154,149,141,0.38)" }}>{icons.logout}</span>
          {isSigningOut ? "Вихід..." : "Вийти"}
        </button>
      </div>
    </div>
  );
}

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
    <article className="p-6" style={statCard}>
      <p className="text-[0.62rem] uppercase tracking-[0.24em] text-[rgba(138,116,68,0.84)]">
        {label}
      </p>

      <p
        className={`mt-5 font-serif text-[2.5rem] leading-none sm:text-[2.8rem] ${
          alert
            ? "text-[rgba(220,80,60,0.88)]"
            : "text-[var(--gold-light,#e2c992)]"
        }`}
      >
        {value}
      </p>

      <p className="mt-3 text-[0.84rem] leading-5 text-[rgba(232,228,221,0.52)]">
        {hint}
      </p>
    </article>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Сторінка
// ─────────────────────────────────────────────────────────────────────────────

export default function TeacherPage() {
  const router = useRouter();
  const starfieldRef = useRef<HTMLDivElement>(null);

  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [displayName, setDisplayName] = useState("Вчитель");
  const [isSigningOut, setIsSigningOut] = useState(false);

  useEffect(() => {
    const field = starfieldRef.current;
    if (!field) return;

    field.innerHTML = "";
    const stars: HTMLDivElement[] = [];

    for (let i = 0; i < 120; i += 1) {
      const star = document.createElement("div");
      star.classList.add("star");

      const r = Math.random();
      if (r < 0.55) star.classList.add("star--small");
      else if (r < 0.85) star.classList.add("star--medium");
      else star.classList.add("star--large");

      star.style.left = `${Math.random() * 100}%`;
      star.style.top = `${Math.random() * 100}%`;
      star.style.setProperty("--dur", `${2 + Math.random() * 5}s`);
      star.style.setProperty("--delay", `${Math.random() * 6}s`);

      field.appendChild(star);
      stars.push(star);
    }

    return () => {
      stars.forEach((star) => star.remove());
    };
  }, []);

  useEffect(() => {
    let active = true;

    const loadUser = async () => {
      const supabase = createClient();

      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (!active) return;

      if (error || !user) {
        router.replace("/login");
        return;
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("full_name, role")
        .eq("id", user.id)
        .single();

      if (!active) return;

      const role = profile?.role ?? "student";

      if (role !== "teacher" && role !== "admin") {
        router.replace("/dashboard");
        return;
      }

      setDisplayName(
        profile?.full_name?.trim() || user.email?.split("@")[0] || "Вчитель"
      );
    };

    loadUser();

    return () => {
      active = false;
    };
  }, [router]);

  const handleLogout = async () => {
    setIsSigningOut(true);

    try {
      const supabase = createClient();
      await supabase.auth.signOut();
      router.push("/login");
    } catch {
      setIsSigningOut(false);
    }
  };

  const firstName = displayName.split(" ")[0] || displayName;

  return (
    <div className="relative min-h-screen bg-[var(--bg)] text-[var(--text)]">
      <div ref={starfieldRef} className="starfield" aria-hidden="true" />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 z-0 h-72"
        style={{
          background:
            "radial-gradient(circle at top, rgba(201,169,110,0.10), transparent 58%)",
        }}
      />

      <header className="sticky top-0 z-40 flex items-center justify-between border-b border-[rgba(201,169,110,0.10)] bg-[rgba(10,10,12,0.94)] px-4 py-4 backdrop-blur md:hidden">
        <Link
          href="/home"
          className="font-serif text-[1.6rem] tracking-[0.22em] text-[rgba(245,239,230,0.92)]"
        >
          KAYA
        </Link>

        <button
          type="button"
          onClick={() => setMobileNavOpen(true)}
          className="rounded-xl border border-[rgba(201,169,110,0.18)] px-3 py-2 text-[0.68rem] uppercase tracking-[0.16em] text-[var(--gold-light)]"
        >
          Меню
        </button>
      </header>

      <div className="relative z-10 flex min-h-screen">
        <aside className="hidden w-[272px] flex-shrink-0 pl-6 pb-6 pt-6 md:block">
          <div
            className="sticky top-6 h-[calc(100vh-48px)] overflow-hidden"
            style={shellPanel}
          >
            <SidebarContent
              displayName={displayName}
              onLogout={handleLogout}
              isSigningOut={isSigningOut}
            />
          </div>
        </aside>

        <main className="min-w-0 flex-1 px-4 pb-10 pt-4 sm:px-6 lg:px-8 xl:px-10">
          <div
            className="mx-auto w-full"
            style={{ maxWidth: `${pageMaxWidth}px` }}
          >
            <section className="mb-10 p-6 sm:p-7 lg:p-8" style={heroPanel}>
              <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
                <div>
                  <p className="mb-3 text-[0.68rem] uppercase tracking-[0.30em] text-[rgba(138,116,68,0.82)]">
                    Кабінет вчителя
                  </p>

                  <h1 className="max-w-[760px] font-serif text-[2rem] leading-[0.95] text-[rgba(245,239,230,0.96)] sm:text-[2.5rem] lg:text-[2.9rem]">
                    Вітаємо, {firstName}
                  </h1>
                </div>

                <div className="flex flex-wrap gap-2.5">
                  {topActions.map((btn) => {
                    const isPrimary = btn.label.startsWith("+");

                    return (
                      <Link
                        key={btn.href}
                        href={btn.href}
                        className="inline-flex min-h-[42px] items-center rounded-[15px] px-4 text-[0.72rem] uppercase tracking-[0.18em] transition-all"
                        style={{
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
                </div>
              </div>
            </section>

            <section className="mb-10 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
              <StatCard label="Учні" value="12" hint="3 активні групи" />
              <StatCard label="Перевірка" value="5" hint="робіт чекають" alert />
              <StatCard label="Курси" value="4" hint="2 опубліковано" />
              <StatCard
                label="Відстають"
                value="4"
                hint="не завершили урок"
                alert
              />
            </section>

            <section className="mb-10 grid grid-cols-1 gap-5 xl:grid-cols-[1.2fr_0.9fr]">
              <article className="p-5 sm:p-6" style={sectionPanel}>
                <div className="mb-5 flex items-center justify-between">
                  <p className="text-[0.66rem] uppercase tracking-[0.24em] text-[rgba(138,116,68,0.82)]">
                    Активність учнів
                  </p>

                  <Link
                    href="/teacher/students"
                    className="text-[0.66rem] uppercase tracking-[0.15em] text-[rgba(138,116,68,0.55)] transition-colors hover:text-[var(--gold-light)]"
                  >
                    Всі →
                  </Link>
                </div>

                <div className="space-y-3.5">
                  {students.map((student) => (
                    <div
                      key={student.name}
                      className="flex flex-col gap-3 rounded-[18px] px-4 py-3 sm:flex-row sm:items-center sm:gap-4"
                      style={innerRowCard}
                    >
                      <div className="flex min-w-0 items-center gap-3 sm:min-w-[220px]">
                        <div style={avatarBase}>{student.initials}</div>

                        <p className="truncate text-[0.85rem] text-[rgba(232,228,221,0.84)]">
                          {student.name}
                        </p>
                      </div>

                      <div className="flex flex-1 items-center gap-3">
                        <div className="h-[4px] flex-1 overflow-hidden rounded-full bg-[rgba(255,255,255,0.06)]">
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

                        <span className="w-9 text-right text-[0.72rem] text-[rgba(154,149,141,0.64)]">
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
              </article>

              <article className="p-5 sm:p-6" style={sectionPanel}>
                <div className="mb-5 flex items-center justify-between">
                  <p className="text-[0.66rem] uppercase tracking-[0.24em] text-[rgba(138,116,68,0.82)]">
                    Найближчі заняття
                  </p>

                  <Link
                    href="/teacher/schedule"
                    className="text-[0.66rem] uppercase tracking-[0.15em] text-[rgba(138,116,68,0.55)] transition-colors hover:text-[var(--gold-light)]"
                  >
                    Розклад →
                  </Link>
                </div>

                <div className="space-y-3.5">
                  {lessons.map((lesson, index) => (
                    <div
                      key={`${lesson.title}-${index}`}
                      className="flex gap-3 rounded-[18px] px-4 py-3 sm:gap-4"
                      style={innerRowCard}
                    >
                      <div className="min-w-[60px] flex-shrink-0 text-right">
                        <p className="text-[0.60rem] uppercase tracking-[0.08em] text-[rgba(138,116,68,0.62)]">
                          {lesson.when}
                        </p>
                        <p className="font-serif text-[0.98rem] text-[rgba(201,169,110,0.82)]">
                          {lesson.time}
                        </p>
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="text-[0.84rem] text-[rgba(232,228,221,0.86)]">
                          {lesson.title}
                        </p>
                        <p className="mt-1 text-[0.70rem] text-[rgba(154,149,141,0.58)]">
                          {lesson.sub}
                        </p>
                      </div>

                      {lesson.soon ? (
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
                      ) : null}
                    </div>
                  ))}
                </div>
              </article>
            </section>

            <section className="p-5 sm:p-6" style={sectionPanel}>
              <div className="mb-5 flex items-center justify-between">
                <p className="flex items-center gap-2 text-[0.66rem] uppercase tracking-[0.24em] text-[rgba(138,116,68,0.82)]">
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

                <Link
                  href="/teacher/review"
                  className="text-[0.66rem] uppercase tracking-[0.15em] text-[rgba(138,116,68,0.55)] transition-colors hover:text-[var(--gold-light)]"
                >
                  Всі →
                </Link>
              </div>

              <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 2xl:grid-cols-3">
                {works.slice(0, 6).map((work, index) => (
                  <Link
                    key={`${work.name}-${index}`}
                    href="/teacher/review"
                    className="flex flex-col gap-3 rounded-[20px] p-4 transition-all"
                    style={innerRowCard}
                  >
                    <div className="flex items-center gap-3">
                      <div style={avatarBase}>{work.initials}</div>

                      <span className="truncate text-[0.84rem] font-medium text-[rgba(232,228,221,0.86)]">
                        {work.name}
                      </span>
                    </div>

                    <p className="text-[0.75rem] text-[rgba(154,149,141,0.62)]">
                      {work.lesson}
                    </p>

                    <div className="mt-auto flex items-center justify-between">
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

                      <span className="text-[0.66rem] text-[rgba(154,149,141,0.44)]">
                        {work.ago}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          </div>
        </main>
      </div>

      {mobileNavOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <button
            type="button"
            aria-label="Закрити меню"
            onClick={() => setMobileNavOpen(false)}
            className="absolute inset-0 bg-black/70"
          />

          <div className="absolute right-0 top-0 h-full w-[88vw] max-w-[320px] overflow-hidden border-l border-[rgba(201,169,110,0.12)] bg-[rgba(10,10,12,0.98)] backdrop-blur">
            <SidebarContent
              displayName={displayName}
              onNavigate={() => setMobileNavOpen(false)}
              onLogout={handleLogout}
              isSigningOut={isSigningOut}
            />
          </div>
        </div>
      )}
    </div>
  );
}