"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { type ReactNode, useEffect, useMemo, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type NavigationItem = {
  label: string;
  href?: string;
  badge?: string;
};

type StatItem = {
  label: string;
  value: string;
  hint: string;
};

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

function Rings({ size = 38, offset = 10 }: { size?: number; offset?: number }) {
  const inner = Math.round(size * 0.54);
  const innerOffset = offset + Math.round((size - inner) / 2);
  return (
    <>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute rounded-full border border-[rgba(201,169,110,0.11)] transition-all duration-300 group-hover:scale-105 group-hover:border-[rgba(201,169,110,0.18)]"
        style={{ right: offset, top: offset, width: size, height: size }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute rounded-full border border-[rgba(201,169,110,0.07)] transition-all duration-300 group-hover:scale-105 group-hover:border-[rgba(201,169,110,0.12)]"
        style={{ right: innerOffset, top: innerOffset, width: inner, height: inner }}
      />
    </>
  );
}

function HoverGlow() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
      style={{
        background:
          "radial-gradient(ellipse 60% 50% at 30% 40%, rgba(180,120,40,0.08), transparent 70%)",
      }}
    />
  );
}

function SidebarNav({
  items,
  pathname,
  onNavigate,
}: {
  items: NavigationItem[];
  pathname: string;
  onNavigate?: () => void;
}) {
  const isActive = (href?: string) => {
    if (!href) return false;
    if (href === "/dashboard") return pathname === "/dashboard";
    return pathname.startsWith(href);
  };

  return (
    <div className="space-y-0.5">
      {items.map((item) => {
        const active = isActive(item.href);
        const base =
          "flex items-center justify-between gap-2 rounded-[10px] px-3 py-1.5 text-[0.80rem] transition-all duration-150";
        const activeStyle = "text-[rgba(240,232,218,0.94)]";
        const inactiveStyle =
          "text-[rgba(214,204,190,0.55)] hover:text-[rgba(226,201,146,0.82)]";

        const content = (
          <>
            <span className="flex min-w-0 items-center gap-2">
              <span
                className="shrink-0 rounded-full transition-all duration-150"
                style={{
                  width: "2px",
                  height: "14px",
                  background: active ? "rgba(201,169,110,0.84)" : "transparent",
                }}
              />
              <span className="truncate">{item.label}</span>
            </span>
            {item.badge && (
              <span className="shrink-0 rounded-full border border-[rgba(201,169,110,0.18)] px-1.5 py-0.5 text-[0.50rem] uppercase tracking-[0.08em] text-[rgba(201,169,110,0.58)]">
                {item.badge}
              </span>
            )}
          </>
        );

        if (item.href) {
          return (
            <Link
              key={item.label}
              href={item.href}
              onClick={onNavigate}
              className={`${base} ${active ? activeStyle : inactiveStyle}`}
            >
              {content}
            </Link>
          );
        }
        return (
          <div key={item.label} className={`${base} ${inactiveStyle} cursor-default`}>
            {content}
          </div>
        );
      })}
    </div>
  );
}

