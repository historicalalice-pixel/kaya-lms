"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useParams } from "next/navigation";
import Link from "next/link";
import dynamic from "next/dynamic";

const MapEmbed = dynamic(() => import("./map-embed"), { ssr: false });

type Lesson = {
  id: string;
  title: string;
  content: string;
  has_map: boolean;
  map_topic_id: string | null;
  course_id: string;
};

export default function LessonPage() {
  const params = useParams();
  const id = params.id as string;
  const lessonId = params.lessonId as string;
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [courseTitle, setCourseTitle] = useState("");
  const [showMap, setShowMap] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    const load = async () => {
      const supabase = createClient();

      const { data: lessonData } = await supabase
        .from("lessons")
        .select("*")
        .eq("id", lessonId)
        .single();

      if (!lessonData) return;
      setLesson(lessonData);

      const { data: courseData } = await supabase
        .from("courses")
        .select("title")
        .eq("id", id)
        .single();

      if (courseData) setCourseTitle(courseData.title);
      setLoading(false);
    };
    load();
  }, [id, lessonId]);

  if (loading) return (
    <div style={{ minHeight: "100vh", background: "#0a0a0c", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.2rem", fontStyle: "italic", color: "rgba(201,169,110,0.5)" }}>
        Завантаження...
      </p>
    </div>
  );

  if (!lesson) return null;

  // ── РЕЖИМ КАРТИ — повний екран ──────────────────────────────────────────────
  if (showMap) {
    return (
      <div style={{ position: "fixed", inset: 0, background: "#0a0a0c", display: "flex", flexDirection: "column", zIndex: 100 }}>
        {/* Хедер карти */}
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: isMobile ? "12px 16px" : "14px 24px",
          borderBottom: "1px solid rgba(201,169,110,0.1)",
          flexShrink: 0,
          gap: 12,
        }}>
          <h2 style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: isMobile ? "1rem" : "1.2rem",
            fontWeight: 300,
            color: "#e8e4dd",
            margin: 0,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            flex: 1,
          }}>{lesson.title}</h2>
          <button onClick={() => setShowMap(false)} style={{
            padding: isMobile ? "8px 14px" : "8px 20px",
            background: "transparent",
            border: "1px solid rgba(201,169,110,0.25)",
            cursor: "pointer",
            fontFamily: "'Manrope', sans-serif",
            fontSize: "0.62rem",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: "rgba(201,169,110,0.7)",
            whiteSpace: "nowrap",
            flexShrink: 0,
          }}>← До уроку</button>
        </div>

        {/* Карта — на весь екран що залишився */}
        <div style={{ flex: 1, overflow: "hidden", position: "relative" }}>
          <MapEmbed topicId={lesson.map_topic_id || "rus"} />
        </div>
      </div>
    );
  }

  // ── РЕЖИМ УРОКУ ─────────────────────────────────────────────────────────────
  return (
    <div style={{ minHeight: "100vh", background: "#0a0a0c", display: "flex", flexDirection: "column" }}>
      <header style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: isMobile ? "14px 16px" : "20px clamp(20px, 5vw, 80px) 16px",
        borderBottom: "1px solid rgba(201,169,110,0.1)",
        flexShrink: 0,
        gap: 8,
      }}>
        <Link href="/home" style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: isMobile ? "1.4rem" : "1.8rem",
          letterSpacing: "0.24em",
          color: "rgba(245,239,230,0.9)",
          textDecoration: "none",
          fontWeight: 300,
          flexShrink: 0,
        }}>KAYA</Link>

        {/* Назва курсу — приховуємо на дуже маленьких */}
        {!isMobile && (
          <span style={{
            fontFamily: "'Manrope', sans-serif",
            fontSize: "0.6rem",
            letterSpacing: "0.3em",
            textTransform: "uppercase",
            color: "rgba(138,116,68,0.8)",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            maxWidth: "40%",
            textAlign: "center",
          }}>{courseTitle}</span>
        )}

        <Link href={`/courses/${id}`} style={{
          fontFamily: "'Manrope', sans-serif",
          fontSize: isMobile ? "0.65rem" : "0.72rem",
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          color: "rgba(201,169,110,0.7)",
          textDecoration: "none",
          flexShrink: 0,
        }}>← Уроки</Link>
      </header>

      <main style={{
        flex: 1,
        padding: isMobile ? "32px 20px 48px" : "60px clamp(20px, 5vw, 80px)",
        maxWidth: 800,
        margin: "0 auto",
        width: "100%",
        boxSizing: "border-box",
      }}>
        <p style={{
          fontFamily: "'Manrope', sans-serif",
          fontSize: "0.6rem",
          letterSpacing: "0.35em",
          textTransform: "uppercase",
          color: "rgba(138,116,68,0.7)",
          marginBottom: 14,
        }}>Урок</p>

        <h1 style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: isMobile ? "clamp(1.8rem, 7vw, 2.4rem)" : "clamp(2rem, 5vw, 3.2rem)",
          fontWeight: 300,
          color: "#e8e4dd",
          marginBottom: isMobile ? 28 : 40,
          lineHeight: 1.15,
        }}>{lesson.title}</h1>

        <div style={{ width: 40, height: 1, background: "rgba(201,169,110,0.3)", marginBottom: isMobile ? 28 : 40 }} />

        <p style={{
          fontFamily: "'Manrope', sans-serif",
          fontSize: isMobile ? "0.95rem" : "0.9rem",
          color: "rgba(232,228,221,0.8)",
          lineHeight: 1.9,
          marginBottom: isMobile ? 40 : 60,
        }}>{lesson.content}</p>

        {lesson.has_map && (
          <div style={{
            padding: isMobile ? "20px 18px" : "28px 32px",
            border: "1px solid rgba(201,169,110,0.2)",
            background: "rgba(201,169,110,0.03)",
            display: "flex",
            flexDirection: isMobile ? "column" : "row",
            alignItems: isMobile ? "flex-start" : "center",
            justifyContent: "space-between",
            gap: isMobile ? 16 : 24,
          }}>
            <div>
              <p style={{
                fontFamily: "'Manrope', sans-serif",
                fontSize: "0.6rem",
                letterSpacing: "0.25em",
                textTransform: "uppercase",
                color: "rgba(201,169,110,0.6)",
                marginBottom: 6,
              }}>◈ Інтерактивна карта</p>
              <p style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: isMobile ? "1rem" : "1.15rem",
                fontWeight: 300,
                color: "#e8e4dd",
              }}>Дослідити на карті: {lesson.title}</p>
            </div>
            <button onClick={() => setShowMap(true)} style={{
              padding: isMobile ? "12px 24px" : "12px 28px",
              background: "transparent",
              border: "1px solid rgba(201,169,110,0.4)",
              cursor: "pointer",
              fontFamily: "'Manrope', sans-serif",
              fontSize: "0.68rem",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "rgba(201,169,110,0.9)",
              transition: "all 0.3s",
              whiteSpace: "nowrap",
              alignSelf: isMobile ? "stretch" : "auto",
              textAlign: "center",
            }}>
              Відкрити карту →
            </button>
          </div>
        )}
      </main>
    </div>
  );
}