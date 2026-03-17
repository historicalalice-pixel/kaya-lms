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

type TileLink = {
  href: string;
  eyebrow: string;
  title: string;
  description: string;
  hoverCard: string;
};

const primaryNavigation: NavigationItem[] = [
  { label: "Головна", href: "/dashboard", isActive: true },
  { label: "Курси", href: "/courses" },
  { label: "Карта", href: "/map" },
  { label: "Підтримка", href: "/contacts" },
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

const tileLinks: TileLink[] = [
  {
    href: "/courses",
    eyebrow: "Навчання",
    title: "Каталог курсів",
    description: "Обери курс і побудуй власний маршрут у KAYA.",
    hoverCard: "Після вибору курсу тут почнуть з'являтися прогрес, уроки та результати.",
  },
  {
    href: "/map",
    eyebrow: "Орієнтир",
    title: "Карта подій",
    description: "Переходь до візуального простору тем, епох і зв'язків.",
    hoverCard: "Карта допомагає бачити історію не як список дат, а як цілісну систему.",
  },
  {
    href: "/contacts",
    eyebrow: "Зв'язок",
    title: "Підтримка",
    description: "Постав запитання, якщо щось незрозуміло або потрібна допомога.",
    hoverCard: "Тут можна уточнити організаційні питання, доступи або логіку навчання.",
  },
];

const onboardingSteps = [
  "Відкрий каталог і обери перший курс.",
  "Переглянь карту, щоб побачити зв'язки між темами.",
  "Запусти пробний урок і познайомся з форматом KAYA.",
];

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
          "group flex items-center justify-between gap-3 rounded-[22px] border px-4 py-3 transition-all duration-300",
          item.isActive
            ? "border-[rgba(201,169,110,0.24)] bg-[linear-gradient(90deg,rgba(201,169,110,0.15),rgba(201,169,110,0.04))] text-[var(--text)]"
            : "border-[rgba(201,169,110,0.06)] bg-[rgba(255,255,255,0.015)] text-[rgba(232,228,221,0.72)] hover:border-[rgba(201,169,110,0.16)] hover:bg-[rgba(201,169,110,0.035)] hover:text-[var(--text)]",
        ].join(" ");

        const content = (
          <>
            <span className="text-[0.94rem] leading-6">{item.label}</span>

            {item.badge ? (
              <span className="rounded-full border border-[rgba(201,169,110,0.18)] px-2.5 py-1 text-[0.6rem] uppercase tracking-[0.18em] text-[rgba(201,169,110,0.86)]">
                {item.badge}
              </span>
            ) : (
              <span className="text-[0.95rem] text-[rgba(201,169,110,0.54)] transition-transform duration-300 group-hover:translate-x-0.5">
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
      <div className="border-b border-[rgba(201,169,110,0.08)] px-5 py-5 sm:px-6">
        <Link
          href="/home"
          onClick={onNavigate}
          className="font-serif text-[1.9rem] tracking-[0.24em] text-[rgba(245,239,230,0.96)]"
        >
          KAYA
        </Link>
        <p className="mt-2 text-[0.66rem] uppercase tracking-[0.34em] text-[rgba(138,116,68,0.74)]">
          Навчальний кабінет
        </p>
      </div>

      <div className="flex-1 space-y-7 overflow-y-auto px-4 py-5 sm:px-5">
        <section className="space-y-3">
          <p className="text-[0.64rem] uppercase tracking-[0.32em] text-[rgba(138,116,68,0.56)]">
            Основне
          </p>
          <DashboardNav items={primaryNavigation} onNavigate={onNavigate} />
        </section>

        <section className="space-y-3">
          <p className="text-[0.64rem] uppercase tracking-[0.32em] text-[rgba(138,116,68,0.56)]">
            Особисте
          </p>
          <DashboardNav items={secondaryNavigation} onNavigate={onNavigate} />
        </section>
      </div>

      <div className="border-t border-[rgba(201,169,110,0.08)] px-4 py-4 sm:px-5">
        <div className="mb-3 flex items-center gap-3 rounded-[22px] border border-[rgba(201,169,110,0.08)] bg-[rgba(255,255,255,0.018)] px-4 py-3.5">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[rgba(201,169,110,0.18)] bg-[rgba(201,169,110,0.08)] font-serif text-[1.12rem] text-[var(--gold-light)]">
            {displayName.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="truncate text-[0.95rem] text-[var(--text)]">{displayName}</p>
            <p className="mt-1 text-[0.66rem] uppercase tracking-[0.24em] text-[rgba(138,116,68,0.76)]">
              Учень
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onLogout}
          disabled={isSigningOut}
          className="flex min-h-[46px] w-full items-center justify-center rounded-[18px] border border-[rgba(201,169,110,0.14)] px-4 text-[0.74rem] uppercase tracking-[0.22em] text-[rgba(232,228,221,0.76)] transition-all duration-300 hover:border-[rgba(201,169,110,0.28)] hover:bg-[rgba(201,169,110,0.04)] hover:text-[var(--text)] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSigningOut ? "Вихід..." : "Вийти"}
        </button>
      </div>
    </div>
  );
}

function StatTile({ item }: { item: StatItem }) {
  return (
    <article className="group relative overflow-hidden rounded-[28px] border border-[rgba(201,169,110,0.10)] bg-[linear-gradient(180deg,rgba(201,169,110,0.045),rgba(255,255,255,0.015))] p-5 transition-all duration-300 hover:-translate-y-1 hover:border-[rgba(201,169,110,0.18)] hover:shadow-[0_18px_44px_rgba(0,0,0,0.22)] sm:p-6">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background:
            "radial-gradient(circle at top right, rgba(201,169,110,0.12), transparent 45%)",
        }}
      />
      <div className="relative z-10">
        <p className="text-[0.66rem] uppercase tracking-[0.24em] text-[rgba(138,116,68,0.82)]">
          {item.label}
        </p>
        <p className="mt-4 font-serif text-[2.2rem] leading-none text-[var(--gold-light)] sm:text-[2.5rem]">
          {item.value}
        </p>
        <p className="mt-3 max-w-[16rem] text-[0.92rem] leading-6 text-[rgba(232,228,221,0.58)]">
          {item.hint}
        </p>
      </div>
    </article>
  );
}

