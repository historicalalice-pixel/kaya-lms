"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";

export default function ContactsPage() {
  const starfieldRef = useRef<HTMLDivElement>(null);

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

  return (
    <div className="min-h-screen flex flex-col overflow-hidden">
      <div ref={starfieldRef} className="starfield" />

      {/* HEADER */}
      <header className="relative z-10 w-full border-b border-[rgba(201,169,110,0.08)]">
        <div
          className="w-full flex items-center justify-between"
          style={{ 
            paddingLeft: "clamp(20px, 5vw, 80px)", 
            paddingRight: "clamp(20px, 5vw, 80px)", 
            paddingTop: "20px", 
            paddingBottom: "20px" 
          }}
        >
          <Link href="/home" className="font-serif text-2xl md:text-3xl tracking-[0.2em] text-[var(--text)]">
            KAYA
          </Link>
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/courses" className="nav-link text-[0.85rem]">Курси</Link>
            <Link href="/about" className="nav-link text-[0.85rem]">Про нас</Link>
            <Link href="/contacts" className="nav-link text-[0.85rem] text-[var(--gold-light)]">Контакти</Link>
          </nav>
          <div className="flex items-center gap-4">
            <Link href="/login" className="nav-link text-[0.85rem]">Увійти</Link>
            <Link href="/register" className="header-btn text-[0.85rem]">Реєстрація</Link>
          </div>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="relative z-10 flex-1 py-16 px-6">
        <div className="max-w-[800px] mx-auto">
          
          {/* PAGE HEADER */}
          <div className="text-center mb-16">
            <Link href="/home" className="inline-flex items-center gap-2 text-[var(--text-dim)] hover:text-[var(--gold-light)] transition-colors mb-6">
              <span>←</span>
              <span className="font-sans text-[0.8rem]">На головну</span>
            </Link>
            <p className="font-sans text-[0.78rem] tracking-[0.4em] uppercase text-[var(--gold-dim)] mb-4">
              Зв'язок
            </p>
            <h1 className="font-serif text-[clamp(2rem,4vw,3rem)] font-light text-[var(--text)] mb-6">
              Контакти
            </h1>
            <p className="font-sans text-[1rem] font-light leading-[1.9] text-[var(--text-dim)] max-w-[500px] mx-auto">
              Маєте питання? Зв'яжіться з нами зручним способом
            </p>
          </div>

          {/* CONTACT OPTIONS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-12">
            
            <a href="mailto:hello@kaya.education" className="kaya-card group p-7 text-center hover:border-[var(--gold-light)] transition-all">
              <div className="text-2xl mb-4 opacity-60 group-hover:opacity-100 transition-opacity">✉</div>
              <h3 className="font-serif text-[1.1rem] text-[var(--gold-light)] mb-2">Email</h3>
              <p className="font-sans text-[0.9rem] text-[var(--text-dim)]">hello@kaya.education</p>
            </a>

            <a href="https://t.me/kaya_support" target="_blank" rel="noopener noreferrer" className="kaya-card group p-7 text-center hover:border-[var(--gold-light)] transition-all">
              <div className="text-2xl mb-4 opacity-60 group-hover:opacity-100 transition-opacity">💬</div>
              <h3 className="font-serif text-[1.1rem] text-[var(--gold-light)] mb-2">Telegram</h3>
              <p className="font-sans text-[0.9rem] text-[var(--text-dim)]">@kaya_support</p>
            </a>

            <a href="https://instagram.com/kaya.education" target="_blank" rel="noopener noreferrer" className="kaya-card group p-7 text-center hover:border-[var(--gold-light)] transition-all">
              <div className="text-2xl mb-4 opacity-60 group-hover:opacity-100 transition-opacity">📷</div>
              <h3 className="font-serif text-[1.1rem] text-[var(--gold-light)] mb-2">Instagram</h3>
              <p className="font-sans text-[0.9rem] text-[var(--text-dim)]">@kaya.education</p>
            </a>

            <div className="kaya-card group p-7 text-center">
              <div className="text-2xl mb-4 opacity-60">📍</div>
              <h3 className="font-serif text-[1.1rem] text-[var(--gold-light)] mb-2">Локація</h3>
              <p className="font-sans text-[0.9rem] text-[var(--text-dim)]">Україна, онлайн</p>
            </div>

          </div>

          {/* CONTACT FORM */}
          <div className="kaya-card p-8">
            <h2 className="font-serif text-[1.3rem] text-[var(--gold-light)] mb-6 text-center">Написати нам</h2>
            
            <form className="space-y-5">
              <div>
                <label className="block font-sans text-[0.8rem] text-[var(--text-dim)] mb-2">Ваше ім'я</label>
                <input 
                  type="text" 
                  className="w-full bg-[rgba(201,169,110,0.05)] border border-[rgba(201,169,110,0.15)] rounded px-4 py-3 font-sans text-[0.9rem] text-[var(--text)] focus:border-[var(--gold-light)] focus:outline-none transition-colors"
                  placeholder="Введіть ім'я"
                />
              </div>
              
              <div>
                <label className="block font-sans text-[0.8rem] text-[var(--text-dim)] mb-2">Email</label>
                <input 
                  type="email" 
                  className="w-full bg-[rgba(201,169,110,0.05)] border border-[rgba(201,169,110,0.15)] rounded px-4 py-3 font-sans text-[0.9rem] text-[var(--text)] focus:border-[var(--gold-light)] focus:outline-none transition-colors"
                  placeholder="your@email.com"
                />
              </div>
              
              <div>
                <label className="block font-sans text-[0.8rem] text-[var(--text-dim)] mb-2">Повідомлення</label>
                <textarea 
                  rows={4}
                  className="w-full bg-[rgba(201,169,110,0.05)] border border-[rgba(201,169,110,0.15)] rounded px-4 py-3 font-sans text-[0.9rem] text-[var(--text)] focus:border-[var(--gold-light)] focus:outline-none transition-colors resize-none"
                  placeholder="Ваше питання або коментар..."
                />
              </div>
              
              <button type="submit" className="hero-cta w-full">
                Надіслати
              </button>
            </form>
          </div>

        </div>
      </main>

      {/* FOOTER */}
      <footer className="relative z-10 py-6 px-6 border-t border-[rgba(201,169,110,0.08)]">
        <div className="max-w-[1400px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="font-serif text-lg tracking-[0.15em] text-[var(--text-dim)]">KAYA</span>
          <span className="font-sans text-[0.75rem] text-[var(--text-dim)]">
            © 2026 KAYA LMS
          </span>
        </div>
      </footer>
    </div>
  );
}