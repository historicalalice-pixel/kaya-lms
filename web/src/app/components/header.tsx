"use client";

import { useState } from "react";
import Link from "next/link";
import { Sheet } from "@/components/ui";
import { cn } from "@/lib/cn";

type ActivePage = "courses" | "about" | "contacts";

type HeaderProps = {
  activePage?: ActivePage;
  showAuth?: boolean;
  logoHref?: string;
};

const NAV_LINKS: Array<{ href: string; label: string; key: ActivePage }> = [
  { href: "/courses", label: "Курси", key: "courses" },
  { href: "/about", label: "Про нас", key: "about" },
  { href: "/contacts", label: "Контакти", key: "contacts" },
];

export default function Header({
  activePage,
  showAuth = true,
  logoHref = "/home",
}: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      <header className="relative z-20 w-full border-b border-[rgba(201,169,110,0.08)]">
        <div className="flex w-full items-center justify-between px-[clamp(20px,5vw,80px)] py-[18px]">
          {/* Logo */}
          <Link
            href={logoHref}
            className="press font-serif text-2xl tracking-[0.2em] text-[var(--text)] transition-colors duration-[var(--dur-popover)] ease-[var(--ease-out)] hover:text-[var(--gold-light)] md:text-3xl"
          >
            KAYA
          </Link>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-8 md:flex" aria-label="Основна навігація">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.key}
                href={link.href}
                aria-current={activePage === link.key ? "page" : undefined}
                className={cn(
                  "nav-link text-[0.85rem]",
                  activePage === link.key && "text-[var(--gold-light)]"
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Desktop auth */}
          {showAuth ? (
            <div className="hidden items-center gap-4 md:flex">
              <Link href="/login" className="nav-link text-[0.85rem]">
                Увійти
              </Link>
              <Link
                href="/register"
                className="press header-btn ui-hover text-[0.85rem]"
              >
                Реєстрація
              </Link>
            </div>
          ) : null}

          {/* Hamburger — opens Sheet */}
          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            aria-label="Відкрити меню"
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            className="press flex h-10 w-10 flex-col items-center justify-center gap-[6px] rounded-[10px] border border-transparent text-[var(--gold)] outline-none transition-colors duration-[var(--dur-popover)] ease-[var(--ease-out)] focus-visible:ring-2 focus-visible:ring-[rgba(201,169,110,0.6)] md:hidden"
          >
            <span className="block h-px w-[22px] bg-current" aria-hidden="true" />
            <span className="block h-px w-[22px] bg-current" aria-hidden="true" />
            <span className="block h-px w-[22px] bg-current" aria-hidden="true" />
          </button>
        </div>
      </header>

      {/* Mobile menu — Sheet handles focus-trap, ESC, scroll-lock, slide animation */}
      <Sheet
        open={menuOpen}
        onClose={closeMenu}
        side="right"
        title="Меню"
        width={320}
      >
        <div id="mobile-menu" className="flex flex-col gap-2">
          <p className="mb-2 font-sans text-[0.62rem] uppercase tracking-[0.22em] text-[rgba(171,140,84,0.55)]">
            Навігація
          </p>

          <nav className="flex flex-col gap-1" aria-label="Мобільна навігація">
            {NAV_LINKS.map((link) => {
              const active = activePage === link.key;
              return (
                <Link
                  key={link.key}
                  href={link.href}
                  onClick={closeMenu}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "press rounded-[10px] px-3 py-3 font-serif text-[1.4rem] tracking-[0.04em] transition-colors duration-[var(--dur-popover)] ease-[var(--ease-out)]",
                    active
                      ? "bg-[rgba(201,169,110,0.08)] text-[var(--gold-light)]"
                      : "text-[var(--text)] hover:bg-[rgba(201,169,110,0.06)] hover:text-[var(--gold-light)]"
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {showAuth ? (
            <>
              <div className="my-4 h-px w-full bg-[rgba(201,169,110,0.14)]" aria-hidden="true" />

              <div className="flex flex-col gap-3">
                <Link
                  href="/login"
                  onClick={closeMenu}
                  className="press ui-hover inline-flex h-12 w-full items-center justify-center rounded-[12px] border border-[rgba(201,169,110,0.22)] bg-[rgba(255,255,255,0.02)] font-sans text-[0.78rem] uppercase tracking-[0.22em] text-[rgba(223,217,207,0.85)] transition-[color,border-color,background-color] duration-[var(--dur-popover)] ease-[var(--ease-out)] hover:border-[rgba(227,196,136,0.7)] hover:bg-[rgba(201,169,110,0.06)]"
                >
                  Увійти
                </Link>
                <Link
                  href="/register"
                  onClick={closeMenu}
                  className="press ui-hover inline-flex h-12 w-full items-center justify-center rounded-[12px] border border-[rgba(201,169,110,0.5)] bg-[rgba(201,169,110,0.05)] font-sans text-[0.78rem] uppercase tracking-[0.22em] text-[rgba(245,239,230,0.96)] transition-[color,border-color,background-color,box-shadow] duration-[var(--dur-popover)] ease-[var(--ease-out)] hover:border-[rgba(227,196,136,0.92)] hover:bg-[rgba(201,169,110,0.09)] hover:shadow-[0_10px_26px_rgba(201,169,110,0.08)]"
                >
                  Реєстрація
                </Link>
              </div>
            </>
          ) : null}
        </div>
      </Sheet>
    </>
  );
}
