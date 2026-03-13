"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import dynamic from "next/dynamic";

// Динамічний імпорт карти щоб не ламати SSR
const MapEmbed = dynamic(() => import("./map-embed"), { ssr: false });

type Lesson = {
  id: string;
  title: string;
  content: string;
  has_map: boolean;
  map_topic_id: string | null;
  course_id: string;
};

export default function LessonPage({ params }: { params: { id: string; lessonId: string } }) {
  const router = useRouter();
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [courseTitle, setCourseTitle] = useState("");
  const [showMap, setShowMap] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push("/"); return; }

      const { data: lessonData } = await supabase
        .from("lessons")
        .select("*")
        .eq("id", params.lessonId)
        .single();

      if (!lessonData) { router.push("/courses"); return; }
      setLesson(lessonData);

      const { data: courseData } = await supabase
        .from("courses")
        .select("title")
        .eq("id", params.id)
        .single();

      if (courseData) setCourseTitle(courseData.title);
      setLoading(false);
    };
    load();
  }, [params.id, params.lessonId, router]);

  if (loading) return (
    <div style={{ minHeight: "100vh", background: "#0a0a0c", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.2rem", fontStyle: "italic", color: "rgba(201,169,110,0.5)" }}>
        Завантаження...
      </p>
    </div>
  );

  if (!lesson) return null;

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a0c", display: "flex", flexDirection: "column" }}>

      {/* HEADER */}
      <header style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "20px clamp(20px, 5vw, 80px) 16px",
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
        }}>{courseTitle}</span>
        <Link href={`/courses/${params.id}`} style={{
          fontFamily: "'Manrope', sans-serif", fontSize: "0.72rem",
          letterSpacing: "0.18em", textTransform: "uppercase",
          color: "rgba(201,169,110,0.7)", textDecoration: "none",
        }}>← Уроки</Link>
      </header>

      {/* УРОК */}
      <main style={{
        flex: 1, padding: "60px clamp(20px, 5vw, 80px)",
        maxWidth: showMap ? "100%" : 800,
        margin: "0 auto", width: "100%",
        display: showMap ? "flex" : "block",
        gap: showMap ? 0 : 0,
      }}>
        {!showMap ? (
          <div>
            <p style={{
              fontFamily: "'Manrope', sans-serif", fontSize: "0.6rem",
              letterSpacing: "0.35em", textTransform: "uppercase",
              color: "rgba(138,116,68,0.7)", marginBottom: 16,
            }}>Урок</p>

            <h1 style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "clamp(2rem, 5vw, 3.2rem)",
              fontWeight: 300, color: "#e8e4dd",
              marginBottom: 40, lineHeight: 1.1,
            }}>{lesson.title}</h1>

            <div style={{
              width: 40, height: 1,
              background: "rgba(201,169,110,0.3)",
              marginBottom: 40,
            }} />

            <p style={{
              fontFamily: "'Manrope', sans-serif", fontSize: "0.9rem",
              color: "rgba(232,228,221,0.8)", lineHeight: 1.9,
              marginBottom: 60,
            }}>{lesson.content}</p>

            {lesson.has_map && (
              <div style={{
                padding: "28px 32px",
                border: "1px solid rgba(201,169,110,0.2)",
                background: "rgba(201,169,110,0.03)",
                display: "flex", alignItems: "center", justifyContent: "space-between",
                gap: 24, flexWrap: "wrap",
              }}>
                <div>
                  <p style={{
                    fontFamily: "'Manrope', sans-serif", fontSize: "0.6rem",
                    letterSpacing: "0.25em", textTransform: "uppercase",
                    color: "rgba(201,169,110,0.6)", marginBottom: 6,
                  }}>◈ Інтерактивна карта</p>
                  <p style={{
                    fontFamily: "'Cormorant Garamond', serif", fontSize: "1.15rem",
                    fontWeight: 300, color: "#e8e4dd",
                  }}>Дослідити на карті: {lesson.title}</p>
                </div>
                <button
                  onClick={() => setShowMap(true)}
                  style={{
                    padding: "12px 28px",
                    background: "transparent",
                    border: "1px solid rgba(201,169,110,0.4)",
                    cursor: "pointer",
                    fontFamily: "'Manrope', sans-serif", fontSize: "0.68rem",
                    letterSpacing: "0.2em", textTransform: "uppercase",
                    color: "rgba(201,169,110,0.9)",
                    transition: "all 0.3s", whiteSpace: "nowrap",
                  }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLButtonElement).style.background = "rgba(201,169,110,0.08)";
                    (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(201,169,110,0.7)";
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLButtonElement).style.background = "transparent";
                    (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(201,169,110,0.4)";
                  }}
                >
                  Відкрити карту →
                </button>
              </div>
            )}
          </div>
        ) : (
          <div style={{ flex: 1, display: "flex", flexDirection: "column", width: "100%", margin: "0 -80px", padding: 0 }}>
            <div style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              padding: "0 0 20px 0", flexShrink: 0,
            }}>
              <h2 style={{
                fontFamily: "'Cormorant Garamond', serif", fontSize: "1.4rem",
                fontWeight: 300, color: "#e8e4dd",
              }}>{lesson.title}</h2>
              <button
                onClick={() => setShowMap(false)}
                style={{
                  padding: "8px 20px", background: "transparent",
                  border: "1px solid rgba(201,169,110,0.25)", cursor: "pointer",
                  fontFamily: "'Manrope', sans-serif", fontSize: "0.62rem",
                  letterSpacing: "0.2em", textTransform: "uppercase",
                  color: "rgba(201,169,110,0.6)",
                }}
              >← До уроку</button>
            </div>
            <div style={{ flex: 1, minHeight: "calc(100vh - 200px)" }}>
              <MapEmbed topicId={lesson.map_topic_id || "rus"} />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}