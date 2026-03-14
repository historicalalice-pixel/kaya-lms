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
    id: "rus",
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
      { id: 1, year: 882,  title: "Олег захоплює Київ",             coords: [30.52, 50.45] as [number, number], desc: "Князь Олег об'єднує Новгород і Київ, заснувавши Київську Русь як державу. Київ стає столицею." },
      { id: 2, year: 988,  title: "Хрещення Русі",                  coords: [30.46, 50.43] as [number, number], desc: "Князь Володимир Великий наказує хрестити киян у водах Дніпра. Православ'я стає державною релігією Русі." },
      { id: 3, year: 1037, title: "Будівництво Софійського собору", coords: [30.51, 50.45] as [number, number], desc: "Ярослав Мудрий будує Софійський собор у Києві — символ розквіту та могутності Київської Русі." },
      { id: 4, year: 1240, title: "Батиєва навала. Падіння Києва",  coords: [32.50, 49.50] as [number, number], desc: "Монгольська орда під керівництвом Батия руйнує Київ. Місто спалене. Кінець Київської Русі як держави." },
    ],
    figures: [
      { name: "Олег Віщий",        years: "?–912",    role: "Перший князь Київської Русі, об'єднав Новгород і Київ" },
      { name: "Володимир Великий", years: "960–1015", role: "Хреститель Русі, будівничий держави" },
      { name: "Ярослав Мудрий",    years: "978–1054", role: "Розквіт держави, Руська правда, Софія Київська" },
      { name: "Ольга",             years: "890–969",  role: "Перша правителька-християнка, реформи управління" },
    ],
  },
};

type Tab = "text" | "map" | "figures" | "test";
type MapTab = "events" | "figures";

