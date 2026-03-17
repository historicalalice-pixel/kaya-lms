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

function Rings({ size = 48, offset = 10 }: { size?: number; offset?: number }) {
  const inner = Math.round(size * 0.52);
  const innerOffset = offset + Math.round((size - inner) / 2);

  return (
    <>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute rounded-full border border-[rgba(201,169,110,0.12)] transition-all duration-300 group-hover:scale-110 group-hover:border-[rgba(201,169,110,0.22)]"
        style={{ right: offset, top: offset, width: size, height: size }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute rounded-full border border-[rgba(201,169,110,0.09)] opacity-70 transition-all duration-300 group-hover:scale-110 group-hover:border-[rgba(201,169,110,0.18)]"
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
          "radial-gradient(ellipse 60% 52% at 50% 42%, rgba(180,130,60,0.10), transparent 72%)",
      }}
    />
  );
}

function DotLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-2 text-[0.72rem] uppercase tracking-[0.14em] text-[rgba(226,201,146,0.86)] transition-colors duration-200 hover:text-[rgba(226,201,146,1)]"
    >
      <span className="h-1.5 w-1.5 rounded-full bg-[rgba(201,169,110,0.74)]" />
      {children}
    </Link>
  );
}

function OutlineButton({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link
      href={href}
      className="group/btn relative inline-flex min-h-[44px] items-center justify-center overflow-hidden rounded-[15px] border border-[rgba(201,169,110,0.28)] px-4 sm:px-5 text-[0.74rem] uppercase tracking-[0.12em] text-[rgba(201,169,110,0.92)] transition-all duration-300 hover:-translate-y-0.5 hover:border-[rgba(201,169,110,0.50)] hover:text-[rgba(226,201,146,1)]"
      style={{ background: "rgba(255,255,255,0.025)" }}
    >
      <span
        aria-hidden="true"
        className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover/btn:opacity-100"
        style={{
          background:
            "radial-gradient(circle at 50% 50%, rgba(201,169,110,0.10), transparent 60%)",
        }}
      />
      <span className="relative z-10">{children}</span>
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
          "border border-[rgba(201,169,110,0.14)] bg-[linear-gradient(90deg,rgba(201,169,110,0.11),rgba(201,169,110,0.02))] text-[rgba(240,232,218,0.96)]";
        const inactiveClass =
          "border border-transparent text-[rgba(214,204,190,0.66)] hover:border-[rgba(201,169,110,0.08)] hover:bg-[rgba(255,255,255,0.02)] hover:text-[rgba(226,201,146,0.92)]";

        const content = (
          <>
            <span className="flex min-w-0 items-center gap-2.5">
              {isActive ? (
                <span className="h-4 w-[2px] shrink-0 rounded-full bg-[rgba(201,169,110,0.86)]" />
              ) : (
                <span className="h-4 w-[2px] shrink-0 rounded-full bg-transparent" />
              )}
              <span className="truncate">{item.label}</span>
            </span>

            {item.badge && (
              <span className="shrink-0 rounded-full border border-[rgba(201,169,110,0.18)] px-2 py-0.5 text-[0.58rem] uppercase tracking-[0.10em] text-[rgba(201,169,110,0.62)]">
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
    <div className="overflow-hidden rounded-[28px] border border-[rgba(201,169,110,0.10)] bg-[rgba(8,8,10,0.74)] shadow-[0_14px_40px_rgba(0,0,0,0.26)] backdrop-blur-md">
      <div className="px-5 pb-4 pt-6 sm:px-6">
        <Link
          href="/home"
          onClick={onNavigate}
          className="font-serif text-[1.85rem] tracking-[0.16em] text-[rgba(240,232,218,0.96)]"
        >
          KAYA
        </Link>

        <p className="mt-2 text-[0.60rem] uppercase leading-relaxed tracking-[0.22em] text-[rgba(171,140,84,0.56)]">
          Навчальний
          <br />
          кабінет
        </p>
      </div>

      <div className="space-y-6 px-4 py-4 sm:px-5">
        <section>
          <p className="mb-2 px-3 text-[0.62rem] uppercase tracking-[0.18em] text-[rgba(171,140,84,0.42)]">
            Основне
          </p>
          <DashboardNav items={primaryNavigation} pathname={pathname} onNavigate={onNavigate} />
        </section>

        <section>
          <p className="mb-2 px-3 text-[0.62rem] uppercase tracking-[0.18em] text-[rgba(171,140,84,0.42)]">
            Особисте
          </p>
          <DashboardNav items={secondaryNavigation} pathname={pathname} onNavigate={onNavigate} />
        </section>
      </div>

      <div className="border-t border-[rgba(201,169,110,0.08)] px-4 pb-5 pt-4 sm:px-5">
        <div className="mb-3 flex items-center gap-3 rounded-[18px] border border-[rgba(201,169,110,0.08)] bg-[rgba(255,255,255,0.02)] px-3 py-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[rgba(201,169,110,0.28)] bg-[rgba(201,169,110,0.10)] font-serif text-[1rem] text-[rgba(226,201,146,0.96)]">
            {displayName.charAt(0).toUpperCase()}
          </div>

          <div className="min-w-0">
            <p className="truncate text-[0.92rem] text-[rgba(240,232,218,0.92)]">{displayName}</p>
            <p className="text-[0.62rem] uppercase tracking-[0.14em] text-[rgba(171,140,84,0.64)]">
              Учень
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onLogout}
          disabled={isSigningOut}
          className="flex w-full items-center justify-center gap-2 rounded-[12px] px-3 py-2.5 text-[0.72rem] uppercase tracking-[0.14em] text-[rgba(210,200,185,0.54)] transition-colors duration-200 hover:bg-[rgba(255,255,255,0.02)] hover:text-[rgba(226,201,146,0.84)] disabled:cursor-not-allowed disabled:opacity-50"
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
      className="group relative min-h-[156px] overflow-hidden rounded-[24px] border border-[rgba(201,169,110,0.12)] p-5 sm:p-6 transition-all duration-300 hover:-translate-y-1 hover:border-[rgba(201,169,110,0.24)] hover:shadow-[0_10px_30px_rgba(0,0,0,0.22)]"
      style={{
        background: "linear-gradient(150deg, rgba(34,26,18,0.72), rgba(10,10,14,0.80))",
      }}
    >
      <HoverGlow />
      <Rings size={34} offset={9} />

      <div className="relative z-10">
        <p className="text-[0.66rem] uppercase tracking-[0.14em] text-[rgba(171,140,84,0.72)]">
          {item.label}
        </p>

        <p className="mt-3 pb-1 font-serif text-[1.95rem] leading-[1.08] tracking-[-0.01em] text-[rgba(226,201,146,0.98)] sm:text-[2.15rem]">
          {item.value}
        </p>

        <p className="mt-2 max-w-[24ch] text-[0.88rem] leading-6 text-[rgba(220,210,196,0.68)]">
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
  minHeightClassName = "min-h-[220px]",
}: CardProps) {
  const content = (
    <>
      <HoverGlow />
      <Rings size={48} offset={10} />

      <div className="relative z-10 flex h-full flex-col">
        <p className="text-[0.66rem] uppercase tracking-[0.14em] text-[rgba(171,140,84,0.74)]">
          {eyebrow}
        </p>

        <h2
          className={[
            "mt-3 pb-1 font-serif text-[1.9rem] leading-[1.08] tracking-[-0.015em] text-[rgba(240,232,218,0.96)] sm:text-[2.1rem]",
            titleClassName ?? "",
          ].join(" ")}
        >
          {title}
        </h2>

        <p className="mt-3 max-w-[44rem] text-[0.98rem] leading-7 text-[rgba(220,210,196,0.76)]">
          {description}
        </p>

        {children}

        {footer ? <div className="mt-auto pt-7">{footer}</div> : null}
      </div>
    </>
  );

  const classes = `group relative overflow-hidden rounded-[28px] border border-[rgba(201,169,110,0.12)] p-6 shadow-[0_12px_34px_rgba(0,0,0,0.22)] transition-all duration-300 hover:-translate-y-1 hover:border-[rgba(201,169,110,0.24)] sm:p-7 ${minHeightClassName}`;

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
        className="pointer-events-none absolute inset-x-0 top-0 z-0 h-[460px]"
        style={{
          background:
            "radial-gradient(ellipse 75% 50% at 58% 0%, rgba(180,130,60,0.15), transparent 72%)",
        }}
      />

      <header className="sticky top-0 z-40 border-b border-[rgba(201,169,110,0.08)] bg-[rgba(10,10,12,0.94)] backdrop-blur xl:hidden">
        <div className="mx-auto flex max-w-[1600px] items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <Link
            href="/home"
            className="font-serif text-[1.6rem] tracking-[0.18em] text-[rgba(240,232,218,0.94)]"
          >
            KAYA
          </Link>

          <button
            type="button"
            onClick={() => setMobileNavOpen(true)}
            className="rounded-[12px] border border-[rgba(201,169,110,0.22)] px-3 py-2 text-[0.70rem] uppercase tracking-[0.14em] text-[rgba(201,169,110,0.90)]"
          >
            Меню
          </button>
        </div>
      </header>

      <div className="relative z-10 mx-auto max-w-[1600px] px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10 xl:px-10 2xl:px-12">
        <div className="grid grid-cols-1 items-start gap-6 xl:grid-cols-[280px_minmax(0,1fr)] xl:gap-8">
          <aside className="hidden xl:block">
            <div className="sticky top-8">
              <SidebarContent
                displayName={displayName}
                pathname={pathname}
                onLogout={handleLogout}
                isSigningOut={isSigningOut}
              />
            </div>
          </aside>

          <main className="min-w-0">
            <div className="space-y-6 lg:space-y-8">
              <div className="grid grid-cols-1 gap-6 2xl:grid-cols-[minmax(0,1.45fr)_minmax(420px,0.95fr)]">
                <article
                  className="group relative min-h-[290px] overflow-hidden rounded-[30px] border border-[rgba(201,169,110,0.14)] px-6 py-7 shadow-[0_14px_40px_rgba(0,0,0,0.24)] transition-all duration-300 hover:-translate-y-1 hover:border-[rgba(201,169,110,0.24)] sm:px-7 sm:py-8 lg:px-8 lg:py-9"
                  style={{
                    background: "linear-gradient(150deg, rgba(54,38,22,0.74), rgba(14,12,16,0.84))",
                  }}
                >
                  <HoverGlow />
                  <Rings size={56} offset={12} />

                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute left-[-28px] top-[-36px] h-[180px] w-[220px]"
                    style={{
                      background:
                        "radial-gradient(circle, rgba(180,130,60,0.13), transparent 66%)",
                    }}
                  />

                  <div className="relative z-10">
                    <p className="text-[0.66rem] uppercase tracking-[0.16em] text-[rgba(171,140,84,0.74)]">
                      Навчальний кабінет
                    </p>

                    <h1 className="mt-4 max-w-[10ch] pb-1 font-serif text-[clamp(2.55rem,4.2vw,4.25rem)] leading-[1.02] tracking-[-0.02em] text-[rgba(240,232,218,0.98)]">
                      Вітаємо, {displayName}
                    </h1>

                    <p className="mt-4 max-w-2xl text-[0.98rem] leading-8 text-[rgba(220,210,196,0.78)] sm:mt-5 sm:text-[1rem]">
                      {heroSubtitle}
                    </p>

                    <div className="mt-6 flex flex-wrap gap-x-6 gap-y-3 sm:mt-7">
                      <Link
                        href="/courses"
                        className="inline-flex items-center gap-2 border-b border-[rgba(201,169,110,0.28)] pb-0.5 text-[0.74rem] uppercase tracking-[0.12em] text-[rgba(226,201,146,0.90)] transition-colors duration-200 hover:border-[rgba(201,169,110,0.58)] hover:text-[rgba(226,201,146,1)]"
                      >
                        <span className="h-1.5 w-1.5 rounded-full bg-[rgba(201,169,110,0.75)]" />
                        Продовжити навчання
                      </Link>

                      <Link
                        href="/dashboard/progress"
                        className="inline-flex items-center gap-2 border-b border-[rgba(201,169,110,0.28)] pb-0.5 text-[0.74rem] uppercase tracking-[0.12em] text-[rgba(226,201,146,0.90)] transition-colors duration-200 hover:border-[rgba(201,169,110,0.58)] hover:text-[rgba(226,201,146,1)]"
                      >
                        <span className="h-1.5 w-1.5 rounded-full bg-[rgba(201,169,110,0.75)]" />
                        Мій прогрес
                      </Link>
                    </div>

                    <div className="mt-6 inline-flex items-center gap-2 text-[0.68rem] uppercase tracking-[0.10em] text-[rgba(210,200,185,0.52)]">
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

              <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
                <InfoCard
                  eyebrow="Продовжити навчання"
                  title="Поки що курс не обрано"
                  description="Почни з каталогу курсів. Після вибору тут з'явиться твій поточний урок і домашні завдання."
                  background="linear-gradient(150deg, rgba(42,30,18,0.70), rgba(12,11,15,0.80))"
                  titleClassName="max-w-[12ch] text-[clamp(1.9rem,2.35vw,2.55rem)]"
                  footer={<OutlineButton href="/courses">Перейти до курсів</OutlineButton>}
                />

                <InfoCard
                  eyebrow="Розклад"
                  title="Найближче заняття"
                  description="Після старту курсу тут з'явиться дата й час твого наступного уроку з куратором."
                  background="linear-gradient(150deg, rgba(34,28,20,0.68), rgba(12,12,15,0.78))"
                  titleClassName="max-w-[11ch] text-[clamp(1.9rem,2.35vw,2.55rem)]"
                  footer={<DotLink href="/dashboard">Переглянути розклад</DotLink>}
                >
                  <div className="mt-5">
                    <p className="text-[0.66rem] uppercase tracking-[0.12em] text-[rgba(171,140,84,0.62)]">
                      Статус
                    </p>
                    <p className="mt-1 text-[0.90rem] leading-6 text-[rgba(220,210,196,0.62)]">
                      Занять поки не заплановано.
                    </p>
                  </div>
                </InfoCard>
              </div>

              <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
                <InfoCard
                  href="/courses"
                  eyebrow="Навчання"
                  title="Каталог курсів"
                  description="Обери свій перший курс з історії України або світу і побудуй власний маршрут навчання."
                  background="linear-gradient(150deg, rgba(36,28,18,0.68), rgba(12,11,14,0.78))"
                  minHeightClassName="min-h-[205px]"
                  titleClassName="text-[clamp(1.75rem,2vw,2.2rem)]"
                  footer={
                    <div className="flex items-center justify-between">
                      <span className="inline-flex items-center gap-2 text-[0.72rem] uppercase tracking-[0.12em] text-[rgba(226,201,146,0.88)]">
                        <span className="h-1.5 w-1.5 rounded-full bg-[rgba(201,169,110,0.75)]" />
                        Відкрити
                      </span>

                      <span className="text-[0.95rem] text-[rgba(201,169,110,0.60)] transition-transform duration-300 group-hover:translate-x-1">
                        →
                      </span>
                    </div>
                  }
                />

                <InfoCard
                  href="/dashboard/progress"
                  eyebrow="Аналітика"
                  title="Мій прогрес"
                  description="Детальна статистика навчання: бали за тести, пройдені теми, активність по днях."
                  background="linear-gradient(150deg, rgba(34,27,18,0.66), rgba(12,11,14,0.78))"
                  minHeightClassName="min-h-[205px]"
                  titleClassName="text-[clamp(1.75rem,2vw,2.2rem)]"
                  footer={
                    <div className="flex items-center justify-between">
                      <span className="inline-flex items-center gap-2 text-[0.72rem] uppercase tracking-[0.12em] text-[rgba(226,201,146,0.88)]">
                        <span className="h-1.5 w-1.5 rounded-full bg-[rgba(201,169,110,0.75)]" />
                        Відкрити
                      </span>

                      <span className="text-[0.95rem] text-[rgba(201,169,110,0.60)] transition-transform duration-300 group-hover:translate-x-1">
                        →
                      </span>
                    </div>
                  }
                />
              </div>

              <article
                className="group relative overflow-hidden rounded-[28px] border border-[rgba(201,169,110,0.10)] p-5 shadow-[0_12px_34px_rgba(0,0,0,0.22)] transition-all duration-300 hover:-translate-y-1 hover:border-[rgba(201,169,110,0.22)] sm:p-6"
                style={{
                  background: "linear-gradient(150deg, rgba(28,24,18,0.58), rgba(12,12,15,0.68))",
                }}
              >
                <HoverGlow />
                <Rings size={48} offset={10} />

                <div className="relative z-10">
                  <p className="text-[0.66rem] uppercase tracking-[0.14em] text-[rgba(171,140,84,0.74)]">
                    Рекомендовані кроки
                  </p>

                  <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-3">
                    {onboardingSteps.map((step, index) => (
                      <div
                        key={step}
                        className="flex min-h-[96px] items-start gap-3 rounded-[18px] border border-[rgba(201,169,110,0.08)] bg-[rgba(255,255,255,0.016)] px-4 py-4"
                      >
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[rgba(201,169,110,0.22)] text-[0.78rem] text-[rgba(201,169,110,0.88)]">
                          {index + 1}
                        </div>

                        <p className="pt-0.5 text-[0.92rem] leading-6 text-[rgba(220,210,196,0.68)]">
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