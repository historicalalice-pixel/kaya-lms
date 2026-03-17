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

type FeatureTile = {
  href: string;
  eyebrow: string;
  title: string;
  description: string;
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
  {
    label: "Прогрес",
    value: "0%",
    hint: "З'явиться після старту першого курсу",
  },
  {
    label: "Уроків завершено",
    value: "0",
    hint: "Тут буде видно твій темп навчання",
  },
  {
    label: "Середній бал",
    value: "—",
    hint: "З'явиться після перших тестів",
  },
  {
    label: "Активні завдання",
    value: "0",
    hint: "Нових дедлайнів поки немає",
  },
];

const featureTiles: FeatureTile[] = [
  {
    href: "/courses",
    eyebrow: "Навчання",
    title: "Каталог курсів",
    description: "Обери свій перший курс і побудуй навчальний маршрут у KAYA.",
  },
  {
    href: "/home",
    eyebrow: "Навігація",
    title: "Як працює KAYA",
    description: "Переглянь головну сторінку платформи й зрозумій логіку простору та навчання.",
  },
];

const onboardingSteps = [
  "Обери перший курс у каталозі.",
  "Переглянь, як побудований простір KAYA.",
  "Після старту тут з'являться уроки, результати й завдання.",
];

function GlowButton({
  href,
  children,
  variant = "secondary",
}: {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "secondary";
}) {
  const isPrimary = variant === "primary";

  return (
    <Link
      href={href}
      className={[
        "group relative inline-flex min-h-[52px] items-center justify-center overflow-hidden rounded-2xl border px-5 text-[0.78rem] uppercase tracking-[0.18em] transition-all duration-300",
        "hover:-translate-y-0.5 hover:shadow-[0_16px_34px_rgba(0,0,0,0.28)]",
        isPrimary
          ? "border-[rgba(210,176,112,0.34)] text-[rgba(234,206,146,0.96)]"
          : "border-[rgba(210,176,112,0.14)] text-[rgba(235,229,219,0.82)]",
      ].join(" ")}
    >
      <span
        aria-hidden="true"
        className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background: isPrimary
            ? "radial-gradient(circle at 50% 50%, rgba(210,176,112,0.18), transparent 60%), linear-gradient(180deg, rgba(210,176,112,0.06), rgba(255,255,255,0.015))"
            : "radial-gradient(circle at 50% 50%, rgba(210,176,112,0.12), transparent 60%), linear-gradient(180deg, rgba(210,176,112,0.04), rgba(255,255,255,0.01))",
        }}
      />
      <span
        aria-hidden="true"
        className="absolute inset-0 opacity-0 blur-xl transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background: "radial-gradient(circle at 50% 50%, rgba(210,176,112,0.18), transparent 52%)",
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
    <div className="space-y-2">
      {items.map((item) => {
        const className = [
          "group flex items-center justify-between gap-3 rounded-[20px] border px-4 py-3 transition-all duration-300",
          item.isActive
            ? "border-[rgba(210,176,112,0.24)] bg-[linear-gradient(90deg,rgba(210,176,112,0.14),rgba(210,176,112,0.04))] text-[rgba(245,239,229,0.96)]"
            : "border-[rgba(210,176,112,0.06)] bg-[rgba(255,255,255,0.015)] text-[rgba(232,228,221,0.76)] hover:border-[rgba(210,176,112,0.16)] hover:bg-[rgba(210,176,112,0.035)] hover:text-[rgba(245,239,229,0.96)]",
        ].join(" ");

        const content = (
          <>
            <span className="text-[0.95rem] leading-6">{item.label}</span>

            {item.badge ? (
              <span className="rounded-full border border-[rgba(210,176,112,0.18)] px-2.5 py-1 text-[0.62rem] uppercase tracking-[0.16em] text-[rgba(234,206,146,0.92)]">
                {item.badge}
              </span>
            ) : (
              <span className="text-[0.95rem] text-[rgba(210,176,112,0.56)] transition-transform duration-300 group-hover:translate-x-0.5">
                →
              </span>
            )}
          </>
        );

        if (item.href) {
          return (
            <Link key={item.label} href={item.href} onClick={onNavigate} className={className}>
              {content}
            </Link>
          );
        }

        return (
          <div key={item.label} className={className}>
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
      <div className="border-b border-[rgba(210,176,112,0.08)] px-5 py-5 sm:px-6">
        <Link
          href="/home"
          onClick={onNavigate}
          className="font-serif text-[1.9rem] tracking-[0.22em] text-[rgba(245,239,229,0.96)]"
        >
          KAYA
        </Link>
        <p className="mt-2 text-[0.66rem] uppercase tracking-[0.28em] text-[rgba(168,137,81,0.76)]">
          Навчальний кабінет
        </p>
      </div>

      <div className="flex-1 space-y-7 overflow-y-auto px-4 py-5 sm:px-5">
        <section className="space-y-3">
          <p className="text-[0.64rem] uppercase tracking-[0.26em] text-[rgba(168,137,81,0.56)]">
            Основне
          </p>
          <DashboardNav items={primaryNavigation} onNavigate={onNavigate} />
        </section>

        <section className="space-y-3">
          <p className="text-[0.64rem] uppercase tracking-[0.26em] text-[rgba(168,137,81,0.56)]">
            Особисте
          </p>
          <DashboardNav items={secondaryNavigation} onNavigate={onNavigate} />
        </section>
      </div>

      <div className="border-t border-[rgba(210,176,112,0.08)] px-4 py-4 sm:px-5">
        <div className="mb-3 flex items-center gap-3 rounded-[22px] border border-[rgba(210,176,112,0.08)] bg-[rgba(255,255,255,0.018)] px-4 py-3.5">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[rgba(210,176,112,0.18)] bg-[rgba(210,176,112,0.08)] font-serif text-[1.12rem] text-[rgba(234,206,146,0.96)]">
            {displayName.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="truncate text-[0.95rem] text-[rgba(245,239,229,0.96)]">{displayName}</p>
            <p className="mt-1 text-[0.66rem] uppercase tracking-[0.22em] text-[rgba(168,137,81,0.76)]">
              Учень
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onLogout}
          disabled={isSigningOut}
          className="flex min-h-[46px] w-full items-center justify-center rounded-[18px] border border-[rgba(210,176,112,0.14)] px-4 text-[0.74rem] uppercase tracking-[0.2em] text-[rgba(232,228,221,0.76)] transition-all duration-300 hover:border-[rgba(210,176,112,0.28)] hover:bg-[rgba(210,176,112,0.04)] hover:text-[rgba(245,239,229,0.96)] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSigningOut ? "Вихід..." : "Вийти"}
        </button>
      </div>
    </div>
  );
}

function StatTile({ item }: { item: StatItem }) {
  return (
    <article className="group relative overflow-hidden rounded-[28px] border border-[rgba(210,176,112,0.10)] bg-[linear-gradient(180deg,rgba(210,176,112,0.05),rgba(255,255,255,0.016))] p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-[rgba(210,176,112,0.18)] sm:p-6">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background:
            "radial-gradient(circle at top right, rgba(210,176,112,0.14), transparent 42%)",
        }}
      />
      <div className="relative z-10">
        <p className="text-[0.68rem] uppercase tracking-[0.18em] text-[rgba(168,137,81,0.84)]">
          {item.label}
        </p>
        <p className="mt-4 font-serif text-[2.1rem] leading-none text-[rgba(234,206,146,0.98)] sm:text-[2.35rem]">
          {item.value}
        </p>
        <p className="mt-3 text-[0.96rem] leading-7 text-[rgba(232,228,221,0.62)]">
          {item.hint}
        </p>
      </div>
    </article>
  );
}

