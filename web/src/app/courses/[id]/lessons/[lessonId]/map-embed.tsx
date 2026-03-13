"use client";

import { useEffect, useRef, useState } from "react";

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN!;

type TopicEvent = {
  id: number;
  year: number;
  title: string;
  coords: [number, number];
  desc: string;
};

type Figure = {
  name: string;
  years: string;
  role: string;
};

type Topic = {
  id: string;
  label: string;
  period: string;
  center: [number, number];
  zoom: number;
  color: string;
  territory: object;
  events: TopicEvent[];
  figures: Figure[];
};

const TOPICS: Topic[] = [
  {
    id: "rus",
    label: "Київська Русь",
    period: "IX–XIII ст.",
    center: [33.0, 51.5],
    zoom: 3.8,
    color: "#c9a96e",
    territory: {
      type: "Feature",
      properties: { name: "Київська Русь" },
      geometry: {
        type: "Polygon",
        coordinates: [[[28.0,57.5],[39.5,57.0],[40.5,54.5],[37.5,51.5],[36.5,47.5],[33.5,45.5],[30.0,46.5],[24.0,49.0],[24.0,52.0],[28.5,55.5],[28.0,57.5]]]
      }
    },
    events: [
      { id: 1, year: 882,  title: "Олег захоплює Київ",             coords: [30.52, 50.45], desc: "Князь Олег об'єднує Новгород і Київ, заснувавши Київську Русь як державу. Київ стає столицею." },
      { id: 2, year: 988,  title: "Хрещення Русі",                  coords: [30.46, 50.43], desc: "Князь Володимир Великий наказує хрестити киян у водах Дніпра. Православ'я стає державною релігією Русі." },
      { id: 3, year: 1037, title: "Будівництво Софійського собору", coords: [30.51, 50.45], desc: "Ярослав Мудрий будує Софійський собор у Києві — символ розквіту та могутності Київської Русі." },
      { id: 4, year: 1240, title: "Батиєва навала. Падіння Києва",  coords: [32.50, 49.50], desc: "Монгольська орда під керівництвом Батия руйнує Київ. Місто спалене. Кінець Київської Русі як держави." },
    ],
    figures: [
      { name: "Олег Віщий",        years: "?–912",    role: "Перший князь Київської Русі, об'єднав Новгород і Київ" },
      { name: "Володимир Великий", years: "960–1015", role: "Хреститель Русі, будівничий держави" },
      { name: "Ярослав Мудрий",    years: "978–1054", role: "Розквіт держави, Руська правда, Софія Київська" },
      { name: "Ольга",             years: "890–969",  role: "Перша правителька-християнка, реформи управління" },
    ],
  },
  {
    id: "cossacks",
    label: "Козацька держава",
    period: "XVI–XVIII ст.",
    center: [32.5, 49.5],
    zoom: 4.5,
    color: "#e2c992",
    territory: {
      type: "Feature",
      properties: { name: "Гетьманщина" },
      geometry: {
        type: "Polygon",
        coordinates: [[[32.0,53.0],[33.5,52.5],[35.0,52.0],[36.5,51.0],[37.2,50.0],[36.8,49.0],[35.5,47.5],[34.0,47.0],[33.0,46.5],[31.5,46.5],[30.5,47.5],[28.5,48.5],[27.5,49.5],[26.5,51.0],[28.0,52.0],[30.0,52.8],[32.0,53.0]]]
      }
    },
    events: [
      { id: 1, year: 1648, title: "Битва під Жовтими Водами", coords: [33.35, 48.35], desc: "Перша перемога Богдана Хмельницького над польськими військами. Початок Національно-визвольної війни." },
      { id: 2, year: 1649, title: "Битва під Зборовом",       coords: [25.15, 49.67], desc: "Козацько-татарське військо оточує польського короля Яна II Казимира. Зборівський мирний договір." },
      { id: 3, year: 1654, title: "Переяславська рада",       coords: [31.45, 50.08], desc: "Рада у Переяславі. Гетьман Хмельницький укладає союз з Московським царством." },
      { id: 4, year: 1709, title: "Полтавська битва",         coords: [34.55, 49.59], desc: "Поразка Карла XII та Мазепи. Фактичний кінець незалежної козацької політики." },
    ],
    figures: [
      { name: "Богдан Хмельницький", years: "1595–1657", role: "Гетьман, засновник Гетьманщини, полководець" },
      { name: "Іван Мазепа",         years: "1639–1709", role: "Гетьман, меценат, союзник Карла XII" },
      { name: "Іван Виговський",     years: "?–1664",    role: "Гетьман, автор Гадяцького договору" },
      { name: "Петро Дорошенко",     years: "1627–1698", role: "Гетьман Правобережної України" },
    ],
  },
  {
    id: "unr",
    label: "УНР та ЗУНР",
    period: "1917–1921",
    center: [30.5, 49.8],
    zoom: 4.5,
    color: "#f0d080",
    territory: {
      type: "Feature",
      properties: { name: "УНР та ЗУНР" },
      geometry: {
        type: "Polygon",
        coordinates: [[[24.0,51.5],[27.5,52.0],[30.5,52.5],[33.5,52.0],[35.5,51.5],[36.5,50.5],[38.5,49.5],[38.0,48.0],[35.0,46.5],[33.5,46.0],[32.0,46.5],[31.0,46.2],[29.5,46.0],[28.5,46.2],[22.5,48.5],[22.0,49.0],[22.5,50.5],[23.0,51.0],[24.0,51.5]]]
      }
    },
    events: [
      { id: 1, year: 1917, title: "Проголошення УНР",           coords: [30.52, 50.45], desc: "Українська Центральна Рада проголошує Українську Народну Республіку у складі федеративної Росії." },
      { id: 2, year: 1918, title: "IV Універсал. Незалежність", coords: [30.52, 50.40], desc: "22 січня 1918 — УНР проголошує повну незалежність від Росії. Перша незалежна українська держава." },
      { id: 3, year: 1918, title: "Проголошення ЗУНР",          coords: [24.02, 49.84], desc: "Листопад 1918 — Західноукраїнська Народна Республіка зі столицею у Львові після розпаду Австро-Угорщини." },
      { id: 4, year: 1919, title: "Акт Злуки",                  coords: [30.52, 50.48], desc: "22 січня 1919 у Києві — урочисте об'єднання УНР і ЗУНР в єдину соборну українську державу." },
    ],
    figures: [
      { name: "Михайло Грушевський",  years: "1866–1934", role: "Голова Центральної Ради, історик" },
      { name: "Симон Петлюра",        years: "1879–1926", role: "Головний Отаман військ УНР" },
      { name: "Євген Петрушевич",     years: "1863–1940", role: "Президент ЗУНР" },
      { name: "Володимир Винниченко", years: "1880–1951", role: "Голова Генерального секретаріату, письменник" },
    ],
  },
];

