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
    <div className="min-h-screen flex flex-col overflow-hidden bg-[var(--bg)]">
      <div ref={starfieldRef} className="starfield" />

      {/* HEADER */}
      <header className="relative z-10 w-full">
        <div
          className="w-full flex items-center justify-between"
          style={{
            paddingLeft: "clamp(28px, 7vw, 140px)",
            paddingRight: "clamp(28px, 7vw, 140px)",
            paddingTop: "28px",
            paddingBottom: "20px",
          }}
        >
          <Link
            href="/"
            className="font-serif text-[2.15rem] md:text-[2.75rem] tracking-[0.24em] text-[rgba(245,239,230,0.94)] hover:text-[var(--text)] transition-colors duration-300"
          >
            KAYA
          </Link>

          <div className="flex items-center gap-5 md:gap-6">
            {authLoading ? (
              <span className="font-sans text-[0.95rem] text-[var(--text-dim)]">
                ...
              </span>
            ) : userEmail ? (
              <>
                <span className="hidden md:inline font-sans text-[0.9rem] text-[var(--text-dim)] max-w-[260px] truncate">
                  {userEmail}
                </span>
                <LogoutButton />
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="font-sans text-[0.92rem] tracking-[0.18em] uppercase text-[rgba(245,239,230,0.82)] hover:text-[var(--gold-light)] transition-colors duration-300"
                >
                  Увійти
                </Link>
                <Link
                  href="/register"
                  className="inline-flex items-center justify-center min-h-[48px] px-6 md:px-7 border border-[rgba(201,169,110,0.55)] bg-[rgba(201,169,110,0.04)] font-sans text-[0.9rem] tracking-[0.18em] uppercase text-[rgba(245,239,230,0.95)] hover:border-[rgba(227,196,136,0.9)] hover:bg-[rgba(201,169,110,0.08)] transition-all duration-300"
                >
                  Реєстрація
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 py-12 md:py-14">
        <div className="max-w-[980px] w-full mx-auto text-center">
          {/* HERO TEXT */}
          <p className="font-sans text-[0.9rem] md:text-[0.95rem] tracking-[0.38em] uppercase text-[var(--gold-dim)] mb-7">
            Освітня платформа
          </p>

          <h1 className="font-serif text-[clamp(2.6rem,5.4vw,4.9rem)] font-light leading-[1.12] text-[var(--text)] mb-8 max-w-[1000px] mx-auto">
            Простір, де історія набуває голосу.
          </h1>

         <p className="font-sans text-[1.05rem] md:text-[1.18rem] font-light leading-[1.8] text-[var(--text-dim)] mb-14 max-w-[620px] mx-auto text-center">
            KAYA — платформа для вивчення історії з репетиторами.
            Структуроване навчання, підготовка до НМТ, персональний підхід.
          </p>

          {/* NAVIGATION CARDS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-14">
            <Link
              href="/courses"
              className="kaya-card group p-8 md:p-10 text-center hover:border-[var(--gold-light)] transition-all duration-300"
            >
              <h3 className="font-serif text-[1.35rem] md:text-[1.55rem] text-[var(--gold-light)] mb-4">
                Курси
              </h3>
              <p className="font-sans text-[0.98rem] md:text-[1.02rem] leading-[1.8] text-[var(--text-dim)] max-w-[240px] mx-auto">
                Каталог програм навчання
              </p>
            </Link>

            <Link
              href="/about"
              className="kaya-card group p-8 md:p-10 text-center hover:border-[var(--gold-light)] transition-all duration-300"
            >
              <h3 className="font-serif text-[1.35rem] md:text-[1.55rem] text-[var(--gold-light)] mb-4">
                Про нас
              </h3>
              <p className="font-sans text-[0.98rem] md:text-[1.02rem] leading-[1.8] text-[var(--text-dim)] max-w-[240px] mx-auto">
                Що таке KAYA
              </p>
            </Link>

            <Link
              href="/contacts"
              className="kaya-card group p-8 md:p-10 text-center hover:border-[var(--gold-light)] transition-all duration-300"
            >
              <h3 className="font-serif text-[1.35rem] md:text-[1.55rem] text-[var(--gold-light)] mb-4">
                Контакти
              </h3>
              <p className="font-sans text-[0.98rem] md:text-[1.02rem] leading-[1.8] text-[var(--text-dim)] max-w-[240px] mx-auto">
                Зв'язатися з нами
              </p>
            </Link>
          </div>

          {/* CTA BUTTONS */}
          <div className="flex flex-col lg:flex-row gap-5 items-center justify-center">
            <Link
              href="/register?role=student"
              className="hero-cta w-full lg:w-[340px] text-center text-[0.98rem] md:text-[1rem] min-h-[60px] flex items-center justify-center"
            >
              Я учень — Почати навчання
            </Link>
            <Link
              href="/register?role=tutor"
              className="hero-cta-secondary w-full lg:w-[340px] text-center text-[0.98rem] md:text-[1rem] min-h-[60px] flex items-center justify-center"
            >
              Я репетитор — Приєднатися
            </Link>
          </div>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="relative z-10 py-6 px-6 border-t border-[rgba(201,169,110,0.08)]">
        <div className="max-w-[1400px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="font-serif text-[1.2rem] tracking-[0.18em] text-[var(--text-dim)]">
            KAYA
          </span>
          <div className="flex items-center gap-6">
            <Link
              href="/about"
              className="font-sans text-[0.82rem] text-[var(--text-dim)] hover:text-[var(--gold-light)] transition-colors"
            >
              Про нас
            </Link>
            <Link
              href="/contacts"
              className="font-sans text-[0.82rem] text-[var(--text-dim)] hover:text-[var(--gold-light)] transition-colors"
            >
              Контакти
            </Link>
            <Link
              href="/privacy"
              className="font-sans text-[0.82rem] text-[var(--text-dim)] hover:text-[var(--gold-light)] transition-colors"
            >
              Конфіденційність
            </Link>
          </div>
          <span className="font-sans text-[0.82rem] text-[var(--text-dim)]">
            © 2026 KAYA LMS
          </span>
        </div>
      </footer>
    </div>
  );
}