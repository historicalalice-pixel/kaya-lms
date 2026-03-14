"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

export default function Dashboard() {
  const starfieldRef = useRef<HTMLDivElement>(null);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const displayName = "Василь";

  useEffect(() => {
    const field = starfieldRef.current;
    if (!field) return;
    for (let i = 0; i < 120; i++) {
      const star = document.createElement("div");
      star.classList.add("star");
      const rand = Math.random();
      if (rand < 0.55) star.classList.add("star--small");
      else if (rand < 0.85) star.classList.add("star--medium");
      else star.classList.add("star--large");
      star.style.setProperty("--dur", (2 + Math.random() * 5) + "s");
      star.style.setProperty("--delay", (Math.random() * 6) + "s");
      star.style.left = Math.random() * 100 + "%";
      star.style.top = Math.random() * 100 + "%";
      field.appendChild(star);
    }
  }, []);

  const navItems = [
    { href: "/dashboard", label: "Dashboard", active: true, icon: <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="1" y="1" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.3"/><rect x="9" y="1" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.3" opacity=".5"/><rect x="1" y="9" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.3" opacity=".5"/><rect x="9" y="9" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.3" opacity=".5"/></svg> },
    { href: "/dashboard/learning", label: "Моє навчання", active: false, icon: <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M2 4h12M2 8h8M2 12h10" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg> },
    { href: "/dashboard/assignments", label: "Завдання", active: false, icon: <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="2" y="2" width="12" height="12" rx="2" stroke="currentColor" strokeWidth="1.3"/><path d="M5 8h6M5 11h4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg> },
    { href: "/dashboard/tests", label: "Тести", active: false, icon: <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.3"/><path d="M8 5v3l2 2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg> },
    { href: "/dashboard/schedule", label: "Розклад", active: false, icon: <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="2" y="3" width="12" height="11" rx="1.5" stroke="currentColor" strokeWidth="1.3"/><path d="M5 1v3M11 1v3M2 7h12" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg> },
    { href: "/map", label: "Карта", active: false, icon: <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 1.5C5.515 1.5 3.5 3.515 3.5 6c0 3.75 4.5 8 4.5 8s4.5-4.25 4.5-8c0-2.485-2.015-4.5-4.5-4.5z" stroke="currentColor" strokeWidth="1.3"/><circle cx="8" cy="6" r="1.5" stroke="currentColor" strokeWidth="1.2"/></svg> },
    { href: "/dashboard/messages", label: "Повідомлення", active: false, icon: <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M2 3h12v8H9l-3 2V11H2V3z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/></svg> },
  ];

  const bottomItems = [
    { href: "/dashboard/profile", label: "Профіль", icon: <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="5.5" r="3" stroke="currentColor" strokeWidth="1.3"/><path d="M2 14c0-3 2.7-5 6-5s6 2 6 5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg> },
    { href: "/contacts", label: "Підтримка", icon: <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.3"/><path d="M8 7v5M8 5v1" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg> },
  ];

  const SidebarContent = () => (
    <>
      <div style={{ padding: "0 20px 24px", borderBottom: "1px solid rgba(201,169,110,0.1)" }}>
        <Link href="/home" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.9rem", fontWeight: 300, letterSpacing: "0.32em", color: "rgba(245,239,230,0.92)", textDecoration: "none", display: "block" }}>KAYA</Link>
        <p style={{ fontSize: "0.55rem", letterSpacing: "0.3em", textTransform: "uppercase", color: "rgba(138,116,68,0.6)", marginTop: 4 }}>Навчальний кабінет</p>
      </div>
      <nav style={{ flex: 1, padding: "14px 10px", display: "flex", flexDirection: "column", gap: 1 }}>
        <p style={{ fontSize: "0.5rem", letterSpacing: "0.3em", textTransform: "uppercase", color: "rgba(138,116,68,0.4)", padding: "6px 10px 10px" }}>Навчання</p>
        {navItems.map(({ href, label, active, icon }) => (
          <Link key={href} href={href} onClick={() => setMobileNavOpen(false)} style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 10px", borderRadius: 6, textDecoration: "none", fontSize: "0.78rem", letterSpacing: "0.03em", color: active ? "var(--gold-light, #e2c992)" : "rgba(154,149,141,0.75)", background: active ? "rgba(201,169,110,0.09)" : "transparent", borderLeft: `2px solid ${active ? "var(--gold-dim, #8a7444)" : "transparent"}`, transition: "all 0.2s" }}>
            <span style={{ color: active ? "var(--gold-dim, #8a7444)" : "rgba(154,149,141,0.45)", flexShrink: 0 }}>{icon}</span>
            {label}
            {label === "Завдання" && (
              <span style={{ marginLeft: "auto", fontSize: "0.55rem", background: "rgba(192,57,43,0.2)", color: "#e74c3c", border: "1px solid rgba(192,57,43,0.3)", borderRadius: 10, padding: "1px 7px" }}>0</span>
            )}
          </Link>
        ))}
      </nav>
      <div style={{ padding: "12px 10px", borderTop: "1px solid rgba(201,169,110,0.08)", display: "flex", flexDirection: "column", gap: 1 }}>
        {bottomItems.map(({ href, label, icon }) => (
          <Link key={href} href={href} onClick={() => setMobileNavOpen(false)} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 10px", borderRadius: 6, textDecoration: "none", fontSize: "0.75rem", color: "rgba(154,149,141,0.6)", transition: "color 0.2s" }}>
            <span style={{ color: "rgba(154,149,141,0.35)" }}>{icon}</span>
            {label}
          </Link>
        ))}
        <Link href="/login" style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 10px", borderRadius: 6, textDecoration: "none", fontSize: "0.75rem", color: "rgba(154,149,141,0.45)" }}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ color: "rgba(154,149,141,0.3)" }}><path d="M6 2H3a1 1 0 00-1 1v10a1 1 0 001 1h3M11 11l3-3-3-3M14 8H6" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>
          Вийти
        </Link>
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 10px 4px", marginTop: 4, borderTop: "1px solid rgba(201,169,110,0.06)" }}>
          <div style={{ width: 30, height: 30, borderRadius: "50%", border: "1px solid rgba(201,169,110,0.25)", background: "rgba(201,169,110,0.06)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Cormorant Garamond', serif", fontSize: "0.9rem", color: "var(--gold-dim, #8a7444)", flexShrink: 0 }}>
            {displayName.charAt(0)}
          </div>
          <div style={{ minWidth: 0 }}>
            <p style={{ fontSize: "0.75rem", color: "rgba(232,228,221,0.7)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{displayName}</p>
            <p style={{ fontSize: "0.6rem", color: "rgba(138,116,68,0.5)", letterSpacing: "0.05em" }}>Учень</p>
          </div>
        </div>
      </div>
    </>
  );

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg, #0a0a0c)", color: "var(--text, #e8e4dd)", fontFamily: "'Manrope', sans-serif", display: "flex", width: "100%", position: "relative" }}>
      <div ref={starfieldRef} className="starfield" />

      {/* MOBILE HEADER */}
      <header style={{ display: "none", position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, background: "rgba(10,10,12,0.95)", borderBottom: "1px solid rgba(201,169,110,0.1)", padding: "14px 20px", alignItems: "center", justifyContent: "space-between" }} className="mobile-header">
        <Link href="/home" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.5rem", fontWeight: 300, letterSpacing: "0.3em", color: "rgba(245,239,230,0.9)", textDecoration: "none" }}>KAYA</Link>
        <button onClick={() => setMobileNavOpen(!mobileNavOpen)} style={{ background: "none", border: "1px solid rgba(201,169,110,0.2)", color: "var(--gold-dim, #8a7444)", cursor: "pointer", padding: "6px 10px", borderRadius: 4, display: "flex", alignItems: "center", gap: 6, fontSize: "0.6rem", letterSpacing: "0.15em", textTransform: "uppercase" }}>
          {mobileNavOpen ? <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg> : <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M1 3h12M1 7h12M1 11h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>}
          Меню
        </button>
      </header>

      {mobileNavOpen && <div onClick={() => setMobileNavOpen(false)} style={{ position: "fixed", inset: 0, zIndex: 150, background: "rgba(0,0,0,0.6)" }} />}

      {/* SIDEBAR */}
      <aside style={{ width: 220, flexShrink: 0, borderRight: "1px solid rgba(201,169,110,0.1)", display: "flex", flexDirection: "column", padding: "28px 0", position: "sticky", top: 0, height: "100vh", overflow: "hidden", zIndex: 200, background: "rgba(10,10,12,0.98)" }} className="desktop-sidebar">
        <SidebarContent />
      </aside>
      <aside style={{ position: "fixed", top: 0, left: mobileNavOpen ? 0 : -260, width: 260, height: "100vh", background: "rgba(10,10,12,0.99)", borderRight: "1px solid rgba(201,169,110,0.15)", display: "flex", flexDirection: "column", padding: "24px 0", zIndex: 200, transition: "left 0.3s ease", overflow: "hidden" }} className="mobile-sidebar">
        <SidebarContent />
      </aside>

      {/* MAIN */}
      <main style={{ flex: 1, padding: "36px 40px", position: "relative", zIndex: 1, maxWidth: "calc(100vw - 220px)" }} className="dashboard-main">

        {/* Вітання */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 32, flexWrap: "wrap", gap: 16 }}>
          <div>
            <p style={{ fontSize: "0.58rem", letterSpacing: "0.35em", textTransform: "uppercase", color: "var(--gold-dim, #8a7444)", marginBottom: 8 }}>Навчальний кабінет</p>
            <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(1.6rem, 3vw, 2.4rem)", fontWeight: 300, color: "var(--text, #e8e4dd)", lineHeight: 1.2, marginBottom: 6 }}>Вітаємо, {displayName}</h1>
            <p style={{ fontSize: "0.76rem", color: "var(--text-dim, #9a958d)" }}>Твій шлях крізь час починається тут</p>
          </div>
          <Link href="/courses" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "12px 28px", border: "1px solid rgba(201,169,110,0.4)", color: "var(--gold-light, #e2c992)", textDecoration: "none", fontSize: "0.65rem", letterSpacing: "0.25em", textTransform: "uppercase", whiteSpace: "nowrap" }}>
            ▶ Обрати курс
          </Link>
        </div>

        {/* 4 картки */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 28 }} className="stats-grid">
          {[
            { label: "Прогрес курсу", value: "0%", sub: "Курс не обрано" },
            { label: "Завершено тем", value: "0", sub: "з 0 тем" },
            { label: "Середній бал", value: "—", sub: "балів поки немає" },
            { label: "Активні завдання", value: "0", sub: "завдань немає" },
          ].map((s, i) => (
            <div key={i} style={{ border: "1px solid rgba(201,169,110,0.12)", background: "rgba(201,169,110,0.025)", padding: "20px 22px" }}>
              <p style={{ fontSize: "0.55rem", letterSpacing: "0.25em", textTransform: "uppercase", color: "var(--gold-dim, #8a7444)", marginBottom: 10 }}>{s.label}</p>
              <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "2.2rem", fontWeight: 300, color: "var(--gold-light, #e2c992)", marginBottom: 4, lineHeight: 1 }}>{s.value}</p>
              <p style={{ fontSize: "0.65rem", color: "rgba(154,149,141,0.55)" }}>{s.sub}</p>
              <div style={{ marginTop: 14, height: 1, background: "rgba(201,169,110,0.08)" }} />
            </div>
          ))}
        </div>

        {/* Два стовпці */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }} className="two-col">

          {/* ЛІВА */}
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

            {/* Продовжити навчання */}
            <div style={{ border: "1px solid rgba(201,169,110,0.12)", background: "rgba(201,169,110,0.02)", padding: "22px 24px" }}>
              <p style={{ fontSize: "0.55rem", letterSpacing: "0.28em", textTransform: "uppercase", color: "var(--gold-dim, #8a7444)", marginBottom: 16 }}>Продовжити навчання</p>
              <div style={{ borderLeft: "2px solid rgba(201,169,110,0.25)", paddingLeft: 14 }}>
                <p style={{ fontSize: "0.65rem", color: "rgba(154,149,141,0.5)", marginBottom: 4 }}>Курс не обрано</p>
                <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.15rem", fontWeight: 300, color: "var(--text, #e8e4dd)", marginBottom: 14 }}>
                  Обери курс щоб розпочати
                </p>
                <div style={{ height: 2, background: "rgba(201,169,110,0.08)", marginBottom: 12, borderRadius: 1 }} />
                <Link href="/dashboard/lesson" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "10px 20px", border: "1px solid rgba(201,169,110,0.35)", background: "rgba(201,169,110,0.06)", color: "var(--gold-light, #e2c992)", textDecoration: "none", fontSize: "0.6rem", letterSpacing: "0.2em", textTransform: "uppercase" }}>
                  ▶ Відкрити урок
                </Link>
              </div>
            </div>

            {/* Найближчі події */}
            <div style={{ border: "1px solid rgba(201,169,110,0.12)", background: "rgba(201,169,110,0.02)", padding: "22px 24px" }}>
              <p style={{ fontSize: "0.55rem", letterSpacing: "0.28em", textTransform: "uppercase", color: "var(--gold-dim, #8a7444)", marginBottom: 16 }}>Найближчі події</p>
              <div style={{ display: "flex", alignItems: "flex-start", gap: 12, padding: "8px 0" }}>
                <div style={{ width: 6, height: 6, borderRadius: "50%", marginTop: 5, background: "rgba(201,169,110,0.3)", flexShrink: 0 }} />
                <div>
                  <p style={{ fontSize: "0.63rem", color: "rgba(154,149,141,0.5)", marginBottom: 3 }}>Незабаром</p>
                  <p style={{ fontSize: "0.82rem", color: "var(--text, #e8e4dd)" }}>Обери курс щоб побачити розклад</p>
                </div>
              </div>
            </div>

            {/* Рекомендації */}
            <div style={{ border: "1px solid rgba(201,169,110,0.12)", background: "rgba(201,169,110,0.02)", padding: "22px 24px" }}>
              <p style={{ fontSize: "0.55rem", letterSpacing: "0.28em", textTransform: "uppercase", color: "var(--gold-dim, #8a7444)", marginBottom: 16 }}>Рекомендації</p>
              {[
                { badge: "Старт", text: "Обери курс і розпочни навчання" },
                { badge: "Профіль", text: "Заповни профіль — вкажи клас і ціль" },
              ].map((rec, i, arr) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 0", borderBottom: i < arr.length - 1 ? "1px solid rgba(201,169,110,0.06)" : "none" }}>
                  <span style={{ fontSize: "0.52rem", letterSpacing: "0.08em", background: "rgba(201,169,110,0.08)", color: "var(--gold-dim, #8a7444)", border: "1px solid rgba(201,169,110,0.18)", padding: "3px 8px", whiteSpace: "nowrap", flexShrink: 0 }}>{rec.badge}</span>
                  <p style={{ fontSize: "0.76rem", color: "var(--text-dim, #9a958d)", lineHeight: 1.4 }}>{rec.text}</p>
                </div>
              ))}
            </div>
          </div>

          {/* ПРАВА */}
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

            {/* Остання активність */}
            <div style={{ border: "1px solid rgba(201,169,110,0.12)", background: "rgba(201,169,110,0.02)", padding: "22px 24px" }}>
              <p style={{ fontSize: "0.55rem", letterSpacing: "0.28em", textTransform: "uppercase", color: "var(--gold-dim, #8a7444)", marginBottom: 16 }}>Остання активність</p>
              <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "8px 0" }}>
                <div style={{ width: 32, height: 32, border: "1px solid rgba(201,169,110,0.15)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--gold-dim, #8a7444)", fontSize: "0.8rem", flexShrink: 0 }}>✦</div>
                <p style={{ fontSize: "0.78rem", color: "var(--text-dim, #9a958d)", flex: 1 }}>Акаунт створено</p>
                <p style={{ fontSize: "0.63rem", color: "rgba(154,149,141,0.35)", whiteSpace: "nowrap" }}>щойно</p>
              </div>
            </div>

            {/* Коментар викладача */}
            <div style={{ border: "1px solid rgba(201,169,110,0.12)", background: "rgba(201,169,110,0.02)", padding: "22px 24px" }}>
              <p style={{ fontSize: "0.55rem", letterSpacing: "0.28em", textTransform: "uppercase", color: "var(--gold-dim, #8a7444)", marginBottom: 16 }}>Коментар викладача</p>
              <div style={{ borderLeft: "2px solid rgba(201,169,110,0.12)", paddingLeft: 14 }}>
                <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1rem", fontWeight: 300, fontStyle: "italic", color: "rgba(154,149,141,0.4)", lineHeight: 1.7 }}>
                  Коментарі з&apos;являться тут після перевірки перших робіт
                </p>
              </div>
            </div>

            {/* Слабкі теми */}
            <div style={{ border: "1px solid rgba(201,169,110,0.12)", background: "rgba(201,169,110,0.02)", padding: "22px 24px" }}>
              <p style={{ fontSize: "0.55rem", letterSpacing: "0.28em", textTransform: "uppercase", color: "var(--gold-dim, #8a7444)", marginBottom: 16 }}>Слабкі теми</p>
              <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "0.95rem", fontWeight: 300, fontStyle: "italic", color: "rgba(154,149,141,0.38)", lineHeight: 1.6 }}>
                Дані з&apos;являться після проходження тестів
              </p>
            </div>

            {/* Швидкі посилання */}
            <div style={{ border: "1px solid rgba(201,169,110,0.1)", background: "rgba(201,169,110,0.015)", padding: "16px 24px", display: "flex", gap: 20, flexWrap: "wrap", alignItems: "center" }}>
              {[
                { href: "/courses", label: "Каталог курсів" },
                { href: "/map", label: "Карта подій" },
                { href: "/contacts", label: "Підтримка" },
              ].map(link => (
                <Link key={link.href} href={link.href} style={{ fontSize: "0.6rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--gold-dim, #8a7444)", textDecoration: "none" }}>
                  {link.label} →
                </Link>
              ))}
            </div>
          </div>
        </div>
      </main>

      <style>{`
        @media (max-width: 768px) {
          .desktop-sidebar { display: none !important; }
          .mobile-header { display: flex !important; }
          .dashboard-main { max-width: 100vw !important; padding: 100px 16px 32px !important; }
          .stats-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .two-col { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}