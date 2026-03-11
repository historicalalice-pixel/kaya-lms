"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function ResetPasswordPage() {
  const router = useRouter();
  const starfieldRef = useRef<HTMLDivElement>(null);

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    const field = starfieldRef.current;
    if (!field) return;

    field.innerHTML = "";

    const stars: HTMLDivElement[] = [];

    for (let i = 0; i < 150; i++) {
      const star = document.createElement("div");
      star.classList.add("star");

      const rand = Math.random();
      if (rand < 0.55) star.classList.add("star--small");
      else if (rand < 0.85) star.classList.add("star--medium");
      else star.classList.add("star--large");

      star.style.setProperty("--dur", `${2 + Math.random() * 5}s`);
      star.style.setProperty("--delay", `${Math.random() * 6}s`);
      star.style.left = `${Math.random() * 100}%`;
      star.style.top = `${Math.random() * 100}%`;

      field.appendChild(star);
      stars.push(star);
    }

    return () => {
      stars.forEach((star) => star.remove());
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setErrorMessage("");
    setSuccessMessage("");

    if (password !== confirmPassword) {
      setErrorMessage("Паролі не збігаються");
      return;
    }

    if (password.length < 6) {
      setErrorMessage("Пароль має містити щонайменше 6 символів");
      return;
    }

    try {
      setLoading(true);

      const supabase = createClient();

      const { error } = await supabase.auth.updateUser({
        password,
      });

      if (error) {
        setErrorMessage(error.message);
        return;
      }

      setSuccessMessage("Пароль успішно оновлено. Зараз ви перейдете на сторінку входу.");
      setPassword("");
      setConfirmPassword("");

      setTimeout(() => {
        router.push("/login");
      }, 1800);
    } catch (error) {
      console.error("RESET PASSWORD ERROR:", error);
      setErrorMessage("Сталася помилка. Спробуйте ще раз.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col overflow-hidden bg-[var(--bg)]">
      <div ref={starfieldRef} className="starfield" aria-hidden="true" />

      <header className="relative z-10 w-full">
        <div className="flex items-center justify-center px-6 pt-6 pb-4 md:px-10 md:pt-8 md:pb-5">
          <Link
            href="/home"
            className="font-serif text-[2rem] md:text-[2.35rem] tracking-[0.24em] text-[rgba(245,239,230,0.92)] hover:text-[var(--text)] transition-colors duration-300"
          >
            KAYA
          </Link>
        </div>
      </header>

      <main className="relative z-10 flex-1 flex items-center justify-center px-6 py-6 md:px-10 md:py-8">
        <div className="w-full max-w-[500px] md:translate-y-4">
          <div className="text-center mb-8 md:mb-10">
            <Link
              href="/login"
              className="inline-flex items-center gap-2 text-[0.95rem] text-[rgba(245,239,230,0.62)] hover:text-[var(--gold-light)] transition-colors duration-300 mb-5"
            >
              <span aria-hidden="true">←</span>
              <span className="font-sans">Назад до входу</span>
            </Link>

            <h1 className="font-serif text-[2.4rem] leading-none md:text-[3.2rem] font-light text-[rgba(245,239,230,0.96)] mb-3">
              Новий пароль
            </h1>

            <p className="font-sans text-[1rem] md:text-[1.08rem] text-[rgba(245,239,230,0.72)]">
              Введіть новий пароль для свого акаунта
            </p>
          </div>

          <div className="rounded-[20px] border border-[rgba(201,169,110,0.12)] bg-[rgba(10,10,14,0.3)] backdrop-blur-[6px] px-5 py-7 md:px-7 md:py-9 shadow-[0_0_0_1px_rgba(255,255,255,0.02),0_14px_40px_rgba(0,0,0,0.24)]">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label
                  htmlFor="password"
                  className="block font-sans text-[0.94rem] text-[rgba(245,239,230,0.78)] mb-2"
                >
                  Новий пароль
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Введіть новий пароль"
                  autoComplete="new-password"
                  required
                  className="w-full h-[54px] rounded-[12px] border border-[rgba(201,169,110,0.22)] bg-[rgba(201,169,110,0.045)] px-4 font-sans text-[1rem] text-[rgba(245,239,230,0.94)] placeholder:text-[rgba(245,239,230,0.34)] outline-none transition-all duration-300 focus:border-[rgba(227,196,136,0.88)] focus:bg-[rgba(201,169,110,0.075)] focus:shadow-[0_0_0_4px_rgba(201,169,110,0.08)]"
                />
              </div>

              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block font-sans text-[0.94rem] text-[rgba(245,239,230,0.78)] mb-2"
                >
                  Підтвердіть пароль
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Повторіть новий пароль"
                  autoComplete="new-password"
                  required
                  className="w-full h-[54px] rounded-[12px] border border-[rgba(201,169,110,0.22)] bg-[rgba(201,169,110,0.045)] px-4 font-sans text-[1rem] text-[rgba(245,239,230,0.94)] placeholder:text-[rgba(245,239,230,0.34)] outline-none transition-all duration-300 focus:border-[rgba(227,196,136,0.88)] focus:bg-[rgba(201,169,110,0.075)] focus:shadow-[0_0_0_4px_rgba(201,169,110,0.08)]"
                />
              </div>

              {errorMessage && (
                <p className="font-sans text-[0.92rem] text-red-400">
                  {errorMessage}
                </p>
              )}

              {successMessage && (
                <p className="font-sans text-[0.92rem] text-emerald-400">
                  {successMessage}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full h-[56px] rounded-[14px] border border-[rgba(201,169,110,0.5)] bg-[rgba(201,169,110,0.05)] font-sans text-[0.97rem] font-medium uppercase tracking-[0.22em] text-[rgba(245,239,230,0.96)] transition-all duration-300 hover:border-[rgba(227,196,136,0.92)] hover:bg-[rgba(201,169,110,0.09)] hover:shadow-[0_10px_26px_rgba(201,169,110,0.08),inset_0_0_0_1px_rgba(255,255,255,0.03)] active:scale-[0.995] disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? "Оновлення..." : "Оновити пароль"}
              </button>
            </form>

            <p className="text-center mt-8 md:mt-9 font-sans text-[0.98rem] text-[rgba(245,239,230,0.62)]">
              Повернутися до{" "}
              <Link
                href="/login"
                className="text-[rgba(227,196,136,0.96)] hover:text-[var(--gold-light)] hover:underline underline-offset-4 transition-colors duration-300"
              >
                входу
              </Link>
            </p>
          </div>
        </div>
      </main>

      <footer className="relative z-10 px-6 pb-5 pt-1 md:px-10 md:pb-6">
        <div className="mx-auto flex max-w-[1400px] items-center justify-center">
          <span className="font-sans text-[0.8rem] tracking-[0.02em] text-[rgba(245,239,230,0.36)]">
            © 2026 KAYA LMS
          </span>
        </div>
      </footer>
    </div>
  );
}