function SidebarInner({
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
  return (
    <div
      className="flex h-full flex-col justify-between"
      style={{ padding: "24px 0" }}
    >
      {/* Top */}
      <div>
        <div style={{ padding: "0 16px", marginBottom: "28px" }}>
          <Link
            href="/home"
            onClick={onNavigate}
            className="block font-serif text-[1.38rem] leading-none tracking-[0.14em] text-[rgba(240,232,218,0.96)]"
          >
            KAYA
          </Link>
          <p className="mt-2 text-[0.50rem] uppercase leading-relaxed tracking-[0.18em] text-[rgba(171,140,84,0.48)]">
            Навчальний
            <br />
            кабінет
          </p>
        </div>

        <div style={{ padding: "0 8px", marginBottom: "20px" }}>
          <p className="mb-1.5 px-3 text-[0.50rem] uppercase tracking-[0.16em] text-[rgba(171,140,84,0.36)]">
            Основне
          </p>
          <SidebarNav items={primaryNavigation} pathname={pathname} onNavigate={onNavigate} />
        </div>

        <div style={{ padding: "0 8px" }}>
          <p className="mb-1.5 px-3 text-[0.50rem] uppercase tracking-[0.16em] text-[rgba(171,140,84,0.36)]">
            Особисте
          </p>
          <SidebarNav items={personalNavigation} pathname={pathname} onNavigate={onNavigate} />
        </div>
      </div>

      {/* Bottom */}
      <div style={{ padding: "0 16px" }}>
        <div className="mb-3 flex items-center gap-2.5">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[rgba(201,169,110,0.28)] bg-[rgba(201,169,110,0.10)] font-serif text-[0.92rem] text-[rgba(226,201,146,0.96)]">
            {displayName.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="truncate text-[0.80rem] text-[rgba(240,232,218,0.88)]">{displayName}</p>
            <p className="text-[0.52rem] uppercase tracking-[0.12em] text-[rgba(171,140,84,0.56)]">
              Учень
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={onLogout}
          disabled={isSigningOut}
          className="text-[0.62rem] uppercase tracking-[0.12em] text-[rgba(210,200,185,0.42)] transition-colors duration-150 hover:text-[rgba(226,201,146,0.72)] disabled:opacity-40"
        >
          {isSigningOut ? "Вихід..." : "Вийти →"}
        </button>
      </div>
    </div>
  );
}

function StatTile({ item }: { item: StatItem }) {
  return (
    <article
      className="group relative overflow-hidden rounded-[18px] border border-[rgba(201,169,110,0.11)] p-4 transition-all duration-300 hover:border-[rgba(201,169,110,0.20)]"
      style={{
        background: "linear-gradient(150deg, rgba(30,22,14,0.82), rgba(10,10,14,0.88))",
      }}
    >
      <HoverGlow />
      <div className="relative z-10">
        <p className="text-[0.54rem] uppercase tracking-[0.12em] text-[rgba(171,140,84,0.65)]">
          {item.label}
        </p>
        <p className="mt-2 font-serif text-[1.52rem] leading-none text-[rgba(226,201,146,0.96)]">
          {item.value}
        </p>
        <p className="mt-2 text-[0.72rem] leading-5 text-[rgba(220,210,196,0.52)]">
          {item.hint}
        </p>
      </div>
    </article>
  );
}

type CardProps = {
  eyebrow: string;
  title: string;
  description?: string;
  children?: ReactNode;
  href?: string;
  footer?: ReactNode;
  background?: string;
  rings?: boolean;
  className?: string;
};

function Card({
  eyebrow,
  title,
  description,
  children,
  href,
  footer,
  background = "linear-gradient(150deg, rgba(38,28,16,0.80), rgba(12,10,14,0.88))",
  rings = true,
  className = "",
}: CardProps) {
  const inner = (
    <>
      <HoverGlow />
      {rings && <Rings />}
      <div className="relative z-10">
        <p className="text-[0.54rem] uppercase tracking-[0.14em] text-[rgba(171,140,84,0.68)]">
          {eyebrow}
        </p>
        <h2 className="mt-2 font-serif text-[1.42rem] leading-[1.22] text-[rgba(240,232,218,0.96)]">
          {title}
        </h2>
        {description && (
          <p className="mt-2 text-[0.82rem] leading-6 text-[rgba(220,210,196,0.65)]">
            {description}
          </p>
        )}
        {children}
        {footer && <div className="mt-3">{footer}</div>}
      </div>
    </>
  );

  const base = `group relative overflow-hidden rounded-[20px] border border-[rgba(201,169,110,0.11)] p-5 transition-all duration-300 hover:border-[rgba(201,169,110,0.20)] hover:shadow-[0_8px_28px_rgba(0,0,0,0.18)] ${className}`;

  if (href) {
    return (
      <Link href={href} className={base} style={{ background }}>
        {inner}
      </Link>
    );
  }
  return (
    <article className={base} style={{ background }}>
      {inner}
    </article>
  );
}

function OutlineBtn({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link
      href={href}
      className="inline-flex items-center justify-center rounded-[11px] border border-[rgba(201,169,110,0.26)] bg-[rgba(201,169,110,0.05)] px-4 py-2 text-[0.66rem] uppercase tracking-[0.10em] text-[rgba(226,201,146,0.88)] transition-all duration-200 hover:border-[rgba(201,169,110,0.44)] hover:bg-[rgba(201,169,110,0.09)]"
    >
      {children}
    </Link>
  );
}

function DotLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-1.5 text-[0.64rem] uppercase tracking-[0.10em] text-[rgba(226,201,146,0.78)] transition-colors duration-200 hover:text-[rgba(226,201,146,1)]"
    >
      <span className="h-1.5 w-1.5 rounded-full bg-[rgba(201,169,110,0.70)]" />
      {children}
    </Link>
  );
}

