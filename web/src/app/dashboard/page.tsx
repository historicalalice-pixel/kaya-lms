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
  isSoon?: boolean;
};

type StatItem = {
  label: string;
  value: string;
  hint: string;
};

type QuickLink = {
  href: string;
  label: string;
  description: string;
};

const primaryNavigation: NavigationItem[] = [
  { label: "Головна", href: "/dashboard", isActive: true },
  { label: "Курси", href: "/courses" },
  { label: "Карта", href: "/map" },
  { label: "Підтримка", href: "/contacts" },
  { label: "Тести", badge: "Скоро", isSoon: true },
  { label: "Розклад", badge: "Скоро", isSoon: true },
];

const secondaryNavigation: NavigationItem[] = [
  { label: "Профіль", badge: "Скоро", isSoon: true },
  { label: "Повідомлення", badge: "Скоро", isSoon: true },
];

const stats: StatItem[] = [
  { label: "Прогрес", value: "0%", hint: "З'явиться після старту першого курсу" },
  { label: "Завершено уроків", value: "0", hint: "Тут буде видно темп навчання" },
  { label: "Середній бал", value: "—", hint: "З'явиться після перших тестів" },
  { label: "Активні завдання", value: "0", hint: "Нових дедлайнів поки немає" },
];

const recommendedSteps = [
  "Обери свій перший курс у каталозі KAYA.",
  "Переглянь карту, щоб побачити зв'язки між темами й епохами.",
  "Після старту тут з'являться уроки, результати та домашні завдання.",
];

