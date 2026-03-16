"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";

// ─── типи ────────────────────────────────────────────────────────────────────

type NavGroup = {
  label: string;
  items: NavItem[];
};

type NavItem = {
  label: string;
  href: string;
  badge?: number;
  isActive?: boolean;
  icon: React.ReactNode;
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

// ─── дані (замінити на реальні з Supabase) ──────────────────────────────────

const students: Student[] = [
  { initials: "ДК", name: "Дмитро Коваль",    progress: 72, status: "active" },
  { initials: "АС", name: "Аліна Савченко",   progress: 45, status: "behind" },
  { initials: "МП", name: "Максим Петренко",  progress: 88, status: "active" },
  { initials: "ІБ", name: "Ірина Бондар",     progress: 20, status: "behind" },
];

const lessons: Lesson[] = [
  { when: "Сьогодні", time: "18:00", title: "Група А — Козацька держава",  sub: "4 учні · Zoom",        soon: true },
  { when: "Завтра",   time: "16:00", title: "Група Б — Київська Русь",      sub: "5 учнів · Google Meet" },
  { when: "Пт",       time: "17:30", title: "Індивідуально — Аліна С.",    sub: "Підготовка до НМТ" },
];

const works: Work[] = [
  { initials: "ДК", name: "Дмитро Коваль",   lesson: "Урок 3 · Козацька держава", ago: "2 год тому" },
  { initials: "АС", name: "Аліна Савченко",  lesson: "Урок 2 · Київська Русь",    ago: "вчора" },
  { initials: "МП", name: "Максим Петренко", lesson: "Урок 4 · УНР та ЗУНР",      ago: "3 дні тому" },
  { initials: "ІБ", name: "Ірина Бондар",    lesson: "Урок 1 · Вступ",            ago: "тиждень тому" },
  { initials: "НЛ", name: "Настя Лисенко",   lesson: "Урок 3 · Козацька держава", ago: "4 дні тому" },
];

// ─── іконки ──────────────────────────────────────────────────────────────────

const icons = {
  overview:  <svg width="15" height="15" viewBox="0 0 15 15" fill="none"><rect x="1" y="1" width="5.5" height="5.5" rx="1.2" stroke="currentColor" strokeWidth="1.2"/><rect x="8.5" y="1" width="5.5" height="5.5" rx="1.2" stroke="currentColor" strokeWidth="1.2" opacity=".5"/><rect x="1" y="8.5" width="5.5" height="5.5" rx="1.2" stroke="currentColor" strokeWidth="1.2" opacity=".5"/><rect x="8.5" y="8.5" width="5.5" height="5.5" rx="1.2" stroke="currentColor" strokeWidth="1.2" opacity=".5"/></svg>,
  courses:   <svg width="15" height="15" viewBox="0 0 15 15" fill="none"><rect x="1.5" y="2" width="12" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.2"/><path d="M4.5 5.5h6M4.5 7.5h4" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round"/></svg>,
  lessons:   <svg width="15" height="15" viewBox="0 0 15 15" fill="none"><path d="M2 2h11v11H2z" rx="1.5" stroke="currentColor" strokeWidth="1.2"/><path d="M5 5h5M5 7.5h3M5 10h4" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round"/></svg>,
  groups:    <svg width="15" height="15" viewBox="0 0 15 15" fill="none"><circle cx="5" cy="5" r="2.5" stroke="currentColor" strokeWidth="1.2"/><circle cx="10" cy="5" r="2.5" stroke="currentColor" strokeWidth="1.2" opacity=".5"/><path d="M1 13c0-2.2 1.8-4 4-4s4 1.8 4 4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/><path d="M10 9c1.7.3 3 1.8 3 4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" opacity=".5"/></svg>,
  students:  <svg width="15" height="15" viewBox="0 0 15 15" fill="none"><circle cx="7.5" cy="5" r="2.8" stroke="currentColor" strokeWidth="1.2"/><path d="M2 13c0-3 2.5-5 5.5-5s5.5 2 5.5 5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>,
  tasks:     <svg width="15" height="15" viewBox="0 0 15 15" fill="none"><rect x="2" y="2" width="11" height="11" rx="1.5" stroke="currentColor" strokeWidth="1.2"/><path d="M5 7.5l2 2 3.5-3.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  review:    <svg width="15" height="15" viewBox="0 0 15 15" fill="none"><path d="M2 3h11v8H9l-2 2-2-2H2V3z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/><path d="M5 6h5M5 8.5h3" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round"/></svg>,
  tests:     <svg width="15" height="15" viewBox="0 0 15 15" fill="none"><circle cx="7.5" cy="7.5" r="5.5" stroke="currentColor" strokeWidth="1.2"/><path d="M7.5 4.5v3l2 2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>,
  schedule:  <svg width="15" height="15" viewBox="0 0 15 15" fill="none"><rect x="1.5" y="2.5" width="12" height="11" rx="1.5" stroke="currentColor" strokeWidth="1.2"/><path d="M4.5 1v3M10.5 1v3M1.5 6.5h12" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>,
  messages:  <svg width="15" height="15" viewBox="0 0 15 15" fill="none"><path d="M2 2h11v8H9l-3 2.5V10H2V2z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/></svg>,
  profile:   <svg width="15" height="15" viewBox="0 0 15 15" fill="none"><circle cx="7.5" cy="5" r="2.8" stroke="currentColor" strokeWidth="1.2"/><path d="M2 13c0-3 2.5-5 5.5-5s5.5 2 5.5 5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>,
  logout:    <svg width="15" height="15" viewBox="0 0 15 15" fill="none"><path d="M6 2H3a1 1 0 00-1 1v9a1 1 0 001 1h3M10 10l3-2.5L10 5M13 7.5H6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>,
};

const navGroups: NavGroup[] = [
  {
    label: "Навчання",
    items: [
      { label: "Огляд",    href: "/teacher",          icon: icons.overview,  isActive: true },
      { label: "Курси",    href: "/teacher/courses",  icon: icons.courses },
      { label: "Уроки",    href: "/teacher/lessons",  icon: icons.lessons },
      { label: "Групи",    href: "/teacher/groups",   icon: icons.groups },
      { label: "Учні",     href: "/teacher/students", icon: icons.students },
    ],
  },
  {
    label: "Робота",
    items: [
      { label: "Завдання",  href: "/teacher/tasks",   icon: icons.tasks },
      { label: "Перевірка", href: "/teacher/review",  icon: icons.review,  badge: 5 },
      { label: "Тести",     href: "/teacher/tests",   icon: icons.tests },
    ],
  },
  {
    label: "Інше",
    items: [
      { label: "Розклад",      href: "/teacher/schedule",  icon: icons.schedule },
      { label: "Повідомлення", href: "/teacher/messages",  icon: icons.messages },
      { label: "Профіль",      href: "/teacher/profile",   icon: icons.profile },
    ],
  },
];

// ─── компоненти ──────────────────────────────────────────────────────────────

function NavLink({ item, onClick }: { item: NavItem; onClick?: () => void }) {
  return (
    <Link
      href={item.href}
      onClick={onClick}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 9,
        padding: "8px 10px",
        borderRadius: 8,
        textDecoration: "none",
        fontSize: "0.8rem",
        letterSpacing: "0.02em",
        color: item.isActive ? "var(--gold-light, #e2c992)" : "rgba(154,149,141,0.8)",
        background: item.isActive ? "rgba(201,169,110,0.1)" : "transparent",
        borderLeft: `2px solid ${item.isActive ? "var(--gold-dim, #8a7444)" : "transparent"}`,
        transition: "all 0.18s",
      }}
    >
      <span style={{ color: item.isActive ? "var(--gold-dim, #8a7444)" : "rgba(154,149,141,0.4)", flexShrink: 0 }}>
        {item.icon}
      </span>
      <span style={{ flex: 1 }}>{item.label}</span>
      {item.badge ? (
        <span style={{
          fontSize: "0.6rem",
          background: "rgba(192,57,43,0.2)",
          color: "#e74c3c",
          border: "1px solid rgba(192,57,43,0.3)",
          borderRadius: 10,
          padding: "1px 6px",
        }}>
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
      {/* Лого */}
      <div style={{ padding: "20px 18px 16px", borderBottom: "1px solid rgba(201,169,110,0.1)" }}>
        <Link href="/home" onClick={onNavigate} style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.85rem", fontWeight: 300, letterSpacing: "0.3em", color: "rgba(245,239,230,0.92)", textDecoration: "none", display: "block" }}>
          KAYA
        </Link>
        <p style={{ fontSize: "0.52rem", letterSpacing: "0.28em", textTransform: "uppercase", color: "rgba(138,116,68,0.6)", marginTop: 4 }}>
          Кабінет вчителя
        </p>
      </div>

      {/* Навігація */}
      <nav style={{ flex: 1, padding: "12px 10px", overflowY: "auto", display: "flex", flexDirection: "column", gap: 0 }}>
        {navGroups.map((group) => (
          <div key={group.label} style={{ marginBottom: 8 }}>
            <p style={{ fontSize: "0.5rem", letterSpacing: "0.28em", textTransform: "uppercase", color: "rgba(138,116,68,0.4)", padding: "6px 10px 6px" }}>
              {group.label}
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 1 }}>
              {group.items.map((item) => (
                <NavLink key={item.href} item={item} onClick={onNavigate} />
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* Низ: користувач + вийти */}
      <div style={{ padding: "12px 10px", borderTop: "1px solid rgba(201,169,110,0.08)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 10px", marginBottom: 4 }}>
          <div style={{ width: 32, height: 32, borderRadius: "50%", border: "1px solid rgba(201,169,110,0.25)", background: "rgba(201,169,110,0.07)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Cormorant Garamond', serif", fontSize: "0.95rem", color: "var(--gold-dim, #8a7444)", flexShrink: 0 }}>
            {displayName.charAt(0).toUpperCase()}
          </div>
          <div style={{ minWidth: 0 }}>
            <p style={{ fontSize: "0.78rem", color: "rgba(232,228,221,0.75)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{displayName}</p>
            <p style={{ fontSize: "0.58rem", color: "rgba(138,116,68,0.55)", letterSpacing: "0.08em", textTransform: "uppercase" }}>Вчитель</p>
          </div>
        </div>
        <button
          type="button"
          onClick={onLogout}
          disabled={isSigningOut}
          style={{ display: "flex", alignItems: "center", gap: 8, width: "100%", padding: "7px 10px", background: "none", border: "none", cursor: "pointer", color: "rgba(154,149,141,0.5)", fontSize: "0.75rem", borderRadius: 6, transition: "color 0.18s" }}
        >
          <span style={{ color: "rgba(154,149,141,0.3)" }}>{icons.logout}</span>
          {isSigningOut ? "Вихід..." : "Вийти"}
        </button>
      </div>
    </div>
  );
}

// ─── головна сторінка ────────────────────────────────────────────────────────

export default function TeacherPage() {
  const router = useRouter();
  const starfieldRef = useRef<HTMLDivElement>(null);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [displayName, setDisplayName] = useState("Вчитель");
  const [isSigningOut, setIsSigningOut] = useState(false);

  // зірки
  useEffect(() => {
    const field = starfieldRef.current;
    if (!field) return;
    field.innerHTML = "";
    const stars: HTMLDivElement[] = [];
    for (let i = 0; i < 120; i++) {
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
    return () => stars.forEach((s) => s.remove());
  }, []);

  // завантаження користувача
  useEffect(() => {
    const supabase = createClient();
    const load = async () => {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error || !user) { router.replace("/login"); return; }
      const { data: profile } = await supabase.from("profiles").select("full_name").eq("id", user.id).single();
      setDisplayName(profile?.full_name?.trim() || user.email?.split("@")[0] || "Вчитель");
    };
    load();
  }, [router]);

  const handleLogout = async () => {
    setIsSigningOut(true);
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
  };

  // ─── JSX ───────────────────────────────────────────────────────────────────

  return (
    <div className="relative min-h-screen bg-[var(--bg)] text-[var(--text)]">
      <div ref={starfieldRef} className="starfield" aria-hidden="true" />
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 z-0 h-72" style={{ background: "radial-gradient(circle at top, rgba(201,169,110,0.09), transparent 58%)" }} />

      {/* ── Мобільний хедер ── */}
      <header className="sticky top-0 z-40 flex items-center justify-between border-b border-[rgba(201,169,110,0.1)] bg-[rgba(10,10,12,0.94)] px-4 py-4 backdrop-blur md:hidden">
        <Link href="/home" className="font-serif text-[1.6rem] tracking-[0.22em] text-[rgba(245,239,230,0.92)]">
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

      {/* ── Layout ── */}
      <div className="relative z-10 mx-auto flex min-h-screen max-w-7xl md:px-6 lg:px-8">

        {/* ── Desktop sidebar ── */}
        <aside className="hidden w-[240px] shrink-0 py-6 md:block lg:w-[260px]">
          <div className="sticky top-6 h-[calc(100vh-48px)] overflow-hidden rounded-[24px] border border-[rgba(201,169,110,0.12)] bg-[rgba(10,10,12,0.92)] backdrop-blur">
            <SidebarContent displayName={displayName} onLogout={handleLogout} isSigningOut={isSigningOut} />
          </div>
        </aside>

        {/* ── Main content ── */}
        <main className="min-w-0 flex-1 px-4 pb-10 pt-6 sm:px-5 sm:pt-8 md:pl-7 md:pr-0 lg:pl-9">

          {/* Заголовок */}
          <section className="mb-6 rounded-[24px] border border-[rgba(201,169,110,0.12)] bg-[rgba(201,169,110,0.03)] p-5 sm:p-7">
            <p className="mb-2 text-[0.68rem] uppercase tracking-[0.3em] text-[rgba(138,116,68,0.82)]">Кабінет вчителя</p>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <h1 className="font-serif text-[2rem] leading-none text-[rgba(245,239,230,0.96)] sm:text-[2.6rem] lg:text-[3.2rem]">
                Вітаємо, {displayName.split(" ")[0]}
              </h1>
              {/* Швидкі кнопки */}
              <div className="flex flex-wrap gap-2">
                {[
                  { label: "+ Урок",     href: "/teacher/lessons/new" },
                  { label: "+ Завдання", href: "/teacher/tasks/new" },
                  { label: "Групи",      href: "/teacher/groups" },
                  { label: "Курси",      href: "/teacher/courses" },
                ].map((btn) => (
                  <Link
                    key={btn.href}
                    href={btn.href}
                    className="inline-flex min-h-[40px] items-center rounded-xl border px-4 text-[0.72rem] uppercase tracking-[0.18em] transition-colors"
                    style={{
                      borderColor: btn.label.startsWith("+")
                        ? "rgba(201,169,110,0.4)"
                        : "rgba(201,169,110,0.16)",
                      color: btn.label.startsWith("+")
                        ? "var(--gold-light, #e2c992)"
                        : "rgba(232,228,221,0.7)",
                    }}
                  >
                    {btn.label}
                  </Link>
                ))}
              </div>
            </div>
          </section>

          {/* Статкарти */}
          <section className="mb-6 grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
            {[
              { label: "Учні",       value: "12",  hint: "3 активні групи",        alert: false },
              { label: "Перевірка",  value: "5",   hint: "робіт чекають",          alert: true  },
              { label: "Курси",      value: "4",   hint: "2 опубліковано",          alert: false },
              { label: "Відстають",  value: "4",   hint: "не завершили урок",      alert: true  },
            ].map((s) => (
              <article key={s.label} className="rounded-[20px] border border-[rgba(201,169,110,0.12)] bg-[rgba(201,169,110,0.025)] p-4 sm:p-5">
                <p className="text-[0.62rem] uppercase tracking-[0.22em] text-[rgba(138,116,68,0.8)]">{s.label}</p>
                <p className={`mt-3 font-serif text-[2.4rem] leading-none sm:text-[2.8rem] ${s.alert ? "text-[rgba(220,80,60,0.85)]" : "text-[var(--gold-light,#e2c992)]"}`}>
                  {s.value}
                </p>
                <p className="mt-2 text-[0.78rem] leading-5 text-[rgba(232,228,221,0.5)]">{s.hint}</p>
              </article>
            ))}
          </section>

          {/* Два стовпці: активність + розклад */}
          <section className="mb-6 grid grid-cols-1 gap-4 xl:grid-cols-[1.3fr_1fr]">

            {/* Активність учнів */}
            <article className="rounded-[20px] border border-[rgba(201,169,110,0.12)] bg-[rgba(201,169,110,0.02)] p-5 sm:p-6">
              <div className="mb-4 flex items-center justify-between">
                <p className="text-[0.65rem] uppercase tracking-[0.24em] text-[rgba(138,116,68,0.8)]">Активність учнів</p>
                <Link href="/teacher/students" className="text-[0.65rem] uppercase tracking-[0.15em] text-[rgba(138,116,68,0.5)] hover:text-[var(--gold-light)]">
                  Всі →
                </Link>
              </div>
              <div className="space-y-3">
                {students.map((s) => (
                  <div key={s.name} className="flex items-center gap-3">
                    {/* Аватар */}
                    <div style={{ width: 32, height: 32, borderRadius: "50%", border: "1px solid rgba(201,169,110,0.18)", background: "rgba(201,169,110,0.06)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.68rem", color: "rgba(201,169,110,0.7)", flexShrink: 0 }}>
                      {s.initials}
                    </div>
                    {/* Ім'я */}
                    <p className="w-[130px] shrink-0 truncate text-[0.82rem] text-[rgba(232,228,221,0.82)] sm:w-[160px]">{s.name}</p>
                    {/* Прогрес */}
                    <div className="flex flex-1 items-center gap-2">
                      <div className="h-[3px] flex-1 overflow-hidden rounded-full bg-[rgba(255,255,255,0.06)]">
                        <div style={{ width: `${s.progress}%`, height: "100%", background: s.status === "active" ? "rgba(201,169,110,0.6)" : "rgba(220,80,60,0.5)", borderRadius: 9999 }} />
                      </div>
                      <span className="w-8 text-right text-[0.7rem] text-[rgba(154,149,141,0.6)]">{s.progress}%</span>
                    </div>
                    {/* Статус */}
                    <span style={{
                      fontSize: "0.58rem",
                      letterSpacing: "0.08em",
                      padding: "2px 7px",
                      borderRadius: 10,
                      background: s.status === "active" ? "rgba(52,168,83,0.12)" : "rgba(220,80,60,0.12)",
                      color: s.status === "active" ? "rgba(52,168,83,0.85)" : "rgba(220,80,60,0.85)",
                      border: `1px solid ${s.status === "active" ? "rgba(52,168,83,0.2)" : "rgba(220,80,60,0.2)"}`,
                      flexShrink: 0,
                    }}>
                      {s.status === "active" ? "Активний" : "Відстає"}
                    </span>
                  </div>
                ))}
              </div>
            </article>

            {/* Найближчі заняття */}
            <article className="rounded-[20px] border border-[rgba(201,169,110,0.12)] bg-[rgba(201,169,110,0.02)] p-5 sm:p-6">
              <div className="mb-4 flex items-center justify-between">
                <p className="text-[0.65rem] uppercase tracking-[0.24em] text-[rgba(138,116,68,0.8)]">Найближчі заняття</p>
                <Link href="/teacher/schedule" className="text-[0.65rem] uppercase tracking-[0.15em] text-[rgba(138,116,68,0.5)] hover:text-[var(--gold-light)]">
                  Розклад →
                </Link>
              </div>
              <div className="space-y-0">
                {lessons.map((l, i) => (
                  <div key={i} style={{ display: "flex", gap: 12, padding: "10px 0", borderBottom: i < lessons.length - 1 ? "1px solid rgba(201,169,110,0.07)" : "none", alignItems: "flex-start" }}>
                    <div style={{ flexShrink: 0, minWidth: 52, textAlign: "right" }}>
                      <p style={{ fontSize: "0.6rem", color: "rgba(138,116,68,0.6)", textTransform: "uppercase", letterSpacing: "0.08em" }}>{l.when}</p>
                      <p style={{ fontSize: "0.82rem", color: "rgba(201,169,110,0.8)", fontFamily: "'Cormorant Garamond', serif" }}>{l.time}</p>
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: "0.82rem", color: "rgba(232,228,221,0.85)", marginBottom: 2 }}>{l.title}</p>
                      <p style={{ fontSize: "0.68rem", color: "rgba(154,149,141,0.55)" }}>{l.sub}</p>
                    </div>
                    {l.soon && (
                      <span style={{ fontSize: "0.55rem", letterSpacing: "0.08em", padding: "2px 7px", borderRadius: 10, background: "rgba(52,130,200,0.12)", color: "rgba(100,170,240,0.85)", border: "1px solid rgba(52,130,200,0.2)", flexShrink: 0 }}>
                        Скоро
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </article>
          </section>

          {/* Роботи на перевірку */}
          <section className="rounded-[20px] border border-[rgba(201,169,110,0.12)] bg-[rgba(201,169,110,0.02)] p-5 sm:p-6">
            <div className="mb-4 flex items-center justify-between">
              <p className="text-[0.65rem] uppercase tracking-[0.24em] text-[rgba(138,116,68,0.8)]">
                Роботи на перевірку
                <span style={{ marginLeft: 8, fontSize: "0.58rem", background: "rgba(192,57,43,0.15)", color: "#e74c3c", border: "1px solid rgba(192,57,43,0.25)", borderRadius: 10, padding: "1px 7px" }}>
                  {works.length}
                </span>
              </p>
              <Link href="/teacher/review" className="text-[0.65rem] uppercase tracking-[0.15em] text-[rgba(138,116,68,0.5)] hover:text-[var(--gold-light)]">
                Всі →
              </Link>
            </div>

            {/* На мобільному — список, на desktop — сітка */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {works.slice(0, 6).map((w, i) => (
                <Link
                  key={i}
                  href="/teacher/review"
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 8,
                    padding: "12px 14px",
                    border: "1px solid rgba(201,169,110,0.1)",
                    borderRadius: 14,
                    background: "rgba(255,255,255,0.01)",
                    textDecoration: "none",
                    transition: "border-color 0.2s",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{ width: 28, height: 28, borderRadius: "50%", border: "1px solid rgba(201,169,110,0.18)", background: "rgba(201,169,110,0.06)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.65rem", color: "rgba(201,169,110,0.7)", flexShrink: 0 }}>
                      {w.initials}
                    </div>
                    <span style={{ fontSize: "0.82rem", fontWeight: 500, color: "rgba(232,228,221,0.85)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {w.name}
                    </span>
                  </div>
                  <p style={{ fontSize: "0.72rem", color: "rgba(154,149,141,0.6)" }}>{w.lesson}</p>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: "0.58rem", letterSpacing: "0.06em", padding: "2px 7px", borderRadius: 10, background: "rgba(220,170,60,0.1)", color: "rgba(220,170,60,0.8)", border: "1px solid rgba(220,170,60,0.18)" }}>
                      Чекає
                    </span>
                    <span style={{ fontSize: "0.65rem", color: "rgba(154,149,141,0.4)" }}>{w.ago}</span>
                  </div>
                </Link>
              ))}
            </div>
          </section>

        </main>
      </div>

      {/* ── Mobile drawer ── */}
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