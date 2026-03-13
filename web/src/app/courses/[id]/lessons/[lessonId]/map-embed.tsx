"use client";

import { useEffect, useRef, useState } from "react";

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN!;

const TOPICS: Record<string, { label: string; period: string; center: [number, number]; zoom: number; color: string }> = {
  rus:      { label: "Київська Русь",    period: "IX–XIII ст.",  center: [33.0, 51.5], zoom: 3.8, color: "#c9a96e" },
  cossacks: { label: "Козацька держава", period: "XVI–XVIII ст.", center: [32.5, 49.5], zoom: 4.5, color: "#e2c992" },
  unr:      { label: "УНР та ЗУНР",     period: "1917–1921",    center: [30.5, 49.8], zoom: 4.5, color: "#f0d080" },
};

export default function MapEmbed({ topicId }: { topicId: string }) {
  const mapRef = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mapInstanceRef = useRef<any>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const topic = TOPICS[topicId] || TOPICS.rus;

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

  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
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
      {mapLoaded && (
        <div style={{
          position: "absolute", top: 16, left: 16,
          background: "rgba(10,10,12,0.9)",
          border: `1px solid ${topic.color}33`,
          padding: "10px 16px",
        }}>
          <p style={{
            fontFamily: "'Manrope', sans-serif", fontSize: "0.58rem",
            letterSpacing: "0.2em", textTransform: "uppercase",
            color: topic.color, marginBottom: 2,
          }}>{topic.period}</p>
          <p style={{
            fontFamily: "'Cormorant Garamond', serif", fontSize: "1rem",
            color: "#e8e4dd",
          }}>{topic.label}</p>
        </div>
      )}
    </div>
  );
}