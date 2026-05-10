"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/cn";

type StarfieldProps = {
  /** Approximate stars per 100 000 px². Default tuned for desktop hero. */
  density?: number;
  /** Force a star count (overrides density). */
  count?: number;
  /** Extra classes for the container. */
  className?: string;
  /** z-index. Default 0 (behind content). */
  zIndex?: number;
};

type Star = {
  x: number;
  y: number;
  r: number;
  baseAlpha: number;
  twinkleSpeed: number;
  twinkleOffset: number;
};

/**
 * Single canvas-based starfield, shared across pages.
 *
 * Why a canvas (not 250 absolutely-positioned divs):
 *  - One node, one paint layer
 *  - Easy to pause when the tab is hidden
 *  - Honours `prefers-reduced-motion` (renders static stars, no twinkle)
 *  - Resilient to DPR — sharp on retina
 *
 * Position: fixed, full-viewport, pointer-events: none.
 */
export default function Starfield({
  density = 0.0007,
  count,
  className,
  zIndex = 0,
}: StarfieldProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let stars: Star[] = [];
    let dpr = Math.max(1, Math.min(window.devicePixelRatio || 1, 2));
    let width = 0;
    let height = 0;
    let startTs = performance.now();

    const reduceMotionMq = window.matchMedia("(prefers-reduced-motion: reduce)");
    let reduceMotion = reduceMotionMq.matches;

    const seed = (n: number) => {
      // Deterministic-ish small PRNG so stars stay put on resize.
      const x = Math.sin(n * 9301 + 49297) * 233280;
      return x - Math.floor(x);
    };

    const buildStars = () => {
      const total =
        typeof count === "number"
          ? count
          : Math.round(width * height * density);

      stars = new Array(total).fill(0).map((_, i) => {
        const rRand = seed(i + 1);
        const r = rRand < 0.55 ? 1 : rRand < 0.85 ? 1.5 : 2;
        return {
          x: seed(i * 2 + 1) * width,
          y: seed(i * 2 + 2) * height,
          r: r * dpr,
          baseAlpha: 0.25 + seed(i * 3 + 7) * 0.55,
          twinkleSpeed: 0.5 + seed(i * 5 + 11) * 1.6, // Hz-ish
          twinkleOffset: seed(i * 7 + 13) * Math.PI * 2,
        };
      });
    };

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      dpr = Math.max(1, Math.min(window.devicePixelRatio || 1, 2));
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      buildStars();
    };

    const drawStatic = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const s of stars) {
        ctx.globalAlpha = Math.min(1, s.baseAlpha + 0.15);
        ctx.fillStyle = "#ffffff";
        ctx.beginPath();
        ctx.arc(s.x * dpr, s.y * dpr, s.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    };

    const draw = (ts: number) => {
      const elapsed = (ts - startTs) / 1000;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const s of stars) {
        // 0.55 amplitude around baseAlpha, smoothed
        const t = elapsed * s.twinkleSpeed + s.twinkleOffset;
        const flicker = (Math.sin(t) + 1) / 2; // 0..1
        const alpha = Math.max(0.05, Math.min(0.95, s.baseAlpha * (0.4 + flicker * 0.7)));
        ctx.globalAlpha = alpha;
        ctx.fillStyle = "#ffffff";
        ctx.beginPath();
        ctx.arc(s.x * dpr, s.y * dpr, s.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(draw);
    };

    const start = () => {
      cancelAnimationFrame(raf);
      if (reduceMotion) {
        drawStatic();
      } else {
        startTs = performance.now();
        raf = requestAnimationFrame(draw);
      }
    };

    const stop = () => {
      cancelAnimationFrame(raf);
    };

    const onVisibility = () => {
      if (document.hidden) stop();
      else start();
    };

    const onMotionChange = (e: MediaQueryListEvent) => {
      reduceMotion = e.matches;
      start();
    };

    resize();
    start();

    window.addEventListener("resize", resize);
    document.addEventListener("visibilitychange", onVisibility);
    reduceMotionMq.addEventListener("change", onMotionChange);

    return () => {
      stop();
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", onVisibility);
      reduceMotionMq.removeEventListener("change", onMotionChange);
    };
  }, [density, count]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={cn("pointer-events-none fixed inset-0", className)}
      style={{ zIndex }}
    />
  );
}