function SealTile({ tile }: { tile: TileLink }) {
  return (
    <Link
      href={tile.href}
      className="group relative overflow-hidden rounded-[30px] border border-[rgba(201,169,110,0.10)] bg-[linear-gradient(180deg,rgba(255,255,255,0.02),rgba(201,169,110,0.04))] p-6 transition-all duration-300 hover:-translate-y-1.5 hover:border-[rgba(201,169,110,0.22)] hover:shadow-[0_24px_50px_rgba(0,0,0,0.28)] sm:p-7"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background:
            "radial-gradient(circle at 82% 18%, rgba(201,169,110,0.16), transparent 28%), radial-gradient(circle at 20% 100%, rgba(201,169,110,0.08), transparent 36%)",
        }}
      />

      <div
        aria-hidden="true"
        className="absolute right-5 top-5 h-16 w-16 rounded-full border border-[rgba(201,169,110,0.15)] opacity-70 transition-all duration-300 group-hover:scale-110 group-hover:border-[rgba(201,169,110,0.26)]"
      />
      <div
        aria-hidden="true"
        className="absolute right-8 top-8 h-10 w-10 rounded-full border border-[rgba(201,169,110,0.18)] opacity-70 transition-all duration-300 group-hover:rotate-6"
      />

      <div className="relative z-10 flex h-full min-h-[220px] flex-col">
        <p className="text-[0.64rem] uppercase tracking-[0.28em] text-[rgba(138,116,68,0.8)]">
          {tile.eyebrow}
        </p>

        <h3 className="mt-4 font-serif text-[1.9rem] leading-tight text-[rgba(245,239,230,0.98)]">
          {tile.title}
        </h3>

        <p className="mt-4 max-w-[24rem] text-[0.98rem] leading-7 text-[rgba(232,228,221,0.72)]">
          {tile.description}
        </p>

        <div className="mt-auto pt-8">
          <div className="flex items-center justify-between">
            <span className="text-[0.74rem] uppercase tracking-[0.22em] text-[var(--gold-light)]">
              Відкрити
            </span>
            <span className="text-[1rem] text-[var(--gold-light)] transition-transform duration-300 group-hover:translate-x-1">
              →
            </span>
          </div>

          <div className="mt-4 overflow-hidden rounded-[22px] border border-[rgba(201,169,110,0.10)] bg-[rgba(12,12,14,0.72)] px-4 py-4 transition-all duration-300 sm:translate-y-5 sm:opacity-0 sm:group-hover:translate-y-0 sm:group-hover:opacity-100">
            <p className="text-[0.88rem] leading-6 text-[rgba(232,228,221,0.66)]">
              {tile.hoverCard}
            </p>
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

    return "Тут збиратиметься твій особистий шлях у KAYA: курси, уроки, прогрес, результати та наступні кроки.";
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
            "radial-gradient(circle at top, rgba(201,169,110,0.12), transparent 60%)",
        }}
      />

      <header className="sticky top-0 z-40 border-b border-[rgba(201,169,110,0.08)] bg-[rgba(10,10,12,0.94)] backdrop-blur md:hidden">
        <div className="mx-auto flex max-w-[1380px] items-center justify-between px-4 py-4 sm:px-6">
          <Link
            href="/home"
            className="font-serif text-[1.7rem] tracking-[0.22em] text-[rgba(245,239,230,0.94)]"
          >
            KAYA
          </Link>

          <button
            type="button"
            onClick={() => setMobileNavOpen(true)}
            className="rounded-2xl border border-[rgba(201,169,110,0.16)] px-3.5 py-2.5 text-[0.72rem] uppercase tracking-[0.18em] text-[var(--gold-light)]"
          >
            Меню
          </button>
        </div>
      </header>

      <div className="relative z-10 mx-auto flex min-h-screen max-w-[1380px] gap-8 md:px-8 lg:gap-10 lg:px-10">
        <aside className="hidden w-[248px] shrink-0 py-8 md:block xl:w-[260px]">
          <div className="sticky top-8 h-[calc(100vh-64px)] overflow-hidden rounded-[30px] border border-[rgba(201,169,110,0.10)] bg-[rgba(10,10,12,0.88)] shadow-[0_18px_60px_rgba(0,0,0,0.28)] backdrop-blur">
            <SidebarContent
              displayName={displayName}
              onLogout={handleLogout}
              isSigningOut={isSigningOut}
            />
          </div>
        </aside>

        <main className="min-w-0 flex-1 px-4 pb-12 pt-8 sm:px-6 sm:pb-14 sm:pt-10 md:px-0 md:pr-2 lg:pb-16 lg:pt-12">
          <section className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-12">
            <article className="relative overflow-hidden rounded-[34px] border border-[rgba(201,169,110,0.12)] bg-[linear-gradient(180deg,rgba(201,169,110,0.065),rgba(255,255,255,0.015))] px-6 py-7 sm:px-8 sm:py-8 xl:col-span-8 xl:min-h-[360px] xl:px-10 xl:py-10">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0"
                style={{
                  background:
                    "radial-gradient(circle at 85% 15%, rgba(201,169,110,0.14), transparent 24%), radial-gradient(circle at 20% 100%, rgba(201,169,110,0.07), transparent 34%)",
                }}
              />

              <div className="relative z-10 flex h-full flex-col">
                <div className="max-w-3xl">
                  <p className="text-[0.68rem] uppercase tracking-[0.32em] text-[rgba(138,116,68,0.82)]">
                    Навчальний кабінет
                  </p>

                  <h1 className="mt-5 font-serif text-[2.4rem] leading-[0.94] text-[rgba(245,239,230,0.98)] sm:text-[3rem] xl:text-[3.55rem]">
                    Вітаємо, {displayName}
                  </h1>

                  <p className="mt-6 max-w-[46rem] text-[1rem] leading-8 text-[rgba(232,228,221,0.72)] sm:text-[1.04rem]">
                    {heroSubtitle}
                  </p>
                </div>

                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <Link
                    href="/courses"
                    className="inline-flex min-h-[52px] items-center justify-center rounded-2xl border border-[rgba(201,169,110,0.34)] px-5 text-[0.76rem] uppercase tracking-[0.22em] text-[var(--gold-light)] transition-all duration-300 hover:border-[rgba(201,169,110,0.56)] hover:bg-[rgba(201,169,110,0.06)] hover:text-[var(--text)]"
                  >
                    Обрати курс
                  </Link>

                  <Link
                    href="/dashboard/lesson"
                    className="inline-flex min-h-[52px] items-center justify-center rounded-2xl border border-[rgba(201,169,110,0.12)] px-5 text-[0.76rem] uppercase tracking-[0.22em] text-[rgba(232,228,221,0.76)] transition-all duration-300 hover:border-[rgba(201,169,110,0.26)] hover:bg-[rgba(201,169,110,0.04)] hover:text-[var(--text)]"
                  >
                    Відкрити пробний урок
                  </Link>
                </div>

                <div className="mt-auto pt-8">
                  <div className="inline-flex items-center gap-3 rounded-full border border-[rgba(201,169,110,0.12)] bg-[rgba(255,255,255,0.02)] px-4 py-2.5 text-[0.74rem] uppercase tracking-[0.18em] text-[rgba(232,228,221,0.68)]">
                    <span className="h-2 w-2 rounded-full bg-[var(--gold-light)]" />
                    Твій простір для навчання вже готовий
                  </div>
                </div>
              </div>
            </article>

            {stats.map((item) => (
              <div key={item.label} className="xl:col-span-3">
                <StatTile item={item} />
              </div>
            ))}

            <article className="relative overflow-hidden rounded-[32px] border border-[rgba(201,169,110,0.12)] bg-[linear-gradient(180deg,rgba(201,169,110,0.07),rgba(255,255,255,0.015))] p-6 sm:p-7 xl:col-span-7 xl:min-h-[320px]">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 opacity-80"
                style={{
                  background:
                    "radial-gradient(circle at 88% 18%, rgba(201,169,110,0.12), transparent 26%)",
                }}
              />

              <div className="relative z-10 flex h-full flex-col">
                <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                  <div className="max-w-2xl">
                    <p className="text-[0.68rem] uppercase tracking-[0.28em] text-[rgba(138,116,68,0.82)]">
                      Продовжити навчання
                    </p>

                    <h2 className="mt-4 font-serif text-[2rem] leading-tight text-[rgba(245,239,230,0.98)] sm:text-[2.3rem]">
                      Поки що курс не обрано
                    </h2>

                    <p className="mt-4 text-[0.98rem] leading-7 text-[rgba(232,228,221,0.7)]">
                      Почни з каталогу курсів або відкрий пробний урок, щоб познайомитися з
                      форматом KAYA. Після старту тут з'являться найближчий урок, домашні
                      завдання та твій прогрес.
                    </p>
                  </div>

                  <div className="w-full rounded-[24px] border border-[rgba(201,169,110,0.10)] bg-[rgba(255,255,255,0.018)] px-4 py-4 lg:w-[250px]">
                    <p className="text-[0.66rem] uppercase tracking-[0.24em] text-[rgba(138,116,68,0.72)]">
                      Наступний крок
                    </p>
                    <p className="mt-3 text-[0.95rem] leading-6 text-[rgba(232,228,221,0.82)]">
                      Обери курс або запусти пробний урок, щоб активувати свій маршрут.
                    </p>
                  </div>
                </div>

                <div className="mt-auto flex flex-col gap-3 pt-8 sm:flex-row">
                  <Link
                    href="/courses"
                    className="inline-flex min-h-[50px] items-center justify-center rounded-2xl border border-[rgba(201,169,110,0.34)] px-5 text-[0.76rem] uppercase tracking-[0.22em] text-[var(--gold-light)] transition-all duration-300 hover:border-[rgba(201,169,110,0.56)] hover:bg-[rgba(201,169,110,0.06)] hover:text-[var(--text)]"
                  >
                    Перейти до курсів
                  </Link>

                  <Link
                    href="/dashboard/lesson"
                    className="inline-flex min-h-[50px] items-center justify-center rounded-2xl border border-[rgba(201,169,110,0.12)] px-5 text-[0.76rem] uppercase tracking-[0.22em] text-[rgba(232,228,221,0.76)] transition-all duration-300 hover:border-[rgba(201,169,110,0.26)] hover:bg-[rgba(201,169,110,0.04)] hover:text-[var(--text)]"
                  >
                    Відкрити урок
                  </Link>
                </div>
              </div>
            </article>

            <article className="rounded-[32px] border border-[rgba(201,169,110,0.10)] bg-[rgba(255,255,255,0.015)] p-6 sm:p-7 xl:col-span-5 xl:min-h-[320px]">
              <div className="flex h-full flex-col">
                <p className="text-[0.68rem] uppercase tracking-[0.28em] text-[rgba(138,116,68,0.82)]">
                  Остання активність
                </p>

                <div className="mt-5 rounded-[24px] border border-[rgba(201,169,110,0.08)] bg-[linear-gradient(180deg,rgba(201,169,110,0.04),rgba(255,255,255,0.015))] px-5 py-5">
                  <p className="text-[0.66rem] uppercase tracking-[0.22em] text-[rgba(138,116,68,0.82)]">
                    Щойно
                  </p>
                  <p className="mt-3 text-[1rem] leading-7 text-[rgba(232,228,221,0.76)]">
                    Твій акаунт готовий. Після вибору курсу або старту уроку тут з'являтимуться
                    історія навчання, результати та активні завдання.
                  </p>
                </div>

                <div className="mt-auto pt-6">
                  <p className="text-[0.78rem] uppercase tracking-[0.18em] text-[rgba(138,116,68,0.7)]">
                    Стан
                  </p>
                  <p className="mt-2 text-[0.96rem] leading-6 text-[rgba(232,228,221,0.62)]">
                    Простір налаштований. Можна починати.
                  </p>
                </div>
              </div>
            </article>

            {tileLinks.map((tile) => (
              <div key={tile.href} className="xl:col-span-4">
                <SealTile tile={tile} />
              </div>
            ))}

            <article className="rounded-[32px] border border-[rgba(201,169,110,0.10)] bg-[rgba(255,255,255,0.015)] p-6 sm:p-7 xl:col-span-12">
              <p className="text-[0.68rem] uppercase tracking-[0.28em] text-[rgba(138,116,68,0.82)]">
                Рекомендовані кроки
              </p>

              <div className="mt-6 grid grid-cols-1 gap-3 lg:grid-cols-3">
                {onboardingSteps.map((step, index) => (
                  <div
                    key={step}
                    className="flex items-start gap-3 rounded-[24px] border border-[rgba(201,169,110,0.08)] bg-[rgba(255,255,255,0.018)] px-4 py-4"
                  >
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[rgba(201,169,110,0.18)] text-[0.8rem] text-[var(--gold-light)]">
                      {index + 1}
                    </div>
                    <p className="pt-0.5 text-[0.96rem] leading-7 text-[rgba(232,228,221,0.74)]">
                      {step}
                    </p>
                  </div>
                ))}
              </div>
            </article>
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
          <div className="absolute right-0 top-0 h-full w-[88vw] max-w-[360px] border-l border-[rgba(201,169,110,0.10)] bg-[rgba(10,10,12,0.98)] backdrop-blur">
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