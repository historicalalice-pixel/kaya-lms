"use client";

import { useEffect, useRef, useState } from "react";

export default function HomePage() {
  const starfieldRef = useRef<HTMLDivElement>(null);
  const [scrolled, setScrolled] = useState(false);

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

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const programs = [
    { title: "Історія України", desc: "Повний курс від давніх часів до сучасності", modules: 24, level: "Базовий — Поглиблений" },
    { title: "Всесвітня історія", desc: "Ключові події та процеси світової цивілізації", modules: 20, level: "Базовий — Поглиблений" },
    { title: "Підготовка до НМТ", desc: "Цілеспрямована підготовка з діагностикою та тестами", modules: 16, level: "Інтенсив" },
    { title: "Тематичні інтенсиви", desc: "Глибоке занурення в окремі епохи та події", modules: 8, level: "Тематичний" },
    { title: "Great War Protocol", desc: "Спецкурс: Перша та Друга світові війни", modules: 12, level: "Поглиблений" },
    { title: "Спецмодулі", desc: "Авторські добірки, нестандартні теми та зв'язки", modules: 6, level: "Різний" },
  ];

  return (
    <div>
      <div ref={starfieldRef} className="starfield" />

      {/* HEADER */}
      <header
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
          scrolled
            ? "bg-[rgba(10,10,12,0.85)] backdrop-blur-md border-b border-[rgba(201,169,110,0.1)]"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-[1400px] mx-auto px-8 py-5 flex items-center justify-between">
          <a href="/home" className="font-serif text-2xl tracking-[0.15em] text-[var(--text)]">
            KAYA
          </a>
          <nav className="hidden md:flex items-center gap-8">
            <a href="#programs" className="nav-link">Програми</a>
            <a href="#space" className="nav-link">Простір</a>
            <a href="#how" className="nav-link">Як це працює</a>
            <a href="#faq" className="nav-link">FAQ</a>
          </nav>
          <div className="flex items-center gap-4">
            <button className="nav-link">UA / EN</button>
            <a href="/" className="header-btn">Увійти</a>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="relative z-[2] min-h-screen flex items-center pt-32 pb-20 px-8">
        <div className="max-w-[1400px] mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="max-w-[600px]">
            <p className="font-sans text-[0.7rem] tracking-[0.35em] uppercase text-[var(--gold-dim)] mb-6">
              Освітня платформа
            </p>
            <h1 className="font-serif text-[clamp(2.5rem,5vw,4.5rem)] font-light leading-[1.15] text-[var(--text)] mb-8">
              Освітній простір, де історія стає маршрутом.
            </h1>
            <p className="font-sans text-[0.95rem] font-light leading-[1.8] text-[var(--text-dim)] mb-12 max-w-[520px]">
              KAYA поєднує структуроване навчання, підготовку до іспитів і просторову навігацію, щоб знання складались у цілісну картину.
            </p>
            <div className="flex flex-wrap gap-4 items-center">
              <button className="hero-cta">Почати навчання</button>
              <a href="#programs" className="hero-cta-secondary">Переглянути програми</a>
            </div>
          </div>

          <div className="hidden lg:flex items-center justify-center">
            <div className="w-full max-w-[500px] aspect-[4/3] rounded-sm border border-[rgba(201,169,110,0.15)] bg-[rgba(201,169,110,0.02)] flex flex-col items-center justify-center gap-6 p-8">
              <div className="grid grid-cols-3 gap-3 w-full max-w-[320px]">
                <div className="aspect-square border border-[rgba(201,169,110,0.1)] bg-[rgba(201,169,110,0.03)] rounded-sm" />
                <div className="aspect-square border border-[rgba(201,169,110,0.1)] bg-[rgba(201,169,110,0.03)] rounded-sm" />
                <div className="aspect-square border border-[rgba(201,169,110,0.1)] bg-[rgba(201,169,110,0.03)] rounded-sm" />
                <div className="aspect-square border border-[rgba(201,169,110,0.1)] bg-[rgba(201,169,110,0.03)] rounded-sm" />
                <div className="aspect-square border border-[rgba(201,169,110,0.15)] bg-[rgba(201,169,110,0.06)] rounded-sm flex items-center justify-center">
                  <span className="text-[var(--gold-dim)] text-lg">◈</span>
                </div>
                <div className="aspect-square border border-[rgba(201,169,110,0.1)] bg-[rgba(201,169,110,0.03)] rounded-sm" />
              </div>
              <p className="font-sans text-[0.65rem] tracking-[0.2em] uppercase text-[var(--text-dim)]">
                Навчальний простір KAYA
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ЩО ТАКЕ KAYA */}
      <section className="relative z-[2] py-32 px-8">
        <div className="max-w-[1400px] mx-auto">
          <div className="text-center mb-20">
            <p className="font-sans text-[0.68rem] tracking-[0.4em] uppercase text-[var(--gold-dim)] mb-4">
              Про платформу
            </p>
            <h2 className="font-serif text-[clamp(1.8rem,3.5vw,3rem)] font-light text-[var(--text)]">
              Що таке KAYA?
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="kaya-card group">
              <div className="text-2xl mb-5 opacity-50 group-hover:opacity-80 transition-opacity">◈</div>
              <h3 className="font-serif text-[1.15rem] text-[var(--gold-light)] mb-3">Структуровані програми</h3>
              <p className="font-sans text-[0.8rem] font-light leading-[1.7] text-[var(--text-dim)]">
                Навчання не фрагментами, а цілісними маршрутами від початку до результату.
              </p>
            </div>
            <div className="kaya-card group">
              <div className="text-2xl mb-5 opacity-50 group-hover:opacity-80 transition-opacity">◉</div>
              <h3 className="font-serif text-[1.15rem] text-[var(--gold-light)] mb-3">Підготовка до результату</h3>
              <p className="font-sans text-[0.8rem] font-light leading-[1.7] text-[var(--text-dim)]">
                НМТ, іспити, діагностика, контроль прогресу — все в одному просторі.
              </p>
            </div>
            <div className="kaya-card group">
              <div className="text-2xl mb-5 opacity-50 group-hover:opacity-80 transition-opacity">◎</div>
              <h3 className="font-serif text-[1.15rem] text-[var(--gold-light)] mb-3">Просторова навігація</h3>
              <p className="font-sans text-[0.8rem] font-light leading-[1.7] text-[var(--text-dim)]">
                {"Теми відкриваються як пов'язаний інтелектуальний простір, а не сухий список."}
              </p>
            </div>
            <div className="kaya-card group">
              <div className="text-2xl mb-5 opacity-50 group-hover:opacity-80 transition-opacity">◇</div>
              <h3 className="font-serif text-[1.15rem] text-[var(--gold-light)] mb-3">Персональний шлях</h3>
              <p className="font-sans text-[0.8rem] font-light leading-[1.7] text-[var(--text-dim)]">
                Платформа адаптується під рівень, темп і роль кожного користувача.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ПРОГРАМИ */}
      <section id="programs" className="relative z-[2] py-32 px-8">
        <div className="max-w-[1400px] mx-auto">
          <div className="text-center mb-20">
            <p className="font-sans text-[0.68rem] tracking-[0.4em] uppercase text-[var(--gold-dim)] mb-4">
              Напрями навчання
            </p>
            <h2 className="font-serif text-[clamp(1.8rem,3.5vw,3rem)] font-light text-[var(--text)]">
              Програми KAYA
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {programs.map((program, i) => (
              <div key={i} className="kaya-card group cursor-pointer">
                <h3 className="font-serif text-[1.3rem] text-[var(--gold-light)] mb-3">
                  {program.title}
                </h3>
                <p className="font-sans text-[0.8rem] font-light leading-[1.7] text-[var(--text-dim)] mb-6">
                  {program.desc}
                </p>
                <div className="flex items-center justify-between">
                  <span className="font-sans text-[0.68rem] tracking-[0.1em] text-[var(--text-dim)]">
                    {program.modules} модулів · {program.level}
                  </span>
                  <span className="font-sans text-[0.68rem] tracking-[0.15em] uppercase text-[var(--gold-dim)] group-hover:text-[var(--gold-light)] transition-colors">
                    Детальніше →
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="relative z-[2] py-16 px-8 border-t border-[rgba(201,169,110,0.08)]">
        <div className="max-w-[1400px] mx-auto flex items-center justify-between">
          <span className="font-serif text-lg tracking-[0.15em] text-[var(--text-dim)]">KAYA</span>
          <span className="font-sans text-[0.65rem] tracking-[0.15em] text-[var(--text-dim)]">
            © 2026 KAYA Learning Management System
          </span>
        </div>
      </footer>
    </div>
  );
}