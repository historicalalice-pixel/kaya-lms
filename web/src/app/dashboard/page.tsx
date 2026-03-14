import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import LogoutButton from "../components/logout-button";
import OnboardingForm from "./onboarding-form";

export default async function Dashboard() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, full_name, phone, grade, telegram, onboarding_completed")
    .eq("id", user.id)
    .single();

  const displayName = profile?.full_name || user.email?.split("@")[0] || "Учень";
  const needsOnboarding = !profile?.onboarding_completed;

  return (
    <div style={{
      minHeight: "100vh",
      background: "var(--bg, #0a0a0c)",
      color: "var(--text, #e8e4dd)",
      fontFamily: "'Manrope', sans-serif",
      display: "flex",
      width: "100%",
    }}>
      {needsOnboarding && <OnboardingForm userId={user.id} />}

      {/* ===== SIDEBAR ===== */}
      <aside style={{
        width: 220,
        flexShrink: 0,
        borderRight: "1px solid rgba(201,169,110,0.1)",
        display: "flex",
        flexDirection: "column",
        padding: "28px 0",
        minHeight: "100vh",
        position: "sticky",
        top: 0,
        height: "100vh",
        overflow: "hidden",
      }}>
        <Link href="/home" style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: "1.8rem",
          fontWeight: 300,
          letterSpacing: "0.3em",
          color: "rgba(245,239,230,0.9)",
          textDecoration: "none",
          padding: "0 24px 28px",
          display: "block",
          borderBottom: "1px solid rgba(201,169,110,0.08)",
        }}>
          KAYA
        </Link>

        <nav style={{ flex: 1, padding: "16px 12px", display: "flex", flexDirection: "column", gap: 2 }}>
          {[
            { href: "/dashboard", label: "Dashboard", active: true },
            { href: "/dashboard/learning", label: "Моє навчання", active: false },
            { href: "/dashboard/assignments", label: "Завдання", active: false },
            { href: "/dashboard/tests", label: "Тести", active: false },
            { href: "/dashboard/schedule", label: "Розклад", active: false },
            { href: "/map", label: "Карта", active: false },
            { href: "/dashboard/messages", label: "Повідомлення", active: false },
          ].map(({ href, label, active }) => (
            <Link key={href} href={href} style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "9px 12px",
              borderRadius: 4,
              textDecoration: "none",
              fontSize: "0.78rem",
              letterSpacing: "0.04em",
              color: active ? "var(--gold-light, #e2c992)" : "var(--text-dim, #9a958d)",
              background: active ? "rgba(201,169,110,0.07)" : "transparent",
              borderLeft: active ? "2px solid var(--gold-dim, #8a7444)" : "2px solid transparent",
              transition: "all 0.2s",
            }}>
              {label}
            </Link>
          ))}
        </nav>

        <div style={{
          padding: "16px 12px 0",
          borderTop: "1px solid rgba(201,169,110,0.08)",
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}>
          <Link href="/dashboard/profile" style={{
            display: "flex", alignItems: "center", gap: 10,
            padding: "9px 12px", borderRadius: 4, textDecoration: "none",
            fontSize: "0.78rem", color: "var(--text-dim, #9a958d)",
          }}>
            Профіль
          </Link>
          <div style={{ padding: "4px 12px" }}>
            <LogoutButton />
          </div>
        </div>
      </aside>

      {/* ===== MAIN ===== */}
      <main style={{ flex: 1, padding: "36px 40px", maxWidth: "calc(100vw - 220px)" }}>

        {/* Вітання */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 32, flexWrap: "wrap", gap: 16 }}>
          <div>
            <p style={{ fontSize: "0.6rem", letterSpacing: "0.35em", textTransform: "uppercase", color: "var(--gold-dim, #8a7444)", marginBottom: 8 }}>
              Навчальний кабінет
            </p>
            <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(1.6rem, 3vw, 2.4rem)", fontWeight: 300, color: "var(--text, #e8e4dd)", lineHeight: 1.2, marginBottom: 6 }}>
              Вітаємо, {displayName}
            </h1>
            <p style={{ fontSize: "0.78rem", color: "var(--text-dim, #9a958d)" }}>
              Твій шлях крізь час починається тут
            </p>
          </div>
          <Link href="/courses" style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            padding: "12px 28px",
            border: "1px solid rgba(201,169,110,0.4)",
            color: "var(--gold-light, #e2c992)",
            textDecoration: "none",
            fontSize: "0.65rem", letterSpacing: "0.25em", textTransform: "uppercase",
            whiteSpace: "nowrap",
          }}>
            ▶ Обрати курс
          </Link>
        </div>

        {/* 4 картки статистики */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 28 }}>
          {[
            { label: "Прогрес курсу", value: "0%", sub: "Курс не обрано" },
            { label: "Завершено тем", value: "0", sub: "з 0 тем" },
            { label: "Середній бал", value: "—", sub: "балів поки немає" },
            { label: "Активні завдання", value: "0", sub: "завдань немає" },
          ].map((s, i) => (
            <div key={i} style={{
              border: "1px solid rgba(201,169,110,0.12)",
              background: "rgba(201,169,110,0.02)",
              padding: "20px 22px",
            }}>
              <p style={{ fontSize: "0.58rem", letterSpacing: "0.25em", textTransform: "uppercase", color: "var(--gold-dim, #8a7444)", marginBottom: 10 }}>
                {s.label}
              </p>
              <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "2rem", fontWeight: 300, color: "var(--gold-light, #e2c992)", marginBottom: 4 }}>
                {s.value}
              </p>
              <p style={{ fontSize: "0.68rem", color: "rgba(154,149,141,0.6)" }}>{s.sub}</p>
              <div style={{ marginTop: 12, height: 1, background: "rgba(201,169,110,0.08)" }} />
            </div>
          ))}
        </div>

        {/* Два стовпці */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>

          {/* ЛІВА */}
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

            {/* Продовжити навчання */}
            <div style={{ border: "1px solid rgba(201,169,110,0.12)", background: "rgba(201,169,110,0.02)", padding: "22px 24px" }}>
              <p style={{ fontSize: "0.58rem", letterSpacing: "0.28em", textTransform: "uppercase", color: "var(--gold-dim, #8a7444)", marginBottom: 16 }}>
                Продовжити навчання
              </p>
              <div style={{ borderLeft: "2px solid rgba(201,169,110,0.25)", paddingLeft: 14 }}>
                <p style={{ fontSize: "0.68rem", color: "rgba(154,149,141,0.5)", marginBottom: 4 }}>Курс не обрано</p>
                <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.15rem", fontWeight: 300, color: "var(--text, #e8e4dd)", marginBottom: 14 }}>
                  Обери курс щоб розпочати
                </p>
                <div style={{ height: 2, background: "rgba(201,169,110,0.08)", marginBottom: 8, borderRadius: 1 }} />
                <p style={{ fontSize: "0.62rem", color: "rgba(154,149,141,0.4)" }}>0% теми завершено</p>
              </div>
            </div>

            {/* Найближчі події */}
            <div style={{ border: "1px solid rgba(201,169,110,0.12)", background: "rgba(201,169,110,0.02)", padding: "22px 24px" }}>
              <p style={{ fontSize: "0.58rem", letterSpacing: "0.28em", textTransform: "uppercase", color: "var(--gold-dim, #8a7444)", marginBottom: 16 }}>
                Найближчі події
              </p>
              <div style={{ display: "flex", alignItems: "flex-start", gap: 12, padding: "10px 0" }}>
                <div style={{ width: 6, height: 6, borderRadius: "50%", marginTop: 5, background: "rgba(201,169,110,0.3)", flexShrink: 0 }} />
                <div>
                  <p style={{ fontSize: "0.65rem", color: "rgba(154,149,141,0.5)", marginBottom: 2 }}>Незабаром</p>
                  <p style={{ fontSize: "0.82rem", color: "var(--text, #e8e4dd)" }}>Обери курс щоб побачити розклад</p>
                </div>
              </div>
            </div>

            {/* Рекомендації */}
            <div style={{ border: "1px solid rgba(201,169,110,0.12)", background: "rgba(201,169,110,0.02)", padding: "22px 24px" }}>
              <p style={{ fontSize: "0.58rem", letterSpacing: "0.28em", textTransform: "uppercase", color: "var(--gold-dim, #8a7444)", marginBottom: 16 }}>
                Рекомендації
              </p>
              {[
                { badge: "Старт", text: "Обери курс і розпочни навчання" },
                { badge: "Профіль", text: "Заповни профіль — вкажи клас і ціль" },
              ].map((rec, i, arr) => (
                <div key={i} style={{
                  display: "flex", alignItems: "center", gap: 12,
                  padding: "10px 0",
                  borderBottom: i < arr.length - 1 ? "1px solid rgba(201,169,110,0.06)" : "none",
                }}>
                  <span style={{
                    fontSize: "0.55rem", letterSpacing: "0.1em",
                    background: "rgba(201,169,110,0.08)", color: "var(--gold-dim, #8a7444)",
                    border: "1px solid rgba(201,169,110,0.18)",
                    padding: "3px 8px", whiteSpace: "nowrap", flexShrink: 0,
                  }}>{rec.badge}</span>
                  <p style={{ fontSize: "0.78rem", color: "var(--text-dim, #9a958d)", lineHeight: 1.4 }}>{rec.text}</p>
                </div>
              ))}
            </div>
          </div>

          {/* ПРАВА */}
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

            {/* Остання активність */}
            <div style={{ border: "1px solid rgba(201,169,110,0.12)", background: "rgba(201,169,110,0.02)", padding: "22px 24px" }}>
              <p style={{ fontSize: "0.58rem", letterSpacing: "0.28em", textTransform: "uppercase", color: "var(--gold-dim, #8a7444)", marginBottom: 16 }}>
                Остання активність
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 0" }}>
                <div style={{
                  width: 32, height: 32, border: "1px solid rgba(201,169,110,0.15)",
                  display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                  color: "var(--gold-dim, #8a7444)", fontSize: "0.75rem",
                }}>✦</div>
                <p style={{ fontSize: "0.78rem", color: "var(--text-dim, #9a958d)", flex: 1 }}>Акаунт створено</p>
                <p style={{ fontSize: "0.65rem", color: "rgba(154,149,141,0.4)", whiteSpace: "nowrap" }}>щойно</p>
              </div>
            </div>

            {/* Коментар викладача */}
            <div style={{ border: "1px solid rgba(201,169,110,0.12)", background: "rgba(201,169,110,0.02)", padding: "22px 24px" }}>
              <p style={{ fontSize: "0.58rem", letterSpacing: "0.28em", textTransform: "uppercase", color: "var(--gold-dim, #8a7444)", marginBottom: 16 }}>
                Коментар викладача
              </p>
              <div style={{ borderLeft: "2px solid rgba(201,169,110,0.12)", paddingLeft: 14 }}>
                <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1rem", fontWeight: 300, fontStyle: "italic", color: "rgba(154,149,141,0.45)", lineHeight: 1.7 }}>
                  Коментарі з&apos;являться тут після перевірки перших робіт
                </p>
              </div>
            </div>

            {/* Слабкі теми */}
            <div style={{ border: "1px solid rgba(201,169,110,0.12)", background: "rgba(201,169,110,0.02)", padding: "22px 24px" }}>
              <p style={{ fontSize: "0.58rem", letterSpacing: "0.28em", textTransform: "uppercase", color: "var(--gold-dim, #8a7444)", marginBottom: 16 }}>
                Слабкі теми
              </p>
              <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "0.95rem", fontWeight: 300, fontStyle: "italic", color: "rgba(154,149,141,0.4)", lineHeight: 1.6 }}>
                Дані з&apos;являться після проходження тестів
              </p>
            </div>

            {/* Швидкі посилання */}
            <div style={{ border: "1px solid rgba(201,169,110,0.12)", background: "rgba(201,169,110,0.02)", padding: "18px 24px", display: "flex", gap: 20, flexWrap: "wrap" }}>
              {[
                { href: "/courses", label: "Каталог курсів" },
                { href: "/map", label: "Карта подій" },
                { href: "/contacts", label: "Підтримка" },
              ].map(link => (
                <Link key={link.href} href={link.href} style={{
                  fontSize: "0.62rem", letterSpacing: "0.2em", textTransform: "uppercase",
                  color: "var(--gold-dim, #8a7444)", textDecoration: "none",
                }}>
                  {link.label} →
                </Link>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}