export default function LessonPage() {
  const [activeTab, setActiveTab] = useState<Tab>("text");
  const [mapTab, setMapTab] = useState<MapTab>("events");
  const [activeEvent, setActiveEvent] = useState<number | null>(2);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mapInstanceRef = useRef<any>(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  const topic = LESSON.topic;

  // Ініціалізація карти
  useEffect(() => {
    if (activeTab !== "map") return;
    if (mapInstanceRef.current) return;
    if (!mapRef.current) return;

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
        // Територія
        map.addSource("territory", { type: "geojson", data: topic.territory });
        map.addLayer({ id: "territory-fill", type: "fill", source: "territory", paint: { "fill-color": topic.color, "fill-opacity": 0.08 } });
        map.addLayer({ id: "territory-line", type: "line", source: "territory", paint: { "line-color": topic.color, "line-width": 1, "line-opacity": 0.4 } });

        // Маркери подій
        topic.events.forEach((ev) => {
          const el = document.createElement("div");
          el.style.cssText = `width:12px;height:12px;border-radius:50%;background:rgba(201,169,110,0.4);border:1.5px solid ${topic.color};cursor:pointer;transition:all 0.2s;`;
          el.addEventListener("mouseenter", () => { el.style.background = "rgba(201,169,110,0.7)"; el.style.transform = "scale(1.3)"; });
          el.addEventListener("mouseleave", () => { el.style.background = "rgba(201,169,110,0.4)"; el.style.transform = "scale(1)"; });
          el.addEventListener("click", () => {
            setActiveEvent(ev.id);
            setMapTab("events");
            map.flyTo({ center: ev.coords, zoom: 7, duration: 1000 });
          });
          new mapboxgl.Marker({ element: el }).setLngLat(ev.coords).addTo(map);
        });

        setMapLoaded(true);
      });
    };
    document.head.appendChild(script);
  }, [activeTab, topic]);

  // Fly to event
  useEffect(() => {
    if (!mapInstanceRef.current || activeEvent === null) return;
    const ev = topic.events.find(e => e.id === activeEvent);
    if (ev) mapInstanceRef.current.flyTo({ center: ev.coords, zoom: 7, duration: 1000 });
  }, [activeEvent, topic.events]);

  const currentEvent = topic.events.find(e => e.id === activeEvent);

  const navItems = [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/dashboard/learning", label: "Моє навчання", active: true },
    { href: "/dashboard/assignments", label: "Завдання" },
    { href: "/dashboard/tests", label: "Тести" },
    { href: "/dashboard/schedule", label: "Розклад" },
    { href: "/map", label: "Карта" },
  ];

  const tabs: { key: Tab; label: string }[] = [
    { key: "text", label: "Текст уроку" },
    { key: "map", label: "Карта подій" },
    { key: "figures", label: "Постаті" },
    { key: "test", label: "Тест" },
  ];

  const testQuestions = [
    {
      q: "У якому році відбулося хрещення Київської Русі?",
      options: ["862 р.", "988 р.", "1054 р.", "1240 р."],
      correct: 1,
    },
    {
      q: "Який собор побудував Ярослав Мудрий як символ розквіту Русі?",
      options: ["Десятинна церква", "Михайлівський собор", "Софійський собор", "Успенський собор"],
      correct: 2,
    },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a0c", color: "#e8e4dd", fontFamily: "'Manrope', sans-serif", display: "flex" }}>

      {/* SIDEBAR */}
      <aside style={{ width: 220, flexShrink: 0, borderRight: "1px solid rgba(201,169,110,0.1)", display: "flex", flexDirection: "column", padding: "28px 0", position: "sticky", top: 0, height: "100vh", overflow: "hidden", background: "rgba(10,10,12,0.98)" }}>
        <Link href="/home" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.8rem", fontWeight: 300, letterSpacing: "0.3em", color: "rgba(245,239,230,0.9)", textDecoration: "none", padding: "0 24px 20px", display: "block", borderBottom: "1px solid rgba(201,169,110,0.08)" }}>
          KAYA
        </Link>
        <nav style={{ flex: 1, padding: "14px 12px", display: "flex", flexDirection: "column", gap: 1 }}>
          <p style={{ fontSize: "0.5rem", letterSpacing: "0.3em", textTransform: "uppercase", color: "rgba(138,116,68,0.4)", padding: "4px 10px 10px" }}>Навчання</p>
          {navItems.map(({ href, label, active }) => (
            <Link key={href} href={href} style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 10px", borderRadius: 4, textDecoration: "none", fontSize: "0.78rem", color: active ? "#e2c992" : "rgba(154,149,141,0.7)", background: active ? "rgba(201,169,110,0.08)" : "transparent", borderLeft: `2px solid ${active ? "#8a7444" : "transparent"}`, transition: "all 0.2s" }}>
              {label}
            </Link>
          ))}
        </nav>
        <div style={{ padding: "14px 12px 0", borderTop: "1px solid rgba(201,169,110,0.08)" }}>
          <Link href="/dashboard" style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 10px", borderRadius: 4, textDecoration: "none", fontSize: "0.75rem", color: "rgba(154,149,141,0.5)" }}>
            ← Назад до кабінету
          </Link>
        </div>
      </aside>

      {/* MAIN */}
      <main style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", maxWidth: "calc(100vw - 220px)" }}>

        {/* HEADER */}
        <div style={{ padding: "20px 36px 0", borderBottom: "1px solid rgba(201,169,110,0.08)", flexShrink: 0 }}>
          {/* Breadcrumb */}
          <div style={{ fontSize: "0.68rem", color: "rgba(154,149,141,0.45)", marginBottom: 12, display: "flex", alignItems: "center", gap: 6 }}>
            <Link href="/dashboard" style={{ color: "inherit", textDecoration: "none" }}>Кабінет</Link>
            <span style={{ color: "rgba(138,116,68,0.4)" }}>›</span>
            <Link href="/dashboard/learning" style={{ color: "inherit", textDecoration: "none" }}>Моє навчання</Link>
            <span style={{ color: "rgba(138,116,68,0.4)" }}>›</span>
            <span>Урок {LESSON.index}</span>
          </div>

          <p style={{ fontSize: "0.58rem", letterSpacing: "0.28em", textTransform: "uppercase", color: "rgba(138,116,68,0.7)", marginBottom: 8 }}>
            {LESSON.module}
          </p>
          <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(1.6rem, 3vw, 2.4rem)", fontWeight: 300, color: "#e8e4dd", marginBottom: 12, lineHeight: 1.2 }}>
            {LESSON.title}
          </h1>

          {/* Мета */}
          <div style={{ display: "flex", alignItems: "center", gap: 20, fontSize: "0.72rem", color: "rgba(154,149,141,0.5)", marginBottom: 14 }}>
            <span>⏱ {LESSON.duration}</span>
            <span>Урок {LESSON.index} з {LESSON.total}</span>
            <span style={{ color: "#8a7444" }}>● В процесі</span>
          </div>

          {/* Прогрес */}
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 0 }}>
            <div style={{ flex: 1, height: 2, background: "rgba(201,169,110,0.08)", borderRadius: 1 }}>
              <div style={{ width: `${LESSON.progress}%`, height: "100%", background: "#8a7444", borderRadius: 1 }} />
            </div>
            <span style={{ fontSize: "0.62rem", color: "rgba(138,116,68,0.7)" }}>{LESSON.progress}%</span>
          </div>

          {/* Tabs */}
          <div style={{ display: "flex", gap: 0, marginTop: 20 }}>
            {tabs.map(({ key, label }) => (
              <button key={key} onClick={() => setActiveTab(key)} style={{
                padding: "11px 28px",
                background: "transparent", border: "none",
                borderBottom: activeTab === key ? `2px solid #8a7444` : "2px solid transparent",
                cursor: "pointer",
                fontSize: "0.65rem", letterSpacing: "0.2em", textTransform: "uppercase",
                color: activeTab === key ? "#e2c992" : "rgba(154,149,141,0.45)",
                transition: "all 0.2s",
              }}>
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* TAB CONTENT */}
        <div style={{ flex: 1, overflow: "auto" }}>

          {/* ===== ТЕКСТ ===== */}
          {activeTab === "text" && (
            <div style={{ maxWidth: 740, margin: "0 auto", padding: "40px 36px" }}>
              <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.3rem", fontWeight: 300, color: "#e2c992", marginBottom: 14 }}>
                Передумови хрещення
              </h2>
              <p style={{ fontSize: "0.9rem", color: "rgba(232,228,221,0.78)", lineHeight: 1.9, marginBottom: 16 }}>
                У 988 році князь Володимир Великий прийняв рішення, яке назавжди змінило долю Київської Русі. Хрещення у водах Дніпра стало не лише релігійним актом — це був свідомий геополітичний вибір, що відкрив Русі шлях до великих цивілізацій Середземномор&apos;я.
              </p>
              <blockquote style={{ borderLeft: "2px solid rgba(201,169,110,0.3)", paddingLeft: 20, margin: "24px 0", fontFamily: "'Cormorant Garamond', serif", fontSize: "1.05rem", fontStyle: "italic", color: "rgba(226,201,146,0.6)", lineHeight: 1.75 }}>
                «І звелів хрестити людей у Дніпрі, і хто не хотів того, противився наказу...»
                <span style={{ display: "block", marginTop: 6, fontSize: "0.75rem", color: "rgba(138,116,68,0.6)", fontStyle: "normal", letterSpacing: "0.1em" }}>— Повість минулих літ</span>
              </blockquote>
              <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.3rem", fontWeight: 300, color: "#e2c992", marginBottom: 14, marginTop: 32 }}>
                Наслідки для держави
              </h2>
              <p style={{ fontSize: "0.9rem", color: "rgba(232,228,221,0.78)", lineHeight: 1.9, marginBottom: 16 }}>
                Прийняття православ&apos;я відкрило Русі двері до візантійської культури, освіти та мистецтва. Будівництво Десятинної церкви і Софійського собору стали символами нової культурної доби. Церква стала важливим інститутом держави — вела літописи, відкривала школи, формувала право.
              </p>
              <p style={{ fontSize: "0.9rem", color: "rgba(232,228,221,0.78)", lineHeight: 1.9, marginBottom: 16 }}>
                Завдяки хрещенню Русь увійшла до кола європейських держав. Шлюбна дипломатія Ярослава Мудрого зробила Київ одним із найвпливовіших дворів Європи.
              </p>

              {/* Навігація між уроками */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 48, paddingTop: 24, borderTop: "1px solid rgba(201,169,110,0.08)" }}>
                <Link href="/dashboard/lesson" style={{ padding: "11px 24px", border: "1px solid rgba(201,169,110,0.15)", color: "rgba(154,149,141,0.55)", textDecoration: "none", fontSize: "0.65rem", letterSpacing: "0.2em", textTransform: "uppercase" }}>
                  ← Попередній урок
                </Link>
                <button onClick={() => setActiveTab("test")} style={{ padding: "11px 24px", border: "1px solid rgba(201,169,110,0.2)", background: "transparent", color: "rgba(138,116,68,0.7)", cursor: "pointer", fontSize: "0.65rem", letterSpacing: "0.2em", textTransform: "uppercase" }}>
                  Пройти тест
                </button>
                <Link href="/dashboard/lesson" style={{ padding: "11px 28px", border: "1px solid rgba(201,169,110,0.4)", background: "rgba(201,169,110,0.06)", color: "#e2c992", textDecoration: "none", fontSize: "0.65rem", letterSpacing: "0.2em", textTransform: "uppercase" }}>
                  Наступний урок →
                </Link>
              </div>
            </div>
          )}

          {/* ===== КАРТА ===== */}
          {activeTab === "map" && (
            <div style={{ display: "flex", height: "calc(100vh - 220px)", minHeight: 480 }}>
              {/* Карта */}
              <div style={{ flex: 1, position: "relative" }}>
                <div ref={mapRef} style={{ width: "100%", height: "100%" }} />
                {!mapLoaded && (
                  <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", background: "#0a0a0c", zIndex: 10 }}>
                    <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.1rem", fontStyle: "italic", color: "rgba(201,169,110,0.4)" }}>Завантаження карти...</p>
                  </div>
                )}
                {/* Картка події */}
                {currentEvent && mapLoaded && (
                  <div style={{ position: "absolute", bottom: 20, left: "50%", transform: "translateX(-50%)", width: "min(400px, calc(100% - 32px))", background: "rgba(10,10,12,0.97)", border: `1px solid ${topic.color}44`, padding: "16px 20px", zIndex: 20, boxShadow: "0 8px 40px rgba(0,0,0,0.6)" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                      <span style={{ fontFamily: "'Manrope', sans-serif", fontSize: "0.6rem", letterSpacing: "0.2em", color: topic.color }}>{currentEvent.year} р.</span>
                      <button onClick={() => setActiveEvent(null)} style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(154,149,141,0.4)", fontSize: "1rem", lineHeight: 1, padding: 0 }}>×</button>
                    </div>
                    <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.1rem", fontWeight: 300, color: "#e8e4dd", marginBottom: 6 }}>{currentEvent.title}</p>
                    <p style={{ fontSize: "0.72rem", color: "rgba(154,149,141,0.8)", lineHeight: 1.7 }}>{currentEvent.desc}</p>
                  </div>
                )}
              </div>

              {/* Бокова панель */}
              <div style={{ width: 300, flexShrink: 0, borderLeft: "1px solid rgba(201,169,110,0.1)", display: "flex", flexDirection: "column", background: "rgba(10,10,12,0.98)", overflow: "hidden" }}>
                <div style={{ padding: "18px 20px 14px", borderBottom: "1px solid rgba(201,169,110,0.08)" }}>
                  <p style={{ fontFamily: "'Manrope', sans-serif", fontSize: "0.55rem", letterSpacing: "0.28em", textTransform: "uppercase", color: "rgba(138,116,68,0.65)", marginBottom: 6 }}>{topic.period}</p>
                  <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.3rem", fontWeight: 300, color: "#e8e4dd" }}>{topic.label}</h3>
                </div>

                {/* Вкладки панелі */}
                <div style={{ display: "flex", borderBottom: "1px solid rgba(201,169,110,0.08)" }}>
                  {(["events", "figures"] as const).map(tab => (
                    <button key={tab} onClick={() => setMapTab(tab)} style={{ flex: 1, padding: "10px", background: "transparent", border: "none", borderBottom: mapTab === tab ? `1px solid ${topic.color}` : "1px solid transparent", cursor: "pointer", fontSize: "0.58rem", letterSpacing: "0.18em", textTransform: "uppercase", color: mapTab === tab ? topic.color : "rgba(154,149,141,0.4)", transition: "all 0.2s" }}>
                      {tab === "events" ? "Хронологія" : "Постаті"}
                    </button>
                  ))}
                </div>

                {/* Список */}
                <div style={{ flex: 1, overflowY: "auto" }}>
                  {mapTab === "events" ? topic.events.map(ev => (
                    <button key={ev.id} onClick={() => setActiveEvent(ev.id)} style={{ width: "100%", textAlign: "left", padding: "12px 20px", background: activeEvent === ev.id ? "rgba(201,169,110,0.05)" : "transparent", border: "none", borderLeft: activeEvent === ev.id ? `2px solid ${topic.color}` : "2px solid transparent", cursor: "pointer", transition: "all 0.2s" }}>
                      <span style={{ fontFamily: "'Manrope', sans-serif", fontSize: "0.58rem", letterSpacing: "0.12em", color: topic.color, display: "block", marginBottom: 3 }}>{ev.year} р.</span>
                      <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "0.95rem", fontWeight: 300, color: "#e8e4dd", display: "block", lineHeight: 1.3 }}>{ev.title}</span>
                    </button>
                  )) : topic.figures.map(fig => (
                    <div key={fig.name} style={{ padding: "12px 20px", borderBottom: "1px solid rgba(201,169,110,0.05)" }}>
                      <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1rem", fontWeight: 300, color: "#e8e4dd", marginBottom: 3 }}>{fig.name}</p>
                      <p style={{ fontSize: "0.58rem", letterSpacing: "0.1em", color: topic.color, marginBottom: 4 }}>{fig.years}</p>
                      <p style={{ fontSize: "0.68rem", color: "rgba(154,149,141,0.65)", lineHeight: 1.5 }}>{fig.role}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ===== ПОСТАТІ ===== */}
          {activeTab === "figures" && (
            <div style={{ maxWidth: 860, margin: "0 auto", padding: "40px 36px" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                {topic.figures.map(fig => (
                  <div key={fig.name} style={{ border: "1px solid rgba(201,169,110,0.12)", background: "rgba(201,169,110,0.02)", padding: "24px 26px", transition: "border-color 0.3s" }}>
                    <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.25rem", fontWeight: 300, color: "#e8e4dd", marginBottom: 4 }}>{fig.name}</p>
                    <p style={{ fontSize: "0.6rem", letterSpacing: "0.15em", color: "#8a7444", marginBottom: 12 }}>{fig.years}</p>
                    <div style={{ height: 1, background: "rgba(201,169,110,0.08)", marginBottom: 12 }} />
                    <p style={{ fontSize: "0.82rem", color: "rgba(154,149,141,0.7)", lineHeight: 1.65 }}>{fig.role}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ===== ТЕСТ ===== */}
          {activeTab === "test" && (
            <div style={{ maxWidth: 680, margin: "0 auto", padding: "40px 36px" }}>
              <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.05rem", fontStyle: "italic", color: "rgba(226,201,146,0.55)", marginBottom: 32, lineHeight: 1.6 }}>
                Перевір своє розуміння теми. {testQuestions.length} запитання — 5 хвилин.
              </p>
              {testQuestions.map((q, qi) => (
                <div key={qi} style={{ marginBottom: 36 }}>
                  <p style={{ fontSize: "0.58rem", letterSpacing: "0.22em", textTransform: "uppercase", color: "rgba(138,116,68,0.6)", marginBottom: 8 }}>
                    Запитання {qi + 1} з {testQuestions.length}
                  </p>
                  <p style={{ fontSize: "0.92rem", color: "#e8e4dd", marginBottom: 16, lineHeight: 1.6 }}>{q.q}</p>
                  {q.options.map((opt, oi) => (
                    <div key={oi} onClick={() => setSelectedAnswer(oi)} style={{
                      display: "flex", alignItems: "center", gap: 12,
                      padding: "11px 16px", marginBottom: 8,
                      border: `1px solid ${selectedAnswer === oi ? "rgba(201,169,110,0.4)" : "rgba(201,169,110,0.1)"}`,
                      background: selectedAnswer === oi ? "rgba(201,169,110,0.06)" : "transparent",
                      cursor: "pointer", transition: "all 0.2s",
                    }}>
                      <div style={{ width: 16, height: 16, borderRadius: "50%", border: `1px solid ${selectedAnswer === oi ? "#8a7444" : "rgba(201,169,110,0.25)"}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, background: selectedAnswer === oi ? "rgba(201,169,110,0.15)" : "transparent" }}>
                        {selectedAnswer === oi && <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#8a7444" }} />}
                      </div>
                      <span style={{ fontSize: "0.85rem", color: selectedAnswer === oi ? "#e2c992" : "rgba(232,228,221,0.65)" }}>{opt}</span>
                    </div>
                  ))}
                </div>
              ))}
              <div style={{ paddingTop: 8 }}>
                <button style={{ padding: "13px 32px", border: "1px solid rgba(201,169,110,0.4)", background: "rgba(201,169,110,0.06)", color: "#e2c992", cursor: "pointer", fontSize: "0.65rem", letterSpacing: "0.25em", textTransform: "uppercase" }}>
                  Здати тест →
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}