"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";

export default function AboutPage() {
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

  const features = [
    { icon: "◈", title: "Структуровані програми", desc: "Навчання не фрагментами, а цілісними маршрутами від початку до результату." },
    { icon: "◉", title: "Підготовка до результату", desc: "НМТ, іспити, діагностика, контроль прогресу — все в одному просторі." },
    { icon: "◎", title: "Просторова навігація", desc: "Теми відкриваються як пов'язаний інтелектуальний простір, а не сухий список." },
    { icon: "◇", title: "Персональний шлях", desc: "Платформа адаптується під рівень, темп і роль кожного користувача." },
  ];

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
            <Link href="/about" className="nav-link text-[0.85rem] text-[var(--gold-light)]">Про нас</Link>
            <Link href="/contacts" className="nav-link text-[0.85rem]">Контакти</Link>
          </nav>
          <div className="flex items-center gap-4">
            <Link href="/login" className="nav-link text-[0.85rem]">Увійти</Link>
            <Link href="/register" className="header-btn text-[0.85rem]">Реєстрація</Link>
          </div>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="relative z-10 flex-1 py-16 px-6">
        <div className="max-w-[1000px] mx-auto">
          
          {/* PAGE HEADER */}
          <div className="text-center mb-16">
            <Link href="/home" className="inline-flex items-center gap-2 text-[var(--text-dim)] hover:text-[var(--gold-light)] transition-colors mb-6">
              <span>←</span>
              <span className="font-sans text-[0.8rem]">На головну</span>
            </Link>
            <p className="font-sans text-[0.78rem] tracking-[0.4em] uppercase text-[var(--gold-dim)] mb-4">
              Про платформу
            </p>
            <h1 className="font-serif text-[clamp(2rem,4vw,3rem)] font-light text-[var(--text)] mb-6">
              Що таке KAYA?
            </h1>
            <p className="font-sans text-[1rem] font-light leading-[1.9] text-[var(--text-dim)] max-w-[650px] mx-auto">
              KAYA — це освітня платформа, яка поєднує структуроване навчання історії, 
              підготовку до іспитів і персональний супровід від досвідчених репетиторів.
            </p>
          </div>

          {/* FEATURES */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-16">
            {features.map((card, i) => (
              <div key={i} className="kaya-card group p-7 flex flex-col min-h-[180px]">
                <div className="text-xl mb-4 opacity-50 group-hover:opacity-80 transition-opacity">{card.icon}</div>
                <h3 className="font-serif text-[1.2rem] text-[var(--gold-light)] mb-3">{card.title}</h3>
                <p className="font-sans text-[0.9rem] font-light leading-[1.7] text-[var(--text-dim)]">{card.desc}</p>
              </div>
            ))}
          </div>

          {/* MISSION */}
          <div className="kaya-card p-10 text-center mb-16">
            <h2 className="font-serif text-[1.5rem] text-[var(--gold-light)] mb-6">Наша місія</h2>
            <p className="font-sans text-[1rem] font-light leading-[1.9] text-[var(--text-dim)] max-w-[600px] mx-auto">
              Ми віримо, що історія — це не набір дат і подій для заучування. 
              Це простір для розуміння світу, себе і свого місця в ньому. 
              KAYA допомагає побачити зв'язки, зрозуміти контекст і закохатися в історію.
            </p>
          </div>

          {/* CTA */}
          <div className="text-center">
            <Link href="/register" className="hero-cta inline-block">
              Приєднатися до KAYA
            </Link>
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