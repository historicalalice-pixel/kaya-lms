"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

export default function LoginPage() {
  const starfieldRef = useRef<HTMLDivElement>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    const field = starfieldRef.current;
    if (!field) return;

    for (let i = 0; i < 150; i++) {
      const star = document.createElement("div");
      star.classList.add("star");

      const rand = Math.random();
      if (rand < 0.55) star.classList.add("star--small");
      else if (rand < 0.85) star.classList.add("star--medium");
      else star.classList.add("star--large");

      star.style.setProperty("--dur", (2 + Math.random() * 5) + "s");
      star.style.setProperty("--delay", (Math.random() * 6) + "s");
      star.style.left = Math.random() * 100 + "%";
      star.style.top = Math.random() * 100 + "%";
      field.appendChild(star);
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Тут буде логіка авторизації
    console.log("Login:", { email, password });
  };

  return (
    <div className="min-h-screen flex flex-col overflow-hidden">
      <div ref={starfieldRef} className="starfield" />

      {/* HEADER */}
      <header className="relative z-10 w-full">
        <div
          className="w-full flex items-center justify-between"
          style={{ 
            paddingLeft: "clamp(16px, 5vw, 80px)", 
            paddingRight: "clamp(16px, 5vw, 80px)", 
            paddingTop: "20px", 
            paddingBottom: "20px" 
          }}
        >
          <Link href="/home" className="font-serif text-xl md:text-3xl tracking-[0.2em] text-[var(--text)]">
            KAYA
          </Link>
          <Link href="/register" className="nav-link text-[0.8rem] md:text-[0.85rem]">
            Реєстрація
          </Link>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-[400px]">
          
          {/* FORM HEADER */}
          <div className="text-center mb-8">
            <Link href="/home" className="inline-flex items-center gap-2 text-[var(--text-dim)] hover:text-[var(--gold-light)] transition-colors mb-4">
              <span>←</span>
              <span className="font-sans text-[0.8rem]">На головну</span>
            </Link>
            <h1 className="font-serif text-[2rem] md:text-[2.5rem] font-light text-[var(--text)] mb-2">
              Вхід
            </h1>
            <p className="font-sans text-[0.9rem] text-[var(--text-dim)]">
              Раді бачити вас знову
            </p>
          </div>

          {/* FORM */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block font-sans text-[0.8rem] text-[var(--text-dim)] mb-2">
                Email
              </label>
              <input 
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[rgba(201,169,110,0.05)] border border-[rgba(201,169,110,0.2)] rounded px-4 py-3 font-sans text-[0.9rem] text-[var(--text)] placeholder:text-[var(--text-dim)] focus:border-[var(--gold-light)] focus:outline-none transition-colors"
                placeholder="your@email.com"
                required
              />
            </div>
            
            <div>
              <label className="block font-sans text-[0.8rem] text-[var(--text-dim)] mb-2">
                Пароль
              </label>
              <input 
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[rgba(201,169,110,0.05)] border border-[rgba(201,169,110,0.2)] rounded px-4 py-3 font-sans text-[0.9rem] text-[var(--text)] placeholder:text-[var(--text-dim)] focus:border-[var(--gold-light)] focus:outline-none transition-colors"
                placeholder="••••••••"
                required
              />
            </div>

            <div className="flex items-center justify-between text-[0.8rem]">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="accent-[var(--gold)]" />
                <span className="text-[var(--text-dim)]">Запам'ятати мене</span>
              </label>
              <Link href="/forgot-password" className="text-[var(--gold-dim)] hover:text-[var(--gold-light)] transition-colors">
                Забули пароль?
              </Link>
            </div>
            
            <button type="submit" className="hero-cta w-full mt-6">
              Увійти
            </button>
          </form>

          {/* DIVIDER */}
          <div className="flex items-center gap-4 my-8">
            <div className="flex-1 h-[1px] bg-[rgba(201,169,110,0.15)]"></div>
            <span className="font-sans text-[0.75rem] text-[var(--text-dim)]">або</span>
            <div className="flex-1 h-[1px] bg-[rgba(201,169,110,0.15)]"></div>
          </div>

          {/* GOOGLE LOGIN */}
          <button className="w-full flex items-center justify-center gap-3 bg-[rgba(255,255,255,0.03)] border border-[rgba(201,169,110,0.15)] rounded px-4 py-3 font-sans text-[0.85rem] text-[var(--text)] hover:border-[var(--gold-dim)] transition-colors">
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Увійти через Google
          </button>

          {/* REGISTER LINK */}
          <p className="text-center mt-8 font-sans text-[0.85rem] text-[var(--text-dim)]">
            Немає акаунту?{" "}
            <Link href="/register" className="text-[var(--gold-light)] hover:underline">
              Зареєструватися
            </Link>
          </p>

        </div>
      </main>

      {/* FOOTER */}
      <footer className="relative z-10 py-4 px-4 border-t border-[rgba(201,169,110,0.08)]">
        <div className="max-w-[1400px] mx-auto flex items-center justify-center">
          <span className="font-sans text-[0.7rem] text-[var(--text-dim)]">
            © 2026 KAYA LMS
          </span>
        </div>
      </footer>
    </div>
  );
}