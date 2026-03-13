"use client";

import { useState } from "react";
import Link from "next/link";

type HeaderProps = {
  activePage?: "courses" | "about" | "contacts";
  showAuth?: boolean;
  logoHref?: string;
};

export default function Header({ activePage, showAuth = true, logoHref = "/home" }: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks = [
    { href: "/courses", label: "Курси", key: "courses" },
    { href: "/about", label: "Про нас", key: "about" },
    { href: "/contacts", label: "Контакти", key: "contacts" },
  ];

  return (
    <>
      <header className="relative z-20 w-full border-b border-[rgba(201,169,110,0.08)]">
        <div
          className="w-full flex items-center justify-between"
          style={{
            paddingLeft: "clamp(20px, 5vw, 80px)",
            paddingRight: "clamp(20px, 5vw, 80px)",
            paddingTop: "18px",
            paddingBottom: "18px",
          }}
        >
          {/* LOGO */}
          <Link
            href={logoHref}
            className="font-serif text-2xl md:text-3xl tracking-[0.2em] text-[var(--text)] hover:text-[var(--gold-light)] transition-colors duration-300"
          >
            KAYA
          </Link>

          {/* DESKTOP NAV */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.key}
                href={link.href}
                className={`nav-link text-[0.85rem] ${
                  activePage === link.key ? "text-[var(--gold-light)]" : ""
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* DESKTOP AUTH */}
          {showAuth && (
            <div className="hidden md:flex items-center gap-4">
              <Link href="/login" className="nav-link text-[0.85rem]">
                Увійти
              </Link>
              <Link href="/register" className="header-btn text-[0.85rem]">
                Реєстрація
              </Link>
            </div>
          )}

          {/* HAMBURGER */}
          <button
            className="md:hidden flex flex-col justify-center items-center w-10 h-10 gap-[6px] focus:outline-none"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Меню"
          >
            <span
              style={{
                display: "block",
                width: "22px",
                height: "1px",
                background: "var(--gold)",
                transition: "all 0.3s ease",
                transform: menuOpen ? "translateY(7px) rotate(45deg)" : "none",
              }}
            />
            <span
              style={{
                display: "block",
                width: "22px",
                height: "1px",
                background: "var(--gold)",
                transition: "all 0.3s ease",
                opacity: menuOpen ? 0 : 1,
              }}
            />
            <span
              style={{
                display: "block",
                width: "22px",
                height: "1px",
                background: "var(--gold)",
                transition: "all 0.3s ease",
                transform: menuOpen ? "translateY(-7px) rotate(-45deg)" : "none",
              }}
            />
          </button>
        </div>
      </header>

      {/* MOBILE MENU OVERLAY */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 50,
          background: "rgba(10,10,12,0.97)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "0",
          transition: "opacity 0.35s ease, visibility 0.35s ease",
          opacity: menuOpen ? 1 : 0,
          visibility: menuOpen ? "visible" : "hidden",
        }}
      >
        {/* Close button */}
        <button
          onClick={() => setMenuOpen(false)}
          style={{
            position: "absolute",
            top: "24px",
            right: "clamp(20px, 5vw, 80px)",
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "var(--gold)",
            fontSize: "1.5rem",
            lineHeight: 1,
          }}
          aria-label="Закрити"
        >
          ✕
        </button>

        {/* Logo in menu */}
        <div
          style={{
            fontFamily: "var(--font-serif), serif",
            fontSize: "1.6rem",
            letterSpacing: "0.3em",
            color: "var(--text-dim)",
            marginBottom: "48px",
          }}
        >
          KAYA
        </div>

        {/* Nav links */}
        <nav style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "8px", width: "100%" }}>
          {navLinks.map((link) => (
            <Link
              key={link.key}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              style={{
                fontFamily: "var(--font-serif), serif",
                fontSize: "clamp(1.8rem, 8vw, 2.4rem)",
                fontWeight: 300,
                letterSpacing: "0.08em",
                color: activePage === link.key ? "var(--gold-light)" : "var(--text)",
                textDecoration: "none",
                padding: "12px 40px",
                transition: "color 0.2s",
                display: "block",
                textAlign: "center",
              }}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Divider */}
        <div
          style={{
            width: "40px",
            height: "1px",
            background: "rgba(201,169,110,0.25)",
            margin: "32px 0",
          }}
        />

        {/* Auth links */}
        {showAuth && (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "16px" }}>
            <Link
              href="/login"
              onClick={() => setMenuOpen(false)}
              style={{
                fontFamily: "var(--font-sans), sans-serif",
                fontSize: "0.85rem",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: "var(--text-dim)",
                textDecoration: "none",
              }}
            >
              Увійти
            </Link>
            <Link
              href="/register"
              onClick={() => setMenuOpen(false)}
              style={{
                fontFamily: "var(--font-sans), sans-serif",
                fontSize: "0.85rem",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: "var(--gold-light)",
                textDecoration: "none",
                border: "1px solid rgba(201,169,110,0.4)",
                padding: "12px 32px",
              }}
            >
              Реєстрація
            </Link>
          </div>
        )}
      </div>
    </>
  );
}