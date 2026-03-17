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

function Rings({ size = 42, offset = 10 }: { size?: number; offset?: number }) {
  const inner = Math.round(size * 0.52);
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
        className="pointer-events-none absolute rounded-full border border-[rgba(201,169,110,0.08)] opacity-80 transition-all duration-300 group-hover:scale-105 group-hover:border-[rgba(201,169,110,0.14)]"
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
          "radial-gradient(ellipse 58% 52% at 50% 40%, rgba(180,130,60,0.08), transparent 72%)",
      }}
    />
  );
}

function OutlineButton({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link
      href={href}
      className="inline-flex min-h-[40px] items-center justify-center rounded-[14px] border border-[rgba(201,169,110,0.26)] px-4 text-[0.72rem] uppercase tracking-[0.12em] text-[rgba(226,201,146,0.92)] transition-all duration-200 hover:border-[rgba(201,169,110,0.46)] hover:bg-[rgba(255,255,255,0.02)]"
    >
      {children}
    </Link>
  );
}

function TextLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-2 text-[0.72rem] uppercase tracking-[0.12em] text-[rgba(226,201,146,0.86)] transition-colors duration-200 hover:text-[rgba(226,201,146,1)]"
    >
      <span className="h-1.5 w-1.5 rounded-full bg-[rgba(201,169,110,0.74)]" />
      {children}
    </Link>
  );
}