export default function DashboardPage() {
  const pathname = usePathname();
  const router = useRouter();
  const starfieldRef = useRef<HTMLDivElement>(null);

  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [displayName, setDisplayName] = useState("Учень");
  const [isLoadingUser, setIsLoadingUser] = useState(true);
  const [isSigningOut, setIsSigningOut] = useState(false);

  useEffect(() => {
    const field = starfieldRef.current;
    if (!field) return;
    field.innerHTML = "";
    const stars: HTMLDivElement[] = [];
    for (let i = 0; i < 140; i++) {
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

  useEffect(() => {
    const supabase = createClient();
    const loadUser = async () => {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error || !user) { router.replace("/login"); return; }
      const { data: profile } = await supabase
        .from("profiles").select("full_name").eq("id", user.id).single();
      const fallback = user.email?.split("@")[0] ?? "Учень";
      setDisplayName(profile?.full_name?.trim() || fallback);
      setIsLoadingUser(false);
    };
    loadUser();
  }, [router]);

  const heroSubtitle = useMemo(
    () =>
      isLoadingUser
        ? "Завантажуємо твій навчальний простір."
        : "Тут збиратиметься твій особистий шлях у KAYA: курси, прогрес, результати та наступні кроки.",
    [isLoadingUser]
  );

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

  return (
    <div
      className="relative min-h-screen overflow-x-hidden bg-[var(--bg)] text-[var(--text)]"
    >
      <div ref={starfieldRef} className="starfield" aria-hidden="true" />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 z-0"
        style={{
          height: "400px",
          background:
            "radial-gradient(ellipse 70% 50% at 60% 0%, rgba(180,120,40,0.11), transparent 70%)",
        }}
      />

      {/* ── Mobile header ── */}
      <header className="sticky top-0 z-40 border-b border-[rgba(201,169,110,0.08)] bg-[rgba(10,10,12,0.94)] backdrop-blur xl:hidden">
        <div className="flex items-center justify-between px-4 py-3">
          <Link
            href="/home"
            className="font-serif text-[1.32rem] leading-none tracking-[0.14em] text-[rgba(240,232,218,0.94)]"
          >
            KAYA
          </Link>
          <button
            type="button"
            onClick={() => setMobileNavOpen(true)}
            className="rounded-[9px] border border-[rgba(201,169,110,0.22)] px-3 py-1.5 text-[0.66rem] uppercase tracking-[0.10em] text-[rgba(201,169,110,0.88)]"
          >
            Меню
          </button>
        </div>
      </header>

      {/* ── Desktop: sidebar fixed + scrollable main ── */}
      <div className="relative z-10 hidden xl:flex" style={{ minHeight: "100vh" }}>

        {/* Sidebar — fixed width, full height */}
        <div
          style={{
            width: "120px",
            flexShrink: 0,
            position: "sticky",
            top: 0,
            height: "100vh",
            borderRight: "1px solid rgba(201,169,110,0.07)",
            background: "rgba(8,8,10,0.82)",
            overflowY: "auto",
            zIndex: 10,
          }}
        >
          <SidebarInner
            displayName={displayName}
            pathname={pathname}
            onLogout={handleLogout}
            isSigningOut={isSigningOut}
          />
        </div>

        {/* Main content — takes remaining width */}
        <main
          style={{
            flex: 1,
            minWidth: 0,
            padding: "24px 28px",
            display: "flex",
            flexDirection: "column",
            gap: "16px",
          }}
        >
          {/* ROW 1: Hero + Stats */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 280px",
              gap: "16px",
              alignItems: "stretch",
            }}
          >
            {/* Hero */}
            <article
              className="group relative overflow-hidden rounded-[22px] border border-[rgba(201,169,110,0.13)]"
              style={{
                background: "linear-gradient(135deg, rgba(48,34,18,0.88), rgba(12,10,14,0.92))",
                padding: "28px 32px",
                minHeight: "200px",
              }}
            >
              <HoverGlow />
              <div
                aria-hidden="true"
                className="pointer-events-none absolute"
                style={{
                  left: "-20px",
                  top: "-20px",
                  width: "200px",
                  height: "160px",
                  background: "radial-gradient(circle at 30% 40%, rgba(180,120,40,0.12), transparent 62%)",
                }}
              />
              <div className="relative z-10">
                <p className="text-[0.56rem] uppercase tracking-[0.16em] text-[rgba(171,140,84,0.68)]">
                  Навчальний кабінет
                </p>
                <h1 className="mt-2 font-serif text-[2.2rem] leading-[1.15] text-[rgba(240,232,218,0.98)] sm:text-[2.5rem]">
                  Вітаємо, {displayName}
                </h1>
                <p className="mt-2.5 text-[0.86rem] leading-7 text-[rgba(220,210,196,0.70)]" style={{ maxWidth: "52ch" }}>
                  {heroSubtitle}
                </p>
                <div className="mt-4 flex flex-wrap items-center gap-3">
                  <OutlineBtn href="/courses">Обрати курс</OutlineBtn>
                  <OutlineBtn href="/home">Як працює KAYA</OutlineBtn>
                </div>
                <div className="mt-3 inline-flex items-center gap-1.5 text-[0.60rem] uppercase tracking-[0.08em] text-[rgba(210,200,185,0.42)]">
                  <span className="h-1.5 w-1.5 rounded-full bg-[rgba(201,169,110,0.60)]" />
                  Твій простір для навчання вже готовий
                </div>
              </div>
            </article>

            {/* Stats 2×2 */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
              {stats.map((item) => (
                <StatTile key={item.label} item={item} />
              ))}
            </div>
          </div>

          {/* ROW 2 */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px" }}>
            <Card
              eyebrow="Продовжити навчання"
              title="Поки що курс не обрано"
              description="Почни з каталогу курсів. Після вибору тут з'явиться твій поточний урок і домашні завдання."
              footer={<OutlineBtn href="/courses">Перейти до курсів</OutlineBtn>}
            />
            <Card
              eyebrow="Розклад"
              title="Найближче заняття"
              description="Після старту курсу тут з'явиться дата й час наступного уроку з куратором."
              footer={<DotLink href="/dashboard">Переглянути розклад</DotLink>}
            >
              <div className="mt-2.5">
                <p className="text-[0.54rem] uppercase tracking-[0.10em] text-[rgba(171,140,84,0.58)]">Статус</p>
                <p className="mt-1 text-[0.78rem] text-[rgba(220,210,196,0.52)]">Занять поки не заплановано.</p>
              </div>
            </Card>
            <Card
              eyebrow="Активні завдання"
              title="Щойно"
              description="Тут з'являться дедлайни й завдання від куратора після старту першого курсу."
              footer={<DotLink href="/dashboard">Відкрити</DotLink>}
            />
          </div>

          {/* ROW 3 */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px" }}>
            <Card
              eyebrow="Навчання"
              title="Продовжити навчання"
              description="Почни з каталогу курсів. Після вибору тут з'явиться твій поточний урок."
              footer={<OutlineBtn href="/courses">Перейти до курсів</OutlineBtn>}
              background="linear-gradient(150deg, rgba(36,26,14,0.80), rgba(12,10,14,0.88))"
            />
            <Card
              href="/courses"
              eyebrow="Каталог"
              title="Каталог курсів"
              description="Обери свій перший курс з історії України або світу і побудуй власний маршрут навчання."
              footer={<DotLink href="/courses">Відкрити</DotLink>}
              background="linear-gradient(150deg, rgba(34,26,14,0.78), rgba(12,10,14,0.88))"
            />
            <Card
              href="/dashboard/progress"
              eyebrow="Аналітика"
              title="Мій прогрес"
              description="Детальна статистика навчання: бали за тести, пройдені теми, активність по днях."
              footer={<DotLink href="/dashboard/progress">Відкрити</DotLink>}
              background="linear-gradient(150deg, rgba(32,24,14,0.78), rgba(12,10,14,0.88))"
            />
          </div>

          {/* ROW 4: Onboarding */}
          <article
            className="group relative overflow-hidden rounded-[20px] border border-[rgba(201,169,110,0.10)] p-5 transition-all duration-300 hover:border-[rgba(201,169,110,0.18)]"
            style={{ background: "linear-gradient(150deg, rgba(28,22,14,0.72), rgba(12,12,15,0.82))" }}
          >
            <HoverGlow />
            <Rings />
            <div className="relative z-10">
              <p className="mb-3 text-[0.54rem] uppercase tracking-[0.14em] text-[rgba(171,140,84,0.68)]">
                Рекомендовані кроки
              </p>
              <h2 className="mb-4 font-serif text-[1.38rem] text-[rgba(240,232,218,0.94)]">
                Рекомендовані кроки
              </h2>
              <div className="flex flex-col gap-3">
                {onboardingSteps.map((step, i) => (
                  <div
                    key={step}
                    className="flex items-start gap-3 rounded-[14px] border border-[rgba(201,169,110,0.08)] bg-[rgba(255,255,255,0.014)] px-4 py-3"
                  >
                    <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-[rgba(201,169,110,0.22)] text-[0.70rem] text-[rgba(201,169,110,0.84)]">
                      {i + 1}
                    </div>
                    <p className="text-[0.82rem] leading-6 text-[rgba(220,210,196,0.66)]">{step}</p>
                  </div>
                ))}
              </div>
            </div>
          </article>
        </main>
      </div>

      {/* ── Mobile layout ── */}
      <div className="relative z-10 xl:hidden">
        <main style={{ padding: "16px", display: "flex", flexDirection: "column", gap: "12px" }}>
          {/* Hero */}
          <article
            className="group relative overflow-hidden rounded-[20px] border border-[rgba(201,169,110,0.13)]"
            style={{
              background: "linear-gradient(135deg, rgba(48,34,18,0.88), rgba(12,10,14,0.92))",
              padding: "24px 20px",
            }}
          >
            <HoverGlow />
            <div className="relative z-10">
              <p className="text-[0.54rem] uppercase tracking-[0.16em] text-[rgba(171,140,84,0.68)]">
                Навчальний кабінет
              </p>
              <h1 className="mt-2 font-serif text-[1.8rem] leading-[1.15] text-[rgba(240,232,218,0.98)]">
                Вітаємо, {displayName}
              </h1>
              <p className="mt-2 text-[0.84rem] leading-6 text-[rgba(220,210,196,0.70)]">
                {heroSubtitle}
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <OutlineBtn href="/courses">Обрати курс</OutlineBtn>
                <OutlineBtn href="/home">Як працює KAYA</OutlineBtn>
              </div>
            </div>
          </article>

          {/* Stats 2×2 mobile */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
            {stats.map((item) => <StatTile key={item.label} item={item} />)}
          </div>

          {/* Cards mobile */}
          <Card
            eyebrow="Продовжити навчання"
            title="Поки що курс не обрано"
            description="Почни з каталогу курсів. Після вибору тут з'явиться твій поточний урок."
            footer={<OutlineBtn href="/courses">Перейти до курсів</OutlineBtn>}
          />
          <Card
            eyebrow="Розклад"
            title="Найближче заняття"
            description="Після старту курсу тут з'явиться дата й час наступного уроку з куратором."
            footer={<DotLink href="/dashboard">Переглянути розклад</DotLink>}
          />
          <Card
            href="/courses"
            eyebrow="Каталог"
            title="Каталог курсів"
            description="Обери свій перший курс з історії України або світу."
            footer={<DotLink href="/courses">Відкрити</DotLink>}
          />
          <Card
            href="/dashboard/progress"
            eyebrow="Аналітика"
            title="Мій прогрес"
            description="Детальна статистика навчання: бали, теми, активність."
            footer={<DotLink href="/dashboard/progress">Відкрити</DotLink>}
          />
        </main>
      </div>

      {/* ── Mobile nav overlay ── */}
      {mobileNavOpen && (
        <div className="fixed inset-0 z-50 xl:hidden">
          <button
            type="button"
            aria-label="Закрити меню"
            onClick={() => setMobileNavOpen(false)}
            className="absolute inset-0 bg-black/70"
          />
          <div
            className="absolute right-0 top-0 h-full w-[80vw] max-w-[320px] backdrop-blur-md"
            style={{
              borderLeft: "1px solid rgba(201,169,110,0.10)",
              background: "rgba(8,8,10,0.96)",
            }}
          >
            <div className="flex justify-end p-4">
              <button
                type="button"
                onClick={() => setMobileNavOpen(false)}
                className="rounded-[9px] border border-[rgba(201,169,110,0.18)] px-3 py-1.5 text-[0.64rem] uppercase tracking-[0.10em] text-[rgba(201,169,110,0.80)]"
              >
                Закрити
              </button>
            </div>
            <SidebarInner
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