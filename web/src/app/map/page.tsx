"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN!;

// ======= ДАНІ ПО ТЕМАХ =======
const TOPICS = [
  {
    id: "rus",
    label: "Київська Русь",
    period: "IX–XIII ст.",
    center: [32.0, 50.5] as [number, number],
    zoom: 5,
    color: "#c9a96e",
    territory: {
      type: "Feature" as const,
      properties: { name: "Київська Русь" },
      geometry: {
        type: "Polygon" as const,
        coordinates: [[
          [22.0, 57.5], [30.0, 60.5], [38.0, 60.0], [44.0, 57.0],
          [42.0, 52.0], [40.0, 47.0], [34.0, 45.5], [28.0, 46.5],
          [24.0, 48.5], [20.0, 51.5], [22.0, 57.5]
        ]]
      }
    },
    events: [
      { id: 1, year: 882, title: "Олег захоплює Київ", coords: [30.52, 50.45] as [number, number], desc: "Князь Олег об'єднує Новгород і Київ, заснувавши Київську Русь як державу." },
      { id: 2, year: 988, title: "Хрещення Русі", coords: [33.38, 44.61] as [number, number], desc: "Князь Володимир Великий хрестить Русь у Корсуні (Херсонес, Крим)." },
      { id: 3, year: 1037, title: "Будівництво Софійського собору", coords: [30.514, 50.453] as [number, number], desc: "Ярослав Мудрий будує Софійський собор — символ могутності Київської Русі." },
      { id: 4, year: 1240, title: "Батиєва навала. Падіння Києва", coords: [30.62, 50.35] as [number, number], desc: "Монгольська орда під керівництвом Батия руйнує Київ. Кінець Київської Русі." },
    ],
    figures: [
      { name: "Олег Віщий", years: "?–912", role: "Перший князь Київської Русі" },
      { name: "Володимир Великий", years: "960–1015", role: "Хреститель Русі" },
      { name: "Ярослав Мудрий", years: "978–1054", role: "Розквіт держави, Руська правда" },
      { name: "Ольга", years: "890–969", role: "Перша правителька-християнка" },
    ],
  },
  {
    id: "cossacks",
    label: "Козацька держава",
    period: "XVI–XVIII ст.",
    center: [33.0, 49.0] as [number, number],
    zoom: 6,
    color: "#e2c992",
    territory: {
      type: "Feature" as const,
      properties: { name: "Гетьманщина" },
      geometry: {
        type: "Polygon" as const,
        coordinates: [[
          [29.0, 52.5], [34.0, 53.0], [38.0, 51.0],
          [36.0, 47.5], [31.0, 46.5], [27.0, 48.0],
          [27.5, 51.0], [29.0, 52.5]
        ]]
      }
    },
    events: [
      { id: 1, year: 1648, title: "Битва під Жовтими Водами", coords: [33.35, 48.35] as [number, number], desc: "Перша перемога Богдана Хмельницького над польськими військами. Початок Національно-визвольної війни." },
      { id: 2, year: 1649, title: "Битва під Зборовом", coords: [25.15, 49.67] as [number, number], desc: "Козацько-татарське військо оточує польського короля. Зборівський договір." },
      { id: 3, year: 1654, title: "Переяславська рада", coords: [31.45, 50.07] as [number, number], desc: "Рада у Переяславі. Україна укладає союз з Московським царством." },
      { id: 4, year: 1709, title: "Полтавська битва", coords: [34.55, 49.59] as [number, number], desc: "Поразка Карла XII та Мазепи. Кінець незалежної козацької політики." },
    ],
    figures: [
      { name: "Богдан Хмельницький", years: "1595–1657", role: "Гетьман, засновник Гетьманщини" },
      { name: "Іван Мазепа", years: "1639–1709", role: "Гетьман, союзник Карла XII" },
      { name: "Іван Виговський", years: "?–1664", role: "Гетьман, Гадяцький договір" },
      { name: "Петро Дорошенко", years: "1627–1698", role: "Гетьман Правобережжя" },
    ],
  },
  {
    id: "unr",
    label: "УНР та ЗУНР",
    period: "1917–1921",
    center: [30.0, 49.5] as [number, number],
    zoom: 6,
    color: "#f0d080",
    territory: {
      type: "Feature" as const,
      properties: { name: "УНР" },
      geometry: {
        type: "Polygon" as const,
        coordinates: [[
          [22.0, 52.0], [32.0, 52.5], [38.0, 50.0],
          [36.0, 46.5], [30.0, 45.5], [24.0, 46.0],
          [22.0, 48.5], [22.0, 52.0]
        ]]
      }
    },
    events: [
      { id: 1, year: 1917, title: "Проголошення УНР", coords: [30.52, 50.45] as [number, number], desc: "Українська Центральна Рада проголошує Українську Народну Республіку." },
      { id: 2, year: 1918, title: "IV Універсал. Незалежність", coords: [32.08, 49.42] as [number, number], desc: "22 січня 1918 — УНР проголошує повну незалежність від Росії." },
      { id: 3, year: 1918, title: "Проголошення ЗУНР", coords: [24.02, 49.84] as [number, number], desc: "Західноукраїнська Народна Республіка зі столицею у Львові." },
      { id: 4, year: 1919, title: "Акт Злуки", coords: [28.65, 50.90] as [number, number], desc: "22 січня 1919 — об'єднання УНР і ЗУНР в єдину державу." },
    ],
    figures: [
      { name: "Михайло Грушевський", years: "1866–1934", role: "Голова Центральної Ради" },
      { name: "Симон Петлюра", years: "1879–1926", role: "Головний Отаман військ УНР" },
      { name: "Євген Петрушевич", years: "1863–1940", role: "Президент ЗУНР" },
      { name: "Володимир Винниченко", years: "1880–1951", role: "Голова Генерального секретаріату" },
    ],
  },
];

