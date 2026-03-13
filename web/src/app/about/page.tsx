"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import Header from "@/app/components/header";

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
      <Header activePage="about" />
      <main className="relative z-10 flex-1 py-10 md:py-16 px-5 md:px-6">
        <div className="max-w-[1000px] mx-auto">
          <div className="text-center mb-10 md:mb-16">
            <Link href="/home" className="inline-flex items-center gap-2 text-[var(--text-dim)] hover:text-[var(--gold-light)] transition-colors mb-5 md:mb-6">
              <span>←</span>
              <span className="font-sans text-[0.8rem]">На головну</span>
            </Link>
            <p className="font-sans text-[0.75rem] tracking-[0.4em] uppercase text-[var(--gold-dim)] mb-3 md:mb-4">Про платформу</p>
            <h1 className="font-serif text-[clamp(1.8rem,4vw,3rem)] font-light text-[var(--text)] mb-5 md:mb-6">Що таке KAYA?</h1>
            <p className="font-sans text-[0.95rem] md:text-[1rem] font-light leading-[1.9] text-[var(--text-dim)] max-w-[650px] mx-auto">
              KAYA — це освітня платформа, яка поєднує структуроване навчання історії, підготовку до іспитів і персональний супровід від досвідчених репетиторів.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5 mb-10 md:mb-16">
            {features.map((card, i) => (
              <div key={i} className="kaya-card group p-6 md:p-7 flex flex-col">
                <div className="text-xl mb-3 opacity-50 group-hover:opacity-80 transition-opacity">{card.icon}</div>
                <h3 className="font-serif text-[1.1rem] md:text-[1.2rem] text-[var(--gold-light)] mb-2 md:mb-3">{card.title}</h3>
                <p className="font-sans text-[0.88rem] md:text-[0.9rem] font-light leading-[1.7] text-[var(--text-dim)]">{card.desc}</p>
              </div>
            ))}
          </div>
          <div className="kaya-card p-7 md:p-10 text-center mb-10 md:mb-16">
            <h2 className="font-serif text-[1.3rem] md:text-[1.5rem] text-[var(--gold-light)] mb-5 md:mb-6">Наша місія</h2>
            <p className="font-sans text-[0.95rem] md:text-[1rem] font-light leading-[1.9] text-[var(--text-dim)] max-w-[600px] mx-auto">
              Ми віримо, що історія — це не набір дат і подій для заучування. Це простір для розуміння світу, себе і свого місця в ньому. KAYA допомагає побачити зв'язки, зрозуміти контекст і закохатися в історію.
            </p>
          </div>
          <div className="text-center pb-4">
            <Link href="/register" className="hero-cta inline-block">Приєднатися до KAYA</Link>
          </div>
        </div>
      </main>
      <footer className="relative z-10 py-5 md:py-6 px-5 border-t border-[rgba(201,169,110,0.08)]">
        <div className="max-w-[1400px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <span className="font-serif text-lg tracking-[0.15em] text-[var(--text-dim)]">KAYA</span>
          <span className="font-sans text-[0.75rem] text-[var(--text-dim)]">© 2026 KAYA LMS</span>
        </div>
      </footer>
    </div>
  );
}