export default function MapEmbed({ topicId }: { topicId: string }) {
  const mapRef = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mapInstanceRef = useRef<any>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [activeEvent, setActiveEvent] = useState<TopicEvent | null>(null);
  const [activeTab, setActiveTab] = useState<"events" | "figures">("events");

  const topic = TOPICS.find(t => t.id === topicId) || TOPICS[0];

  const selectEvent = (ev: TopicEvent) => {
    setActiveEvent(ev);
    if (!mapInstanceRef.current) return;
    mapInstanceRef.current.flyTo({ center: ev.coords, zoom: 7, duration: 1200 });
  };

  const closeEvent = () => {
    setActiveEvent(null);
    if (!mapInstanceRef.current) return;
    mapInstanceRef.current.flyTo({ center: topic.center, zoom: topic.zoom, duration: 1200 });
  };

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
        center: topic.center,
        zoom: topic.zoom,
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

  useEffect(() => {
    if (!mapLoaded || !mapInstanceRef.current) return;
    const map = mapInstanceRef.current;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const mapboxgl = (window as any).mapboxgl;

    ["territory-fill", "territory-outline"].forEach(id => { if (map.getLayer(id)) map.removeLayer(id); });
    ["territory-source"].forEach(id => { if (map.getSource(id)) map.removeSource(id); });
    document.querySelectorAll(".kaya-marker").forEach(el => el.remove());

    map.addSource("territory-source", {
      type: "geojson",
      data: { type: "FeatureCollection", features: [topic.territory] },
    });
    map.addLayer({ id: "territory-fill", type: "fill", source: "territory-source", paint: { "fill-color": topic.color, "fill-opacity": 0.1 } });
    map.addLayer({ id: "territory-outline", type: "line", source: "territory-source", paint: { "line-color": topic.color, "line-width": 1.5, "line-opacity": 0.55 } });

    const offsets: [number, number][] = [[0,0],[-22,-18],[20,-12],[0,0]];

    topic.events.forEach((ev, index) => {
      const el = document.createElement("div");
      el.className = "kaya-marker";
      el.style.cssText = `
        width: 30px; height: 30px; border-radius: 50%;
        background: rgba(10,10,12,0.95);
        border: 1.5px solid ${topic.color};
        display: flex; align-items: center; justify-content: center;
        cursor: pointer;
        font-family: 'Manrope', sans-serif;
        font-size: 8.5px; color: ${topic.color}; font-weight: 600;
        box-shadow: 0 0 14px ${topic.color}55;
        transition: border-color 0.2s, color 0.2s, box-shadow 0.2s;
      `;
      el.textContent = String(ev.year);
      el.addEventListener("mouseenter", () => {
        el.style.borderColor = "#fff"; el.style.color = "#fff";
        el.style.boxShadow = `0 0 20px ${topic.color}99`;
      });
      el.addEventListener("mouseleave", () => {
        el.style.borderColor = topic.color; el.style.color = topic.color;
        el.style.boxShadow = `0 0 14px ${topic.color}55`;
      });
      el.addEventListener("click", () => selectEvent(ev));
      new mapboxgl.Marker({ element: el, anchor: "center", offset: offsets[index] || [0,0] })
        .setLngLat(ev.coords).addTo(map);
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mapLoaded]);

  return (
    <div style={{ width: "100%", height: "100%", display: "flex", overflow: "hidden" }}>

      {/* КАРТА */}
      <div style={{ flex: 1, position: "relative" }}>
        <div ref={mapRef} style={{ width: "100%", height: "100%" }} />

        {!mapLoaded && (
          <div style={{
            position: "absolute", inset: 0,
            display: "flex", alignItems: "center", justifyContent: "center",
            background: "#0a0a0c",
          }}>
            <p style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "1.2rem", fontStyle: "italic",
              color: "rgba(201,169,110,0.5)",
            }}>Завантаження карти...</p>
          </div>
        )}

        {activeEvent && (
          <div style={{
            position: "absolute", bottom: 20, left: "50%",
            transform: "translateX(-50%)",
            width: "min(380px, calc(100% - 32px))",
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
              fontSize: "1.05rem", fontWeight: 400, color: "#e8e4dd", marginBottom: 8,
            }}>{activeEvent.title}</p>
            <p style={{
              fontFamily: "'Manrope', sans-serif",
              fontSize: "0.74rem", color: "rgba(154,149,141,0.85)", lineHeight: 1.75,
            }}>{activeEvent.desc}</p>
          </div>
        )}
      </div>

      {/* БОКОВА ПАНЕЛЬ */}
      <div style={{
        width: 280, flexShrink: 0,
        background: "rgba(10,10,12,0.97)",
        borderLeft: "1px solid rgba(201,169,110,0.1)",
        display: "flex", flexDirection: "column", overflow: "hidden",
      }}>
        <div style={{ padding: "20px 20px 14px", borderBottom: "1px solid rgba(201,169,110,0.08)" }}>
          <p style={{
            fontFamily: "'Manrope', sans-serif", fontSize: "0.58rem",
            letterSpacing: "0.3em", textTransform: "uppercase",
            color: "rgba(138,116,68,0.7)", marginBottom: 6,
          }}>{topic.period}</p>
          <h2 style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: "1.3rem", fontWeight: 300, color: "#e8e4dd", lineHeight: 1.2,
          }}>{topic.label}</h2>
        </div>

        <div style={{ display: "flex", borderBottom: "1px solid rgba(201,169,110,0.08)" }}>
          {(["events", "figures"] as const).map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} style={{
              flex: 1, padding: "10px",
              background: "transparent", border: "none",
              borderBottom: activeTab === tab ? `1px solid ${topic.color}` : "1px solid transparent",
              cursor: "pointer", fontFamily: "'Manrope', sans-serif",
              fontSize: "0.6rem", letterSpacing: "0.2em", textTransform: "uppercase",
              color: activeTab === tab ? topic.color : "rgba(154,149,141,0.5)",
              transition: "all 0.2s",
            }}>
              {tab === "events" ? "Хронологія" : "Постаті"}
            </button>
          ))}
        </div>

        <div style={{ flex: 1, overflowY: "auto", padding: "6px 0" }}>
          {activeTab === "events" ? (
            topic.events.map(ev => (
              <button key={ev.id} onClick={() => selectEvent(ev)} style={{
                width: "100%", textAlign: "left", padding: "13px 20px",
                background: activeEvent?.id === ev.id ? "rgba(201,169,110,0.05)" : "transparent",
                border: "none",
                borderLeft: activeEvent?.id === ev.id ? `2px solid ${topic.color}` : "2px solid transparent",
                cursor: "pointer", transition: "all 0.2s",
              }}>
                <span style={{
                  fontFamily: "'Manrope', sans-serif", fontSize: "0.58rem",
                  letterSpacing: "0.15em", color: topic.color, display: "block", marginBottom: 4,
                }}>{ev.year} р.</span>
                <span style={{
                  fontFamily: "'Cormorant Garamond', serif", fontSize: "0.95rem",
                  fontWeight: 300, color: "#e8e4dd", display: "block", lineHeight: 1.3,
                }}>{ev.title}</span>
              </button>
            ))
          ) : (
            topic.figures.map(figure => (
              <div key={figure.name} style={{
                padding: "13px 20px", borderBottom: "1px solid rgba(201,169,110,0.05)",
              }}>
                <p style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: "1rem", fontWeight: 400, color: "#e8e4dd", marginBottom: 4,
                }}>{figure.name}</p>
                <p style={{
                  fontFamily: "'Manrope', sans-serif", fontSize: "0.58rem",
                  letterSpacing: "0.1em", color: topic.color, marginBottom: 4,
                }}>{figure.years}</p>
                <p style={{
                  fontFamily: "'Manrope', sans-serif", fontSize: "0.68rem",
                  color: "rgba(154,149,141,0.7)", lineHeight: 1.5,
                }}>{figure.role}</p>
              </div>
            ))
          )}
        </div>

        {!activeEvent && (
          <div style={{ padding: "10px 20px", borderTop: "1px solid rgba(201,169,110,0.06)" }}>
            <p style={{
              fontFamily: "'Manrope', sans-serif", fontSize: "0.56rem",
              letterSpacing: "0.1em", color: "rgba(154,149,141,0.3)", lineHeight: 1.6,
            }}>Натискай на маркери щоб дізнатись більше</p>
          </div>
        )}
      </div>
    </div>
  );
}