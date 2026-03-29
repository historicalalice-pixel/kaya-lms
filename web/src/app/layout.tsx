"use client";

import type { CSSProperties, ReactNode } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
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
  icon: ReactNode;
};

// ─────────────────────────────────────────────────────────────────────────────
// Стилі
// ─────────────────────────────────────────────────────────────────────────────

const shellPanel: CSSProperties = {
  borderRadius: 28,
  border: "1px solid rgba(201,169,110,0.16)",
  background:
    "linear-gradient(180deg, rgba(15,13,12,0.96) 0%, rgba(9,9,11,0.95) 100%)",
  boxShadow:
    "0 14px 34px rgba(0,0,0,0.28), inset 0 1px 0 rgba(255,255,255,0.03)",
  backdropFilter: "blur(12px)",
};

// ─────────────────────────────────────────────────────────────────────────────
// Іконки
// ─────────────────────────────────────────────────────────────────────────────

const icons = {
  dashboard: (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
      <rect x="1" y="1" width="5.5" height="5.5" rx="1.2" stroke="currentColor" strokeWidth="1.2" />
      <rect x="8.5" y="1" width="5.5" height="5.5" rx="1.2" stroke="currentColor" strokeWidth="1.2" opacity=".5" />
      <rect x="1" y="8.5" width="5.5" height="5.5" rx="1.2" stroke="currentColor" strokeWidth="1.2" opacity=".5" />
      <rect x="8.5" y="8.5" width="5.5" height="5.5" rx="1.2" stroke="currentColor" strokeWidth="1.2" opacity=".5" />
    </svg>
  ),
  courses: (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
      <rect x="1.5" y="2" width="12" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.2" />
      <path d="M4.5 5.5h6M4.5 7.5h4" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
    </svg>
  ),
  lessons: (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
      <path d="M2 2h11v11H2z" stroke="currentColor" strokeWidth="1.2" />
      <path d="M5 5h5M5 7.5h3M5 10h4" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
    </svg>
  ),
  groups: (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
      <circle cx="5" cy="5" r="2.5" stroke="currentColor" strokeWidth="1.2" />
      <circle cx="10" cy="5" r="2.5" stroke="currentColor" strokeWidth="1.2" opacity=".5" />
      <path d="M1 13c0-2.2 1.8-4 4-4s4 1.8 4 4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      <path d="M10 9c1.7.3 3 1.8 3 4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" opacity=".5" />
    </svg>
  ),
  students: (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
      <circle cx="7.5" cy="5" r="2.8" stroke="currentColor" strokeWidth="1.2" />
      <path d="M2 13c0-3 2.5-5 5.5-5s5.5 2 5.5 5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  ),
  assignments: (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
      <rect x="2" y="2" width="11" height="11" rx="1.5" stroke="currentColor" strokeWidth="1.2" />
      <path d="M5 7.5l2 2 3.5-3.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  tests: (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
      <path d="M3 1.5h9l.5.5v11l-.5.5H3l-.5-.5v-11L3 1.5z" stroke="currentColor" strokeWidth="1.2" />
      <path d="M5.5 5h4M5.5 7.5h4M5.5 10h2.5" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
    </svg>
  ),
  gradebook: (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
      <rect x="1.5" y="2" width="12" height="11" rx="1.2" stroke="currentColor" strokeWidth="1.2" />
      <path d="M1.5 5.5h12M5.5 5.5v7.5M9.5 5.5v7.5" stroke="currentColor" strokeWidth="1.1" />
    </svg>
  ),
  attendance: (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
      <rect x="2" y="1.5" width="11" height="12" rx="1.2" stroke="currentColor" strokeWidth="1.2" />
      <path d="M5 5.5h5M5 8h5M5 10.5h3" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
      <circle cx="3.8" cy="5.5" r="0.6" fill="currentColor" />
      <circle cx="3.8" cy="8" r="0.6" fill="currentColor" />
      <circle cx="3.8" cy="10.5" r="0.6" fill="currentColor" />
    </svg>
  ),
  messages: (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
      <path d="M2 2h11v8H9l-3 2.5V10H2V2z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
    </svg>
  ),
  files: (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
      <path d="M2 3.5h4l1.5 1.5H13v7.5H2V3.5z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
    </svg>
  ),
  calendar: (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
      <rect x="1.5" y="2.5" width="12" height="11" rx="1.5" stroke="currentColor" strokeWidth="1.2" />
      <path d="M4.5 1v3M10.5 1v3M1.5 6.5h12" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  ),
  drafts: (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
      <path d="M10.5 2L13 4.5 5.5 12H3v-2.5L10.5 2z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
      <path d="M8.5 4l2.5 2.5" stroke="currentColor" strokeWidth="1.1" />
    </svg>
  ),
  archive: (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
      <rect x="1.5" y="2" width="12" height="3" rx="1" stroke="currentColor" strokeWidth="1.2" />
      <path d="M2.5 5v7.5h10V5" stroke="currentColor" strokeWidth="1.2" />
      <path d="M6 8.5h3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  ),
  analytics: (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
      <rect x="2" y="9" width="2.5" height="4" rx="0.5" stroke="currentColor" strokeWidth="1.2" />
      <rect x="6.25" y="5" width="2.5" height="8" rx="0.5" stroke="currentColor" strokeWidth="1.2" />
      <rect x="10.5" y="2" width="2.5" height="11" rx="0.5" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  ),
  search: (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
      <circle cx="6.5" cy="6.5" r="4" stroke="currentColor" strokeWidth="1.2" />
      <path d="M9.5 9.5L13 13" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  ),
  settings: (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
      <circle cx="7.5" cy="7.5" r="2.5" stroke="currentColor" strokeWidth="1.2" />
      <path d="M7.5 1v2M7.5 12v2M1 7.5h2M12 7.5h2M3.1 3.1l1.4 1.4M10.5 10.5l1.4 1.4M3.1 11.9l1.4-1.4M10.5 4.5l1.4-1.4" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
    </svg>
  ),
  logout: (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
      <path d="M6 2H3a1 1 0 00-1 1v9a1 1 0 001 1h3M10 10l3-2.5L10 5M13 7.5H6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
};

// ─────────────────────────────────────────────────────────────────────────────
// Навігація
// ─────────────────────────────────────────────────────────────────────────────

const navGroups: NavGroup[] = [
  {
    label: "Навчання",
    items: [
      { label: "Дашборд", href: "/teacher", icon: icons.dashboard },
      { label: "Курси", href: "/teacher/courses", icon: icons.courses },
      { label: "Уроки", href: "/teacher/lessons", icon: icons.lessons },
      { label: "Тести", href: "/teacher/tests", icon: icons.tests },
    ],
  },
  {
    label: "Учні",
    items: [
      { label: "Групи", href: "/teacher/groups", icon: icons.groups },
      { label: "Учні", href: "/teacher/students", icon: icons.students },
      { label: "Завдання", href: "/teacher/assignments", icon: icons.assignments, badge: 5 },
      { label: "Журнал оцінок", href: "/teacher/gradebook", icon: icons.gradebook },
      { label: "Відвідуваність", href: "/teacher/attendance", icon: icons.attendance },
    ],
  },
  {
    label: "Інструменти",
    items: [
      { label: "Календар", href: "/teacher/calendar", icon: icons.calendar },
      { label: "Повідомлення", href: "/teacher/messages", icon: icons.messages },
      { label: "Файли", href: "/teacher/files", icon: icons.files },
      { label: "Аналітика", href: "/teacher/analytics", icon: icons.analytics },
    ],
  },
  {
    label: "Система",
    items: [
      { label: "Чернетки", href: "/teacher/drafts", icon: icons.drafts },
      { label: "Архів", href: "/teacher/archive", icon: icons.archive },
      { label: "Налаштування", href: "/teacher/settings", icon: icons.settings },
    ],
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// Компоненти
// ─────────────────────────────────────────────────────────────────────────────

function NavLink({
  item,
  isActive,
  onClick,
}: {
  item: NavItem;
  isActive: boolean;
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
        color: isActive
          ? "var(--gold-light, #e2c992)"
          : "rgba(232,228,221,0.72)",
        background: isActive ? "rgba(201,169,110,0.09)" : "transparent",
        border: isActive
          ? "1px solid rgba(201,169,110,0.17)"
          : "1px solid transparent",
        transition: "all 0.18s ease",
      }}
    >
      <span
        style={{
          color: isActive
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
  pathname,
  onNavigate,
  onLogout,
  isSigningOut,
}: {
  displayName: string;
  pathname: string;
  onNavigate?: () => void;
  onLogout: () => void;
  isSigningOut: boolean;
}) {
  const isItemActive = (href: string) => {
    if (href === "/teacher") return pathname === "/teacher";
    return pathname.startsWith(href);
  };

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

      {/* Глобальний пошук */}
      <div style={{ padding: "10px 10px 0" }}>
        <Link
          href="/teacher/search"
          onClick={onNavigate}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "10px 12px",
            borderRadius: 14,
            border: "1px solid rgba(201,169,110,0.12)",
            background: "rgba(255,255,255,0.015)",
            textDecoration: "none",
            transition: "all 0.18s ease",
            cursor: "pointer",
          }}
        >
          <span style={{ color: "rgba(154,149,141,0.42)", flexShrink: 0 }}>
            {icons.search}
          </span>
          <span
            style={{
              fontSize: "0.80rem",
              color: "rgba(154,149,141,0.44)",
              flex: 1,
            }}
          >
            Пошук...
          </span>
          <span
            style={{
              fontSize: "0.56rem",
              color: "rgba(138,116,68,0.36)",
              border: "1px solid rgba(201,169,110,0.10)",
              borderRadius: 6,
              padding: "2px 6px",
            }}
          >
            ⌘K
          </span>
        </Link>
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
                <NavLink
                  key={item.href}
                  item={item}
                  isActive={isItemActive(item.href)}
                  onClick={onNavigate}
                />
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

// ─────────────────────────────────────────────────────────────────────────────
// Layout
// ─────────────────────────────────────────────────────────────────────────────

export default function TeacherLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const starfieldRef = useRef<HTMLDivElement>(null);

  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [displayName, setDisplayName] = useState("Вчитель");
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [authReady, setAuthReady] = useState(false);

  // Зірки
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
      stars.forEach((s) => s.remove());
    };
  }, []);

  // Авторизація
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
      setAuthReady(true);
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

  // Закривати мобільне меню при навігації
  useEffect(() => {
    setMobileNavOpen(false);
  }, [pathname]);

  if (!authReady) {
    return (
      <div
        className="flex min-h-screen items-center justify-center bg-[var(--bg)]"
        style={{ color: "rgba(201,169,110,0.6)" }}
      >
        <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.4rem", letterSpacing: "0.2em" }}>
          KAYA
        </p>
      </div>
    );
  }

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

      {/* Мобільний хедер */}
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

      <div className="relative z-10 flex min-h-screen gap-4 md:gap-6 xl:gap-8">
        {/* Десктоп сайдбар */}
        <aside className="hidden w-[272px] flex-shrink-0 pl-6 pr-2 pb-6 pt-6 md:block lg:pr-4">
          <div
            className="sticky top-6 h-[calc(100vh-48px)] overflow-hidden"
            style={shellPanel}
          >
            <SidebarContent
              displayName={displayName}
              pathname={pathname}
              onLogout={handleLogout}
              isSigningOut={isSigningOut}
            />
          </div>
        </aside>

        {/* Контент */}
        <main className="min-w-0 flex-1 px-4 pb-14 pt-6 sm:px-6 lg:px-8 lg:pt-8 xl:px-10">
          {children}
        </main>
      </div>

      {/* Мобільне меню */}
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
              pathname={pathname}
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