function DashboardNav({
  items,
  pathname,
  onNavigate,
}: {
  items: NavigationItem[];
  pathname: string;
  onNavigate?: () => void;
}) {
  const isItemActive = (href?: string) => {
    if (!href) return false;
    if (href === "/dashboard") return pathname === "/dashboard";
    return pathname.startsWith(href);
  };

  return (
    <div className="space-y-1">
      {items.map((item) => {
        const isActive = isItemActive(item.href);

        const baseClass =
          "flex items-center justify-between gap-3 rounded-[14px] px-3 py-2.5 text-[0.92rem] transition-all duration-200";
        const activeClass =
          "border border-[rgba(201,169,110,0.12)] bg-[linear-gradient(90deg,rgba(201,169,110,0.10),rgba(201,169,110,0.02))] text-[rgba(240,232,218,0.96)]";
        const inactiveClass =
          "border border-transparent text-[rgba(214,204,190,0.68)] hover:border-[rgba(201,169,110,0.06)] hover:bg-[rgba(255,255,255,0.015)] hover:text-[rgba(226,201,146,0.90)]";

        const content = (
          <>
            <span className="flex min-w-0 items-center gap-2.5">
              {isActive ? (
                <span className="h-4 w-[2px] shrink-0 rounded-full bg-[rgba(201,169,110,0.84)]" />
              ) : (
                <span className="h-4 w-[2px] shrink-0 rounded-full bg-transparent" />
              )}
              <span className="truncate">{item.label}</span>
            </span>

            {item.badge && (
              <span className="shrink-0 rounded-full border border-[rgba(201,169,110,0.18)] px-2 py-0.5 text-[0.56rem] uppercase tracking-[0.08em] text-[rgba(201,169,110,0.62)]">
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
              className={`${baseClass} ${isActive ? activeClass : inactiveClass}`}
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
    <div className="overflow-hidden rounded-[28px] border border-[rgba(201,169,110,0.10)] bg-[rgba(8,8,10,0.76)] shadow-[0_14px_40px_rgba(0,0,0,0.22)] backdrop-blur-md">
      <div className="px-5 pb-4 pt-5 sm:px-6">
        <Link
          href="/home"
          onClick={onNavigate}
          className="font-serif text-[1.7rem] leading-none tracking-[0.14em] text-[rgba(240,232,218,0.96)]"
        >
          KAYA
        </Link>

        <p className="mt-3 text-[0.60rem] uppercase leading-relaxed tracking-[0.18em] text-[rgba(171,140,84,0.56)]">
          Навчальний
          <br />
          кабінет
        </p>
      </div>

      <div className="px-4 pb-4 sm:px-5">
        <section>
          <p className="mb-2 px-3 text-[0.62rem] uppercase tracking-[0.16em] text-[rgba(171,140,84,0.42)]">
            Основне
          </p>
          <DashboardNav items={primaryNavigation} pathname={pathname} onNavigate={onNavigate} />
        </section>
      </div>

      <div className="border-t border-[rgba(201,169,110,0.08)] px-4 pb-5 pt-4 sm:px-5">
        <div className="mb-3">
          <div className="flex items-center justify-between rounded-[16px] border border-[rgba(201,169,110,0.08)] bg-[rgba(255,255,255,0.02)] px-3 py-2.5">
            <span className="text-[0.84rem] text-[rgba(240,232,218,0.88)]">Повідомлення</span>
            <span className="rounded-full border border-[rgba(201,169,110,0.18)] px-2 py-0.5 text-[0.56rem] uppercase tracking-[0.08em] text-[rgba(201,169,110,0.62)]">
              Скоро
            </span>
          </div>
        </div>

        <Link
          href="/dashboard/profile"
          onClick={onNavigate}
          className="mb-3 flex items-center gap-3 rounded-[18px] border border-[rgba(201,169,110,0.08)] bg-[rgba(255,255,255,0.02)] px-3 py-3 transition-colors duration-200 hover:border-[rgba(201,169,110,0.16)] hover:bg-[rgba(255,255,255,0.03)]"
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[rgba(201,169,110,0.28)] bg-[rgba(201,169,110,0.10)] font-serif text-[1rem] text-[rgba(226,201,146,0.96)]">
            {displayName.charAt(0).toUpperCase()}
          </div>

          <div className="min-w-0 flex-1">
            <p className="truncate text-[0.92rem] text-[rgba(240,232,218,0.92)]">{displayName}</p>
            <p className="text-[0.62rem] uppercase tracking-[0.12em] text-[rgba(171,140,84,0.64)]">
              Учень
            </p>
          </div>

          <span className="text-[0.9rem] text-[rgba(201,169,110,0.62)]">→</span>
        </Link>

        <button
          type="button"
          onClick={onLogout}
          disabled={isSigningOut}
          className="flex w-full items-center justify-center gap-2 rounded-[12px] px-3 py-2.5 text-[0.72rem] uppercase tracking-[0.12em] text-[rgba(210,200,185,0.54)] transition-colors duration-200 hover:bg-[rgba(255,255,255,0.02)] hover:text-[rgba(226,201,146,0.84)] disabled:cursor-not-allowed disabled:opacity-50"
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
      className="group relative min-h-[132px] overflow-hidden rounded-[24px] border border-[rgba(201,169,110,0.11)] px-4 py-4 sm:px-5 sm:py-5 transition-all duration-300 hover:border-[rgba(201,169,110,0.20)] hover:shadow-[0_10px_28px_rgba(0,0,0,0.18)]"
      style={{
        background: "linear-gradient(150deg, rgba(32,24,18,0.72), rgba(10,10,14,0.80))",
      }}
    >
      <HoverGlow />
      <Rings size={30} offset={8} />

      <div className="relative z-10 flex h-full flex-col items-center justify-center text-center">
        <p className="text-[0.64rem] uppercase tracking-[0.12em] text-[rgba(171,140,84,0.72)]">
          {item.label}
        </p>

        <p className="mt-2 font-serif text-[1.75rem] leading-[1.18] text-[rgba(226,201,146,0.98)] sm:text-[1.9rem]">
          {item.value}
        </p>

        <p className="mt-2 max-w-[18ch] text-[0.84rem] leading-6 text-[rgba(220,210,196,0.66)]">
          {item.hint}
        </p>
      </div>
    </article>
  );
}

type CardProps = {
  eyebrow: string;
  title: string;
  description: string;
  children?: ReactNode;
  href?: string;
  footer?: ReactNode;
  background: string;
  titleClassName?: string;
  minHeightClassName?: string;
};

function InfoCard({
  eyebrow,
  title,
  description,
  children,
  href,
  footer,
  background,
  titleClassName,
  minHeightClassName = "min-h-[180px]",
}: CardProps) {
  const content = (
    <>
      <HoverGlow />
      <Rings size={42} offset={10} />

      <div className="relative z-10 flex h-full flex-col items-center justify-center text-center">
        <p className="text-[0.64rem] uppercase tracking-[0.12em] text-[rgba(171,140,84,0.74)]">
          {eyebrow}
        </p>

        <h2
          className={[
            "mt-2 max-w-[13ch] font-serif text-[1.62rem] leading-[1.18] text-[rgba(240,232,218,0.96)] sm:text-[1.84rem]",
            titleClassName ?? "",
          ].join(" ")}
        >
          {title}
        </h2>

        <p className="mt-3 max-w-[34ch] text-[0.92rem] leading-7 text-[rgba(220,210,196,0.74)]">
          {description}
        </p>

        {children}

        {footer ? <div className="mt-5">{footer}</div> : null}
      </div>
    </>
  );

  const classes = `group relative overflow-hidden rounded-[26px] border border-[rgba(201,169,110,0.11)] px-5 py-5 shadow-[0_12px_30px_rgba(0,0,0,0.18)] transition-all duration-300 hover:border-[rgba(201,169,110,0.20)] sm:px-6 sm:py-6 ${minHeightClassName}`;

  if (href) {
    return (
      <Link href={href} className={classes} style={{ background }}>
        {content}
      </Link>
    );
  }

  return (
    <article className={classes} style={{ background }}>
      {content}
    </article>
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

    for (let i = 0; i < 130; i += 1) {
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

    return () => stars.forEach((star) => star.remove());
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
    <div className="relative min-h-screen overflow-x-hidden bg-[var(--bg)] text-[var(--text)]">
      <div ref={starfieldRef} className="starfield" aria-hidden="true" />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 z-0 h-[420px]"
        style={{
          background:
            "radial-gradient(ellipse 72% 48% at 58% 0%, rgba(180,130,60,0.14), transparent 72%)",
        }}
      />

      <header className="sticky top-0 z-40 border-b border-[rgba(201,169,110,0.08)] bg-[rgba(10,10,12,0.94)] backdrop-blur xl:hidden">
        <div className="mx-auto flex max-w-[1600px] items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <Link
            href="/home"
            className="font-serif text-[1.5rem] leading-none tracking-[0.16em] text-[rgba(240,232,218,0.94)]"
          >
            KAYA
          </Link>

          <button
            type="button"
            onClick={() => setMobileNavOpen(true)}
            className="rounded-[12px] border border-[rgba(201,169,110,0.22)] px-3 py-2 text-[0.70rem] uppercase tracking-[0.12em] text-[rgba(201,169,110,0.90)]"
          >
            Меню
          </button>
        </div>
      </header>

      <div className="relative z-10 mx-auto max-w-[1540px] px-4 py-5 sm:px-6 sm:py-6 lg:px-8 lg:py-8 xl:px-10">
        <div className="grid grid-cols-1 items-start gap-5 xl:grid-cols-[286px_minmax(0,1fr)] xl:gap-6">
          <aside className="hidden xl:block">
            <div className="sticky top-6">
              <SidebarContent
                displayName={displayName}
                pathname={pathname}
                onLogout={handleLogout}
                isSigningOut={isSigningOut}
              />
            </div>
          </aside>

          <main className="min-w-0">
            <div className="space-y-5">
              <div className="grid grid-cols-1 gap-5 2xl:grid-cols-[minmax(0,1.28fr)_minmax(380px,0.9fr)]">
                <article
                  className="group relative min-h-[248px] overflow-hidden rounded-[28px] border border-[rgba(201,169,110,0.12)] px-5 py-6 shadow-[0_12px_30px_rgba(0,0,0,0.18)] transition-all duration-300 hover:border-[rgba(201,169,110,0.20)] sm:px-6 sm:py-7"
                  style={{
                    background: "linear-gradient(150deg, rgba(50,36,22,0.72), rgba(14,12,16,0.84))",
                  }}
                >
                  <HoverGlow />
                  <Rings size={50} offset={12} />

                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute left-[-28px] top-[-36px] h-[160px] w-[200px]"
                    style={{
                      background:
                        "radial-gradient(circle, rgba(180,130,60,0.10), transparent 66%)",
                    }}
                  />

                  <div className="relative z-10 flex h-full flex-col items-center justify-center text-center">
                    <p className="text-[0.64rem] uppercase tracking-[0.14em] text-[rgba(171,140,84,0.74)]">
                      Навчальний кабінет
                    </p>

                    <h1 className="mt-2 max-w-[8ch] font-serif text-[2.2rem] leading-[1.14] text-[rgba(240,232,218,0.98)] sm:text-[2.6rem] xl:text-[3rem]">
                      Вітаємо, {displayName}
                    </h1>

                    <p className="mt-3 max-w-[34ch] text-[0.96rem] leading-8 text-[rgba(220,210,196,0.78)]">
                      {heroSubtitle}
                    </p>

                    <div className="mt-5 flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
                      <TextLink href="/courses">Продовжити навчання</TextLink>
                      <TextLink href="/dashboard/progress">Мій прогрес</TextLink>
                    </div>

                    <div className="mt-4 inline-flex items-center gap-2 text-[0.66rem] uppercase tracking-[0.10em] text-[rgba(210,200,185,0.52)]">
                      <span className="h-1.5 w-1.5 rounded-full bg-[rgba(201,169,110,0.70)]" />
                      Твій простір для навчання вже готовий
                    </div>
                  </div>
                </article>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {stats.map((item) => (
                    <StatTile key={item.label} item={item} />
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
                <InfoCard
                  eyebrow="Продовжити навчання"
                  title="Поки що курс не обрано"
                  description="Почни з каталогу курсів. Після вибору тут з'явиться твій поточний урок і домашні завдання."
                  background="linear-gradient(150deg, rgba(40,29,18,0.70), rgba(12,11,15,0.80))"
                  titleClassName="max-w-[10ch]"
                  footer={<OutlineButton href="/courses">Перейти до курсів</OutlineButton>}
                />

                <InfoCard
                  eyebrow="Розклад"
                  title="Найближче заняття"
                  description="Після старту курсу тут з'явиться дата й час твого наступного уроку з куратором."
                  background="linear-gradient(150deg, rgba(34,28,20,0.68), rgba(12,12,15,0.78))"
                  titleClassName="max-w-[9ch]"
                  footer={<TextLink href="/dashboard">Переглянути розклад</TextLink>}
                >
                  <div className="mt-4 text-center">
                    <p className="text-[0.64rem] uppercase tracking-[0.12em] text-[rgba(171,140,84,0.62)]">
                      Статус
                    </p>
                    <p className="mt-1 text-[0.88rem] leading-6 text-[rgba(220,210,196,0.62)]">
                      Занять поки не заплановано.
                    </p>
                  </div>
                </InfoCard>
              </div>

              <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
                <InfoCard
                  href="/courses"
                  eyebrow="Навчання"
                  title="Каталог курсів"
                  description="Обери свій перший курс з історії України або світу і побудуй власний маршрут навчання."
                  background="linear-gradient(150deg, rgba(36,28,18,0.68), rgba(12,11,14,0.78))"
                  minHeightClassName="min-h-[170px]"
                  titleClassName="max-w-[11ch] text-[1.55rem] sm:text-[1.72rem]"
                  footer={<TextLink href="/courses">Відкрити</TextLink>}
                />

                <InfoCard
                  href="/dashboard/progress"
                  eyebrow="Аналітика"
                  title="Мій прогрес"
                  description="Детальна статистика навчання: бали за тести, пройдені теми, активність по днях."
                  background="linear-gradient(150deg, rgba(34,27,18,0.66), rgba(12,11,14,0.78))"
                  minHeightClassName="min-h-[170px]"
                  titleClassName="max-w-[10ch] text-[1.55rem] sm:text-[1.72rem]"
                  footer={<TextLink href="/dashboard/progress">Відкрити</TextLink>}
                />
              </div>

              <article
                className="group relative overflow-hidden rounded-[26px] border border-[rgba(201,169,110,0.10)] px-5 py-5 shadow-[0_12px_30px_rgba(0,0,0,0.18)] transition-all duration-300 hover:border-[rgba(201,169,110,0.18)] sm:px-6 sm:py-6"
                style={{
                  background: "linear-gradient(150deg, rgba(28,24,18,0.58), rgba(12,12,15,0.68))",
                }}
              >
                <HoverGlow />
                <Rings size={42} offset={10} />

                <div className="relative z-10 text-center">
                  <p className="text-[0.64rem] uppercase tracking-[0.12em] text-[rgba(171,140,84,0.74)]">
                    Рекомендовані кроки
                  </p>

                  <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-3">
                    {onboardingSteps.map((step, index) => (
                      <div
                        key={step}
                        className="flex min-h-[92px] flex-col items-center justify-center gap-3 rounded-[18px] border border-[rgba(201,169,110,0.08)] bg-[rgba(255,255,255,0.016)] px-4 py-4 text-center"
                      >
                        <div className="flex h-8 w-8 items-center justify-center rounded-full border border-[rgba(201,169,110,0.22)] text-[0.78rem] text-[rgba(201,169,110,0.88)]">
                          {index + 1}
                        </div>

                        <p className="text-[0.90rem] leading-6 text-[rgba(220,210,196,0.68)]">
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
      </div>

      {mobileNavOpen && (
        <div className="fixed inset-0 z-50 xl:hidden">
          <button
            type="button"
            aria-label="Закрити меню"
            onClick={() => setMobileNavOpen(false)}
            className="absolute inset-0 bg-black/70"
          />

          <div className="absolute right-0 top-0 h-full w-[88vw] max-w-[360px] p-3 sm:p-4">
            <div className="mb-3 flex justify-end">
              <button
                type="button"
                onClick={() => setMobileNavOpen(false)}
                className="rounded-[12px] border border-[rgba(201,169,110,0.18)] bg-[rgba(8,8,10,0.82)] px-3 py-2 text-[0.68rem] uppercase tracking-[0.12em] text-[rgba(201,169,110,0.84)] backdrop-blur"
              >
                Закрити
              </button>
            </div>

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