function FeatureTileCard({ tile }: { tile: FeatureTile }) {
  return (
    <Link
      href={tile.href}
      className="group relative overflow-hidden rounded-[30px] border border-[rgba(210,176,112,0.10)] bg-[linear-gradient(180deg,rgba(255,255,255,0.02),rgba(210,176,112,0.045))] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-[rgba(210,176,112,0.22)] hover:shadow-[0_20px_42px_rgba(0,0,0,0.24)] sm:p-7"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background:
            "radial-gradient(circle at 82% 18%, rgba(210,176,112,0.18), transparent 24%), radial-gradient(circle at 15% 100%, rgba(210,176,112,0.08), transparent 34%)",
        }}
      />
      <div
        aria-hidden="true"
        className="absolute right-5 top-5 h-14 w-14 rounded-full border border-[rgba(210,176,112,0.14)] opacity-70 transition-all duration-300 group-hover:scale-110 group-hover:border-[rgba(210,176,112,0.24)]"
      />
      <div
        aria-hidden="true"
        className="absolute right-8 top-8 h-8 w-8 rounded-full border border-[rgba(210,176,112,0.18)] opacity-70 transition-all duration-300 group-hover:rotate-6"
      />

      <div className="relative z-10 flex min-h-[210px] flex-col">
        <p className="text-[0.66rem] uppercase tracking-[0.22em] text-[rgba(168,137,81,0.82)]">
          {tile.eyebrow}
        </p>

        <h3 className="mt-4 font-serif text-[2rem] leading-tight text-[rgba(245,239,229,0.98)]">
          {tile.title}
        </h3>

        <p className="mt-4 text-[1rem] leading-7 text-[rgba(232,228,221,0.74)]">
          {tile.description}
        </p>

        <div className="mt-auto pt-8">
          <div className="flex items-center justify-between">
            <span className="text-[0.78rem] uppercase tracking-[0.18em] text-[rgba(234,206,146,0.96)]">
              Відкрити
            </span>
            <span className="text-[1rem] text-[rgba(234,206,146,0.96)] transition-transform duration-300 group-hover:translate-x-1">
              →
            </span>
          </div>
        </div>
      </div>
    </Link>
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

    for (let i = 0; i < 120; i += 1) {
      const star = document.createElement("div");
      star.classList.add("star");

      const randomSize = Math.random();
      if (randomSize < 0.55) star.classList.add("star--small");
      else if (randomSize < 0.85) star.classList.add("star--medium");
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
    const supabase = createClient();

    const loadUser = async () => {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (error || !user) {
        router.replace("/login");
        return;
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("full_name")
        .eq("id", user.id)
        .single();

      const fallbackName = user.email?.split("@")[0] ?? "Учень";
      setDisplayName(profile?.full_name?.trim() || fallbackName);
      setIsLoadingUser(false);
    };

    loadUser();
  }, [router]);

  const heroSubtitle = useMemo(() => {
    if (isLoadingUser) {
      return "Завантажуємо твій навчальний простір.";
    }

    return "Тут збиратиметься твій особистий шлях у KAYA: курси, прогрес, результати та наступні кроки.";
  }, [isLoadingUser]);

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

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 z-0 h-[380px]"
        style={{
          background:
            "radial-gradient(circle at top, rgba(210,176,112,0.14), transparent 58%)",
        }}
      />

      <header className="sticky top-0 z-40 border-b border-[rgba(210,176,112,0.08)] bg-[rgba(10,10,12,0.94)] backdrop-blur md:hidden">
        <div className="mx-auto flex max-w-[1340px] items-center justify-between px-4 py-4 sm:px-6">
          <Link
            href="/home"
            className="font-serif text-[1.7rem] tracking-[0.2em] text-[rgba(245,239,229,0.94)]"
          >
            KAYA
          </Link>

          <button
            type="button"
            onClick={() => setMobileNavOpen(true)}
            className="rounded-2xl border border-[rgba(210,176,112,0.16)] px-3.5 py-2.5 text-[0.72rem] uppercase tracking-[0.16em] text-[rgba(234,206,146,0.96)]"
          >
            Меню
          </button>
        </div>
      </header>

      <div className="relative z-10 mx-auto flex min-h-screen max-w-[1340px] gap-8 md:px-8 lg:gap-10 lg:px-10">
        <aside className="hidden w-[250px] shrink-0 py-8 md:block">
          <div className="sticky top-8 h-[calc(100vh-64px)] overflow-hidden rounded-[30px] border border-[rgba(210,176,112,0.10)] bg-[rgba(10,10,12,0.88)] shadow-[0_18px_60px_rgba(0,0,0,0.28)] backdrop-blur">
            <SidebarContent
              displayName={displayName}
              onLogout={handleLogout}
              isSigningOut={isSigningOut}
            />
          </div>
        </aside>

        <main className="min-w-0 flex-1 px-4 pb-12 pt-8 sm:px-6 sm:pb-14 sm:pt-10 md:px-0 lg:pb-16 lg:pt-12">
          <section
            className="relative overflow-hidden rounded-[34px] border border-[rgba(210,176,112,0.12)] px-6 py-7 sm:px-8 sm:py-8 lg:px-10 lg:py-10"
            style={{
              background:
                "linear-gradient(180deg, rgba(54,38,23,0.56), rgba(18,16,18,0.58))",
            }}
          >
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  "radial-gradient(circle at 25% 10%, rgba(210,176,112,0.12), transparent 26%), radial-gradient(circle at 85% 18%, rgba(210,176,112,0.14), transparent 28%), radial-gradient(circle at 50% 100%, rgba(210,176,112,0.06), transparent 34%)",
              }}
            />

            <div className="relative z-10 max-w-4xl">
              <p className="text-[0.7rem] uppercase tracking-[0.24em] text-[rgba(168,137,81,0.84)]">
                Навчальний кабінет
              </p>

              <h1 className="mt-5 font-serif text-[2.5rem] leading-[0.95] text-[rgba(245,239,229,0.98)] sm:text-[3rem] xl:text-[3.45rem]">
                Вітаємо, {displayName}
              </h1>

              <p className="mt-6 max-w-[52rem] text-[1rem] leading-8 text-[rgba(236,231,222,0.76)] sm:text-[1.05rem]">
                {heroSubtitle}
              </p>
            </div>

            <div className="relative z-10 mt-8 flex flex-col gap-3 sm:flex-row">
              <GlowButton href="/courses" variant="primary">
                Обрати курс
              </GlowButton>

              <GlowButton href="/home" variant="secondary">
                Як працює KAYA
              </GlowButton>
            </div>

            <div className="relative z-10 mt-8 inline-flex items-center gap-3 rounded-full border border-[rgba(210,176,112,0.12)] bg-[rgba(255,255,255,0.02)] px-4 py-2.5 text-[0.76rem] uppercase tracking-[0.16em] text-[rgba(232,228,221,0.68)]">
              <span className="h-2 w-2 rounded-full bg-[rgba(234,206,146,0.96)]" />
              Твій простір для навчання вже готовий
            </div>
          </section>

          <section className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {stats.map((item) => (
              <StatTile key={item.label} item={item} />
            ))}
          </section>

          <section className="mt-8 grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1.35fr)_minmax(320px,0.65fr)]">
            <article
              className="relative overflow-hidden rounded-[32px] border border-[rgba(210,176,112,0.12)] p-6 sm:p-7 lg:p-8"
              style={{
                background:
                  "linear-gradient(180deg, rgba(47,34,23,0.54), rgba(16,15,17,0.56))",
              }}
            >
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0"
                style={{
                  background:
                    "radial-gradient(circle at 88% 18%, rgba(210,176,112,0.12), transparent 26%)",
                }}
              />

              <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                <div className="max-w-2xl">
                  <p className="text-[0.7rem] uppercase tracking-[0.22em] text-[rgba(168,137,81,0.84)]">
                    Продовжити навчання
                  </p>

                  <h2 className="mt-4 font-serif text-[2rem] leading-tight text-[rgba(245,239,229,0.98)] sm:text-[2.35rem]">
                    Поки що курс не обрано
                  </h2>

                  <p className="mt-4 text-[1rem] leading-8 text-[rgba(236,231,222,0.74)]">
                    Почни з каталогу курсів. Після вибору тут з'являться найближчий урок,
                    домашні завдання, результати тестів і твій прогрес.
                  </p>
                </div>

                <div className="w-full rounded-[24px] border border-[rgba(210,176,112,0.10)] bg-[rgba(255,255,255,0.02)] px-4 py-4 lg:w-[260px] lg:shrink-0">
                  <p className="text-[0.66rem] uppercase tracking-[0.18em] text-[rgba(168,137,81,0.76)]">
                    Наступний крок
                  </p>
                  <p className="mt-3 text-[0.96rem] leading-7 text-[rgba(236,231,222,0.84)]">
                    Обери свій перший курс і активуй маршрут навчання.
                  </p>
                </div>
              </div>

              <div className="relative z-10 mt-8 flex flex-col gap-3 sm:flex-row">
                <GlowButton href="/courses" variant="primary">
                  Перейти до курсів
                </GlowButton>

                <GlowButton href="/home" variant="secondary">
                  Як працює KAYA
                </GlowButton>
              </div>
            </article>

            <article className="rounded-[32px] border border-[rgba(210,176,112,0.10)] bg-[linear-gradient(180deg,rgba(34,27,22,0.52),rgba(14,14,16,0.56))] p-6 sm:p-7 lg:p-8">
              <p className="text-[0.7rem] uppercase tracking-[0.22em] text-[rgba(168,137,81,0.84)]">
                Остання активність
              </p>

              <div className="mt-5 rounded-[24px] border border-[rgba(210,176,112,0.08)] bg-[linear-gradient(180deg,rgba(210,176,112,0.04),rgba(255,255,255,0.015))] px-5 py-5">
                <p className="text-[0.68rem] uppercase tracking-[0.16em] text-[rgba(168,137,81,0.84)]">
                  Щойно
                </p>
                <p className="mt-3 text-[1rem] leading-8 text-[rgba(236,231,222,0.78)]">
                  Твій акаунт готовий. Після старту курсу тут з'являтиметься історія
                  навчання, активні завдання й результати.
                </p>
              </div>

              <div className="mt-6">
                <p className="text-[0.78rem] uppercase tracking-[0.16em] text-[rgba(168,137,81,0.74)]">
                  Стан
                </p>
                <p className="mt-2 text-[0.98rem] leading-7 text-[rgba(232,228,221,0.66)]">
                  Простір налаштований. Можна починати.
                </p>
              </div>
            </article>
          </section>

          <section className="mt-8 grid grid-cols-1 gap-5 lg:grid-cols-2">
            {featureTiles.map((tile) => (
              <FeatureTileCard key={tile.title} tile={tile} />
            ))}
          </section>

          <section className="mt-8 rounded-[32px] border border-[rgba(210,176,112,0.10)] bg-[linear-gradient(180deg,rgba(32,27,22,0.46),rgba(12,13,15,0.56))] p-6 sm:p-7 lg:p-8">
            <p className="text-[0.7rem] uppercase tracking-[0.22em] text-[rgba(168,137,81,0.84)]">
              Рекомендовані кроки
            </p>

            <div className="mt-6 grid grid-cols-1 gap-3 lg:grid-cols-3">
              {onboardingSteps.map((step, index) => (
                <div
                  key={step}
                  className="flex items-start gap-3 rounded-[24px] border border-[rgba(210,176,112,0.08)] bg-[rgba(255,255,255,0.018)] px-4 py-4"
                >
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[rgba(210,176,112,0.18)] text-[0.82rem] text-[rgba(234,206,146,0.96)]">
                    {index + 1}
                  </div>
                  <p className="pt-0.5 text-[0.96rem] leading-7 text-[rgba(232,228,221,0.76)]">
                    {step}
                  </p>
                </div>
              ))}
            </div>
          </section>
        </main>
      </div>

      {mobileNavOpen ? (
        <div className="fixed inset-0 z-50 md:hidden">
          <button
            type="button"
            aria-label="Закрити меню"
            onClick={() => setMobileNavOpen(false)}
            className="absolute inset-0 bg-black/70"
          />
          <div className="absolute right-0 top-0 h-full w-[88vw] max-w-[360px] border-l border-[rgba(210,176,112,0.10)] bg-[rgba(10,10,12,0.98)] backdrop-blur">
            <SidebarContent
              displayName={displayName}
              onNavigate={() => setMobileNavOpen(false)}
              onLogout={handleLogout}
              isSigningOut={isSigningOut}
            />
          </div>
        </div>
      ) : null}
    </div>
  );
}