export default function MapPage() {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<unknown>(null);
  const [activeTopic, setActiveTopic] = useState(TOPICS[0]);
  const [activeEvent, setActiveEvent] = useState<typeof TOPICS[0]["events"][0] | null>(null);
  const [activeTab, setActiveTab] = useState<"events" | "figures">("events");
  const [mapLoaded, setMapLoaded] = useState(false);

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
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (mapInstanceRef.current as any).remove();
        mapInstanceRef.current = null;
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Оновлення карти при зміні теми
  useEffect(() => {
    if (!mapLoaded || !mapInstanceRef.current) return;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const map = mapInstanceRef.current as any;
    const mapboxgl = (window as any).mapboxgl;

    // Летимо до нової теми
    map.flyTo({ center: activeTopic.center, zoom: activeTopic.zoom, duration: 1800 });

    setActiveEvent(null);

    // Видаляємо старі шари
    ["territory-fill", "territory-outline", "events-layer"].forEach((id) => {
      if (map.getLayer(id)) map.removeLayer(id);
    });
    ["territory-source", "events-source"].forEach((id) => {
      if (map.getSource(id)) map.removeSource(id);
    });
    // Видаляємо старі маркери
    document.querySelectorAll(".kaya-marker").forEach((el) => el.remove());

    // Додаємо територію
    map.addSource("territory-source", {
      type: "geojson",
      data: { type: "FeatureCollection", features: [activeTopic.territory] },
    });

    map.addLayer({
      id: "territory-fill",
      type: "fill",
      source: "territory-source",
      paint: {
        "fill-color": activeTopic.color,
        "fill-opacity": 0.12,
      },
    });

    map.addLayer({
      id: "territory-outline",
      type: "line",
      source: "territory-source",
      paint: {
        "line-color": activeTopic.color,
        "line-width": 1.5,
        "line-opacity": 0.6,
      },
    });

    // Додаємо маркери подій
    activeTopic.events.forEach((event) => {
      const el = document.createElement("div");
      el.className = "kaya-marker";
      el.style.cssText = `
        width: 28px; height: 28px;
        border-radius: 50%;
        background: rgba(10,10,12,0.95);
        border: 1.5px solid ${activeTopic.color};
        display: flex; align-items: center; justify-content: center;
        cursor: pointer;
        font-family: 'Manrope', sans-serif;
        font-size: 9px;
        color: ${activeTopic.color};
        font-weight: 600;
        transition: all 0.2s;
        box-shadow: 0 0 12px ${activeTopic.color}44;
      `;
      el.textContent = String(event.year).slice(0, 4);
      el.title = event.title;

      el.addEventListener("mouseenter", () => {
        el.style.width = "34px";
        el.style.height = "34px";
        el.style.borderColor = "#fff";
        el.style.color = "#fff";
        el.style.marginLeft = "-3px";
        el.style.marginTop = "-3px";
      });
      el.addEventListener("mouseleave", () => {
        el.style.width = "28px";
        el.style.height = "28px";
        el.style.borderColor = activeTopic.color;
        el.style.color = activeTopic.color;
        el.style.marginLeft = "0px";
        el.style.marginTop = "0px";
      });
      el.addEventListener("click", () => {
        setActiveEvent(event);
      });

      new mapboxgl.Marker({ element: el })
        .setLngLat(event.coords)
        .addTo(map);
    });

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTopic, mapLoaded]);

  const topic = activeTopic;

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a0c", display: "flex", flexDirection: "column" }}>

      {/* HEADER */}
      <header style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        paddingLeft: "clamp(20px, 5vw, 80px)", paddingRight: "clamp(20px, 5vw, 80px)",
        paddingTop: 20, paddingBottom: 16,
        borderBottom: "1px solid rgba(201,169,110,0.1)",
        flexShrink: 0,
      }}>
        <Link href="/home" style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: "1.8rem", letterSpacing: "0.24em",
          color: "rgba(245,239,230,0.9)", textDecoration: "none", fontWeight: 300,
        }}>
          KAYA
        </Link>

        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{
            fontFamily: "'Manrope', sans-serif", fontSize: "0.6rem",
            letterSpacing: "0.3em", textTransform: "uppercase",
            color: "rgba(138,116,68,0.8)",
          }}>
            Інтерактивна карта
          </span>
        </div>

        <Link href="/dashboard" style={{
          fontFamily: "'Manrope', sans-serif", fontSize: "0.72rem",
          letterSpacing: "0.18em", textTransform: "uppercase",
          color: "rgba(201,169,110,0.7)", textDecoration: "none",
        }}>
          ← Кабінет
        </Link>
      </header>

      {/* TOPIC SWITCHER */}
      <div style={{
        display: "flex", gap: 0,
        borderBottom: "1px solid rgba(201,169,110,0.08)",
        flexShrink: 0, overflowX: "auto",
      }}>
        {TOPICS.map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveTopic(t)}
            style={{
              padding: "14px 28px",
              background: "transparent",
              border: "none",
              borderBottom: activeTopic.id === t.id
                ? `2px solid ${t.color}`
                : "2px solid transparent",
              cursor: "pointer",
              fontFamily: "'Manrope', sans-serif",
              fontSize: "0.72rem",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              color: activeTopic.id === t.id ? t.color : "rgba(154,149,141,0.6)",
              whiteSpace: "nowrap",
              transition: "all 0.3s",
            }}
          >
            {t.label}
            <span style={{ marginLeft: 8, fontSize: "0.6rem", opacity: 0.6 }}>
              {t.period}
            </span>
          </button>
        ))}
      </div>

      {/* MAIN LAYOUT */}
      <div style={{ flex: 1, display: "flex", overflow: "hidden", position: "relative" }}>

        {/* КАРТА */}
        <div ref={mapRef} style={{ flex: 1, position: "relative" }}>
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
              }}>
                Завантаження карти...
              </p>
            </div>
          )}
        </div>

        {/* БОКОВА ПАНЕЛЬ */}
        <div style={{
          width: 340, flexShrink: 0,
          background: "rgba(10,10,12,0.97)",
          borderLeft: "1px solid rgba(201,169,110,0.1)",
          display: "flex", flexDirection: "column",
          overflow: "hidden",
        }}>

          {/* Назва теми */}
          <div style={{ padding: "24px 24px 16px", borderBottom: "1px solid rgba(201,169,110,0.08)" }}>
            <p style={{
              fontFamily: "'Manrope', sans-serif", fontSize: "0.6rem",
              letterSpacing: "0.3em", textTransform: "uppercase",
              color: "rgba(138,116,68,0.7)", marginBottom: 8,
            }}>
              {topic.period}
            </p>
            <h2 style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "1.6rem", fontWeight: 300,
              color: "#e8e4dd", lineHeight: 1.2,
            }}>
              {topic.label}
            </h2>
          </div>

          {/* Активна подія */}
          {activeEvent && (
            <div style={{
              margin: "16px 16px 0",
              padding: "16px",
              background: "rgba(201,169,110,0.05)",
              border: `1px solid ${topic.color}44`,
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                <span style={{
                  fontFamily: "'Manrope', sans-serif", fontSize: "0.65rem",
                  letterSpacing: "0.2em", color: topic.color,
                }}>
                  {activeEvent.year} р.
                </span>
                <button
                  onClick={() => setActiveEvent(null)}
                  style={{
                    background: "none", border: "none", cursor: "pointer",
                    color: "rgba(154,149,141,0.5)", fontSize: "1rem", lineHeight: 1,
                  }}
                >
                  ×
                </button>
              </div>
              <p style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: "1.05rem", fontWeight: 400,
                color: "#e8e4dd", marginBottom: 8,
              }}>
                {activeEvent.title}
              </p>
              <p style={{
                fontFamily: "'Manrope', sans-serif", fontSize: "0.75rem",
                color: "rgba(154,149,141,0.8)", lineHeight: 1.7,
              }}>
                {activeEvent.desc}
              </p>
            </div>
          )}

          {/* Вкладки */}
          <div style={{ display: "flex", borderBottom: "1px solid rgba(201,169,110,0.08)", marginTop: 16 }}>
            {(["events", "figures"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  flex: 1, padding: "10px",
                  background: "transparent", border: "none",
                  borderBottom: activeTab === tab
                    ? `1px solid ${topic.color}`
                    : "1px solid transparent",
                  cursor: "pointer",
                  fontFamily: "'Manrope', sans-serif",
                  fontSize: "0.62rem", letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  color: activeTab === tab ? topic.color : "rgba(154,149,141,0.5)",
                  transition: "all 0.2s",
                }}
              >
                {tab === "events" ? "Хронологія" : "Постаті"}
              </button>
            ))}
          </div>

          {/* Список */}
          <div style={{ flex: 1, overflowY: "auto", padding: "8px 0" }}>
            {activeTab === "events" ? (
              topic.events.map((event) => (
                <button
                  key={event.id}
                  onClick={() => setActiveEvent(event)}
                  style={{
                    width: "100%", textAlign: "left",
                    padding: "14px 24px",
                    background: activeEvent?.id === event.id
                      ? "rgba(201,169,110,0.06)"
                      : "transparent",
                    border: "none",
                    borderLeft: activeEvent?.id === event.id
                      ? `2px solid ${topic.color}`
                      : "2px solid transparent",
                    cursor: "pointer",
                    transition: "all 0.2s",
                  }}
                >
                  <span style={{
                    fontFamily: "'Manrope', sans-serif",
                    fontSize: "0.62rem", letterSpacing: "0.15em",
                    color: topic.color, display: "block", marginBottom: 4,
                  }}>
                    {event.year} р.
                  </span>
                  <span style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: "1rem", fontWeight: 300,
                    color: "#e8e4dd", display: "block", lineHeight: 1.3,
                  }}>
                    {event.title}
                  </span>
                </button>
              ))
            ) : (
              topic.figures.map((figure) => (
                <div
                  key={figure.name}
                  style={{
                    padding: "14px 24px",
                    borderBottom: "1px solid rgba(201,169,110,0.05)",
                  }}
                >
                  <p style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: "1.05rem", fontWeight: 400,
                    color: "#e8e4dd", marginBottom: 4,
                  }}>
                    {figure.name}
                  </p>
                  <p style={{
                    fontFamily: "'Manrope', sans-serif",
                    fontSize: "0.62rem", letterSpacing: "0.1em",
                    color: topic.color, marginBottom: 4,
                  }}>
                    {figure.years}
                  </p>
                  <p style={{
                    fontFamily: "'Manrope', sans-serif",
                    fontSize: "0.72rem",
                    color: "rgba(154,149,141,0.7)", lineHeight: 1.5,
                  }}>
                    {figure.role}
                  </p>
                </div>
              ))
            )}
          </div>

          {/* Підказка */}
          <div style={{
            padding: "12px 24px",
            borderTop: "1px solid rgba(201,169,110,0.06)",
          }}>
            <p style={{
              fontFamily: "'Manrope', sans-serif",
              fontSize: "0.6rem", letterSpacing: "0.1em",
              color: "rgba(154,149,141,0.35)", lineHeight: 1.6,
            }}>
              Натискай на маркери на карті щоб дізнатись більше про подію
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}