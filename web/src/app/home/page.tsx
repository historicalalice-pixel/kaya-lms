"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import LogoutButton from "@/app/components/logout-button";
import { createClient } from "@/lib/supabase/client";

function WaxSeal({
  label,
  seed,
  href,
  cardTitle,
  cardDesc,
  cardLinkText,
  size = "default",
  compact = false,
  onClick,
}: {
  label: string;
  seed: number;
  href: string;
  cardTitle: string;
  cardDesc: string;
  cardLinkText: string;
  size?: "default" | "mobileMenu";
  compact?: boolean;
  onClick?: () => void;
}) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;

    const ns = "http://www.w3.org/2000/svg";

    function sr(s: number) {
      const x = Math.sin(s) * 10000;
      return x - Math.floor(x);
    }

    function makeBlobPath(cx: number, cy: number, avgR: number, s: number): string {
      const n = 12;
      const points: [number, number][] = [];
      for (let i = 0; i < n; i++) {
        const angle = (i / n) * Math.PI * 2 - Math.PI / 2;
        const noise = sr(s + i * 17.3);
        const noise2 = sr(s + i * 5.7 + 3);
        const bulge = 0.78 + noise * 0.38 + (noise2 > 0.7 ? noise2 * 0.18 : 0);
        const r = avgR * bulge;
        points.push([cx + r * Math.cos(angle), cy + r * Math.sin(angle)]);
      }
      let d = `M ${points[0][0].toFixed(1)},${points[0][1].toFixed(1)}`;
      for (let i = 0; i < n; i++) {
        const p0 = points[(i - 1 + n) % n];
        const p1 = points[i];
        const p2 = points[(i + 1) % n];
        const p3 = points[(i + 2) % n];
        const cp1x = p1[0] + (p2[0] - p0[0]) * 0.25;
        const cp1y = p1[1] + (p2[1] - p0[1]) * 0.25;
        const cp2x = p2[0] - (p3[0] - p1[0]) * 0.25;
        const cp2y = p2[1] - (p3[1] - p1[1]) * 0.25;
        d += ` C ${cp1x.toFixed(1)},${cp1y.toFixed(1)} ${cp2x.toFixed(1)},${cp2y.toFixed(1)} ${p2[0].toFixed(1)},${p2[1].toFixed(1)}`;
      }
      return `${d} Z`;
    }

    while (svg.firstChild) svg.removeChild(svg.firstChild);

    const defs = document.createElementNS(ns, "defs");
    const gradId = `g_${label.replace(/\s/g, "_")}_${seed}`;
    const grad = document.createElementNS(ns, "radialGradient");
    grad.setAttribute("id", gradId);
    grad.setAttribute("cx", "50%");
    grad.setAttribute("cy", "38%");
    grad.setAttribute("r", "58%");

    (
      [
        ["0%", "#1a1608"],
        ["45%", "#2e2510"],
        ["68%", "#5a4418"],
        ["82%", "#8a6a28"],
        ["92%", "#c9a96e"],
        ["97%", "#e2c070"],
        ["100%", "#a07a30"],
      ] as [string, string][]
    ).forEach(([offset, color]) => {
      const stop = document.createElementNS(ns, "stop");
      stop.setAttribute("offset", offset);
      stop.setAttribute("stop-color", color);
      grad.appendChild(stop);
    });

    defs.appendChild(grad);
    svg.appendChild(defs);

    const blob = document.createElementNS(ns, "path");
    blob.setAttribute("d", makeBlobPath(100, 100, 88, seed));
    blob.setAttribute("fill", `url(#${gradId})`);
    svg.appendChild(blob);

    const inner = document.createElementNS(ns, "path");
    inner.setAttribute("d", makeBlobPath(100, 100, 66, seed + 99));
    inner.setAttribute("fill", "#100e08");
    svg.appendChild(inner);

    const ring = document.createElementNS(ns, "path");
    ring.setAttribute("d", makeBlobPath(100, 100, 68, seed + 99));
    ring.setAttribute("fill", "none");
    ring.setAttribute("stroke", "rgba(201,169,110,0.4)");
    ring.setAttribute("stroke-width", "1");
    svg.appendChild(ring);

    const shadow = document.createElementNS(ns, "text");
    shadow.setAttribute("x", "100");
    shadow.setAttribute("y", "106");
    shadow.setAttribute("text-anchor", "middle");
    shadow.setAttribute("font-family", "Manrope, sans-serif");
    shadow.setAttribute("font-size", compact ? "9" : "10");
    shadow.setAttribute("font-weight", "400");
    shadow.setAttribute("letter-spacing", compact ? "3.2" : "4");
    shadow.setAttribute("fill", "rgba(0,0,0,0.95)");
    shadow.setAttribute("transform", "translate(0.9,0.9)");
    shadow.textContent = label;
    svg.appendChild(shadow);

    const text = document.createElementNS(ns, "text");
    text.setAttribute("x", "100");
    text.setAttribute("y", "106");
    text.setAttribute("text-anchor", "middle");
    text.setAttribute("font-family", "Manrope, sans-serif");
    text.setAttribute("font-size", compact ? "9" : "10");
    text.setAttribute("font-weight", "400");
    text.setAttribute("letter-spacing", compact ? "3.2" : "4");
    text.setAttribute("fill", "rgba(220,185,110,0.8)");
    text.textContent = label;
    svg.appendChild(text);
  }, [label, seed, compact]);

  const sz = size === "mobileMenu" ? "min(200px, 60vw)" : "min(220px, 80vw)";

  return (
    <div
      style={{ position: "relative", width: sz, height: sz, flexShrink: 0 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Печатка SVG */}
      <svg
        ref={svgRef}
        viewBox="0 0 200 200"
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          display: "block",
          overflow: "visible",
          transition: "opacity 0.45s ease, transform 0.45s ease",
        }}
        className={hovered ? "seal-hovered" : "seal-default"}
      />

      {/* Hover-карточка — тільки desktop */}
      <Link
        href={href}
        onClick={onClick}
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          width: size === "mobileMenu" ? "min(250px, 76vw)" : "min(240px, 85vw)",
          transform: hovered
            ? "translate(-50%, -50%) scale(1)"
            : "translate(-50%, -50%) scale(0.88)",
          background: "rgba(12,10,7,0.97)",
          border: "1px solid rgba(201,169,110,0.28)",
          padding: size === "mobileMenu" ? "18px 16px" : "22px 18px",
          zIndex: 10,
          textDecoration: "none",
          opacity: hovered ? 1 : 0,
          transition: "all 0.45s cubic-bezier(0.4,0,0.2,1)",
          pointerEvents: hovered ? "auto" : "none",
        }}
        className="seal-card"
      >
        <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: size === "mobileMenu" ? "1.25rem" : "1.4rem", fontWeight: 300, color: "#e2c992", letterSpacing: "0.05em", marginBottom: 10 }}>
          {cardTitle}
        </div>
        <div style={{ fontFamily: "'Manrope', sans-serif", fontSize: size === "mobileMenu" ? "0.74rem" : "0.78rem", fontWeight: 300, color: "#9a958d", lineHeight: 1.75 }}>
          {cardDesc}
        </div>
        <div style={{ marginTop: 16, display: "inline-block", fontFamily: "'Manrope', sans-serif", fontSize: "0.6rem", letterSpacing: "0.25em", textTransform: "uppercase", color: "#c9a96e", borderBottom: "1px solid rgba(201,169,110,0.3)", paddingBottom: 2 }}>
          {cardLinkText} →
        </div>
      </Link>

      {/* Touch overlay — весь контейнер клікабельний на мобільному */}
      <Link
        href={href}
        onClick={onClick}
        style={{ position: "absolute", inset: 0, zIndex: 5 }}
        className="seal-touch-link"
        aria-label={cardTitle}
      />

      <style>{`
        @media (hover: hover) {
          .seal-hovered { opacity: 0 !important; transform: scale(0.92) !important; pointer-events: none !important; }
          .seal-default { opacity: 1; transform: scale(1); }
          .seal-card { display: block !important; }
          .seal-touch-link { display: none !important; }
        }
        @media (hover: none) {
          .seal-hovered, .seal-default { opacity: 1 !important; transform: scale(1) !important; pointer-events: none !important; }
          .seal-card { display: none !important; }
          .seal-touch-link { display: block !important; }
        }
      `}</style>
    </div>
  );
}

