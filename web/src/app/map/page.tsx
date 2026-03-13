"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN!;

type TopicEvent = {
  id: number;
  year: number;
  title: string;
  coords: [number, number];
  desc: string;
};

const TOPICS = [
  {
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
          [30.5, 58.5], [32.0, 59.5], [34.5, 59.0],
          [38.0, 57.5], [40.5, 56.5], [41.0, 54.0],
          [39.0, 51.5], [37.5, 50.5],
          [36.5, 47.5], [34.0, 45.5], [33.5, 44.5],
          [31.0, 46.5], [29.0, 46.0],
          [24.5, 48.5], [23.5, 50.5],
          [24.0, 52.5], [26.0, 54.5],
          [28.5, 57.0], [30.5, 58.5]
        ]]
      }
    },
    events: [
      { id: 1, year: 882, title: "Олег захоплює Київ", coords: [30.52, 50.45] as [number, number], desc: "Князь Олег об'єднує Новгород і Київ, заснувавши Київську Русь як державу. Київ стає столицею." },
      { id: 2, year: 988, title: "Хрещення Русі", coords: [33.38, 44.61] as [number, number], desc: "Князь Володимир Великий хрестить Русь у Корсуні (Херсонес, Крим). Православ'я стає державною релігією." },
      { id: 3, year: 1037, title: "Будівництво Софійського собору", coords: [30.514, 50.453] as [number, number], desc: "Ярослав Мудрий будує Софійський собор у Києві — символ розквіту та могутності Київської Русі." },
      { id: 4, year: 1240, title: "Батиєва навала. Падіння Києва", coords: [30.75, 49.90] as [number, number], desc: "Монгольська орда під керівництвом Батия руйнує Київ. Місто спалене. Кінець Київської Русі як держави." },
    ],
    figures: [
      { name: "Олег Віщий", years: "?–912", role: "Перший князь Київської Русі, об'єднав Новгород і Київ" },
      { name: "Володимир Великий", years: "960–1015", role: "Хреститель Русі, будівничий держави" },
      { name: "Ярослав Мудрий", years: "978–1054", role: "Розквіт держави, Руська правда, Софія Київська" },
      { name: "Ольга", years: "890–969", role: "Перша правителька-християнка, реформи управління" },
    ],
  },
  {
    id: "cossacks",
    label: "Козацька держава",
    period: "XVI–XVIII ст.",
    center: [32.5, 49.5] as [number, number],
    zoom: 4.5,
    color: "#e2c992",
    territory: {
      type: "Feature" as const,
      properties: { name: "Гетьманщина" },
      geometry: {
        type: "Polygon" as const,
        coordinates: [[
          [29.5, 52.4], [31.5, 53.0], [33.5, 52.8], [35.5, 52.0],
          [37.5, 51.0], [38.0, 49.5],
          [35.5, 47.8], [34.0, 47.2], [32.0, 46.8],
          [30.0, 47.5], [28.5, 48.5],
          [27.5, 50.0], [28.0, 51.5],
          [29.5, 52.4]
        ]]
      }
    },
    events: [
      { id: 1, year: 1648, title: "Битва під Жовтими Водами", coords: [33.35, 48.35] as [number, number], desc: "Перша перемога Богдана Хмельницького над польськими військами. Початок Національно-визвольної війни." },
      { id: 2, year: 1649, title: "Битва під Зборовом", coords: [25.15, 49.67] as [number, number], desc: "Козацько-татарське військо оточує польського короля Яна II Казимира. Зборівський мирний договір." },
      { id: 3, year: 1654, title: "Переяславська рада", coords: [31.45, 50.07] as [number, number], desc: "Рада у Переяславі. Гетьман Хмельницький укладає союз з Московським царством." },
      { id: 4, year: 1709, title: "Полтавська битва", coords: [34.55, 49.59] as [number, number], desc: "Поразка Карла XII та Мазепи. Фактичний кінець незалежної козацької політики." },
    ],
    figures: [
      { name: "Богдан Хмельницький", years: "1595–1657", role: "Гетьман, засновник Гетьманщини, полководець" },
      { name: "Іван Мазепа", years: "1639–1709", role: "Гетьман, меценат, союзник Карла XII" },
      { name: "Іван Виговський", years: "?–1664", role: "Гетьман, автор Гадяцького договору" },
      { name: "Петро Дорошенко", years: "1627–1698", role: "Гетьман Правобережної України" },
    ],
  },
  {
    id: "unr",
    label: "УНР та ЗУНР",
    period: "1917–1921",
    center: [30.5, 49.8] as [number, number],
    zoom: 4.5,
    color: "#f0d080",
    territory: {
      type: "Feature" as const,
      properties: { name: "УНР та ЗУНР" },
      geometry: {
        type: "Polygon" as const,
        coordinates: [[
          [27.5, 52.0], [30.0, 52.5], [32.5, 52.3], [34.5, 52.0],
          [36.5, 51.0], [37.5, 49.5], [37.0, 47.8],
          [35.5, 46.5], [34.0, 45.0], [33.0, 44.5],
          [31.0, 46.0], [29.5, 46.2],
          [22.5, 48.0], [22.0, 49.5], [23.5, 50.5],
          [24.5, 51.5], [26.0, 52.0], [27.5, 52.0]
        ]]
      }
    },
    events: [
      { id: 1, year: 1917, title: "Проголошення УНР", coords: [30.52, 50.45] as [number, number], desc: "Українська Центральна Рада проголошує Українську Народну Республіку у складі федеративної Росії." },
      { id: 2, year: 1918, title: "IV Універсал. Незалежність", coords: [30.62, 50.38] as [number, number], desc: "22 січня 1918 — УНР проголошує повну незалежність від Росії. Перша незалежна українська держава." },
      { id: 3, year: 1918, title: "Проголошення ЗУНР", coords: [24.02, 49.84] as [number, number], desc: "Листопад 1918 — Західноукраїнська Народна Республіка зі столицею у Львові після розпаду Австро-Угорщини." },
      { id: 4, year: 1919, title: "Акт Злуки", coords: [30.52, 51.50] as [number, number], desc: "22 січня 1919 у Києві — урочисте об'єднання УНР і ЗУНР в єдину соборну українську державу." },
    ],
    figures: [
      { name: "Михайло Грушевський", years: "1866–1934", role: "Голова Центральної Ради, історик" },
      { name: "Симон Петлюра", years: "1879–1926", role: "Головний Отаман військ УНР" },
      { name: "Євген Петрушевич", years: "1863–1940", role: "Президент ЗУНР" },
      { name: "Володимир Винниченко", years: "1880–1951", role: "Голова Генерального секретаріату, письменник" },
    ],
  },
];

