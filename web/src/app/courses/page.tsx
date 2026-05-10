"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Header from "@/app/components/header";
import { Starfield } from "@/components/ui";

type Course = {
  id: string;
  title: string;
  description: string;
  order_index: number;
};

export default function CoursesPage() {
  const trackRef = useRef<HTMLDivElement>(null);
  const positionRef = useRef(0);
  const isDraggingRef = useRef(false);
  const startXRef = useRef(0);
  const scrollStartRef = useRef(0);
  const [isMobile, setIsMobile] = useState(false);
  const [courses, setCourses] = useState<Course[]>([]);

  // Завантажуємо курси з Supabase
  useEffect(() => {
    fetch("/api/courses")
      .then(r => r.json())
      .then(data => setCourses(data))
      .catch(() => setCourses([]));
  }, []);

  // Мобільний
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // Карусель
  useEffect(() => {
    if (isMobile || courses.length === 0) return;
    const track = trackRef.current;
    if (!track) return;

    let animationId: number;
    const cardWidth = 380 + 32;
    const totalCards = courses.length;
    const resetPoint = cardWidth * totalCards;

    const animate = () => {
      if (!isDraggingRef.current) {
        positionRef.current -= 0.15;
        if (positionRef.current <= -resetPoint) positionRef.current = 0;
        if (positionRef.current > 0) positionRef.current = -resetPoint + 10;
        track.style.transform = `translateX(${positionRef.current}px)`;
      }
      animationId = requestAnimationFrame(animate);
    };
    animate();

    const handleMouseDown = (e: MouseEvent) => {
      isDraggingRef.current = true;
      startXRef.current = e.clientX;
      scrollStartRef.current = positionRef.current;
      track.style.cursor = "grabbing";
    };
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDraggingRef.current) return;
      const diff = e.clientX - startXRef.current;
      positionRef.current = scrollStartRef.current + diff;
      if (positionRef.current <= -resetPoint) { positionRef.current = 0; scrollStartRef.current = -diff; }
      if (positionRef.current > 0) { positionRef.current = -resetPoint; scrollStartRef.current = -resetPoint - diff; }
      track.style.transform = `translateX(${positionRef.current}px)`;
    };
    const handleMouseUp = () => { isDraggingRef.current = false; track.style.cursor = "grab"; };

    track.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      cancelAnimationFrame(animationId);
      track.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isMobile, courses]);

  // Дублюємо картки для безкінечної каруселі
  const duplicatedCourses = [...courses, ...courses, ...courses];

  return (
    <div className="min-h-screen flex flex-col overflow-hidden">
      <Starfield count={150} />

      <Header activePage="courses" />

      {/* MAIN */}
      <main className="relative z-10 flex-1 flex flex-col">

        <div className="text-center px-4 pt-6">
          <Link href="/home" className="inline-flex items-center gap-2 text-[var(--text-dim)] hover:text-[var(--gold-light)] transition-colors mb-3">
            <span>←</span>
            <span className="font-sans text-[0.8rem] md:text-[0.85rem]">На головну</span>
          </Link>
          <h1 className="font-serif text-[2rem] md:text-[clamp(2.8rem,6vw,4.5rem)] font-light text-[var(--text)]">
            Програми KAYA
          </h1>
        </div>

        {/* Завантаження */}
        {courses.length === 0 && (
          <div className="flex-1 flex items-center justify-center">
            <p className="font-serif text-[1.1rem] italic" style={{ color: "rgba(201,169,110,0.4)" }}>
              Завантаження курсів...
            </p>
          </div>
        )}

        {/* MOBILE */}
        {isMobile && courses.length > 0 && (
          <div className="flex-1 px-4 py-8">
            <div className="flex flex-col gap-4">
              {courses.map((course) => (
                <div key={course.id} className="kaya-card p-5 flex flex-col">
                  <h3 className="font-serif text-[1.2rem] text-[var(--gold-light)] mb-2">
                    {course.title}
                  </h3>
                  <p className="font-sans text-[0.85rem] font-light leading-[1.6] text-[var(--text-dim)] mb-4">
                    {course.description}
                  </p>
                  <div className="flex items-center justify-end mt-auto">
                    <Link href={`/courses/${course.id}`}
                      className="font-sans text-[0.7rem] tracking-[0.1em] uppercase text-[var(--gold-dim)] hover:text-[var(--gold-light)] transition-colors">
                      Детальніше →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* DESKTOP карусель */}
        {!isMobile && courses.length > 0 && (
          <div className="flex-1 flex items-center">
            <div className="relative w-full overflow-hidden">
              <div
                ref={trackRef}
                className="flex gap-8 will-change-transform select-none"
                style={{ paddingLeft: "60px", cursor: "grab" }}
              >
                {duplicatedCourses.map((course, i) => (
                  <div
                    key={`${course.id}-${i}`}
                    className="kaya-card group p-8 flex flex-col justify-between min-h-[300px] w-[380px] flex-shrink-0 hover:border-[var(--gold-light)] hover:scale-[1.02] transition-all duration-300"
                  >
                    <div>
                      <h3 className="font-serif text-[1.4rem] text-[var(--gold-light)] mb-4">
                        {course.title}
                      </h3>
                      <p className="font-sans text-[0.95rem] font-light leading-[1.8] text-[var(--text-dim)] mb-8">
                        {course.description}
                      </p>
                    </div>
                    <div className="flex items-center justify-end">
                      <Link href={`/courses/${course.id}`}
                        className="font-sans text-[0.8rem] tracking-[0.15em] uppercase text-[var(--gold-dim)] hover:text-[var(--gold-light)] transition-colors">
                        Детальніше →
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="text-center px-4 py-8">
          <Link href="/register" className="hero-cta inline-block text-[0.8rem] md:text-[1rem]">
            Почати навчання
          </Link>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="relative z-10 py-4 md:py-6 px-4 border-t border-[rgba(201,169,110,0.08)]">
        <div className="max-w-[1400px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span className="font-serif text-base md:text-lg tracking-[0.15em] text-[var(--text-dim)]">KAYA</span>
          <span className="font-sans text-[0.65rem] md:text-[0.75rem] text-[var(--text-dim)]">© 2026 KAYA LMS</span>
        </div>
      </footer>
    </div>
  );
}