const quickLinks: QuickLink[] = [
  {
    href: "/courses",
    label: "Каталог курсів",
    description: "Обери курс і почни навчання у своєму темпі.",
  },
  {
    href: "/map",
    label: "Карта подій",
    description: "Перейди до візуального маршруту по темах та епохах.",
  },
  {
    href: "/contacts",
    label: "Підтримка",
    description: "Постав запитання, якщо щось незрозуміло.",
  },
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
        const baseClass = [
          "group flex items-center justify-between gap-3 rounded-2xl border px-4 py-3 transition-all duration-300",
          item.isActive
            ? "border-[rgba(201,169,110,0.26)] bg-[linear-gradient(90deg,rgba(201,169,110,0.16),rgba(201,169,110,0.05))] text-[var(--text)] shadow-[inset_0_0_0_1px_rgba(201,169,110,0.05)]"
            : "border-[rgba(201,169,110,0.06)] bg-[rgba(255,255,255,0.015)] text-[rgba(232,228,221,0.76)] hover:border-[rgba(201,169,110,0.16)] hover:bg-[rgba(201,169,110,0.04)] hover:text-[var(--text)]",
        ].join(" ");

        const content = (
          <>
            <div className="min-w-0">
              <span className="block text-[0.94rem] leading-6">{item.label}</span>
            </div>
            {item.badge ? (
              <span className="shrink-0 rounded-full border border-[rgba(201,169,110,0.18)] px-2.5 py-1 text-[0.6rem] uppercase tracking-[0.18em] text-[rgba(201,169,110,0.86)]">
                {item.badge}
              </span>
            ) : (
              <span className="shrink-0 text-[0.95rem] text-[rgba(201,169,110,0.56)] transition-transform duration-300 group-hover:translate-x-0.5">
                →
              </span>
            )}
          </>
        );

        if (item.href) {
          return (
            <Link key={item.label} href={item.href} onClick={onNavigate} className={baseClass}>
              {content}
            </Link>
          );
        }

        return (
          <div key={item.label} className={baseClass}>
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

function StatCard({ item }: { item: StatItem }) {
  return (
    <article className="rounded-[24px] border border-[rgba(201,169,110,0.10)] bg-[linear-gradient(180deg,rgba(201,169,110,0.045),rgba(255,255,255,0.015))] p-5 sm:p-6">
      <div className="h-[1px] w-14 bg-[linear-gradient(90deg,rgba(201,169,110,0.75),rgba(201,169,110,0))]" />
      <p className="mt-4 text-[0.68rem] uppercase tracking-[0.24em] text-[rgba(138,116,68,0.82)]">
        {item.label}
      </p>
      <p className="mt-4 font-serif text-[2.2rem] leading-none text-[var(--gold-light)] sm:text-[2.6rem]">
        {item.value}
      </p>
      <p className="mt-3 max-w-[18rem] text-[0.92rem] leading-6 text-[rgba(232,228,221,0.58)]">
        {item.hint}
      </p>
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

  const heroSubtitle = useMemo(() => {
    if (isLoadingUser) {
      return "Завантажуємо твій кабінет";
    }

    return "Тут збиратиметься твій особистий простір: курси, прогрес, результати та наступні кроки.";
  }, [isLoadingUser]);

  return (
    <div className="relative min-h-screen bg-[var(--bg)] text-[var(--text)]">
      <div ref={starfieldRef} className="starfield" aria-hidden="true" />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 z-0 h-[340px]"
        style={{
          background:
            "radial-gradient(circle at top, rgba(201,169,110,0.12), transparent 60%)",
        }}
      />

      <header className="sticky top-0 z-40 border-b border-[rgba(201,169,110,0.08)] bg-[rgba(10,10,12,0.94)] backdrop-blur md:hidden">
        <div className="mx-auto flex max-w-[1500px] items-center justify-between px-4 py-4 sm:px-6">
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

      <div className="relative z-10 mx-auto flex min-h-screen max-w-[1320px] gap-8 md:px-8 lg:gap-10 lg:px-10 xl:gap-12">
        <aside className="hidden w-[248px] shrink-0 py-8 md:block xl:w-[260px]">
          <div className="sticky top-6 h-[calc(100vh-48px)] overflow-hidden rounded-[30px] border border-[rgba(201,169,110,0.10)] bg-[rgba(10,10,12,0.88)] shadow-[0_18px_60px_rgba(0,0,0,0.28)] backdrop-blur">
            <SidebarContent
              displayName={displayName}
              onLogout={handleLogout}
              isSigningOut={isSigningOut}
            />
          </div>
        </aside>

        <main className="min-w-0 flex-1 px-4 pb-12 pt-8 sm:px-6 sm:pb-14 sm:pt-10 md:px-0 md:pr-2 lg:pb-16 lg:pt-12">
          <section className="rounded-[30px] border border-[rgba(201,169,110,0.10)] bg-[linear-gradient(180deg,rgba(201,169,110,0.055),rgba(255,255,255,0.012))] px-5 py-6 sm:px-7 sm:py-8 lg:px-9 lg:py-9">
            <div className="flex flex-col gap-10">
              <div className="max-w-3xl">
                <p className="mb-4 text-[0.68rem] uppercase tracking-[0.32em] text-[rgba(138,116,68,0.82)]">
                  Навчальний кабінет
                </p>
                <h1 className="font-serif text-[2.25rem] leading-[0.94] text-[rgba(245,239,230,0.98)] sm:text-[2.85rem] lg:text-[3.2rem] xl:text-[3.45rem]">
                  Вітаємо, {displayName}
                </h1>
                <p className="mt-5 max-w-2xl text-[0.98rem] leading-7 text-[rgba(232,228,221,0.72)] sm:text-[1.02rem]">
                  {heroSubtitle}
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row lg:shrink-0">
                <Link
                  href="/courses"
                  className="inline-flex min-h-[50px] items-center justify-center rounded-2xl border border-[rgba(201,169,110,0.34)] px-5 text-[0.76rem] uppercase tracking-[0.22em] text-[var(--gold-light)] transition-all duration-300 hover:border-[rgba(201,169,110,0.56)] hover:bg-[rgba(201,169,110,0.06)] hover:text-[var(--text)]"
                >
                  Обрати курс
                </Link>
                <Link
                  href="/map"
                  className="inline-flex min-h-[50px] items-center justify-center rounded-2xl border border-[rgba(201,169,110,0.12)] px-5 text-[0.76rem] uppercase tracking-[0.22em] text-[rgba(232,228,221,0.76)] transition-all duration-300 hover:border-[rgba(201,169,110,0.26)] hover:bg-[rgba(201,169,110,0.04)] hover:text-[var(--text)]"
                >
                  Відкрити карту
                </Link>
              </div>
            </div>
          </section>

          <section className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 2xl:grid-cols-4">
            {stats.map((item) => (
              <StatCard key={item.label} item={item} />
            ))}
          </section>

         <section className="mt-8 grid grid-cols-1 gap-5">
            <div className="space-y-4">
              <article className="overflow-hidden rounded-[28px] border border-[rgba(201,169,110,0.12)] bg-[linear-gradient(180deg,rgba(201,169,110,0.07),rgba(255,255,255,0.016))] p-5 sm:p-6 lg:p-7">
                <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                  <div className="max-w-2xl">
                    <p className="text-[0.7rem] uppercase tracking-[0.26em] text-[rgba(138,116,68,0.82)]">
                      Продовжити навчання
                    </p>
                    <h2 className="mt-4 font-serif text-[1.9rem] leading-tight text-[rgba(245,239,230,0.98)] sm:text-[2.2rem]">
                      Поки що курс не обрано
                    </h2>
                    <p className="mt-4 text-[0.98rem] leading-7 text-[rgba(232,228,221,0.7)]">
                      Почни з каталогу курсів. Після вибору тут з'являться найближчий урок,
                      домашні завдання та твій прогрес.
                    </p>
                  </div>

                  <div className="rounded-[24px] border border-[rgba(201,169,110,0.10)] bg-[rgba(255,255,255,0.018)] px-4 py-4 lg:min-w-[220px]">
                    <p className="text-[0.66rem] uppercase tracking-[0.24em] text-[rgba(138,116,68,0.72)]">
                      Наступний крок
                    </p>
                    <p className="mt-3 text-[0.96rem] leading-6 text-[rgba(232,228,221,0.82)]">
                      Обери курс і сформуй свій стартовий маршрут у KAYA.
                    </p>
                  </div>
                </div>

                <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                  <Link
                    href="/courses"
                    className="inline-flex min-h-[50px] items-center justify-center rounded-2xl border border-[rgba(201,169,110,0.34)] px-5 text-[0.76rem] uppercase tracking-[0.22em] text-[var(--gold-light)] transition-all duration-300 hover:border-[rgba(201,169,110,0.56)] hover:bg-[rgba(201,169,110,0.06)] hover:text-[var(--text)]"
                  >
                    Перейти до курсів
                  </Link>
                  <Link
                    href="/contacts"
                    className="inline-flex min-h-[50px] items-center justify-center rounded-2xl border border-[rgba(201,169,110,0.12)] px-5 text-[0.76rem] uppercase tracking-[0.22em] text-[rgba(232,228,221,0.76)] transition-all duration-300 hover:border-[rgba(201,169,110,0.26)] hover:bg-[rgba(201,169,110,0.04)] hover:text-[var(--text)]"
                  >
                    Поставити запитання
                  </Link>
                </div>
              </article>

              <article className="rounded-[28px] border border-[rgba(201,169,110,0.10)] bg-[rgba(255,255,255,0.015)] p-5 sm:p-6">
                <p className="text-[0.7rem] uppercase tracking-[0.26em] text-[rgba(138,116,68,0.82)]">
                  Рекомендовані кроки
                </p>
                <div className="mt-5 space-y-3">
                  {recommendedSteps.map((step, index) => (
                    <div
                      key={step}
                      className="flex items-start gap-3 rounded-[22px] border border-[rgba(201,169,110,0.08)] bg-[rgba(255,255,255,0.018)] px-4 py-4"
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
            </div>

            <div className="space-y-4">
              <article className="rounded-[28px] border border-[rgba(201,169,110,0.10)] bg-[rgba(255,255,255,0.015)] p-5 sm:p-6">
                <p className="text-[0.7rem] uppercase tracking-[0.26em] text-[rgba(138,116,68,0.82)]">
                  Остання активність
                </p>
                <div className="mt-5 rounded-[22px] border border-[rgba(201,169,110,0.08)] bg-[linear-gradient(180deg,rgba(201,169,110,0.04),rgba(255,255,255,0.015))] px-4 py-4 sm:px-5">
                  <p className="text-[0.68rem] uppercase tracking-[0.2em] text-[rgba(138,116,68,0.82)]">
                    Щойно
                  </p>
                  <p className="mt-3 text-[0.98rem] leading-7 text-[rgba(232,228,221,0.76)]">
                    Твій акаунт готовий. Обери курс, щоб тут почала з'являтися історія навчання,
                    результати та активні завдання.
                  </p>
                </div>
              </article>

              <article className="rounded-[28px] border border-[rgba(201,169,110,0.10)] bg-[rgba(255,255,255,0.015)] p-5 sm:p-6">
                <p className="text-[0.7rem] uppercase tracking-[0.26em] text-[rgba(138,116,68,0.82)]">
                  Швидкі переходи
                </p>
                <div className="mt-5 grid grid-cols-1 gap-3">
                  {quickLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="group rounded-[22px] border border-[rgba(201,169,110,0.10)] bg-[rgba(255,255,255,0.018)] px-4 py-4 transition-all duration-300 hover:border-[rgba(201,169,110,0.22)] hover:bg-[rgba(201,169,110,0.04)]"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="text-[0.8rem] uppercase tracking-[0.18em] text-[rgba(232,228,221,0.84)]">
                            {link.label}
                          </p>
                          <p className="mt-2 max-w-[22rem] text-[0.92rem] leading-6 text-[rgba(232,228,221,0.58)]">
                            {link.description}
                          </p>
                        </div>
                        <span className="pt-1 text-[1rem] text-[var(--gold-light)] transition-transform duration-300 group-hover:translate-x-0.5">
                          →
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              </article>
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