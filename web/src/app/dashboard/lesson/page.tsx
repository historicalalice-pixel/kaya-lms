"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN!;

const LESSON = {
  module: "Модуль 1 · Давня Україна",
  title: "Хрещення Русі та його наслідки",
  duration: "25 хв",
  index: 3,
  total: 4,
  progress: 40,
  topic: {
    label: "Київська Русь",
    period: "IX–XIII ст.",
    center: [33.0, 51.5] as [number, number],
    zoom: 3.8,
    color: "#c9a96e",
    territory: {
      type: "Feature" as const,
      properties: { name: "Київська Русь" },
      geometry: {
        type: "Polygon" as const,
        coordinates: [[
          [28.0, 57.5], [39.5, 57.0], [40.5, 54.5], [37.5, 51.5],
          [36.5, 47.5], [33.5, 45.5], [30.0, 46.5], [24.0, 49.0],
          [24.0, 52.0], [28.5, 55.5], [28.0, 57.5]
        ]]
      }
    },
    events: [
      { id: 1, year: 882,  title: "Олег захоплює Київ",             coords: [30.52, 50.45] as [number, number], desc: "Князь Олег об'єднує Новгород і Київ. Київ стає столицею держави." },
      { id: 2, year: 988,  title: "Хрещення Русі",                  coords: [30.46, 50.43] as [number, number], desc: "Князь Володимир Великий наказує хрестити киян у водах Дніпра. Православ'я стає державною релігією Русі." },
      { id: 3, year: 1037, title: "Будівництво Софійського собору", coords: [30.51, 50.45] as [number, number], desc: "Ярослав Мудрий будує Софійський собор у Києві — символ розквіту та могутності Київської Русі." },
      { id: 4, year: 1240, title: "Батиєва навала. Падіння Києва",  coords: [32.50, 49.50] as [number, number], desc: "Монгольська орда руйнує Київ. Кінець Київської Русі як держави." },
    ],
    keyDates: [
      { year: "?–912",    name: "Олег Віщий",       note: "Правління першого князя. Об'єднання Новгорода і Києва." },
      { year: "890–969",  name: "Ольга",             note: "Регентство. Перша правителька-християнка, реформи данини." },
      { year: "960–1015", name: "Володимир Великий", note: "Хрещення Русі (988). Будівництво Десятинної церкви." },
      { year: "978–1054", name: "Ярослав Мудрий",    note: "Розквіт держави. Руська правда. Софійський собор (1037)." },
      { year: "1054",     name: "Розпад на уділи",   note: "Після смерті Ярослава Мудрого починається роздробленість." },
      { year: "1240",     name: "Батиєва навала",    note: "Монголи руйнують Київ. Кінець Київської Русі як держави." },
    ],
    figures: [
      { name: "Олег Віщий",        years: "?–912",    role: "Перший князь Київської Русі, об'єднав Новгород і Київ" },
      { name: "Володимир Великий", years: "960–1015", role: "Хреститель Русі, будівничий держави" },
      { name: "Ярослав Мудрий",    years: "978–1054", role: "Розквіт держави, Руська правда, Софія Київська" },
      { name: "Ольга",             years: "890–969",  role: "Перша правителька-християнка, реформи управління" },
    ],
  },
};

type Tab = "text" | "map" | "dates" | "figures" | "test";

