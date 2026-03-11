"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import LogoutButton from "@/app/components/logout-button";
import { createClient } from "@/lib/supabase/client";

export default function HomePage() {
  const starfieldRef = useRef<HTMLDivElement>(null);

  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const field = starfieldRef.current;
    if (!field) return;

    field.innerHTML = "";

    const stars: HTMLDivElement[] = [];

    for (let i = 0; i < 150; i++) {
      const star = document.createElement("div");
      star.classList.add("star");

      const rand = Math.random();
      if (rand < 0.55) star.classList.add("star--small");
      else if (rand < 0.85) star.classList.add("star--medium");
      else star.classList.add("star--large");

      star.style.setProperty("--dur", `${2 + Math.random() * 5}s`);
      star.style.setProperty("--delay", `${Math.random() * 6}s`);
      star.style.left = `${Math.random() * 100}%`;
      star.style.top = `${Math.random() * 100}%`;

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
      const { data, error } = await supabase.auth.getUser();

      if (!error && data.user) {
        setUserEmail(data.user.email ?? null);
      } else {
        setUserEmail(null);
      }

      setAuthLoading(false);
    };

    loadUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUserEmail(session?.user?.email ?? null);
      setAuthLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col overflow-hidden">
      <div ref={starfieldRef} className="starfield" />

      {/* HEADER */}
      <header className="relative z-10 w-full">
        <div
          className="w-full flex items-center justify-between"
          style={{
            paddingLeft: "clamp(20px, 5vw, 80px)",
            paddingRight: "clamp(20px, 5vw, 80px)",
            paddingTop: "24px",
            paddingBottom: "24px",
          }}
        >
          <Link
            href="/"
            className="font-serif text-2xl md:text-3xl tracking-[0.2em] text-[var(--text)]"
          >
            KAYA
          </Link>

          <div className="flex items-center gap-4">
            {authLoading ? (
              <span className="font-sans text-[0.85rem] text-[var(--text-dim)]">
                ...
              </span>
            ) : userEmail ? (
              <>
                <span className="hidden sm:inline font-sans text-[0.82rem] text-[var(--text-dim)] max-w-[220px] truncate">
                  {userEmail}
                </span>
                <LogoutButton />
              </>
            ) : (
              <>
                <Link href="/login" className="nav-link text-[0.85rem]">
                  Увійти
                </Link>
                <Link href="/register" className="header-btn text-[0.85rem]">
                  Реєстрація
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 py-12">
        <div className="max-w-[800px] w-full text-center">
          <p className="font-sans text-[0.8rem] tracking-[0.35em] uppercase text-[var(--gold-dim)] mb-6">
            Освітня платформа
          </p>

          <h1 className="font-serif text-[clamp(2.2rem,5vw,4rem)] font-light leading-[1.2] text-[var(--text)] mb-6">
            Простір, де історія набуває голосу.
          </h1>

          <p className="font-sans text-[1rem] font-light leading-[1.8] text-[var(--text-dim)] mb-12 max-w-[600px] mx-auto">
            KAYA — платформа для вивчення історії з репетиторами.
            Структуроване навчання, підготовка до НМТ, персональний підхід.
          </p>

          {/* NAVIGATION CARDS */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12">
            <Link
              href="/courses"
              className="kaya-card group p-6 text-center hover:border-[var(--gold-light)] transition-all"
            >
              <div className="text-2xl mb-3 opacity-60 group-hover:opacity-100 transition-opacity">
                📚
              </div>
              <h3 className="font-serif text-[1.1rem] text-[var(--gold-light)] mb-2">
                Курси
              </h3>
              <p className="font-sans text-[0.8rem] text-[var(--text-dim)]">
                Каталог програм навчання
              </p>
            </Link>

            <Link
              href="/about"
              className="kaya-card group p-6 text-center hover:border-[var(--gold-light)] transition-all"
            >
              <div className="text-2xl mb-3 opacity-60 group-hover:opacity-100 transition-opacity">
                ✦
              </div>
              <h3 className="font-serif text-[1.1rem] text-[var(--gold-light)] mb-2">
                Про нас
              </h3>
              <p className="font-sans text-[0.8rem] text-[var(--text-dim)]">
                Що таке KAYA
              </p>
            </Link>

            <Link
              href="/contacts"
              className="kaya-card group p-6 text-center hover:border-[var(--gold-light)] transition-all"
            >
              <div className="text-2xl mb-3 opacity-60 group-hover:opacity-100 transition-opacity">
                ✉
              </div>
              <h3 className="font-serif text-[1.1rem] text-[var(--gold-light)] mb-2">
                Контакти
              </h3>
              <p className="font-sans text-[0.8rem] text-[var(--text-dim)]">
                Зв'язатися з нами
              </p>
            </Link>
          </div>

          {/* CTA BUTTONS */}
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
            <Link
              href="/register?role=student"
              className="hero-cta w-full sm:w-[280px] text-center"
            >
              Я учень — Почати навчання
            </Link>
            <Link
              href="/register?role=tutor"
              className="hero-cta-secondary w-full sm:w-[280px] text-center"
            >
              Я репетитор — Приєднатися
            </Link>
          </div>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="relative z-10 py-6 px-6 border-t border-[rgba(201,169,110,0.08)]">
        <div className="max-w-[1400px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="font-serif text-lg tracking-[0.15em] text-[var(--text-dim)]">
            KAYA
          </span>
          <div className="flex items-center gap-6">
            <Link
              href="/about"
              className="font-sans text-[0.75rem] text-[var(--text-dim)] hover:text-[var(--gold-light)] transition-colors"
            >
              Про нас
            </Link>
            <Link
              href="/contacts"
              className="font-sans text-[0.75rem] text-[var(--text-dim)] hover:text-[var(--gold-light)] transition-colors"
            >
              Контакти
            </Link>
            <Link
              href="/privacy"
              className="font-sans text-[0.75rem] text-[var(--text-dim)] hover:text-[var(--gold-light)] transition-colors"
            >
              Конфіденційність
            </Link>
          </div>
          <span className="font-sans text-[0.75rem] text-[var(--text-dim)]">
            © 2026 KAYA LMS
          </span>
        </div>
      </footer>
    </div>
  );
}