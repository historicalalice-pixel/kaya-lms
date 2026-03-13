"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function OnboardingForm({ userId }: { userId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    full_name: "",
    phone: "",
    grade: "",
    telegram: "",
  });

  const handleSubmit = async () => {
    if (!form.full_name.trim()) return;
    setLoading(true);
    const supabase = createClient();
    await supabase
      .from("profiles")
      .update({
        full_name: form.full_name.trim(),
        phone: form.phone.trim(),
        grade: form.grade.trim(),
        telegram: form.telegram.trim(),
        onboarding_completed: true,
      })
      .eq("id", userId);
    setLoading(false);
    router.refresh();
  };

  const inputStyle = {
    width: "100%",
    background: "rgba(201,169,110,0.03)",
    border: "1px solid rgba(201,169,110,0.2)",
    padding: "12px 16px",
    color: "var(--text, #e8e4dd)",
    fontFamily: "var(--font-sans, 'Manrope', sans-serif)",
    fontSize: "0.9rem",
    outline: "none",
    boxSizing: "border-box" as const,
  };

  const labelStyle = {
    display: "block",
    fontFamily: "var(--font-sans, 'Manrope', sans-serif)",
    fontSize: "0.62rem",
    letterSpacing: "0.2em",
    textTransform: "uppercase" as const,
    color: "var(--gold-dim, #8a7444)",
    marginBottom: 8,
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.88)",
        zIndex: 100,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
        backdropFilter: "blur(4px)",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 480,
          background: "#0d0b08",
          border: "1px solid rgba(201,169,110,0.25)",
          padding: "44px 40px",
        }}
      >
        <p
          style={{
            fontFamily: "var(--font-sans, 'Manrope', sans-serif)",
            fontSize: "0.65rem",
            letterSpacing: "0.35em",
            textTransform: "uppercase",
            color: "var(--gold-dim, #8a7444)",
            marginBottom: 16,
          }}
        >
          Ласкаво просимо до KAYA
        </p>
        <h2
          style={{
            fontFamily: "var(--font-serif, 'Cormorant Garamond', serif)",
            fontSize: "1.9rem",
            fontWeight: 300,
            color: "var(--text, #e8e4dd)",
            marginBottom: 8,
            lineHeight: 1.2,
          }}
        >
          Розкажи нам про себе
        </h2>
        <p
          style={{
            fontFamily: "var(--font-sans, 'Manrope', sans-serif)",
            fontSize: "0.78rem",
            color: "var(--text-dim, #9a958d)",
            marginBottom: 36,
            lineHeight: 1.6,
          }}
        >
          Заповни профіль один раз — і твоє ім&apos;я відображатиметься скрізь на платформі
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div>
            <label style={labelStyle}>Повне ім&apos;я *</label>
            <input
              type="text"
              placeholder="Іван Франко"
              value={form.full_name}
              onChange={(e) => setForm({ ...form, full_name: e.target.value })}
              style={inputStyle}
            />
          </div>
          <div>
            <label style={labelStyle}>Телефон</label>
            <input
              type="tel"
              placeholder="+380 XX XXX XX XX"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              style={inputStyle}
            />
          </div>
          <div>
            <label style={labelStyle}>Клас</label>
            <input
              type="text"
              placeholder="11"
              value={form.grade}
              onChange={(e) => setForm({ ...form, grade: e.target.value })}
              style={inputStyle}
            />
          </div>
          <div>
            <label style={labelStyle}>Нік у Telegram</label>
            <input
              type="text"
              placeholder="@username"
              value={form.telegram}
              onChange={(e) => setForm({ ...form, telegram: e.target.value })}
              style={inputStyle}
            />
          </div>
        </div>

        <button
          onClick={handleSubmit}
          disabled={loading || !form.full_name.trim()}
          style={{
            marginTop: 32,
            width: "100%",
            padding: "16px",
            border: "1px solid rgba(201,169,110,0.5)",
            background: "transparent",
            color: "var(--gold-light, #e2c992)",
            fontFamily: "var(--font-sans, 'Manrope', sans-serif)",
            fontSize: "0.7rem",
            letterSpacing: "0.3em",
            textTransform: "uppercase",
            cursor: loading || !form.full_name.trim() ? "not-allowed" : "pointer",
            opacity: loading || !form.full_name.trim() ? 0.5 : 1,
            transition: "all 0.3s",
          }}
        >
          {loading ? "Зберігаємо..." : "Зберегти та продовжити"}
        </button>
      </div>
    </div>
  );
}