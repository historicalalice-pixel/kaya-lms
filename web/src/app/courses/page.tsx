"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";

export default function CoursesPage() {
  const starfieldRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const positionRef = useRef(0);
  const isDraggingRef = useRef(false);
  const startXRef = useRef(0);
  const scrollStartRef = useRef(0);

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
    const track = trackRef.current;
    if (!track) return;

    let animationId: number;

    const cardWidth = 380 + 32;
    const totalCards = 6;
    const resetPoint = cardWidth * totalCards;

    const animate = () => {
      if (!isDraggingRef.current) {
        positionRef.current -= 0.15;
        
        if (positionRef.current <= -resetPoint) {
          positionRef.current = 0;
        }
        if (positionRef.current > 0) {
          positionRef.current = -resetPoint + 10;
        }
        
        track.style.transform = `translateX(${positionRef.current}px)`;
      }
      animationId = requestAnimationFrame(animate);
    };

    animate();

    const handleMouseDown = (e: MouseEvent) => {
      isDraggingRef.current = true;
      startXRef.current = e.clientX;
      scrollStartRef.current = positionRef.current;
      track.style.cursor = 'grabbing';
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDraggingRef.current) return;
      const diff = e.clientX - startXRef.current;
      positionRef.current = scrollStartRef.current + diff;
      
      if (positionRef.current <= -resetPoint) {
        positionRef.current = 0;
        scrollStartRef.current = -diff;
      }
      if (positionRef.current > 0) {
        positionRef.current = -resetPoint;
        scrollStartRef.current = -resetPoint - diff;
      }
      
      track.style.transform = `translateX(${positionRef.current}px)`;
    };

    const handleMouseUp = () => {
      isDraggingRef.current = false;
      track.style.cursor = 'grab';
    };

    const handleTouchStart = (e: TouchEvent) => {
      isDraggingRef.current = true;
      startXRef.current = e.touches[0].clientX;
      scrollStartRef.current = positionRef.current;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isDraggingRef.current) return;
      const diff = e.touches[0].clientX - startXRef.current;
      positionRef.current = scrollStartRef.current + diff;
      
      if (positionRef.current <= -resetPoint) {
        positionRef.current = 0;
        scrollStartRef.current = -diff;
      }
      if (positionRef.current > 0) {
        positionRef.current = -resetPoint;
        scrollStartRef.current = -resetPoint - diff;
      }
      
      track.style.transform = `translateX(${positionRef.current}px)`;
    };

    const handleTouchEnd = () => {
      isDraggingRef.current = false;
    };

    track.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    track.addEventListener('touchstart', handleTouchStart);
    track.addEventListener('touchmove', handleTouchMove);
    track.addEventListener('touchend', handleTouchEnd);

    return () => {
      cancelAnimationFrame(animationId);
      track.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      track.removeEventListener('touchstart', handleTouchStart);
      track.removeEventListener('touchmove', handleTouchMove);
      track.removeEventListener('touchend', handleTouchEnd);
    };
  }, []);

  const programs = [
    { title: "Історія України", desc: "Повний курс від давніх часів до сучасності", modules: 24, level: "Базовий — Поглиблений" },
    { title: "Всесвітня історія", desc: "Ключові події та процеси світової цивілізації", modules: 20, level: "Базовий — Поглиблений" },
    { title: "Підготовка до НМТ", desc: "Цілеспрямована підготовка з діагностикою та тестами", modules: 16, level: "Інтенсив" },
    { title: "Тематичні інтенсиви", desc: "Глибоке занурення в окремі епохи та події", modules: 8, level: "Тематичний" },
    { title: "Great War Protocol", desc: "Спецкурс: Перша та Друга світові війни", modules: 12, level: "Поглиблений" },
    { title: "Спецмодулі", desc: "Авторські добірки, нестандартні теми та зв'язки", modules: 6, level: "Різний" },
  ];

  const duplicatedPrograms = [...programs, ...programs, ...programs];

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
            <Link href="/courses" className="nav-link text-[0.85rem] text-[var(--gold-light)]">Курси</Link>
            <Link href="/about" className="nav-link text-[0.85rem]">Про нас</Link>
            <Link href="/contacts" className="nav-link text-[0.85rem]">Контакти</Link>
          </nav>
          <div className="flex items-center gap-4">
            <Link href="/login" className="nav-link text-[0.85rem]">Увійти</Link>
            <Link href="/register" className="header-btn text-[0.85rem]">Реєстрація</Link>
          </div>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="relative z-10 flex-1 flex flex-col">
        
        {/* PAGE HEADER */}
        <div className="text-center px-6 pt-6">
          <Link href="/home" className="inline-flex items-center gap-2 text-[var(--text-dim)] hover:text-[var(--gold-light)] transition-colors mb-3">
            <span>←</span>
            <span className="font-sans text-[0.85rem]">На головну</span>
          </Link>
          <h1 className="font-serif text-[clamp(2.8rem,6vw,4.5rem)] font-light text-[var(--text)]">
            Програми KAYA
          </h1>
        </div>

        {/* INFINITE CAROUSEL */}
        <div className="flex-1 flex items-center">
          <div className="relative w-full overflow-hidden">
            <div 
              ref={trackRef}
              className="flex gap-8 will-change-transform select-none"
              style={{ paddingLeft: '60px', cursor: 'grab' }}
            >
              {duplicatedPrograms.map((program, i) => (
                <div 
                  key={i} 
                  className="kaya-card group p-8 flex flex-col justify-between min-h-[300px] w-[380px] flex-shrink-0 hover:border-[var(--gold-light)] hover:scale-[1.02] transition-all duration-300"
                >
                  <div>
                    <h3 className="font-serif text-[1.4rem] text-[var(--gold-light)] mb-4">
                      {program.title}
                    </h3>
                    <p className="font-sans text-[0.95rem] font-light leading-[1.8] text-[var(--text-dim)] mb-8">
                      {program.desc}
                    </p>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-sans text-[0.8rem] tracking-[0.1em] text-[var(--text-dim)]">
                      {program.modules} модулів · {program.level}
                    </span>
                    <Link 
                      href={`/courses/${program.title.toLowerCase().replace(/\s+/g, '-')}`}
                      className="font-sans text-[0.8rem] tracking-[0.15em] uppercase text-[var(--gold-dim)] hover:text-[var(--gold-light)] transition-colors"
                    >
                      Детальніше →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center px-6 pb-8">
          <Link href="/register" className="hero-cta inline-block">
            Почати навчання
          </Link>
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