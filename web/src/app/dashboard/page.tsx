"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { type ReactNode, useEffect, useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Starfield } from "@/components/ui";

type NavigationItem = { label: string; href?: string; badge?: string };
type StatItem = { label: string; value: string; hint: string };

const primaryNavigation: NavigationItem[] = [
  { label: "Головна", href: "/dashboard" },
  { label: "Курси", href: "/courses" },
  { label: "Як працює KAYA", href: "/home" },
  { label: "Тести", badge: "Скоро" },
  { label: "Розклад", badge: "Скоро" },
];

const personalNavigation: NavigationItem[] = [
  { label: "Профіль", href: "/dashboard/profile" },
  { label: "Повідомлення", badge: "Скоро" },
];

const stats: StatItem[] = [
  { label: "Прогрес", value: "0%", hint: "З'явиться після старту першого курсу" },
  { label: "Середній бал", value: "—", hint: "З'явиться після перших тестів" },
  { label: "Уроків завершено", value: "0", hint: "Тут буде видно твій темп навчання" },
  { label: "Активні завдання", value: "0", hint: "Нових дедлайнів поки немає" },
];

const onboardingSteps = [
  "Обери перший курс у каталозі.",
  "Переглянь, як побудований простір KAYA.",
  "Після старту тут з'являться уроки, результати й завдання.",
];

function Rings({ size = 44, offset = 12 }: { size?: number; offset?: number }) {
  const inner = Math.round(size * 0.58);
  const off2 = offset + Math.round((size - inner) / 2);
  return (
    <>
      <div aria-hidden="true" className="pointer-events-none absolute rounded-full transition-all duration-500 group-hover:scale-110"
        style={{ right: offset, top: offset, width: size, height: size, border: "1px solid rgba(201,169,110,0.18)" }} />
      <div aria-hidden="true" className="pointer-events-none absolute rounded-full transition-all duration-500 group-hover:scale-110"
        style={{ right: off2, top: off2, width: inner, height: inner, border: "1px solid rgba(201,169,110,0.10)" }} />
    </>
  );
}

function CardGlow({ x = "20%", y = "30%" }: { x?: string; y?: string }) {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0"
      style={{ background: `radial-gradient(ellipse 70% 60% at ${x} ${y}, rgba(160,100,20,0.13), transparent 65%)` }} />
  );
}

function HoverGlow() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
      style={{ background: "radial-gradient(ellipse 65% 55% at 25% 35%, rgba(180,120,30,0.10), transparent 68%)" }} />
  );
}

function SidebarNav({ items, pathname, onNavigate }: {
  items: NavigationItem[]; pathname: string; onNavigate?: () => void;
}) {
  const isActive = (href?: string) => {
    if (!href) return false;
    if (href === "/dashboard") return pathname === "/dashboard";
    return pathname.startsWith(href);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
      {items.map((item) => {
        const active = isActive(item.href);
        const content = (
          <>
            <span style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 0 }}>
              <span style={{ width: 2, height: 13, borderRadius: 2, flexShrink: 0, background: active ? "rgba(201,169,110,0.90)" : "transparent", transition: "background 0.15s" }} />
              <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontSize: "0.78rem" }}>{item.label}</span>
            </span>
            {item.badge && (
              <span style={{ fontSize: "0.48rem", letterSpacing: "0.08em", border: "1px solid rgba(201,169,110,0.20)", borderRadius: 99, padding: "2px 5px", color: "rgba(201,169,110,0.55)", textTransform: "uppercase", flexShrink: 0 }}>
                {item.badge}
              </span>
            )}
          </>
        );

        const baseStyle: React.CSSProperties = {
          display: "flex", alignItems: "center", justifyContent: "space-between",
          gap: 8, borderRadius: 10, padding: "6px 12px",
          color: active ? "rgba(240,232,218,0.95)" : "rgba(200,190,174,0.52)",
          transition: "color 0.15s", textDecoration: "none", cursor: "pointer",
        };

        if (item.href) {
          return <Link key={item.label} href={item.href} onClick={onNavigate} style={baseStyle}>{content}</Link>;
        }
        return <div key={item.label} style={{ ...baseStyle, cursor: "default" }}>{content}</div>;
      })}
    </div>
  );
}

