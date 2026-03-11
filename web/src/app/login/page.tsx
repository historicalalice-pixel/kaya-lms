"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

export default function LoginPage() {
  const starfieldRef = useRef<HTMLDivElement>(null);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  useEffect(() => {
    const field = starfieldRef.current;
    if (!field) return;

    // Очистка перед створенням нових зірок
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

    // Cleanup
    return () => {
      stars.forEach((star) => star.remove());
    };
  }, []);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Не логуй пароль у консоль на реальному проекті
    console.log("Login attempt:", {
      email,
      rememberMe,
    });

    // Тут далі буде реальна авторизація
    // await signIn(...)
  };

  return (
    <div className="min-h-screen flex flex-col overflow-hidden">
      <div
        ref={starfieldRef}
        className="starfield"
        aria-hidden="true"
      />

      <header className="relative z-10 w-full">
        <div
          className="w-full flex items-center justify-center"
          style={{
            paddingTop: "24px",
            paddingBottom: "24px",
          }}
        >
          <Link
            href="/home"
            className="font-serif text-2xl md:text-3xl tracking-[0.2em] text-[var(--text)]"
          >
            KAYA
          </Link>
        </div>
      </header>

      <main className="relative z-10 flex-1 flex items-center justify-center px-8 md:px-16 lg:px-32 py-8">
        <div className="w-full" style={{ maxWidth: "750px" }}>
          <div className="text-center mb-10">
            <Link
              href="/home"
              className="inline-flex items-center gap-2 text-[var(--text-dim)] hover:text-[var(--gold-light)] transition-colors mb-5"
            >
              <span aria-hidden="true">←</span>
              <span className="font-sans text-[0.9rem]">На головну</span>
            </Link>

            <h1 className="font-serif text-[2.5rem] md:text-[3.5rem] font-light text-[var(--text)] mb-4">
              Вхід
            </h1>

            <p className="font-sans text-[1rem] md:text-[1.15rem] text-[var(--text-dim)]">
              Раді бачити вас знову
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block font-sans text-[0.9rem] text-[var(--text-dim)] mb-2"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[rgba(201,169,110,0.05)] border border-[rgba(201,169,110,0.2)] rounded px-5 py-4 font-sans text-[1rem] text-[var(--text)] placeholder:text-[var(--text-dim)] focus:border-[var(--gold-light)] focus:outline-none transition-colors"
                placeholder="your@email.com"
                autoComplete="email"
                required
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block font-sans text-[0.9rem] text-[var(--text-dim)] mb-2"
              >
                Пароль
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[rgba(201,169,110,0.05)] border border-[rgba(201,169,110,0.2)] rounded px-5 py-4 font-sans text-[1rem] text-[var(--text)] placeholder:text-[var(--text-dim)] focus:border-[var(--gold-light)] focus:outline-none transition-colors"
                placeholder="••••••••"
                autoComplete="current-password"
                required
              />
            </div>

            <div className="flex items-center justify-between text-[0.9rem]">
              <label className="flex items-center gap-3 cursor-pointer group">
                <div className="relative">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  <div className="w-5 h-5 border border-[rgba(201,169,110,0.3)] rounded peer-checked:bg-[var(--gold)] peer-checked:border-[var(--gold)] transition-all"></div>
                  <svg
                    className="absolute top-1 left-1 w-3 h-3 text-[var(--bg)] opacity-0 peer-checked:opacity-100 transition-opacity"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    aria-hidden="true"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>

                <span className="text-[var(--text-dim)] group-hover:text-[var(--text)] transition-colors text-[0.85rem]">
                  Запам'ятати
                </span>
              </label>

              <Link
                href="/forgot-password"
                className="text-[var(--gold-dim)] hover:text-[var(--gold-light)] transition-colors"
              >
                Забули пароль?
              </Link>
            </div>

            <button type="submit" className="hero-cta w-full text-[1rem] py-4 mt-4">
              Увійти
            </button>
          </form>

          <div className="flex items-center gap-4 my-10">
            <div className="flex-1 h-[1px] bg-[rgba(201,169,110,0.15)]"></div>
            <span className="font-sans text-[0.85rem] text-[var(--text-dim)]">або</span>
            <div className="flex-1 h-[1px] bg-[rgba(201,169,110,0.15)]"></div>
          </div>

          <div className="flex flex-col gap-4">
            <button
              type="button"
              className="w-full flex items-center justify-center gap-3 bg-transparent border border-[rgba(201,169,110,0.3)] rounded px-5 py-4 font-sans text-[1rem] text-[var(--text)] hover:border-[var(--gold-light)] hover:bg-[rgba(201,169,110,0.05)] transition-all duration-300"
            >
              <svg className="w-6 h-6" viewBox="0 0 24 24" aria-hidden="true">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Увійти через Google
            </button>

            <button
              type="button"
              className="w-full flex items-center justify-center gap-3 bg-transparent border border-[rgba(201,169,110,0.3)] rounded px-5 py-4 font-sans text-[1rem] text-[var(--text)] hover:border-[var(--gold-light)] hover:bg-[rgba(201,169,110,0.05)] transition-all duration-300"
            >
              <svg
                className="w-6 h-6"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
              </svg>
              Увійти через Apple
            </button>
          </div>

          <p className="text-center mt-10 font-sans text-[1rem] text-[var(--text-dim)]">
            Немає акаунту?{" "}
            <Link href="/register" className="text-[var(--gold-light)] hover:underline">
              Зареєструватися
            </Link>
          </p>
        </div>
      </main>

      <footer className="relative z-10 py-6 px-4 border-t border-[rgba(201,169,110,0.08)]">
        <div className="max-w-[1400px] mx-auto flex items-center justify-center">
          <span className="font-sans text-[0.8rem] text-[var(--text-dim)]">
            © 2026 KAYA LMS
          </span>
        </div>
      </footer>
    </div>
  );
}