export default function LessonPage() {
  const [activeTab, setActiveTab] = useState<Tab>("text");
  const [mapSideTab, setMapSideTab] = useState<"events" | "figures">("events");
  const [activeEvent, setActiveEvent] = useState<number | null>(null);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const mapRef = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mapInstanceRef = useRef<any>(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  const topic = LESSON.topic;
  const gold = "#c9a96e";
  const goldDim = "#8a7444";
  const goldLight = "#e2c992";
  const textColor = "#e8e4dd";
  const textDim = "rgba(154,149,141,0.7)";
  const borderFaint = "rgba(201,169,110,0.06)";

  useEffect(() => {
    const timer = setTimeout(() => {
      if (mapInstanceRef.current || !mapRef.current) return;
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = "https://api.mapbox.com/mapbox-gl-js/v3.3.0/mapbox-gl.css";
      document.head.appendChild(link);
      const script = document.createElement("script");
      script.src = "https://api.mapbox.com/mapbox-gl-js/v3.3.0/mapbox-gl.js";
      script.onload = () => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const mapboxgl = (window as any).mapboxgl;
        mapboxgl.accessToken = MAPBOX_TOKEN;
        const map = new mapboxgl.Map({
          container: mapRef.current,
          style: "mapbox://styles/mapbox/dark-v11",
          center: topic.center,
          zoom: topic.zoom,
          attributionControl: false,
        });
        mapInstanceRef.current = map;
        map.on("load", () => {
          map.addSource("territory", { type: "geojson", data: topic.territory });
          map.addLayer({ id: "territory-fill", type: "fill", source: "territory", paint: { "fill-color": topic.color, "fill-opacity": 0.08 } });
          map.addLayer({ id: "territory-line", type: "line", source: "territory", paint: { "line-color": topic.color, "line-width": 1.5, "line-opacity": 0.5 } });
          const offsets: [number, number][] = [[0,0],[-22,-18],[20,-12],[0,0]];
          topic.events.forEach((ev, index) => {
            const el = document.createElement("div");
            const offset = offsets[index] || [0,0];
            el.style.cssText = `width:30px;height:30px;border-radius:50%;background:rgba(10,10,12,0.95);border:1.5px solid ${topic.color};display:flex;align-items:center;justify-content:center;cursor:pointer;font-family:'Manrope',sans-serif;font-size:8.5px;color:${topic.color};font-weight:600;box-shadow:0 0 14px ${topic.color}55;transition:all 0.2s;margin-left:${offset[0]}px;margin-top:${offset[1]}px;`;
            el.textContent = String(ev.year);
            el.addEventListener("mouseenter", () => { el.style.background = `${topic.color}22`; el.style.transform = "scale(1.15)"; });
            el.addEventListener("mouseleave", () => { el.style.background = "rgba(10,10,12,0.95)"; el.style.transform = "scale(1)"; });
            el.addEventListener("click", () => { setActiveEvent(ev.id); map.flyTo({ center: ev.coords, zoom: 7, duration: 1000 }); });
            new mapboxgl.Marker({ element: el }).setLngLat(ev.coords).addTo(map);
          });
          setMapLoaded(true);
        });
      };
      document.head.appendChild(script);
    }, 100);
    return () => clearTimeout(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleTabChange = (key: Tab) => {
    setActiveTab(key);
    if (key === "map" && mapInstanceRef.current) {
      setTimeout(() => mapInstanceRef.current.resize(), 50);
    }
  };

  useEffect(() => {
    if (!mapInstanceRef.current || activeEvent === null) return;
    const ev = topic.events.find(e => e.id === activeEvent);
    if (ev) mapInstanceRef.current.flyTo({ center: ev.coords, zoom: 7, duration: 1000 });
  }, [activeEvent, topic.events]);

  const currentEvent = topic.events.find(e => e.id === activeEvent);

  const tabs: { key: Tab; label: string }[] = [
    { key: "text",    label: "Текст" },
    { key: "map",     label: "Карта" },
    { key: "dates",   label: "Дати" },
    { key: "figures", label: "Постаті" },
    { key: "test",    label: "Тест" },
  ];

  const testQuestions = [
    { q: "У якому році відбулося хрещення Київської Русі?", options: ["862 р.", "988 р.", "1054 р.", "1240 р."], correct: 1 },
    { q: "Який собор побудував Ярослав Мудрий?", options: ["Десятинна церква", "Михайлівський собор", "Софійський собор", "Успенський собор"], correct: 2 },
  ];

  return (
    <div style={{ height: "100vh", background: "#0a0a0c", color: textColor, fontFamily: "'Manrope', sans-serif", display: "flex", overflow: "hidden" }}>

      {/* MOBILE OVERLAY */}
      {mobileNavOpen && <div onClick={() => setMobileNavOpen(false)} style={{ position: "fixed", inset: 0, zIndex: 150, background: "rgba(0,0,0,0.6)" }} />}

      {/* SIDEBAR — desktop only */}
      <aside className="lesson-sidebar" style={{ width: 220, flexShrink: 0, borderRight: "1px solid rgba(201,169,110,0.1)", display: "flex", flexDirection: "column", padding: "28px 0", height: "100vh", overflow: "hidden", background: "rgba(10,10,12,0.98)" }}>
        <Link href="/home" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.8rem", fontWeight: 300, letterSpacing: "0.3em", color: "rgba(245,239,230,0.9)", textDecoration: "none", padding: "0 24px 20px", display: "block", borderBottom: "1px solid rgba(201,169,110,0.08)" }}>KAYA</Link>
        <nav style={{ flex: 1, padding: "14px 12px", display: "flex", flexDirection: "column", gap: 1 }}>
          <p style={{ fontSize: "0.5rem", letterSpacing: "0.3em", textTransform: "uppercase", color: "rgba(138,116,68,0.4)", padding: "4px 10px 10px" }}>Навчання</p>
          {[
            { href: "/dashboard", label: "Dashboard" },
            { href: "/dashboard/learning", label: "Моє навчання", active: true },
            { href: "/dashboard/assignments", label: "Завдання" },
            { href: "/dashboard/tests", label: "Тести" },
            { href: "/dashboard/schedule", label: "Розклад" },
            { href: "/map", label: "Карта" },
          ].map(({ href, label, active }) => (
            <Link key={href} href={href} style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 10px", borderRadius: 4, textDecoration: "none", fontSize: "0.78rem", color: active ? goldLight : "rgba(154,149,141,0.7)", background: active ? "rgba(201,169,110,0.08)" : "transparent", borderLeft: `2px solid ${active ? goldDim : "transparent"}` }}>
              {label}
            </Link>
          ))}
        </nav>
        <div style={{ padding: "14px 12px 0", borderTop: "1px solid rgba(201,169,110,0.08)" }}>
          <Link href="/dashboard" style={{ display: "flex", alignItems: "center", gap: 8, padding: "9px 10px", borderRadius: 4, textDecoration: "none", fontSize: "0.75rem", color: "rgba(154,149,141,0.45)" }}>← Назад до кабінету</Link>
        </div>
      </aside>

      {/* MOBILE SIDEBAR DRAWER */}
      <aside className="lesson-sidebar-mobile" style={{ position: "fixed", top: 0, left: mobileNavOpen ? 0 : -260, width: 260, height: "100vh", background: "rgba(10,10,12,0.99)", borderRight: "1px solid rgba(201,169,110,0.15)", display: "flex", flexDirection: "column", padding: "24px 0", zIndex: 200, transition: "left 0.3s ease", overflow: "hidden" }}>
        <Link href="/home" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.8rem", fontWeight: 300, letterSpacing: "0.3em", color: "rgba(245,239,230,0.9)", textDecoration: "none", padding: "0 20px 20px", display: "block", borderBottom: "1px solid rgba(201,169,110,0.08)" }}>KAYA</Link>
        <nav style={{ flex: 1, padding: "14px 12px", display: "flex", flexDirection: "column", gap: 1 }}>
          {[
            { href: "/dashboard", label: "Dashboard" },
            { href: "/dashboard/learning", label: "Моє навчання", active: true },
            { href: "/dashboard/assignments", label: "Завдання" },
            { href: "/dashboard/tests", label: "Тести" },
            { href: "/dashboard/schedule", label: "Розклад" },
            { href: "/map", label: "Карта" },
          ].map(({ href, label, active }) => (
            <Link key={href} href={href} onClick={() => setMobileNavOpen(false)} style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 10px", borderRadius: 4, textDecoration: "none", fontSize: "0.82rem", color: active ? goldLight : "rgba(154,149,141,0.7)", background: active ? "rgba(201,169,110,0.08)" : "transparent", borderLeft: `2px solid ${active ? goldDim : "transparent"}` }}>
              {label}
            </Link>
          ))}
        </nav>
        <div style={{ padding: "14px 12px 0", borderTop: "1px solid rgba(201,169,110,0.08)" }}>
          <Link href="/dashboard" onClick={() => setMobileNavOpen(false)} style={{ display: "flex", alignItems: "center", gap: 8, padding: "9px 10px", textDecoration: "none", fontSize: "0.78rem", color: "rgba(154,149,141,0.45)" }}>← Назад до кабінету</Link>
        </div>
      </aside>

      {/* MAIN */}
      <main style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0, height: "100vh", overflow: "hidden" }}>

        {/* MOBILE TOP BAR */}
        <div className="lesson-mobile-bar" style={{ display: "none", alignItems: "center", justifyContent: "space-between", padding: "12px 16px", borderBottom: "1px solid rgba(201,169,110,0.08)", flexShrink: 0 }}>
          <button onClick={() => setMobileNavOpen(true)} style={{ background: "none", border: "1px solid rgba(201,169,110,0.2)", color: goldDim, cursor: "pointer", padding: "6px 10px", borderRadius: 4, fontSize: "0.6rem", letterSpacing: "0.1em" }}>☰ Меню</button>
          <Link href="/home" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.3rem", fontWeight: 300, letterSpacing: "0.3em", color: "rgba(245,239,230,0.9)", textDecoration: "none" }}>KAYA</Link>
          <Link href="/dashboard" style={{ fontSize: "0.6rem", color: "rgba(154,149,141,0.5)", textDecoration: "none", letterSpacing: "0.1em" }}>← Назад</Link>
        </div>

        {/* HEADER */}
        <div style={{ padding: "18px 20px 0", borderBottom: "1px solid rgba(201,169,110,0.1)", flexShrink: 0 }}>
          <div className="lesson-breadcrumb" style={{ fontSize: "0.62rem", color: "rgba(154,149,141,0.4)", marginBottom: 8, display: "flex", gap: 6, flexWrap: "wrap" }}>
            <Link href="/dashboard" style={{ color: "inherit", textDecoration: "none" }}>Кабінет</Link>
            <span style={{ color: "rgba(138,116,68,0.35)" }}>›</span>
            <span>Урок {LESSON.index}</span>
          </div>
          <p style={{ fontSize: "0.55rem", letterSpacing: "0.22em", textTransform: "uppercase", color: "rgba(138,116,68,0.7)", marginBottom: 5 }}>{LESSON.module}</p>
          <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(1.2rem, 4vw, 2rem)", fontWeight: 300, color: textColor, marginBottom: 8, lineHeight: 1.2 }}>{LESSON.title}</h1>
          <div style={{ display: "flex", alignItems: "center", gap: 12, fontSize: "0.65rem", color: "rgba(154,149,141,0.45)", marginBottom: 10, flexWrap: "wrap" }}>
            <span>⏱ {LESSON.duration}</span>
            <span>Урок {LESSON.index} з {LESSON.total}</span>
            <span style={{ color: goldDim }}>● В процесі</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ flex: 1, height: 2, background: "rgba(201,169,110,0.08)", borderRadius: 1 }}>
              <div style={{ width: `${LESSON.progress}%`, height: "100%", background: goldDim, borderRadius: 1 }} />
            </div>
            <span style={{ fontSize: "0.6rem", color: "rgba(138,116,68,0.7)" }}>{LESSON.progress}%</span>
          </div>
          {/* TABS */}
          <div style={{ display: "flex", overflowX: "auto", marginTop: 16, gap: 0 }}>
            {tabs.map(({ key, label }) => (
              <button key={key} onClick={() => handleTabChange(key)} style={{ padding: "10px 16px", background: "transparent", border: "none", borderBottom: activeTab === key ? `2px solid ${goldDim}` : "2px solid transparent", cursor: "pointer", fontSize: "0.6rem", letterSpacing: "0.14em", textTransform: "uppercase", color: activeTab === key ? goldLight : "rgba(154,149,141,0.4)", transition: "all 0.2s", whiteSpace: "nowrap", flexShrink: 0 }}>
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* CONTENT WRAPPER */}
        <div style={{ flex: 1, overflow: "hidden", display: "flex", flexDirection: "column" }}>

          {/* КАРТА */}
          <div style={{ flex: 1, display: activeTab === "map" ? "flex" : "none", flexDirection: "column" }} className="map-container">
            {/* Карта на повну висоту */}
            <div style={{ flex: 1, position: "relative", minHeight: 260 }}>
              <div ref={mapRef} style={{ position: "absolute", inset: 0 }} />
              {!mapLoaded && (
                <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", background: "#0a0a0c", zIndex: 10 }}>
                  <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.1rem", fontStyle: "italic", color: "rgba(201,169,110,0.5)" }}>Завантаження карти...</p>
                </div>
              )}
              {currentEvent && mapLoaded && (
                <div style={{ position: "absolute", bottom: 16, left: "50%", transform: "translateX(-50%)", width: "min(380px, calc(100% - 24px))", background: "rgba(10,10,12,0.97)", border: `1px solid ${gold}44`, padding: "14px 18px", zIndex: 30, boxShadow: "0 8px 40px rgba(0,0,0,0.7)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                    <span style={{ fontSize: "0.6rem", letterSpacing: "0.18em", color: gold }}>{currentEvent.year} р.</span>
                    <button onClick={() => setActiveEvent(null)} style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(154,149,141,0.5)", fontSize: "1rem", lineHeight: 1, padding: 0 }}>×</button>
                  </div>
                  <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1rem", fontWeight: 300, color: "#e8e4dd", marginBottom: 6 }}>{currentEvent.title}</p>
                  <p style={{ fontSize: "0.7rem", color: "rgba(154,149,141,0.8)", lineHeight: 1.7 }}>{currentEvent.desc}</p>
                </div>
              )}
            </div>
            {/* Панель — під картою на мобільному, справа на десктопі */}
            <div className="map-panel" style={{ background: "rgba(10,10,12,0.97)", borderTop: "1px solid rgba(201,169,110,0.1)" }}>
              <div style={{ display: "flex", borderBottom: "1px solid rgba(201,169,110,0.08)", padding: "0 16px" }}>
                <div style={{ padding: "10px 0 6px", marginRight: 16 }}>
                  <p style={{ fontSize: "0.55rem", letterSpacing: "0.22em", textTransform: "uppercase", color: "rgba(138,116,68,0.6)" }}>{topic.period}</p>
                  <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.1rem", fontWeight: 300, color: "#e8e4dd" }}>{topic.label}</p>
                </div>
                <div style={{ display: "flex", marginLeft: "auto" }}>
                  {(["events", "figures"] as const).map((tab) => (
                    <button key={tab} onClick={() => setMapSideTab(tab)} style={{ padding: "10px 12px", background: "transparent", border: "none", borderBottom: mapSideTab === tab ? `1px solid ${gold}` : "1px solid transparent", cursor: "pointer", fontSize: "0.58rem", letterSpacing: "0.14em", textTransform: "uppercase", color: mapSideTab === tab ? gold : "rgba(154,149,141,0.45)" }}>
                      {tab === "events" ? "Хронологія" : "Постаті"}
                    </button>
                  ))}
                </div>
              </div>
              <div style={{ overflowY: "auto", maxHeight: 200 }}>
                {mapSideTab === "events" ? topic.events.map(ev => (
                  <button key={ev.id} onClick={() => setActiveEvent(ev.id)} style={{ width: "100%", textAlign: "left", padding: "10px 16px", background: activeEvent === ev.id ? "rgba(201,169,110,0.05)" : "transparent", border: "none", borderLeft: activeEvent === ev.id ? `2px solid ${gold}` : "2px solid transparent", cursor: "pointer" }}>
                    <span style={{ fontSize: "0.58rem", letterSpacing: "0.1em", color: gold, display: "block", marginBottom: 2 }}>{ev.year} р.</span>
                    <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "0.92rem", fontWeight: 300, color: "#e8e4dd" }}>{ev.title}</span>
                  </button>
                )) : topic.figures.map(fig => (
                  <div key={fig.name} style={{ padding: "10px 16px", borderBottom: "1px solid rgba(201,169,110,0.05)" }}>
                    <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "0.95rem", fontWeight: 300, color: "#e8e4dd", marginBottom: 2 }}>{fig.name}</p>
                    <p style={{ fontSize: "0.58rem", color: gold, marginBottom: 3 }}>{fig.years}</p>
                    <p style={{ fontSize: "0.68rem", color: "rgba(154,149,141,0.65)", lineHeight: 1.4 }}>{fig.role}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ІНШІ ВКЛАДКИ */}
          <div style={{ flex: 1, overflowY: "auto", display: activeTab === "map" ? "none" : "block" }}>

            {activeTab === "text" && (
              <div style={{ maxWidth: 740, margin: "0 auto", padding: "28px 20px" }}>
                <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.2rem", fontWeight: 300, color: goldLight, marginBottom: 12 }}>Передумови хрещення</h2>
                <p style={{ fontSize: "0.88rem", color: "rgba(232,228,221,0.78)", lineHeight: 1.85, marginBottom: 14 }}>
                  У 988 році князь Володимир Великий прийняв рішення, яке назавжди змінило долю Київської Русі. Хрещення у водах Дніпра стало не лише релігійним актом — це був свідомий геополітичний вибір, що відкрив Русі шлях до великих цивілізацій Середземномор&apos;я.
                </p>
                <blockquote style={{ borderLeft: "2px solid rgba(201,169,110,0.3)", paddingLeft: 16, margin: "20px 0", fontFamily: "'Cormorant Garamond', serif", fontSize: "1rem", fontStyle: "italic", color: "rgba(226,201,146,0.6)", lineHeight: 1.7 }}>
                  «І звелів хрестити людей у Дніпрі...»
                  <span style={{ display: "block", marginTop: 4, fontSize: "0.7rem", color: "rgba(138,116,68,0.6)", fontStyle: "normal" }}>— Повість минулих літ</span>
                </blockquote>
                <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.2rem", fontWeight: 300, color: goldLight, marginBottom: 12, marginTop: 24 }}>Наслідки для держави</h2>
                <p style={{ fontSize: "0.88rem", color: "rgba(232,228,221,0.78)", lineHeight: 1.85, marginBottom: 14 }}>
                  Прийняття православ&apos;я відкрило Русі двері до візантійської культури, освіти та мистецтва. Церква стала важливим інститутом держави — вела літописи, відкривала школи, формувала право.
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 32, paddingTop: 20, borderTop: `1px solid ${borderFaint}` }}>
                  <button onClick={() => handleTabChange("test")} style={{ width: "100%", padding: "13px", border: "1px solid rgba(201,169,110,0.4)", background: "rgba(201,169,110,0.06)", color: goldLight, cursor: "pointer", fontSize: "0.65rem", letterSpacing: "0.2em", textTransform: "uppercase" }}>Пройти тест →</button>
                  <Link href="/dashboard/lesson" style={{ width: "100%", padding: "13px", border: "1px solid rgba(201,169,110,0.15)", color: "rgba(154,149,141,0.55)", textDecoration: "none", fontSize: "0.65rem", letterSpacing: "0.2em", textTransform: "uppercase", textAlign: "center", display: "block" }}>Наступний урок →</Link>
                </div>
              </div>
            )}

            {activeTab === "dates" && (
              <div style={{ maxWidth: 740, margin: "0 auto", padding: "28px 20px" }}>
                <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.2rem", fontWeight: 300, color: goldLight, marginBottom: 20 }}>Ключові дати та правителі</h2>
                {topic.keyDates.map((d, i) => (
                  <div key={i} style={{ display: "flex", borderBottom: `1px solid ${borderFaint}`, padding: "14px 0" }}>
                    <div style={{ width: 90, flexShrink: 0, paddingRight: 16 }}>
                      <span style={{ fontSize: "0.68rem", letterSpacing: "0.08em", color: goldDim }}>{d.year}</span>
                    </div>
                    <div style={{ borderLeft: "1px solid rgba(201,169,110,0.15)", paddingLeft: 16, flex: 1 }}>
                      <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1rem", fontWeight: 300, color: textColor, marginBottom: 3 }}>{d.name}</p>
                      <p style={{ fontSize: "0.75rem", color: textDim, lineHeight: 1.6 }}>{d.note}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === "figures" && (
              <div style={{ maxWidth: 860, margin: "0 auto", padding: "28px 20px" }}>
                <div className="figures-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  {topic.figures.map(fig => (
                    <div key={fig.name} style={{ border: "1px solid rgba(201,169,110,0.12)", background: "rgba(201,169,110,0.02)", padding: "18px 20px" }}>
                      <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.1rem", fontWeight: 300, color: textColor, marginBottom: 3 }}>{fig.name}</p>
                      <p style={{ fontSize: "0.58rem", letterSpacing: "0.12em", color: goldDim, marginBottom: 10 }}>{fig.years}</p>
                      <div style={{ height: 1, background: "rgba(201,169,110,0.08)", marginBottom: 10 }} />
                      <p style={{ fontSize: "0.78rem", color: textDim, lineHeight: 1.6 }}>{fig.role}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "test" && (
              <div style={{ maxWidth: 680, margin: "0 auto", padding: "28px 20px" }}>
                <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1rem", fontStyle: "italic", color: "rgba(226,201,146,0.55)", marginBottom: 24, lineHeight: 1.6 }}>
                  Перевір своє розуміння теми. {testQuestions.length} запитання — 5 хвилин.
                </p>
                {testQuestions.map((q, qi) => (
                  <div key={qi} style={{ marginBottom: 28 }}>
                    <p style={{ fontSize: "0.56rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(138,116,68,0.6)", marginBottom: 8 }}>Запитання {qi + 1} з {testQuestions.length}</p>
                    <p style={{ fontSize: "0.88rem", color: textColor, marginBottom: 14, lineHeight: 1.6 }}>{q.q}</p>
                    {q.options.map((opt, oi) => {
                      const isSelected = selectedAnswers[qi] === oi;
                      return (
                        <div key={oi} onClick={() => setSelectedAnswers(prev => ({ ...prev, [qi]: oi }))} style={{ display: "flex", alignItems: "center", gap: 12, padding: "11px 14px", marginBottom: 8, border: `1px solid ${isSelected ? "rgba(201,169,110,0.4)" : "rgba(201,169,110,0.1)"}`, background: isSelected ? "rgba(201,169,110,0.06)" : "transparent", cursor: "pointer" }}>
                          <div style={{ width: 16, height: 16, borderRadius: "50%", border: `1px solid ${isSelected ? goldDim : "rgba(201,169,110,0.25)"}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, background: isSelected ? "rgba(201,169,110,0.15)" : "transparent" }}>
                            {isSelected && <div style={{ width: 6, height: 6, borderRadius: "50%", background: goldDim }} />}
                          </div>
                          <span style={{ fontSize: "0.85rem", color: isSelected ? goldLight : "rgba(232,228,221,0.65)" }}>{opt}</span>
                        </div>
                      );
                    })}
                  </div>
                ))}
                <button style={{ width: "100%", padding: "13px", border: "1px solid rgba(201,169,110,0.4)", background: "rgba(201,169,110,0.06)", color: goldLight, cursor: "pointer", fontSize: "0.65rem", letterSpacing: "0.25em", textTransform: "uppercase" }}>
                  Здати тест →
                </button>
              </div>
            )}
          </div>
        </div>
      </main>

      <style>{`
        @media (max-width: 768px) {
          .lesson-sidebar { display: none !important; }
          .lesson-mobile-bar { display: flex !important; }
          .lesson-breadcrumb { display: none !important; }
          .map-container { flex-direction: column !important; }
          .map-panel { border-top: 1px solid rgba(201,169,110,0.1) !important; border-left: none !important; width: 100% !important; }
          .figures-grid { grid-template-columns: 1fr !important; }
        }
        @media (min-width: 769px) {
          .lesson-sidebar-mobile { display: none !important; }
          .map-container { flex-direction: row !important; }
          .map-panel { width: 320px; flex-shrink: 0; border-left: 1px solid rgba(201,169,110,0.1); border-top: none !important; max-height: 100% !important; display: flex; flex-direction: column; }
          .map-panel > div:last-child { flex: 1; max-height: none !important; }
        }
      `}</style>
    </div>
  );
}