export default function MapPage() {
  const mapRef = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mapInstanceRef = useRef<any>(null);
  const [activeTopic, setActiveTopic] = useState(TOPICS[0]);
  const [activeEvent, setActiveEvent] = useState<TopicEvent | null>(null);
  const [activeTab, setActiveTab] = useState<"events" | "figures">("events");
  const [mapLoaded, setMapLoaded] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const selectEvent = (event: TopicEvent) => {
    setActiveEvent(event);
    if (!mapInstanceRef.current) return;
    mapInstanceRef.current.flyTo({
      center: event.coords,
      zoom: 7,
      duration: 1200,
    });
  };

  const closeEvent = () => {
    setActiveEvent(null);
    if (!mapInstanceRef.current) return;
    mapInstanceRef.current.flyTo({
      center: activeTopic.center,
      zoom: activeTopic.zoom,
      duration: 1200,
    });
  };

  // Ініціалізація Mapbox
  useEffect(() => {
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
        center: activeTopic.center,
        zoom: activeTopic.zoom,
        projection: "mercator",
      });
      map.on("load", () => {
        setMapLoaded(true);
        mapInstanceRef.current = map;
      });
    };
    document.head.appendChild(script);

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Оновлення теми
  useEffect(() => {
    if (!mapLoaded || !mapInstanceRef.current) return;
    const map = mapInstanceRef.current;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const mapboxgl = (window as any).mapboxgl;

    map.flyTo({ center: activeTopic.center, zoom: activeTopic.zoom, duration: 1800 });
    setActiveEvent(null);

    ["territory-fill", "territory-outline"].forEach((id) => { if (map.getLayer(id)) map.removeLayer(id); });
    ["territory-source"].forEach((id) => { if (map.getSource(id)) map.removeSource(id); });
    document.querySelectorAll(".kaya-marker").forEach((el) => el.remove());

    map.addSource("territory-source", {
      type: "geojson",
      data: { type: "FeatureCollection", features: [activeTopic.territory] },
    });
    map.addLayer({ id: "territory-fill", type: "fill", source: "territory-source", paint: { "fill-color": activeTopic.color, "fill-opacity": 0.1 } });
    map.addLayer({ id: "territory-outline", type: "line", source: "territory-source", paint: { "line-color": activeTopic.color, "line-width": 1.5, "line-opacity": 0.55 } });

    activeTopic.events.forEach((ev) => {
      const el = document.createElement("div");
      el.className = "kaya-marker";
      el.style.cssText = `
        width: 30px; height: 30px; border-radius: 50%;
        background: rgba(10,10,12,0.95);
        border: 1.5px solid ${activeTopic.color};
        display: flex; align-items: center; justify-content: center;
        cursor: pointer;
        font-family: 'Manrope', sans-serif;
        font-size: 8.5px; color: ${activeTopic.color}; font-weight: 600;
        box-shadow: 0 0 14px ${activeTopic.color}55;
        transition: border-color 0.2s, color 0.2s, box-shadow 0.2s;
      `;
      el.textContent = String(ev.year);
      el.addEventListener("mouseenter", () => {
        el.style.borderColor = "#fff"; el.style.color = "#fff";
        el.style.boxShadow = `0 0 20px ${activeTopic.color}99`;
      });
      el.addEventListener("mouseleave", () => {
        el.style.borderColor = activeTopic.color; el.style.color = activeTopic.color;
        el.style.boxShadow = `0 0 14px ${activeTopic.color}55`;
      });
      el.addEventListener("click", () => selectEvent(ev));
      new mapboxgl.Marker({ element: el, anchor: "center" }).setLngLat(ev.coords).addTo(map);
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTopic, mapLoaded]);

  // Resize карти при fullscreen
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    setTimeout(() => {
      mapInstanceRef.current.resize();
    }, 50);
  }, [isFullscreen]);

  const topic = activeTopic;

  return (
    <div style={{
      position: isFullscreen ? "fixed" : "relative",
      inset: isFullscreen ? 0 : "auto",
      zIndex: isFullscreen ? 200 : "auto",
      minHeight: "100vh",
      background: "#0a0a0c",
      display: "flex", flexDirection: "column",
    }}>

      {/* HEADER — тільки в звичайному режимі */}
      {!isFullscreen && (
        <header style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          paddingLeft: "clamp(20px, 5vw, 80px)", paddingRight: "clamp(20px, 5vw, 80px)",
          paddingTop: 20, paddingBottom: 16,
          borderBottom: "1px solid rgba(201,169,110,0.1)",
          flexShrink: 0,
        }}>
          <Link href="/home" style={{
            fontFamily: "'Cormorant Garamond', serif", fontSize: "1.8rem",
            letterSpacing: "0.24em", color: "rgba(245,239,230,0.9)",
            textDecoration: "none", fontWeight: 300,
          }}>KAYA</Link>
          <span style={{
            fontFamily: "'Manrope', sans-serif", fontSize: "0.6rem",
            letterSpacing: "0.3em", textTransform: "uppercase",
            color: "rgba(138,116,68,0.8)",
          }}>Інтерактивна карта</span>
          <Link href="/dashboard" style={{
            fontFamily: "'Manrope', sans-serif", fontSize: "0.72rem",
            letterSpacing: "0.18em", textTransform: "uppercase",
            color: "rgba(201,169,110,0.7)", textDecoration: "none",
          }}>← Кабінет</Link>
        </header>
      )}

      {/* TOPIC SWITCHER */}
      <div style={{
        display: "flex",
        borderBottom: "1px solid rgba(201,169,110,0.08)",
        flexShrink: 0, overflowX: "auto",
        paddingLeft: isFullscreen ? 8 : 0,
      }}>
        {TOPICS.map((t) => (
          <button key={t.id} onClick={() => setActiveTopic(t)} style={{
            padding: isFullscreen ? "10px 20px" : "14px 28px",
            background: "transparent", border: "none",
            borderBottom: activeTopic.id === t.id ? `2px solid ${t.color}` : "2px solid transparent",
            cursor: "pointer", fontFamily: "'Manrope', sans-serif",
            fontSize: "0.72rem", letterSpacing: "0.15em", textTransform: "uppercase",
            color: activeTopic.id === t.id ? t.color : "rgba(154,149,141,0.6)",
            whiteSpace: "nowrap", transition: "all 0.3s",
          }}>
            {t.label}
            <span style={{ marginLeft: 8, fontSize: "0.6rem", opacity: 0.6 }}>{t.period}</span>
          </button>
        ))}
      </div>

      {/* MAIN LAYOUT */}
      <div style={{ flex: 1, display: "flex", overflow: "hidden", position: "relative" }}>

        {/* КАРТА */}
        <div style={{ flex: 1, position: "relative" }}>
          <div ref={mapRef} style={{ width: "100%", height: "100%", minHeight: 400 }}>
            {!mapLoaded && (
              <div style={{
                position: "absolute", inset: 0, display: "flex",
                alignItems: "center", justifyContent: "center",
                background: "#0a0a0c", zIndex: 10,
              }}>
                <p style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: "1.2rem", fontStyle: "italic",
                  color: "rgba(201,169,110,0.5)",
                }}>Завантаження карти...</p>
              </div>
            )}
          </div>

          {/* Кнопка fullscreen — правий верхній кут карти */}
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            title={isFullscreen ? "Згорнути" : "Повний екран"}
            style={{
              position: "absolute", top: 12, right: 12, zIndex: 20,
              width: 32, height: 32,
              background: "rgba(10,10,12,0.88)",
              border: "1px solid rgba(201,169,110,0.25)",
              cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
              color: "rgba(201,169,110,0.65)",
            }}
          >
            {isFullscreen ? (
              <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                <path d="M2 5H5V2M8 2V5H11M11 8H8V11M5 11V8H2" stroke="currentColor" strokeWidth="1.5"/>
              </svg>
            ) : (
              <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                <path d="M1 4V1H4M9 1H12V4M12 9V12H9M4 12H1V9" stroke="currentColor" strokeWidth="1.5"/>
              </svg>
            )}
          </button>

          {/* Картка події поверх карти */}
          {activeEvent && (
            <div style={{
              position: "absolute",
              bottom: isFullscreen ? 28 : 20,
              left: "50%", transform: "translateX(-50%)",
              width: isFullscreen ? "min(520px, calc(100% - 48px))" : "min(380px, calc(100% - 32px))",
              background: "rgba(10,10,12,0.97)",
              border: `1px solid ${topic.color}44`,
              padding: "18px 22px", zIndex: 30,
              boxShadow: "0 8px 50px rgba(0,0,0,0.7)",
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                <span style={{
                  fontFamily: "'Manrope', sans-serif", fontSize: "0.65rem",
                  letterSpacing: "0.2em", color: topic.color,
                }}>{activeEvent.year} р.</span>
                <button onClick={closeEvent} style={{
                  background: "none", border: "none", cursor: "pointer",
                  color: "rgba(154,149,141,0.5)", fontSize: "1.1rem", lineHeight: 1, padding: 0,
                }}>×</button>
              </div>
              <p style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: isFullscreen ? "1.2rem" : "1.05rem",
                fontWeight: 400, color: "#e8e4dd", marginBottom: 8,
              }}>{activeEvent.title}</p>
              <p style={{
                fontFamily: "'Manrope', sans-serif",
                fontSize: "0.74rem", color: "rgba(154,149,141,0.85)", lineHeight: 1.75,
              }}>{activeEvent.desc}</p>
            </div>
          )}
        </div>

        {/* БОКОВА ПАНЕЛЬ — прихована у fullscreen */}
        {!isFullscreen && (
          <div style={{
            width: 320, flexShrink: 0,
            background: "rgba(10,10,12,0.97)",
            borderLeft: "1px solid rgba(201,169,110,0.1)",
            display: "flex", flexDirection: "column", overflow: "hidden",
          }}>
            <div style={{ padding: "22px 22px 14px", borderBottom: "1px solid rgba(201,169,110,0.08)" }}>
              <p style={{
                fontFamily: "'Manrope', sans-serif", fontSize: "0.6rem",
                letterSpacing: "0.3em", textTransform: "uppercase",
                color: "rgba(138,116,68,0.7)", marginBottom: 8,
              }}>{topic.period}</p>
              <h2 style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: "1.5rem", fontWeight: 300, color: "#e8e4dd", lineHeight: 1.2,
              }}>{topic.label}</h2>
            </div>

            {/* Вкладки */}
            <div style={{ display: "flex", borderBottom: "1px solid rgba(201,169,110,0.08)", marginTop: 8 }}>
              {(["events", "figures"] as const).map((tab) => (
                <button key={tab} onClick={() => setActiveTab(tab)} style={{
                  flex: 1, padding: "10px",
                  background: "transparent", border: "none",
                  borderBottom: activeTab === tab ? `1px solid ${topic.color}` : "1px solid transparent",
                  cursor: "pointer", fontFamily: "'Manrope', sans-serif",
                  fontSize: "0.62rem", letterSpacing: "0.2em", textTransform: "uppercase",
                  color: activeTab === tab ? topic.color : "rgba(154,149,141,0.5)",
                  transition: "all 0.2s",
                }}>
                  {tab === "events" ? "Хронологія" : "Постаті"}
                </button>
              ))}
            </div>

            {/* Список */}
            <div style={{ flex: 1, overflowY: "auto", padding: "6px 0" }}>
              {activeTab === "events" ? (
                topic.events.map((ev) => (
                  <button key={ev.id} onClick={() => selectEvent(ev)} style={{
                    width: "100%", textAlign: "left", padding: "13px 22px",
                    background: activeEvent?.id === ev.id ? "rgba(201,169,110,0.05)" : "transparent",
                    border: "none",
                    borderLeft: activeEvent?.id === ev.id ? `2px solid ${topic.color}` : "2px solid transparent",
                    cursor: "pointer", transition: "all 0.2s",
                  }}>
                    <span style={{
                      fontFamily: "'Manrope', sans-serif", fontSize: "0.6rem",
                      letterSpacing: "0.15em", color: topic.color, display: "block", marginBottom: 4,
                    }}>{ev.year} р.</span>
                    <span style={{
                      fontFamily: "'Cormorant Garamond', serif", fontSize: "0.98rem",
                      fontWeight: 300, color: "#e8e4dd", display: "block", lineHeight: 1.3,
                    }}>{ev.title}</span>
                  </button>
                ))
              ) : (
                topic.figures.map((figure) => (
                  <div key={figure.name} style={{
                    padding: "13px 22px", borderBottom: "1px solid rgba(201,169,110,0.05)",
                  }}>
                    <p style={{
                      fontFamily: "'Cormorant Garamond', serif",
                      fontSize: "1.02rem", fontWeight: 400, color: "#e8e4dd", marginBottom: 4,
                    }}>{figure.name}</p>
                    <p style={{
                      fontFamily: "'Manrope', sans-serif", fontSize: "0.6rem",
                      letterSpacing: "0.1em", color: topic.color, marginBottom: 4,
                    }}>{figure.years}</p>
                    <p style={{
                      fontFamily: "'Manrope', sans-serif", fontSize: "0.7rem",
                      color: "rgba(154,149,141,0.7)", lineHeight: 1.5,
                    }}>{figure.role}</p>
                  </div>
                ))
              )}
            </div>

            {!activeEvent && (
              <div style={{ padding: "10px 22px", borderTop: "1px solid rgba(201,169,110,0.06)" }}>
                <p style={{
                  fontFamily: "'Manrope', sans-serif", fontSize: "0.58rem",
                  letterSpacing: "0.1em", color: "rgba(154,149,141,0.3)", lineHeight: 1.6,
                }}>Натискай на маркери на карті щоб дізнатись більше</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}