export default function HomePage() {
  const starfieldRef = useRef<HTMLDivElement>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
    return () => { stars.forEach((s) => s.remove()); };
  }, []);

  useEffect(() => {
    const supabase = createClient();
    const loadUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (!error && data.user) {
        setUserEmail(data.user.email ?? null);
        const { data: profile } = await supabase.from("profiles").select("full_name").eq("id", data.user.id).single();
        setUserName(profile?.full_name ?? null);
      } else {
        setUserEmail(null);
        setUserName(null);
      }
      setAuthLoading(false);
    };
    loadUser();
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUserEmail(session.user.email ?? null);
        createClient().from("profiles").select("full_name").eq("id", session.user.id).single().then(({ data: p }) => setUserName(p?.full_name ?? null));
      } else {
        setUserEmail(null);
        setUserName(null);
      }
      setAuthLoading(false);
    });
    return () => { subscription.unsubscribe(); };
  }, []);

  useEffect(() => {
    if (!mobileMenuOpen) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = originalOverflow; };
  }, [mobileMenuOpen]);

  const displayName = userName || userEmail;

  return (
    <div className="min-h-screen flex flex-col overflow-hidden bg-[var(--bg)]">
      <div ref={starfieldRef} className="starfield" />

      <header className="relative z-20 w-full">
        <div
          className="w-full flex items-center justify-between"
          style={{ paddingLeft: "clamp(20px, 7vw, 140px)", paddingRight: "clamp(20px, 7vw, 140px)", paddingTop: "22px", paddingBottom: "18px" }}
        >
          <Link href="/" className="font-serif text-[2rem] md:text-[2.75rem] tracking-[0.24em] text-[rgba(245,239,230,0.94)] hover:text-[var(--text)] transition-colors duration-300">
            KAYA
          </Link>
          <div className="hidden md:flex items-center gap-5 md:gap-6">
            {authLoading ? (
              <span className="font-sans text-[0.95rem] text-[var(--text-dim)]">...</span>
            ) : userEmail ? (
              <>
                <span className="hidden md:inline font-sans text-[0.85rem] text-[var(--text-dim)] max-w-[180px] truncate">{displayName}</span>
                <Link href="/dashboard" className="font-sans text-[0.82rem] tracking-[0.18em] uppercase text-[rgba(245,239,230,0.82)] hover:text-[var(--gold-light)] transition-colors duration-300">Кабінет</Link>
                <LogoutButton />
              </>
            ) : (
              <>
                <Link href="/login" className="font-sans text-[0.92rem] tracking-[0.18em] uppercase text-[rgba(245,239,230,0.82)] hover:text-[var(--gold-light)] transition-colors duration-300">Увійти</Link>
                <Link href="/register" className="inline-flex items-center justify-center min-h-[48px] px-6 md:px-7 border border-[rgba(201,169,110,0.55)] bg-[rgba(201,169,110,0.04)] font-sans text-[0.9rem] tracking-[0.18em] uppercase text-[rgba(245,239,230,0.95)] hover:border-[rgba(227,196,136,0.9)] hover:bg-[rgba(201,169,110,0.08)] transition-all duration-300">Реєстрація</Link>
              </>
            )}
          </div>
          <button className="md:hidden flex flex-col justify-center items-center w-10 h-10 gap-[6px] focus:outline-none" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} aria-label="Меню">
            <span style={{ display: "block", width: "22px", height: "1px", background: "var(--gold)", transition: "all 0.3s ease", transform: mobileMenuOpen ? "translateY(7px) rotate(45deg)" : "none" }} />
            <span style={{ display: "block", width: "22px", height: "1px", background: "var(--gold)", transition: "all 0.3s ease", opacity: mobileMenuOpen ? 0 : 1 }} />
            <span style={{ display: "block", width: "22px", height: "1px", background: "var(--gold)", transition: "all 0.3s ease", transform: mobileMenuOpen ? "translateY(-7px) rotate(-45deg)" : "none" }} />
          </button>
        </div>
      </header>

      {/* Mobile fullscreen menu */}
      <div style={{ position: "fixed", inset: 0, zIndex: 50, background: "rgba(10,10,12,0.97)", display: "flex", flexDirection: "column", transition: "opacity 0.35s ease, visibility 0.35s ease", opacity: mobileMenuOpen ? 1 : 0, visibility: mobileMenuOpen ? "visible" : "hidden", pointerEvents: mobileMenuOpen ? "auto" : "none" }}>
        <button onClick={() => setMobileMenuOpen(false)} style={{ position: "absolute", top: "24px", right: "clamp(20px, 5vw, 80px)", background: "none", border: "none", cursor: "pointer", color: "var(--gold)", fontSize: "1.5rem", lineHeight: 1, zIndex: 2 }} aria-label="Закрити">✕</button>
        <div style={{ flex: 1, overflowY: "auto", WebkitOverflowScrolling: "touch", padding: "88px 20px 32px", display: "flex", flexDirection: "column", alignItems: "center" }}>
          <div style={{ fontFamily: "var(--font-serif), serif", fontSize: "1.6rem", letterSpacing: "0.3em", color: "var(--text-dim)", marginBottom: "28px" }}>KAYA</div>
          <p style={{ fontFamily: "var(--font-sans), sans-serif", fontSize: "0.72rem", letterSpacing: "0.28em", textTransform: "uppercase", color: "rgba(201,169,110,0.68)", marginBottom: "18px", textAlign: "center" }}>Розділи платформи</p>
          <div style={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center", gap: "14px" }}>
            <WaxSeal label="КУРСИ" seed={42.1} href="/courses" cardTitle="Курси" cardDesc="Каталог програм з історії України та світу. Підготовка до НМТ." cardLinkText="Переглянути" size="mobileMenu" compact onClick={() => setMobileMenuOpen(false)} />
            <WaxSeal label="ПРО НАС" seed={87.5} href="/about" cardTitle="Про нас" cardDesc="KAYA — платформа з репетиторами для глибокого вивчення історії." cardLinkText="Дізнатися більше" size="mobileMenu" compact onClick={() => setMobileMenuOpen(false)} />
            <WaxSeal label="КОНТАКТИ" seed={133.9} href="/contacts" cardTitle="Контакти" cardDesc="Зв'яжіться з нами — відповімо на будь-які питання." cardLinkText="Написати" size="mobileMenu" compact onClick={() => setMobileMenuOpen(false)} />
          </div>
          <div style={{ width: "44px", height: "1px", background: "rgba(201,169,110,0.25)", margin: "24px 0 20px" }} />
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "16px" }}>
            {userEmail ? (
              <>
                <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)} style={{ fontFamily: "var(--font-sans), sans-serif", fontSize: "0.85rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--text-dim)", textDecoration: "none" }}>Кабінет</Link>
                <LogoutButton />
              </>
            ) : (
              <>
                <Link href="/login" onClick={() => setMobileMenuOpen(false)} style={{ fontFamily: "var(--font-sans), sans-serif", fontSize: "0.85rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--text-dim)", textDecoration: "none" }}>Увійти</Link>
                <Link href="/register" onClick={() => setMobileMenuOpen(false)} style={{ fontFamily: "var(--font-sans), sans-serif", fontSize: "0.85rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--gold-light)", textDecoration: "none", border: "1px solid rgba(201,169,110,0.4)", padding: "12px 32px" }}>Реєстрація</Link>
              </>
            )}
          </div>
        </div>
      </div>

      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 py-12 md:py-14">
        <div className="w-full mx-auto text-center" style={{ maxWidth: 980 }}>
          <p className="font-sans text-[0.9rem] md:text-[0.95rem] tracking-[0.38em] uppercase text-[var(--gold-dim)] mb-7">Освітня платформа</p>
          <h1 className="font-serif text-[clamp(2.6rem,5.4vw,4.9rem)] font-light leading-[1.12] text-[var(--text)] mb-8 mx-auto">
            Простір, де історія набуває голосу.
          </h1>
          <div className="mb-14 text-center">
            <p className="font-sans text-[1.05rem] md:text-[1.18rem] font-light leading-[1.8] text-[var(--text-dim)]">KAYA — платформа для вивчення історії з репетиторами.</p>
            <p className="font-sans text-[1.05rem] md:text-[1.18rem] font-light leading-[1.8] text-[var(--text-dim)]">Структуроване навчання, підготовка до НМТ, персональний підхід.</p>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "clamp(16px, 5vw, 40px)", alignItems: "center", justifyContent: "center", marginBottom: 48 }}>
            <WaxSeal label="КУРСИ" seed={42.1} href="/courses" cardTitle="Курси" cardDesc="Каталог програм з історії України та світу. Підготовка до НМТ." cardLinkText="Переглянути" />
            <WaxSeal label="ПРО НАС" seed={87.5} href="/about" cardTitle="Про нас" cardDesc="KAYA — платформа з репетиторами для глибокого вивчення історії." cardLinkText="Дізнатися більше" />
            <WaxSeal label="КОНТАКТИ" seed={133.9} href="/contacts" cardTitle="Контакти" cardDesc="Зв'яжіться з нами — відповімо на будь-які питання." cardLinkText="Написати" />
          </div>
          <div className="flex items-center justify-center">
            <Link href="/register?role=student" className="hero-cta w-full lg:w-[340px] text-center text-[0.98rem] md:text-[1rem] min-h-[60px] flex items-center justify-center">
              Я учень — Почати навчання
            </Link>
          </div>
        </div>
      </main>

      <footer className="relative z-10 py-6 px-6 border-t border-[rgba(201,169,110,0.08)]">
        <div className="max-w-[1400px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="font-serif text-[1.2rem] tracking-[0.18em] text-[var(--text-dim)]">KAYA</span>
          <div className="flex items-center gap-6">
            <Link href="/about" className="font-sans text-[0.82rem] text-[var(--text-dim)] hover:text-[var(--gold-light)] transition-colors">Про нас</Link>
            <Link href="/contacts" className="font-sans text-[0.82rem] text-[var(--text-dim)] hover:text-[var(--gold-light)] transition-colors">Контакти</Link>
            <Link href="/privacy" className="font-sans text-[0.82rem] text-[var(--text-dim)] hover:text-[var(--gold-light)] transition-colors">Конфіденційність</Link>
          </div>
          <span className="font-sans text-[0.82rem] text-[var(--text-dim)]">© 2026 KAYA LMS</span>
        </div>
      </footer>
    </div>
  );
}