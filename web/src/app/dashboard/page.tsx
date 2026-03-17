"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type NavigationItem = {
  label: string;
  href?: string;
  badge?: string;
  isActive?: boolean;
};

type StatItem = {
  label: string;
  value: string;
  hint: string;
};

const primaryNavigation: NavigationItem[] = [
  { label: "Головна", href: "/dashboard", isActive: true },
  { label: "Курси", href: "/courses" },
  { label: "Як працює KAYA", href: "/home" },
  { label: "Тести", badge: "Скоро" },
  { label: "Розклад", badge: "Скоро" },
];

const secondaryNavigation: NavigationItem[] = [
  { label: "Профіль", badge: "Скоро" },
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

// Декоративні кола у правому верхньому куті картки
function Rings({ size = 52, offset = 10 }: { size?: number; offset?: number }) {
  const inner = Math.round(size * 0.5);
  const innerOffset = offset + Math.round((size - inner) / 2);
  return (
    <>
      <div
        aria-hidden="true"
        className="absolute rounded-full border border-[rgba(201,169,110,0.18)] transition-all duration-300 group-hover:scale-110 group-hover:border-[rgba(201,169,110,0.34)]"
        style={{ right: offset, top: offset, width: size, height: size }}
      />
      <div
        aria-hidden="true"
        className="absolute rounded-full border border-[rgba(201,169,110,0.18)] opacity-60 transition-all duration-300 group-hover:scale-110 group-hover:border-[rgba(201,169,110,0.34)]"
        style={{ right: innerOffset, top: innerOffset, width: inner, height: inner }}
      />
    </>
  );
}

// Внутрішній glow при hover
function HoverGlow() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
      style={{
        background:
          "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(180,130,60,0.16), transparent 70%)",
      }}
    />
  );
}

// Dot-посилання: ● ВІДКРИТИ
function DotLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-2 text-[0.74rem] uppercase tracking-[0.18em] text-[rgba(226,201,146,0.88)] transition-colors duration-200 hover:text-[rgba(226,201,146,1)]"
    >
      <span className="h-1.5 w-1.5 rounded-full bg-[rgba(201,169,110,0.75)]" />
      {children}
    </Link>
  );
}

// Outlined кнопка
function OutlineButton({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="group/btn relative inline-flex min-h-[40px] items-center justify-center overflow-hidden rounded-[12px] border border-[rgba(201,169,110,0.36)] px-5 text-[0.76rem] uppercase tracking-[0.14em] text-[rgba(201,169,110,0.92)] transition-all duration-300 hover:border-[rgba(201,169,110,0.60)] hover:text-[rgba(226,201,146,1)]"
      style={{ background: "rgba(255,255,255,0.03)" }}
    >
      <span
        aria-hidden="true"
        className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover/btn:opacity-100"
        style={{
          background:
            "radial-gradient(circle at 50% 50%, rgba(201,169,110,0.12), transparent 60%)",
        }}
      />
      <span className="relative z-10">{children}</span>
    </Link>
  );
}