function SidebarInner({ displayName, pathname, onNavigate, onLogout, isSigningOut }: {
  displayName: string; pathname: string; onNavigate?: () => void;
  onLogout: () => void; isSigningOut: boolean;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", height: "100%", padding: "24px 0" }}>
      <div>
        <div style={{ padding: "0 16px", marginBottom: 32 }}>
          <Link href="/home" onClick={onNavigate} style={{ display: "block", fontFamily: "var(--font-serif, Georgia, serif)", fontSize: "1.36rem", letterSpacing: "0.14em", color: "rgba(240,232,218,0.96)", textDecoration: "none" }}>
            KAYA
          </Link>
          <p style={{ marginTop: 6, fontSize: "0.48rem", textTransform: "uppercase", letterSpacing: "0.18em", lineHeight: 1.7, color: "rgba(171,140,84,0.44)" }}>
            Навчальний<br />кабінет
          </p>
        </div>

        <div style={{ padding: "0 6px", marginBottom: 20 }}>
          <p style={{ marginBottom: 6, paddingLeft: 12, fontSize: "0.48rem", textTransform: "uppercase", letterSpacing: "0.16em", color: "rgba(171,140,84,0.32)" }}>Основне</p>
          <SidebarNav items={primaryNavigation} pathname={pathname} onNavigate={onNavigate} />
        </div>

        <div style={{ padding: "0 6px" }}>
          <p style={{ marginBottom: 6, paddingLeft: 12, fontSize: "0.48rem", textTransform: "uppercase", letterSpacing: "0.16em", color: "rgba(171,140,84,0.32)" }}>Особисте</p>
          <SidebarNav items={personalNavigation} pathname={pathname} onNavigate={onNavigate} />
        </div>
      </div>

      <div style={{ padding: "0 16px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
          <div style={{ width: 36, height: 36, flexShrink: 0, borderRadius: "50%", border: "1px solid rgba(201,169,110,0.30)", background: "rgba(201,169,110,0.10)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-serif, Georgia, serif)", fontSize: "0.90rem", color: "rgba(226,201,146,0.95)" }}>
            {displayName.charAt(0).toUpperCase()}
          </div>
          <div style={{ minWidth: 0 }}>
            <p style={{ fontSize: "0.78rem", color: "rgba(240,232,218,0.88)", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{displayName}</p>
            <p style={{ fontSize: "0.50rem", textTransform: "uppercase", letterSpacing: "0.12em", color: "rgba(171,140,84,0.52)", margin: 0 }}>Учень</p>
          </div>
        </div>
        <button type="button" onClick={onLogout} disabled={isSigningOut} style={{ fontSize: "0.60rem", textTransform: "uppercase", letterSpacing: "0.12em", color: "rgba(210,200,185,0.38)", background: "none", border: "none", cursor: "pointer", padding: 0, transition: "color 0.15s" }}>
          {isSigningOut ? "Вихід..." : "Вийти →"}
        </button>
      </div>
    </div>
  );
}

function StatTile({ item }: { item: StatItem }) {
  return (
    <article className="group relative overflow-hidden" style={{ borderRadius: 18, border: "1px solid rgba(201,169,110,0.14)", background: "linear-gradient(145deg, rgba(38,26,12,0.92) 0%, rgba(18,14,8,0.96) 100%)", padding: "18px 16px", boxShadow: "inset 0 1px 0 rgba(201,169,110,0.06), 0 4px 20px rgba(0,0,0,0.30)" }}>
      <CardGlow x="15%" y="20%" />
      <HoverGlow />
      <div className="relative z-10">
        <p style={{ fontSize: "0.52rem", textTransform: "uppercase", letterSpacing: "0.13em", color: "rgba(171,140,84,0.62)", margin: 0 }}>{item.label}</p>
        <p style={{ margin: "10px 0 0", fontFamily: "var(--font-serif, Georgia, serif)", fontSize: "1.58rem", lineHeight: 1, color: "rgba(226,201,146,0.97)" }}>{item.value}</p>
        <p style={{ margin: "8px 0 0", fontSize: "0.70rem", lineHeight: 1.55, color: "rgba(210,198,180,0.50)" }}>{item.hint}</p>
      </div>
    </article>
  );
}

type CardProps = {
  eyebrow: string; title: string; description?: string;
  children?: ReactNode; href?: string; footer?: ReactNode;
  glowX?: string; glowY?: string;
};

function Card({ eyebrow, title, description, children, href, footer, glowX = "20%", glowY = "25%" }: CardProps) {
  const cardStyle: React.CSSProperties = {
    borderRadius: 20, border: "1px solid rgba(201,169,110,0.13)",
    background: "linear-gradient(145deg, rgba(42,30,14,0.90) 0%, rgba(16,12,8,0.95) 100%)",
    padding: "22px 22px", boxShadow: "inset 0 1px 0 rgba(201,169,110,0.07), 0 6px 28px rgba(0,0,0,0.28)",
    position: "relative", overflow: "hidden", display: "block", textDecoration: "none",
    transition: "border-color 0.3s",
  };

  const inner = (
    <>
      <CardGlow x={glowX} y={glowY} />
      <HoverGlow />
      <Rings />
      <div className="relative z-10">
        <p style={{ fontSize: "0.52rem", textTransform: "uppercase", letterSpacing: "0.14em", color: "rgba(171,140,84,0.65)", margin: 0 }}>{eyebrow}</p>
        <h2 style={{ margin: "10px 0 0", fontFamily: "var(--font-serif, Georgia, serif)", fontSize: "1.42rem", lineHeight: 1.22, color: "rgba(240,232,218,0.97)" }}>{title}</h2>
        {description && <p style={{ margin: "10px 0 0", fontSize: "0.82rem", lineHeight: 1.75, color: "rgba(210,198,180,0.62)" }}>{description}</p>}
        {children}
        {footer && <div style={{ marginTop: 14 }}>{footer}</div>}
      </div>
    </>
  );

  if (href) return <Link href={href} className="group" style={cardStyle}>{inner}</Link>;
  return <article className="group" style={cardStyle}>{inner}</article>;
}

function OutlineBtn({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link href={href} style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", borderRadius: 11, border: "1px solid rgba(201,169,110,0.28)", background: "rgba(201,169,110,0.06)", padding: "8px 18px", fontSize: "0.64rem", textTransform: "uppercase", letterSpacing: "0.10em", color: "rgba(226,201,146,0.90)", textDecoration: "none", transition: "border-color 0.2s, background 0.2s" }}>
      {children}
    </Link>
  );
}

function DotLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link href={href} style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: "0.62rem", textTransform: "uppercase", letterSpacing: "0.10em", color: "rgba(226,201,146,0.75)", textDecoration: "none", transition: "color 0.2s" }}>
      <span style={{ width: 6, height: 6, borderRadius: "50%", background: "rgba(201,169,110,0.72)", flexShrink: 0 }} />
      {children}
    </Link>
  );
}

