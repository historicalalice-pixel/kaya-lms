"use client";

import { useEffect, useRef } from "react";

export default function Home() {
  const starfieldRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const field = starfieldRef.current;
    if (!field) return;

    for (let i = 0; i < 250; i++) {
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
    <>
      {/* Зоряне небо */}
      <div ref={starfieldRef} className="starfield" />

      {/* Кутові рамки */}
      <div className="fixed inset-0 z-[1] pointer-events-none">
        <div className="corner corner--tl" />
        <div className="corner corner--tr" />
        <div className="corner corner--bl" />
        <div className="corner corner--br" />
      </div>

      {/* Горизонт */}
      <div className="horizon-glow" />
      <div className="horizon-line" />

      {/* Головний екран */}
      <section className="hero">
        {/* Декоративна точка */}
        <div
          className="w-3 h-3 rounded-full border border-[var(--gold-dim)] relative mb-28 opacity-0 animate-fade-down"
          style={{ animationDelay: "0.3s" }}
        >
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-[var(--gold)]" />
        </div>

        <p
          className="font-sans text-[0.72rem] font-normal tracking-[0.35em] uppercase text-[var(--text-dim)] mb-8 opacity-0 animate-fade-down"
          style={{ animationDelay: "0.5s" }}
        >
          Платформа з вивчення історії України
        </p>

        <h1
          className="font-serif font-light text-[clamp(5rem,14vw,12rem)] tracking-[0.2em] leading-none text-[var(--text)] opacity-0 animate-fade-scale"
          style={{ animationDelay: "0.7s" }}
        >
          KAYA
        </h1>

        <div
          className="hero-line opacity-0 animate-fade-in"
          style={{ animationDelay: "1.1s" }}
        />

        <p
          className="font-serif text-[clamp(1rem,2.2vw,1.35rem)] font-light italic text-[var(--gold-light)] mt-16 mb-36 opacity-0 animate-fade-in"
          style={{ animationDelay: "1.4s" }}
        >
          Пройди крізь час. Відчуй кожну епоху.
        </p>

      href="/home"
          className="hero-cta opacity-0 animate-fade-up mt-24"
          style={{ animationDelay: "1.7s" }}
        >
          Увійти
        </a>
      </section>

      {/* Версія */}
      <div className="fixed bottom-0 right-0 z-10 px-10 pb-7 pointer-events-none">
        <span
          className="font-sans text-[0.58rem] tracking-[0.15em] text-[var(--gold-dim)] opacity-0 animate-fade-in"
          style={{ animationDelay: "2.2s" }}
        >
          v1.0 · 2026
        </span>
      </div>
    </>
  );
}