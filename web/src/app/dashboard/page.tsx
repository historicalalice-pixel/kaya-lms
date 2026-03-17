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

const recommendedSteps = [
  "Обери перший курс у каталозі.",
  "Переглянь, як побудований простір KAYA.",
  "Після старту тут з'являться уроки, результати й завдання.",
];

function Rings({ size = 40, offset = 10 }: { size?: number; offset?: number }) {
  const inner = Math.round(size * 0.54);
  const innerOffset = offset + Math.round((size - inner) / 2);

  return (
    <>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute rounded-full border border-[rgba(201,169,110,0.10)] transition-all duration-200 group-hover:scale-[1.05] group-hover:border-[rgba(201,169,110,0.16)]"
        style={{ top: offset, right: offset, width: size, height: size }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute rounded-full border border-[rgba(201,169,110,0.07)] transition-all duration-200 group-hover:scale-[1.05] group-hover:border-[rgba(201,169,110,0.12)]"
        style={{ top: innerOffset, right: innerOffset, width: inner, height: inner }}
      />
    </>
  );
}

function HoverGlow() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-200 group-hover:opacity-100"
      style={{
        background:
          "radial-gradient(ellipse at 50% 40%, rgba(180,130,60,0.07), transparent 72%)",
      }}
    />
  );
}

function ActionButton({
  href,
  children,
  variant = "outline",
}: {
  href: string;
  children: ReactNode;
  variant?: "outline" | "ghost";
}) {
  if (variant === "ghost") {
    return (
      <Link
        href={href}
        className="inline-flex min-h-[36px] items-center justify-center rounded-[12px] border border-[rgba(201,169,110,0.18)] px-[18px] text-[0.68rem] uppercase tracking-[0.10em] text-[rgba(226,201,146,0.86)] transition-all duration-200 hover:border-[rgba(201,169,110,0.30)] hover:bg-[rgba(201,169,110,0.04)] hover:text-[rgba(226,201,146,1)]"
      >
        {children}
      </Link>
    );
  }

  return (
    <Link
      href={href}
      className="inline-flex min-h-[36px] items-center justify-center rounded-[12px] border border-[rgba(201,169,110,0.28)] bg-[rgba(201,169,110,0.06)] px-[18px] text-[0.68rem] uppercase tracking-[0.10em] text-[rgba(226,201,146,0.92)] transition-all duration-200 hover:border-[rgba(201,169,110,0.42)] hover:bg-[rgba(201,169,110,0.09)]"
    >
      {children}
    </Link>
  );
}

function TextAction({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-2 text-[0.68rem] uppercase tracking-[0.10em] text-[rgba(226,201,146,0.88)] transition-colors duration-200 hover:text-[rgba(226,201,146,1)]"
    >
      <span className="h-1.5 w-1.5 rounded-full bg-[rgba(201,169,110,0.74)]" />
      {children}
    </Link>
  );
}