export default function DashboardPage() {
  const pathname = usePathname();
  const router = useRouter();

  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [displayName, setDisplayName] = useState("Учень");
  const [isLoadingUser, setIsLoadingUser] = useState(true);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  // Responsive detection — runs only on client, no SSR mismatch
  useEffect(() => {
    // 1024px = Tailwind 'lg'. Catches laptops in 1024–1279 range that
    // were previously stuck on the mobile layout.
    const mq = window.matchMedia("(min-width: 1024px)");
    setIsDesktop(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  // Auth
  useEffect(() => {
    const supabase = createClient();
    const loadUser = async () => {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error || !user) { router.replace("/login"); return; }
      const { data: profile } = await supabase.from("profiles").select("full_name").eq("id", user.id).single();
      const fallback = user.email?.split("@")[0] ?? "Учень";
      setDisplayName(profile?.full_name?.trim() || fallback);
      setIsLoadingUser(false);
    };
    loadUser();
  }, [router]);

  const heroSubtitle = useMemo(() =>
    isLoadingUser
      ? "Завантажуємо твій навчальний простір."
      : "Тут збиратиметься твій особистий шлях у KAYA: курси, прогрес, результати та наступні кроки.",
    [isLoadingUser]);

  const handleLogout = async () => {
    try {
      setIsSigningOut(true);
      const supabase = createClient();
      await supabase.auth.signOut();
      router.push("/login");
      router.refresh();
    } finally {
      setIsSigningOut(false);
    }
  };

  // ── Shared content (no duplication) ──────────────────────────────────────
  const mainContent = (
    <main style={{ flex: 1, minWidth: 0, padding: isDesktop ? "24px 26px" : "14px", display: "flex", flexDirection: "column", gap: isDesktop ? 14 : 12 }}>

      {/* ROW 1: Hero + Stats */}
      <div style={{ display: "grid", gridTemplateColumns: isDesktop ? "1fr 272px" : "1fr", gap: isDesktop ? 14 : 12, alignItems: "stretch" }}>
        {/* Hero */}
        <article className="group relative overflow-hidden" style={{ borderRadius: 22, border: "1px solid rgba(201,169,110,0.16)", background: "linear-gradient(140deg, rgba(56,38,16,0.92) 0%, rgba(20,14,8,0.97) 55%, rgba(12,8,14,0.98) 100%)", padding: isDesktop ? "30px 34px" : "24px 20px", minHeight: isDesktop ? 210 : "auto", boxShadow: "inset 0 1px 0 rgba(201,169,110,0.10), 0 8px 40px rgba(0,0,0,0.40)" }}>
          <div aria-hidden="true" style={{ pointerEvents: "none", position: "absolute", left: -30, top: -30, width: 280, height: 200, background: "radial-gradient(ellipse at 25% 30%, rgba(180,110,15,0.18), transparent 60%)" }} />
          <HoverGlow />
          <div className="relative z-10">
            <p style={{ fontSize: "0.54rem", textTransform: "uppercase", letterSpacing: "0.16em", color: "rgba(171,140,84,0.65)", margin: 0 }}>Навчальний кабінет</p>
            <h1 style={{ margin: "10px 0 0", fontFamily: "var(--font-serif, Georgia, serif)", fontSize: isDesktop ? "2.45rem" : "1.85rem", lineHeight: 1.14, color: "rgba(245,238,225,0.99)", textShadow: "0 2px 20px rgba(180,120,20,0.15)" }}>
              Вітаємо, {displayName}
            </h1>
            <p style={{ margin: "12px 0 0", fontSize: "0.86rem", lineHeight: 1.78, color: "rgba(210,198,180,0.68)", maxWidth: "54ch" }}>{heroSubtitle}</p>
            <div style={{ marginTop: 18, display: "flex", flexWrap: "wrap", alignItems: "center", gap: 10 }}>
              <OutlineBtn href="/courses">Обрати курс</OutlineBtn>
              <OutlineBtn href="/home">Як працює KAYA</OutlineBtn>
            </div>
            <div style={{ marginTop: 12, display: "inline-flex", alignItems: "center", gap: 6, fontSize: "0.58rem", textTransform: "uppercase", letterSpacing: "0.08em", color: "rgba(200,188,168,0.38)" }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: "rgba(201,169,110,0.55)" }} />
              Твій простір для навчання вже готовий
            </div>
          </div>
        </article>

        {/* Stats 2×2 */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          {stats.map((item) => <StatTile key={item.label} item={item} />)}
        </div>
      </div>

      {/* ROW 2 */}
      <div style={{ display: "grid", gridTemplateColumns: isDesktop ? "repeat(3, 1fr)" : "1fr", gap: isDesktop ? 14 : 12 }}>
        <Card eyebrow="Продовжити навчання" title="Поки що курс не обрано"
          description="Почни з каталогу курсів. Після вибору тут з'явиться твій поточний урок і домашні завдання."
          footer={<OutlineBtn href="/courses">Перейти до курсів</OutlineBtn>} glowX="10%" glowY="20%" />
        <Card eyebrow="Розклад" title="Найближче заняття"
          description="Після старту курсу тут з'явиться дата й час наступного уроку з куратором."
          footer={<DotLink href="/dashboard">Переглянути розклад</DotLink>} glowX="80%" glowY="15%">
          <div style={{ marginTop: 10 }}>
            <p style={{ fontSize: "0.52rem", textTransform: "uppercase", letterSpacing: "0.10em", color: "rgba(171,140,84,0.55)", margin: 0 }}>Статус</p>
            <p style={{ margin: "4px 0 0", fontSize: "0.78rem", color: "rgba(210,198,180,0.48)" }}>Занять поки не заплановано.</p>
          </div>
        </Card>
        <Card eyebrow="Активні завдання" title="Щойно"
          description="Тут з'являться дедлайни й завдання від куратора після старту першого курсу."
          footer={<DotLink href="/dashboard">Відкрити</DotLink>} glowX="50%" glowY="10%" />
      </div>

      {/* ROW 3 */}
      <div style={{ display: "grid", gridTemplateColumns: isDesktop ? "repeat(3, 1fr)" : "1fr", gap: isDesktop ? 14 : 12 }}>
        <Card eyebrow="Навчання" title="Продовжити навчання"
          description="Почни з каталогу курсів. Після вибору тут з'явиться твій поточний урок."
          footer={<OutlineBtn href="/courses">Перейти до курсів</OutlineBtn>} glowX="15%" glowY="30%" />
        <Card href="/courses" eyebrow="Каталог" title="Каталог курсів"
          description="Обери свій перший курс з історії України або світу і побудуй власний маршрут навчання."
          footer={<DotLink href="/courses">Відкрити</DotLink>} glowX="75%" glowY="20%" />
        <Card href="/dashboard/progress" eyebrow="Аналітика" title="Мій прогрес"
          description="Детальна статистика навчання: бали за тести, пройдені теми, активність по днях."
          footer={<DotLink href="/dashboard/progress">Відкрити</DotLink>} glowX="30%" glowY="15%" />
      </div>

      {/* ROW 4: Onboarding */}
      <article className="group relative overflow-hidden" style={{ borderRadius: 20, border: "1px solid rgba(201,169,110,0.12)", background: "linear-gradient(145deg, rgba(36,26,12,0.88) 0%, rgba(14,12,10,0.94) 100%)", padding: "22px 24px", boxShadow: "inset 0 1px 0 rgba(201,169,110,0.06), 0 4px 24px rgba(0,0,0,0.28)" }}>
        <CardGlow x="50%" y="0%" />
        <HoverGlow />
        <Rings size={48} offset={13} />
        <div className="relative z-10">
          <p style={{ fontSize: "0.52rem", textTransform: "uppercase", letterSpacing: "0.14em", color: "rgba(171,140,84,0.62)", margin: "0 0 10px" }}>Рекомендовані кроки</p>
          <h2 style={{ margin: "0 0 18px", fontFamily: "var(--font-serif, Georgia, serif)", fontSize: "1.42rem", color: "rgba(240,232,218,0.95)" }}>Рекомендовані кроки</h2>
          <div style={{ display: "flex", flexDirection: isDesktop ? "row" : "column", gap: 10 }}>
            {onboardingSteps.map((step, i) => (
              <div key={step} style={{ flex: 1, display: "flex", alignItems: "flex-start", gap: 12, borderRadius: 13, border: "1px solid rgba(201,169,110,0.09)", background: "rgba(255,255,255,0.013)", padding: "12px 16px" }}>
                <div style={{ width: 24, height: 24, flexShrink: 0, marginTop: 1, borderRadius: "50%", border: "1px solid rgba(201,169,110,0.24)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.68rem", color: "rgba(201,169,110,0.82)" }}>{i + 1}</div>
                <p style={{ margin: 0, fontSize: "0.82rem", lineHeight: 1.7, color: "rgba(210,198,180,0.64)" }}>{step}</p>
              </div>
            ))}
          </div>
        </div>
      </article>
    </main>
  );

  return (
    <div style={{ position: "relative", minHeight: "100vh", overflowX: "hidden", background: "#080608" }}>
      <Starfield count={160} />

      {/* Global ambient */}
      <div aria-hidden="true" style={{ pointerEvents: "none", position: "absolute", inset: 0, zIndex: 0, background: "radial-gradient(ellipse 80% 55% at 55% 0%, rgba(160,95,15,0.14), transparent 65%)" }} />

      {/* Mobile header — only visible when not desktop */}
      {!isDesktop && (
        <header style={{ position: "sticky", top: 0, zIndex: 40, borderBottom: "1px solid rgba(201,169,110,0.08)", background: "rgba(8,6,8,0.95)", backdropFilter: "blur(12px)" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px" }}>
            <Link href="/home" style={{ fontFamily: "var(--font-serif, Georgia, serif)", fontSize: "1.30rem", letterSpacing: "0.14em", color: "rgba(240,232,218,0.94)", textDecoration: "none" }}>KAYA</Link>
            <button type="button" onClick={() => setMobileNavOpen(true)} style={{ borderRadius: 9, border: "1px solid rgba(201,169,110,0.22)", padding: "6px 12px", fontSize: "0.64rem", textTransform: "uppercase", letterSpacing: "0.10em", color: "rgba(201,169,110,0.88)", background: "none", cursor: "pointer" }}>Меню</button>
          </div>
        </header>
      )}

      {/* Main layout */}
      <div style={{ position: "relative", zIndex: 10, display: "flex", minHeight: "100vh" }}>

        {/* Sidebar — only on desktop */}
        {isDesktop && (
          <div style={{ width: 124, flexShrink: 0, position: "sticky", top: 0, height: "100vh", borderRight: "1px solid rgba(201,169,110,0.08)", background: "rgba(6,5,6,0.88)", backdropFilter: "blur(16px)", overflowY: "auto", zIndex: 10 }}>
            <SidebarInner displayName={displayName} pathname={pathname} onLogout={handleLogout} isSigningOut={isSigningOut} />
          </div>
        )}

        {/* Content — single instance, no duplication */}
        {mainContent}
      </div>

      {/* Mobile nav overlay */}
      {mobileNavOpen && (
        <div style={{ position: "fixed", inset: 0, zIndex: 50 }}>
          <button type="button" aria-label="Закрити меню" onClick={() => setMobileNavOpen(false)} style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.75)", border: "none", cursor: "pointer" }} />
          <div style={{ position: "absolute", right: 0, top: 0, height: "100%", width: "78vw", maxWidth: 300, borderLeft: "1px solid rgba(201,169,110,0.10)", background: "rgba(6,5,6,0.97)", backdropFilter: "blur(20px)" }}>
            <div style={{ display: "flex", justifyContent: "flex-end", padding: 14 }}>
              <button type="button" onClick={() => setMobileNavOpen(false)} style={{ borderRadius: 9, border: "1px solid rgba(201,169,110,0.18)", padding: "6px 12px", fontSize: "0.62rem", textTransform: "uppercase", letterSpacing: "0.10em", color: "rgba(201,169,110,0.78)", background: "none", cursor: "pointer" }}>Закрити</button>
            </div>
            <SidebarInner displayName={displayName} pathname={pathname} onNavigate={() => setMobileNavOpen(false)} onLogout={handleLogout} isSigningOut={isSigningOut} />
          </div>
        </div>
      )}
    </div>
  );
}