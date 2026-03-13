import { createClient } from "@/lib/supabase/server";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";

export default async function CoursePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/");

  const { data: course } = await supabase
    .from("courses")
    .select("*")
    .eq("id", id)
    .single();

  if (!course) notFound();

  const { data: lessons } = await supabase
    .from("lessons")
    .select("*")
    .eq("course_id", id)
    .order("order_index");

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a0c", display: "flex", flexDirection: "column" }}>

      <header style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "20px clamp(20px, 5vw, 80px) 16px",
        borderBottom: "1px solid rgba(201,169,110,0.1)",
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
        }}>{course.title}</span>
        <Link href="/courses" style={{
          fontFamily: "'Manrope', sans-serif", fontSize: "0.72rem",
          letterSpacing: "0.18em", textTransform: "uppercase",
          color: "rgba(201,169,110,0.7)", textDecoration: "none",
        }}>← Курси</Link>
      </header>

      <main style={{
        flex: 1, padding: "60px clamp(20px, 5vw, 80px)",
        maxWidth: 960, margin: "0 auto", width: "100%",
      }}>
        <p style={{
          fontFamily: "'Manrope', sans-serif", fontSize: "0.6rem",
          letterSpacing: "0.35em", textTransform: "uppercase",
          color: "rgba(138,116,68,0.7)", marginBottom: 16,
        }}>Уроки курсу</p>
        <h1 style={{
          fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(2rem, 5vw, 3rem)",
          fontWeight: 300, color: "#e8e4dd", marginBottom: 60, lineHeight: 1.1,
        }}>{course.title}</h1>

        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {lessons?.map((lesson, i) => (
            <Link key={lesson.id} href={`/courses/${id}/lessons/${lesson.id}`} style={{ textDecoration: "none" }}>
              <div style={{
                padding: "28px 40px",
                border: "1px solid rgba(201,169,110,0.08)",
                borderRadius: 2,
                background: "rgba(201,169,110,0.02)",
                display: "flex", alignItems: "center", justifyContent: "space-between",
                transition: "all 0.3s", cursor: "pointer",
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLDivElement).style.background = "rgba(201,169,110,0.05)";
                (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(201,169,110,0.25)";
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLDivElement).style.background = "rgba(201,169,110,0.02)";
                (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(201,169,110,0.08)";
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 32 }}>
                  <span style={{
                    fontFamily: "'Cormorant Garamond', serif", fontSize: "0.9rem",
                    color: "rgba(201,169,110,0.4)", minWidth: 24,
                  }}>{String(i + 1).padStart(2, "0")}</span>
                  <div>
                    <h2 style={{
                      fontFamily: "'Cormorant Garamond', serif", fontSize: "1.3rem",
                      fontWeight: 300, color: "#e8e4dd", marginBottom: 4,
                    }}>{lesson.title}</h2>
                    {lesson.has_map && (
                      <span style={{
                        fontFamily: "'Manrope', sans-serif", fontSize: "0.58rem",
                        letterSpacing: "0.2em", textTransform: "uppercase",
                        color: "rgba(201,169,110,0.5)",
                      }}>◈ Інтерактивна карта</span>
                    )}
                  </div>
                </div>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0, opacity: 0.4 }}>
                  <path d="M3 8H13M13 8L8 3M13 8L8 13" stroke="#c9a96e" strokeWidth="1.5"/>
                </svg>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