function NavSectionLabel({ children }: { children: ReactNode }) {
  return (
    <p className="mb-2 px-4 text-[0.52rem] uppercase tracking-[0.16em] text-[rgba(171,140,84,0.35)]">
      {children}
    </p>
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

        const content = (
          <>
            <span className="flex min-w-0 items-center gap-2">
              <span
                className={`h-4 w-[2px] shrink-0 rounded-full ${
                  active ? "bg-[rgba(201,169,110,0.84)]" : "bg-transparent"
                }`}
              />
              <span className="truncate">{item.label}</span>
            </span>

            {item.badge ? (
              <span className="shrink-0 rounded-full border border-[rgba(201,169,110,0.18)] px-2 py-0.5 text-[0.52rem] uppercase tracking-[0.06em] text-[rgba(201,169,110,0.62)]">
                {item.badge}
              </span>
            ) : null}
          </>
        );

        const className = [
          "flex items-center justify-between gap-2 rounded-[12px] px-4 py-[7px] text-[0.82rem] transition-all duration-200",
          active
            ? "bg-[linear-gradient(90deg,rgba(201,169,110,0.10),rgba(201,169,110,0.02))] text-[rgba(240,232,218,0.96)]"
            : "text-[rgba(214,204,190,0.60)] hover:bg-[rgba(255,255,255,0.02)] hover:text-[rgba(226,201,146,0.90)]",
        ].join(" ");

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

function ProfileBadge({
  displayName,
  onNavigate,
}: {
  displayName: string;
  onNavigate?: () => void;
}) {
  return (
    <Link
      href="/dashboard/profile"
      onClick={onNavigate}
      className="block rounded-[16px] border border-[rgba(201,169,110,0.08)] bg-[rgba(255,255,255,0.02)] px-4 py-4 transition-colors duration-200 hover:border-[rgba(201,169,110,0.16)] hover:bg-[rgba(255,255,255,0.03)]"
    >
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[rgba(201,169,110,0.28)] bg-[rgba(201,169,110,0.10)] font-serif text-[0.96rem] text-[rgba(226,201,146,0.96)]">
          {displayName.charAt(0).toUpperCase()}
        </div>

        <div className="min-w-0">
          <p className="truncate text-[0.82rem] text-[rgba(240,232,218,0.92)]">{displayName}</p>
          <p className="text-[0.56rem] uppercase tracking-[0.12em] text-[rgba(171,140,84,0.64)]">
            Учень
          </p>
        </div>
      </div>
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
  return (
    <div className="flex h-full min-h-screen flex-col justify-between border-r border-[rgba(201,169,110,0.08)] bg-[rgba(8,8,10,0.90)] px-0 py-6">
      <div>
        <div className="px-4">
          <Link
            href="/home"
            onClick={onNavigate}
            className="font-serif text-[1.4rem] leading-none tracking-[0.14em] text-[rgba(240,232,218,0.96)]"
          >
            KAYA
          </Link>

          <p className="mt-3 text-[0.52rem] uppercase leading-[1.6] tracking-[0.14em] text-[rgba(171,140,84,0.40)]">
            НАВЧАЛЬНИЙ
            <br />
            КАБІНЕТ
          </p>
        </div>

        <div className="mt-6">
          <NavSectionLabel>ОСНОВНЕ</NavSectionLabel>
          <SidebarNav items={primaryNavigation} pathname={pathname} onNavigate={onNavigate} />
        </div>

        <div className="mt-4">
          <NavSectionLabel>ОСОБИСТЕ</NavSectionLabel>
          <SidebarNav items={personalNavigation} pathname={pathname} onNavigate={onNavigate} />
        </div>
      </div>

      <div className="px-4">
        <ProfileBadge displayName={displayName} onNavigate={onNavigate} />

        <button
          type="button"
          onClick={onLogout}
          disabled={isSigningOut}
          className="mt-3 flex w-full items-center justify-center gap-2 text-[0.66rem] uppercase tracking-[0.10em] text-[rgba(210,200,185,0.50)] transition-colors duration-200 hover:text-[rgba(226,201,146,0.84)] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSigningOut ? "Вихід..." : "Вийти"} <span>→</span>
        </button>
      </div>
    </div>
  );
}

function CardShell({
  children,
  background,
  className = "",
}: {
  children: ReactNode;
  background: string;
  className?: string;
}) {
  return (
    <article
      className={`group relative overflow-hidden rounded-[20px] border border-[rgba(201,169,110,0.12)] ${className}`}
      style={{ background }}
    >
      <HoverGlow />
      <Rings />
      {children}
    </article>
  );
}

function StatTile({ item }: { item: StatItem }) {
  return (
    <CardShell
      background="linear-gradient(150deg, rgba(30,22,14,0.80), rgba(10,10,14,0.85))"
      className="min-h-[118px] px-[18px] py-4"
    >
      <div className="relative z-10 text-left">
        <p className="text-[0.56rem] uppercase tracking-[0.10em] text-[rgba(171,140,84,0.65)]">
          {item.label}
        </p>
        <p className="mt-1.5 font-serif text-[1.6rem] leading-none text-[rgba(226,201,146,0.96)]">
          {item.value}
        </p>
        <p className="mt-2 text-[0.74rem] leading-[1.5] text-[rgba(220,210,196,0.55)]">
          {item.hint}
        </p>
      </div>
    </CardShell>
  );
}

function InfoCard({
  eyebrow,
  title,
  description,
  button,
  children,
}: {
  eyebrow: string;
  title: string;
  description: string;
  button?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <CardShell
      background="linear-gradient(150deg, rgba(40,28,16,0.78), rgba(12,10,14,0.86))"
      className="min-h-[182px] px-[26px] py-6"
    >
      <div className="relative z-10">
        <p className="text-[0.58rem] uppercase tracking-[0.16em] text-[rgba(171,140,84,0.70)]">
          {eyebrow}
        </p>

        <h3 className="mt-2 font-serif text-[1.6rem] leading-[1.2] text-[rgba(240,232,218,0.96)]">
          {title}
        </h3>

        <p className="mt-3 max-w-[44ch] text-[0.84rem] leading-[1.7] text-[rgba(220,210,196,0.68)]">
          {description}
        </p>

        {children}

        {button ? <div className="mt-4">{button}</div> : null}
      </div>
    </CardShell>
  );
}

function FeatureCard({
  eyebrow,
  title,
  description,
  action,
  href,
}: {
  eyebrow: string;
  title: string;
  description: string;
  action: string;
  href: string;
}) {
  return (
    <Link href={href} className="block">
      <CardShell
        background="linear-gradient(150deg, rgba(40,28,16,0.78), rgba(12,10,14,0.86))"
        className="min-h-[176px] px-[26px] py-6 transition-transform duration-200 hover:-translate-y-[1px]"
      >
        <div className="relative z-10">
          <p className="text-[0.58rem] uppercase tracking-[0.16em] text-[rgba(171,140,84,0.70)]">
            {eyebrow}
          </p>

          <h3 className="mt-2 font-serif text-[1.5rem] leading-[1.2] text-[rgba(240,232,218,0.96)]">
            {title}
          </h3>

          <p className="mt-3 max-w-[42ch] text-[0.84rem] leading-[1.7] text-[rgba(220,210,196,0.68)]">
            {description}
          </p>

          <div className="mt-4">
            <TextAction href={href}>{action}</TextAction>
          </div>
        </div>
      </CardShell>
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

    for (let i = 0; i < 130; i += 1) {
      const star = document.createElement("div");
      star.classList.add("star");

      const r = Math.random();
      if (r < 0.55) star.classList.add("star--small");
      else if (r < 0.85) star.classList.add("star--medium");
      else star.classList.add("star--large");

      const opacity = 0.35 + Math.random() * 0.45;

      star.style.left = `${Math.random() * 100}%`;
      star.style.top = `${Math.random() * 100}%`;
      star.style.setProperty("--dur", `${2 + Math.random() * 5}s`);
      star.style.setProperty("--delay", `${Math.random() * 7}s`);
      star.style.setProperty("--star-opacity", opacity.toFixed(2));

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
    <div className="relative min-h-screen overflow-x-hidden bg-[#0a0a0c] text-[var(--text)]">
      <div ref={starfieldRef} className="starfield" aria-hidden="true" />

      <header className="sticky top-0 z-40 border-b border-[rgba(201,169,110,0.08)] bg-[rgba(8,8,10,0.94)] backdrop-blur xl:hidden">
        <div className="flex items-center justify-between px-4 py-3.5 sm:px-5">
          <Link
            href="/home"
            className="font-serif text-[1.25rem] leading-none tracking-[0.14em] text-[rgba(240,232,218,0.96)]"
          >
            KAYA
          </Link>

          <button
            type="button"
            onClick={() => setMobileNavOpen(true)}
            className="rounded-[10px] border border-[rgba(201,169,110,0.22)] px-3 py-1.5 text-[0.66rem] uppercase tracking-[0.10em] text-[rgba(201,169,110,0.90)]"
          >
            Меню
          </button>
        </div>
      </header>

      <div className="grid min-h-screen grid-cols-1 xl:grid-cols-[120px_1fr] xl:gap-0">
        <aside className="hidden xl:block">
          <SidebarContent
            displayName={displayName}
            pathname={pathname}
            onLogout={handleLogout}
            isSigningOut={isSigningOut}
          />
        </aside>

        <main className="px-4 py-4 sm:px-5 sm:py-5 lg:px-6 lg:py-6 xl:px-7 xl:py-6">
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1fr_280px]">
              <CardShell
                background="linear-gradient(135deg, rgba(48,34,18,0.85), rgba(12,10,14,0.90))"
                className="min-h-[200px] px-7 py-7"
              >
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0"
                  style={{
                    background:
                      "radial-gradient(circle at 20% 30%, rgba(180,120,40,0.12), transparent 60%)",
                  }}
                />

                <div className="relative z-10">
                  <p className="text-[0.58rem] uppercase tracking-[0.16em] text-[rgba(171,140,84,0.70)]">
                    НАВЧАЛЬНИЙ КАБІНЕТ
                  </p>

                  <h1 className="mt-3 font-serif text-[2rem] leading-[1.15] text-[rgba(240,232,218,0.98)] sm:text-[2.2rem] xl:text-[2.4rem]">
                    Вітаємо, {displayName}
                  </h1>

                  <p className="mt-3 max-w-[52ch] text-[0.88rem] leading-[1.7] text-[rgba(220,210,196,0.72)]">
                    {heroSubtitle}
                  </p>

                  <div className="mt-5 flex flex-wrap gap-3">
                    <ActionButton href="/courses">ОБРАТИ КУРС</ActionButton>
                    <ActionButton href="/home" variant="ghost">
                      ЯК ПРАЦЮЄ KAYA
                    </ActionButton>
                  </div>

                  <div className="mt-5 inline-flex items-center gap-2 text-[0.62rem] text-[rgba(210,200,185,0.45)]">
                    <span className="h-1.5 w-1.5 rounded-full bg-[rgba(201,169,110,0.74)]" />
                    <span>Твій простір для навчання вже готовий</span>
                  </div>
                </div>
              </CardShell>

              <div className="grid grid-cols-2 gap-3">
                {stats.map((item) => (
                  <StatTile key={item.label} item={item} />
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-3">
              <InfoCard
                eyebrow="ПРОДОВЖИТИ НАВЧАННЯ"
                title="Поки що курс не обрано"
                description="Почни з каталогу курсів. Після вибору тут з'явиться твій поточний урок і домашні завдання."
                button={<OutlineButton href="/courses">ПЕРЕЙТИ ДО КУРСІВ</OutlineButton>}
              />

              <InfoCard
                eyebrow="РОЗКЛАД"
                title="З'явиться після перших тестів"
                description="Після старту навчання тут з’являтиметься актуальна інформація про розклад та наступні уроки."
                button={<TextAction href="/dashboard">ВІДКРИТИ</TextAction>}
              />

              <InfoCard
                eyebrow="АКТИВНІ ЗАВДАННЯ"
                title="Щойно"
                description="Нові дедлайни, домашні роботи та активні завдання з’являтимуться тут одразу після початку навчання."
                button={<TextAction href="/dashboard/progress">ВІДКРИТИ</TextAction>}
              />
            </div>

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-3">
              <FeatureCard
                eyebrow="НАВЧАННЯ"
                title="Продовжити навчання"
                description="Швидкий перехід до активного курсу, уроків та домашніх завдань."
                action="ПЕРЕЙТИ ДО КУРСІВ"
                href="/courses"
              />

              <FeatureCard
                eyebrow="КАТАЛОГ"
                title="Каталог курсів"
                description="Обери курс з історії України або світу та сформуй власний маршрут навчання."
                action="ВІДКРИТИ"
                href="/courses"
              />

              <FeatureCard
                eyebrow="АНАЛІТИКА"
                title="Мій прогрес"
                description="Бали, пройдені теми, динаміка навчання та загальна активність по днях."
                action="ВІДКРИТИ"
                href="/dashboard/progress"
              />
            </div>

            <CardShell
              background="linear-gradient(150deg, rgba(28,24,18,0.58), rgba(12,12,15,0.68))"
              className="px-[26px] py-6"
            >
              <div className="relative z-10">
                <p className="text-[0.58rem] uppercase tracking-[0.16em] text-[rgba(171,140,84,0.70)]">
                  РЕКОМЕНДОВАНІ КРОКИ
                </p>

                <h3 className="mt-2 font-serif text-[1.5rem] leading-[1.2] text-[rgba(240,232,218,0.96)]">
                  Рекомендовані кроки
                </h3>

                <div className="mt-5 flex flex-col gap-3">
                  {recommendedSteps.map((step, index) => (
                    <div key={step} className="flex items-start gap-3">
                      <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-[rgba(201,169,110,0.22)] text-[0.72rem] text-[rgba(201,169,110,0.88)]">
                        {index + 1}
                      </div>
                      <p className="text-[0.84rem] leading-[1.6] text-[rgba(220,210,196,0.68)]">
                        {step}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </CardShell>
          </div>
        </main>
      </div>

      {mobileNavOpen && (
        <div className="fixed inset-0 z-50 xl:hidden">
          <button
            type="button"
            aria-label="Закрити меню"
            onClick={() => setMobileNavOpen(false)}
            className="absolute inset-0 bg-black/70"
          />

          <div className="absolute left-0 top-0 h-full w-[86vw] max-w-[320px]">
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