function DashboardNav({
  items,
  onNavigate,
}: {
  items: NavigationItem[];
  onNavigate?: () => void;
}) {
  return (
    <div className="space-y-0.5">
      {items.map((item) => {
        const baseClass =
          "flex items-center justify-between gap-2 px-3 py-2 text-[0.84rem] transition-colors duration-200";
        const activeClass = "text-[rgba(226,201,146,0.98)]";
        const inactiveClass =
          "text-[rgba(210,200,185,0.62)] hover:text-[rgba(226,201,146,0.88)]";

        const content = (
          <>
            <span className="flex items-center gap-2">
              {item.isActive && (
                <span className="h-3.5 w-[2px] shrink-0 rounded-full bg-[rgba(201,169,110,0.88)]" />
              )}
              {item.label}
            </span>
            {item.badge && (
              <span className="rounded-full border border-[rgba(201,169,110,0.20)] px-2 py-0.5 text-[0.58rem] uppercase tracking-[0.12em] text-[rgba(201,169,110,0.65)]">
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
              className={`${baseClass} ${item.isActive ? activeClass : inactiveClass}`}
            >
              {content}
            </Link>
          );
        }
        return (
          <div key={item.label} className={`${baseClass} ${inactiveClass} cursor-default`}>
            {content}
          </div>
        );
      })}
    </div>
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
    <div className="flex h-full flex-col">
      <div className="px-5 pb-3 pt-6">
        <Link
          href="/home"
          onClick={onNavigate}
          className="font-serif text-[1.75rem] tracking-[0.20em] text-[rgba(240,232,218,0.96)]"
        >
          KAYA
        </Link>
        <p className="mt-1 text-[0.58rem] uppercase tracking-[0.26em] leading-relaxed text-[rgba(171,140,84,0.55)]">
          Навчальний
          <br />
          кабінет
        </p>
      </div>

      <div className="flex-1 space-y-5 overflow-y-auto px-3 py-3">
        <section>
          <p className="mb-1 px-3 text-[0.58rem] uppercase tracking-[0.22em] text-[rgba(171,140,84,0.40)]">
            Основне
          </p>
          <DashboardNav items={primaryNavigation} onNavigate={onNavigate} />
        </section>
        <section>
          <p className="mb-1 px-3 text-[0.58rem] uppercase tracking-[0.22em] text-[rgba(171,140,84,0.40)]">
            Особисте
          </p>
          <DashboardNav items={secondaryNavigation} onNavigate={onNavigate} />
        </section>
      </div>

      <div className="px-4 pb-5 pt-3">
        <div className="mb-3 flex items-center gap-3 px-1 py-2">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[rgba(201,169,110,0.28)] bg-[rgba(201,169,110,0.10)] font-serif text-[0.95rem] text-[rgba(226,201,146,0.96)]">
            {displayName.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="truncate text-[0.88rem] text-[rgba(240,232,218,0.92)]">{displayName}</p>
            <p className="text-[0.60rem] uppercase tracking-[0.18em] text-[rgba(171,140,84,0.64)]">
              Учень
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={onLogout}
          disabled={isSigningOut}
          className="flex w-full items-center justify-center gap-2 py-2 text-[0.70rem] uppercase tracking-[0.18em] text-[rgba(210,200,185,0.46)] transition-colors duration-200 hover:text-[rgba(226,201,146,0.80)] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSigningOut ? "Вихід..." : "Вийти"} <span>→</span>
        </button>
      </div>
    </div>
  );
}

function StatTile({ item }: { item: StatItem }) {
  return (
    <article
      className="group relative overflow-hidden rounded-[20px] border border-[rgba(201,169,110,0.12)] p-4 transition-all duration-300 hover:-translate-y-1 hover:border-[rgba(201,169,110,0.34)] hover:shadow-[0_0_22px_rgba(180,130,60,0.16),0_6px_24px_rgba(0,0,0,0.28)]"
      style={{ background: "linear-gradient(150deg, rgba(38,28,18,0.76), rgba(12,11,14,0.72))" }}
    >
      <HoverGlow />
      <Rings size={32} offset={6} />
      <div className="relative z-10">
        <p className="text-[0.62rem] uppercase tracking-[0.18em] text-[rgba(171,140,84,0.70)]">
          {item.label}
        </p>
        <p className="mt-2 font-serif text-[2rem] leading-none text-[rgba(226,201,146,0.98)]">
          {item.value}
        </p>
        <p className="mt-2 text-[0.82rem] leading-6 text-[rgba(210,200,185,0.52)]">{item.hint}</p>
      </div>
    </article>
  );
}

export default function DashboardPage() {
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
    for (let i = 0; i < 130; i++) {
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
    <div className="relative min-h-screen bg-[var(--bg)] text-[var(--text)]">
      <div ref={starfieldRef} className="starfield" aria-hidden="true" />

      {/* Top glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 z-0 h-[480px]"
        style={{
          background:
            "radial-gradient(ellipse 80% 50% at 60% 0%, rgba(180,130,60,0.20), transparent 70%)",
        }}
      />

      {/* Mobile header */}
      <header className="sticky top-0 z-40 border-b border-[rgba(201,169,110,0.08)] bg-[rgba(10,10,12,0.94)] backdrop-blur md:hidden">
        <div className="mx-auto flex max-w-[1380px] items-center justify-between px-4 py-4 sm:px-6">
          <Link href="/home" className="font-serif text-[1.6rem] tracking-[0.20em] text-[rgba(240,232,218,0.94)]">
            KAYA
          </Link>
          <button
            type="button"
            onClick={() => setMobileNavOpen(true)}
            className="rounded-xl border border-[rgba(201,169,110,0.22)] px-3 py-2 text-[0.70rem] uppercase tracking-[0.16em] text-[rgba(201,169,110,0.90)]"
          >
            Меню
          </button>
        </div>
      </header>

      <div className="relative z-10 mx-auto flex min-h-screen max-w-[1380px]">
        {/* Sidebar */}
        <aside className="hidden w-[150px] shrink-0 py-6 md:block lg:w-[165px]">
          <div className="sticky top-6 h-[calc(100vh-48px)]">
            <SidebarContent
              displayName={displayName}
              onLogout={handleLogout}
              isSigningOut={isSigningOut}
            />
          </div>
        </aside>

        <main className="min-w-0 flex-1 px-4 pb-14 pt-6 sm:px-5 md:px-6 lg:pb-16 lg:pt-8">
          <div className="flex flex-col gap-4">

            {/* ── Рядок 1: Hero + Stats ── */}
            <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">

              {/* Hero */}
              <article
                className="group relative overflow-hidden rounded-[24px] border border-[rgba(201,169,110,0.14)] px-6 py-7 transition-all duration-300 hover:-translate-y-1 hover:border-[rgba(201,169,110,0.34)] hover:shadow-[0_0_28px_rgba(180,130,60,0.16),0_8px_32px_rgba(0,0,0,0.28)] sm:px-8 sm:py-8 xl:col-span-7"
                style={{ background: "linear-gradient(150deg, rgba(60,42,22,0.75), rgba(18,15,18,0.80))" }}
              >
                <HoverGlow />
                <Rings size={60} offset={12} />
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute left-[-20px] top-[-30px] h-[160px] w-[200px]"
                  style={{ background: "radial-gradient(circle, rgba(180,130,60,0.18), transparent 65%)" }}
                />
                <div className="relative z-10">
                  <p className="text-[0.62rem] uppercase tracking-[0.24em] text-[rgba(171,140,84,0.72)]">
                    Навчальний кабінет
                  </p>
                  <h1 className="mt-4 font-serif text-[2.4rem] leading-[1.05] text-[rgba(240,232,218,0.98)] sm:text-[2.8rem] xl:text-[3.1rem]">
                    Вітаємо, {displayName}
                  </h1>
                  <p className="mt-5 max-w-[40rem] text-[0.92rem] leading-7 text-[rgba(220,210,196,0.70)]">
                    {heroSubtitle}
                  </p>

                  {/* Hero links */}
                  <div className="mt-7 flex flex-wrap gap-4">
                    <Link
                      href="/courses"
                      className="inline-flex items-center gap-2 border-b border-[rgba(201,169,110,0.30)] pb-0.5 text-[0.76rem] uppercase tracking-[0.16em] text-[rgba(226,201,146,0.88)] transition-colors duration-200 hover:border-[rgba(201,169,110,0.60)] hover:text-[rgba(226,201,146,1)]"
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-[rgba(201,169,110,0.75)]" />
                      Продовжити навчання
                    </Link>
                    <Link
                      href="/dashboard/progress"
                      className="inline-flex items-center gap-2 border-b border-[rgba(201,169,110,0.30)] pb-0.5 text-[0.76rem] uppercase tracking-[0.16em] text-[rgba(226,201,146,0.88)] transition-colors duration-200 hover:border-[rgba(201,169,110,0.60)] hover:text-[rgba(226,201,146,1)]"
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-[rgba(201,169,110,0.75)]" />
                      Мій прогрес
                    </Link>
                  </div>

                  <div className="mt-6 inline-flex items-center gap-2 text-[0.68rem] uppercase tracking-[0.14em] text-[rgba(210,200,185,0.48)]">
                    <span className="h-1.5 w-1.5 rounded-full bg-[rgba(201,169,110,0.70)]" />
                    Твій простір для навчання вже готовий
                  </div>
                </div>
              </article>

              {/* Stats 2×2 */}
              <div className="grid grid-cols-2 gap-3 xl:col-span-5">
                {stats.map((item) => (
                  <StatTile key={item.label} item={item} />
                ))}
              </div>
            </div>

            {/* ── Рядок 2: Продовжити навчання + Розклад ── */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

              {/* Продовжити навчання */}
              <article
                className="group relative overflow-hidden rounded-[24px] border border-[rgba(201,169,110,0.13)] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-[rgba(201,169,110,0.34)] hover:shadow-[0_0_28px_rgba(180,130,60,0.16),0_8px_32px_rgba(0,0,0,0.28)] sm:p-7"
                style={{ background: "linear-gradient(150deg, rgba(50,36,20,0.72), rgba(14,13,16,0.76))" }}
              >
                <HoverGlow />
                <Rings size={52} offset={12} />
                <div className="relative z-10">
                  <p className="text-[0.62rem] uppercase tracking-[0.22em] text-[rgba(171,140,84,0.70)]">
                    Продовжити навчання
                  </p>
                  <h2 className="mt-3 font-serif text-[1.9rem] leading-tight text-[rgba(240,232,218,0.96)]">
                    Поки що курс не обрано
                  </h2>
                  <p className="mt-3 text-[0.90rem] leading-6 text-[rgba(210,200,185,0.66)]">
                    Почни з каталогу курсів. Після вибору тут з'явиться твій поточний урок і домашні завдання.
                  </p>
                  <div className="mt-6">
                    <OutlineButton href="/courses">Перейти до курсів</OutlineButton>
                  </div>
                </div>
              </article>

              {/* Розклад */}
              <article
                className="group relative overflow-hidden rounded-[24px] border border-[rgba(201,169,110,0.12)] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-[rgba(201,169,110,0.34)] hover:shadow-[0_0_28px_rgba(180,130,60,0.16),0_8px_32px_rgba(0,0,0,0.28)] sm:p-7"
                style={{ background: "linear-gradient(150deg, rgba(36,30,22,0.66), rgba(12,12,15,0.72))" }}
              >
                <HoverGlow />
                <Rings size={52} offset={12} />
                <div className="relative z-10">
                  <p className="text-[0.62rem] uppercase tracking-[0.22em] text-[rgba(171,140,84,0.70)]">
                    Розклад
                  </p>
                  <h2 className="mt-3 font-serif text-[1.9rem] leading-tight text-[rgba(240,232,218,0.96)]">
                    Найближче заняття
                  </h2>
                  <p className="mt-3 text-[0.90rem] leading-6 text-[rgba(210,200,185,0.66)]">
                    Після старту курсу тут з'явиться дата й час твого наступного уроку з куратором.
                  </p>
                  <div className="mt-5">
                    <p className="text-[0.62rem] uppercase tracking-[0.14em] text-[rgba(171,140,84,0.60)]">
                      Статус
                    </p>
                    <p className="mt-1 text-[0.86rem] leading-6 text-[rgba(210,200,185,0.56)]">
                      Занять поки не заплановано.
                    </p>
                  </div>
                  <div className="mt-6">
                    <DotLink href="/dashboard">Переглянути розклад</DotLink>
                  </div>
                </div>
              </article>
            </div>

            {/* ── Рядок 3: Каталог курсів + Мій прогрес ── */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

              {/* Каталог курсів */}
              <Link
                href="/courses"
                className="group relative flex flex-col overflow-hidden rounded-[24px] border border-[rgba(201,169,110,0.12)] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-[rgba(201,169,110,0.34)] hover:shadow-[0_0_28px_rgba(180,130,60,0.16),0_8px_32px_rgba(0,0,0,0.28)] sm:p-7"
                style={{ background: "linear-gradient(150deg, rgba(38,28,18,0.68), rgba(12,11,14,0.74))" }}
              >
                <HoverGlow />
                <Rings size={52} offset={10} />
                <div className="relative z-10 flex flex-1 flex-col">
                  <p className="text-[0.62rem] uppercase tracking-[0.20em] text-[rgba(171,140,84,0.70)]">
                    Навчання
                  </p>
                  <h3 className="mt-3 font-serif text-[1.75rem] leading-tight text-[rgba(240,232,218,0.96)]">
                    Каталог курсів
                  </h3>
                  <p className="mt-3 text-[0.88rem] leading-6 text-[rgba(210,200,185,0.64)]">
                    Обери свій перший курс з історії України або світу і побудуй власний маршрут навчання.
                  </p>
                  <div className="mt-auto flex items-center justify-between pt-6">
                    <span className="inline-flex items-center gap-2 text-[0.74rem] uppercase tracking-[0.16em] text-[rgba(226,201,146,0.88)]">
                      <span className="h-1.5 w-1.5 rounded-full bg-[rgba(201,169,110,0.75)]" />
                      Відкрити
                    </span>
                    <span className="text-[0.9rem] text-[rgba(201,169,110,0.60)] transition-transform duration-300 group-hover:translate-x-1">
                      →
                    </span>
                  </div>
                </div>
              </Link>

              {/* Мій прогрес */}
              <Link
                href="/dashboard/progress"
                className="group relative flex flex-col overflow-hidden rounded-[24px] border border-[rgba(201,169,110,0.12)] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-[rgba(201,169,110,0.34)] hover:shadow-[0_0_28px_rgba(180,130,60,0.16),0_8px_32px_rgba(0,0,0,0.28)] sm:p-7"
                style={{ background: "linear-gradient(150deg, rgba(36,28,18,0.66), rgba(12,11,14,0.74))" }}
              >
                <HoverGlow />
                <Rings size={52} offset={10} />
                <div className="relative z-10 flex flex-1 flex-col">
                  <p className="text-[0.62rem] uppercase tracking-[0.20em] text-[rgba(171,140,84,0.70)]">
                    Аналітика
                  </p>
                  <h3 className="mt-3 font-serif text-[1.75rem] leading-tight text-[rgba(240,232,218,0.96)]">
                    Мій прогрес
                  </h3>
                  <p className="mt-3 text-[0.88rem] leading-6 text-[rgba(210,200,185,0.64)]">
                    Детальна статистика навчання: бали за тести, пройдені теми, активність по днях.
                  </p>
                  <div className="mt-auto flex items-center justify-between pt-6">
                    <span className="inline-flex items-center gap-2 text-[0.74rem] uppercase tracking-[0.16em] text-[rgba(226,201,146,0.88)]">
                      <span className="h-1.5 w-1.5 rounded-full bg-[rgba(201,169,110,0.75)]" />
                      Відкрити
                    </span>
                    <span className="text-[0.9rem] text-[rgba(201,169,110,0.60)] transition-transform duration-300 group-hover:translate-x-1">
                      →
                    </span>
                  </div>
                </div>
              </Link>
            </div>

            {/* ── Рядок 4: Рекомендовані кроки ── */}
            <article
              className="group relative overflow-hidden rounded-[24px] border border-[rgba(201,169,110,0.10)] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-[rgba(201,169,110,0.28)] hover:shadow-[0_0_22px_rgba(180,130,60,0.12),0_6px_24px_rgba(0,0,0,0.24)] sm:p-7"
              style={{ background: "linear-gradient(150deg, rgba(30,26,20,0.56), rgba(12,12,15,0.62))" }}
            >
              <HoverGlow />
              <Rings size={52} offset={12} />
              <div className="relative z-10">
                <p className="text-[0.62rem] uppercase tracking-[0.22em] text-[rgba(171,140,84,0.70)]">
                  Рекомендовані кроки
                </p>
                <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
                  {onboardingSteps.map((step, index) => (
                    <div
                      key={step}
                      className="flex items-start gap-3 rounded-[16px] border border-[rgba(201,169,110,0.08)] bg-[rgba(255,255,255,0.016)] px-4 py-3.5"
                    >
                      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-[rgba(201,169,110,0.22)] text-[0.76rem] text-[rgba(201,169,110,0.88)]">
                        {index + 1}
                      </div>
                      <p className="pt-0.5 text-[0.88rem] leading-6 text-[rgba(210,200,185,0.68)]">
                        {step}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </article>

          </div>
        </main>
      </div>

      {/* Mobile drawer */}
      {mobileNavOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <button
            type="button"
            aria-label="Закрити меню"
            onClick={() => setMobileNavOpen(false)}
            className="absolute inset-0 bg-black/70"
          />
          <div className="absolute right-0 top-0 h-full w-[80vw] max-w-[320px] bg-[rgba(10,10,12,0.98)] backdrop-blur">
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