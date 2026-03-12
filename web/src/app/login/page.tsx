"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const starfieldRef = useRef<HTMLDivElement>(null);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

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

    try {
      setLoading(true);

      const supabase = createClient();

      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setErrorMessage(error.message);
        return;
      }

      router.push("/dashboard");
      router.refresh();
    } catch (error) {
      console.error("LOGIN ERROR:", error);
      setErrorMessage("Сталася помилка під час входу. Спробуйте ще раз.");
    } finally {
      setLoading(false);
    }
  };

  const handleOAuthLogin = async (provider: "google") => {
    try {
      setLoading(true);
      setErrorMessage("");

      const supabase = createClient();

      const redirectBase =
        process.env.NEXT_PUBLIC_SITE_URL || window.location.origin;

      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${redirectBase}/auth/callback?next=/dashboard`,
        },
      });

      if (error) {
        setErrorMessage(error.message);
      }
    } catch (error) {
      console.error("OAUTH LOGIN ERROR:", error);
      setErrorMessage("Не вдалося виконати вхід через Google.");
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
              href="/home"
              className="inline-flex items-center gap-2 text-[0.95rem] text-[rgba(245,239,230,0.62)] hover:text-[var(--gold-light)] transition-colors duration-300 mb-5"
            >
              <span aria-hidden="true">←</span>
              <span className="font-sans">На головну</span>
            </Link>

            <h1 className="font-serif text-[2.9rem] leading-none md:text-[3.9rem] font-light text-[rgba(245,239,230,0.96)] mb-3">
              Вхід
            </h1>

            <p className="font-sans text-[1rem] md:text-[1.08rem] text-[rgba(245,239,230,0.72)]">
              Раді бачити вас знову
            </p>
          </div>

          <div className="rounded-[20px] border border-[rgba(201,169,110,0.12)] bg-[rgba(10,10,14,0.3)] backdrop-blur-[6px] px-5 py-7 md:px-7 md:py-9 shadow-[0_0_0_1px_rgba(255,255,255,0.02),0_14px_40px_rgba(0,0,0,0.24)]">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label
                  htmlFor="email"
                  className="block font-sans text-[0.94rem] text-[rgba(245,239,230,0.78)] mb-2"
                >
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  autoComplete="email"
                  required
                  className="w-full h-[54px] rounded-[12px] border border-[rgba(201,169,110,0.22)] bg-[rgba(201,169,110,0.045)] px-4 font-sans text-[1rem] text-[rgba(245,239,230,0.94)] placeholder:text-[rgba(245,239,230,0.34)] outline-none transition-all duration-300 focus:border-[rgba(227,196,136,0.88)] focus:bg-[rgba(201,169,110,0.075)] focus:shadow-[0_0_0_4px_rgba(201,169,110,0.08)]"
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block font-sans text-[0.94rem] text-[rgba(245,239,230,0.78)] mb-2"
                >
                  Пароль
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  required
                  className="w-full h-[54px] rounded-[12px] border border-[rgba(201,169,110,0.22)] bg-[rgba(201,169,110,0.045)] px-4 font-sans text-[1rem] text-[rgba(245,239,230,0.94)] placeholder:text-[rgba(245,239,230,0.34)] outline-none transition-all duration-300 focus:border-[rgba(227,196,136,0.88)] focus:bg-[rgba(201,169,110,0.075)] focus:shadow-[0_0_0_4px_rgba(201,169,110,0.08)]"
                />
              </div>

              <div className="flex items-center justify-between gap-4 pt-1 text-[0.9rem]">
                <label className="flex items-center gap-3 cursor-pointer group select-none">
                  <div className="relative shrink-0">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                    />
                    <div className="w-5 h-5 rounded-[6px] border border-[rgba(201,169,110,0.32)] bg-transparent transition-all duration-300 peer-checked:border-[var(--gold)] peer-checked:bg-[var(--gold)] peer-focus-visible:shadow-[0_0_0_4px_rgba(201,169,110,0.08)]" />
                    <svg
                      className="absolute left-1 top-1 w-3 h-3 text-[var(--bg)] opacity-0 transition-opacity duration-300 peer-checked:opacity-100"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                      aria-hidden="true"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>

                  <span className="font-sans text-[0.92rem] text-[rgba(245,239,230,0.72)] transition-colors duration-300 group-hover:text-[rgba(245,239,230,0.9)]">
                    Запам'ятати
                  </span>
                </label>

                <Link
                  href="/forgot-password"
                  className="font-sans text-[0.92rem] text-[rgba(201,169,110,0.86)] hover:text-[var(--gold-light)] transition-colors duration-300 whitespace-nowrap"
                >
                  Забули пароль?
                </Link>
              </div>

              {errorMessage && (
                <p className="font-sans text-[0.92rem] text-red-400">
                  {errorMessage}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full h-[56px] rounded-[14px] border border-[rgba(201,169,110,0.5)] bg-[rgba(201,169,110,0.05)] font-sans text-[0.97rem] font-medium uppercase tracking-[0.34em] text-[rgba(245,239,230,0.96)] transition-all duration-300 hover:border-[rgba(227,196,136,0.92)] hover:bg-[rgba(201,169,110,0.09)] hover:shadow-[0_10px_26px_rgba(201,169,110,0.08),inset_0_0_0_1px_rgba(255,255,255,0.03)] active:scale-[0.995] disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? "Вхід..." : "Увійти"}
              </button>
            </form>

            <div className="flex items-center gap-4 my-7 md:my-8">
              <div className="flex-1 h-px bg-[rgba(201,169,110,0.14)]" />
              <span className="font-sans text-[0.88rem] text-[rgba(245,239,230,0.48)]">
                або
              </span>
              <div className="flex-1 h-px bg-[rgba(201,169,110,0.14)]" />
            </div>

            <div className="flex flex-col gap-3.5">
              <button
                type="button"
                onClick={() => handleOAuthLogin("google")}
                disabled={loading}
                className="w-full h-[54px] rounded-[12px] border border-[rgba(201,169,110,0.22)] bg-[rgba(255,255,255,0.01)] px-5 font-sans text-[0.98rem] text-[rgba(245,239,230,0.9)] transition-all duration-300 hover:border-[rgba(227,196,136,0.74)] hover:bg-[rgba(201,169,110,0.045)] disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <span className="flex items-center justify-center gap-3.5">
                  <svg
                    className="w-5 h-5 shrink-0"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      fill="currentColor"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="currentColor"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 5.38c1.61 0 3.06.55 4.2 1.63l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  <span>Увійти через Google</span>
                </span>
              </button>
            </div>

            <p className="mt-7 text-center font-sans text-[0.94rem] text-[rgba(245,239,230,0.64)]">
              Ще не маєте акаунта?{" "}
              <Link
                href="/register"
                className="text-[rgba(227,196,136,0.96)] hover:text-[var(--gold-light)] transition-colors duration-300"
              >
                Зареєструватися
              </Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}