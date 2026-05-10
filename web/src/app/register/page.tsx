"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Starfield } from "@/components/ui";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agree, setAgree] = useState(false);

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (password !== confirmPassword) {
      setErrorMessage("Паролі не збігаються.");
      return;
    }

    if (!agree) {
      setErrorMessage("Потрібно погодитися з умовами користування.");
      return;
    }

    try {
      setLoading(true);

      const supabase = createClient();

      const redirectBase =
        process.env.NEXT_PUBLIC_SITE_URL || window.location.origin;

      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${redirectBase}/auth/callback?next=/home`,
          data: {
            full_name: name,
          },
        },
      });

      if (error) {
        setErrorMessage(error.message);
        return;
      }

      setSuccessMessage(
        "Акаунт створено. Перевірте пошту, щоб підтвердити email."
      );

      setName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      setAgree(false);
    } catch (error) {
      console.error("REGISTER ERROR:", error);
      setErrorMessage("Сталася помилка під час реєстрації. Спробуйте ще раз.");
    } finally {
      setLoading(false);
    }
  };

  const handleOAuthRegister = async (provider: "google") => {
    try {
      setLoading(true);
      setErrorMessage("");
      setSuccessMessage("");

      const supabase = createClient();

      const redirectBase =
        process.env.NEXT_PUBLIC_SITE_URL || window.location.origin;

      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${redirectBase}/auth/callback?next=/home`,
        },
      });

      if (error) {
        setErrorMessage(error.message);
      }
    } catch (error) {
      console.error("OAUTH REGISTER ERROR:", error);
      setErrorMessage("Не вдалося виконати реєстрацію через Google.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col overflow-hidden bg-[var(--bg)]">
      <Starfield count={150} />

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
        <div className="w-full max-w-[560px] md:translate-y-4">
          <div className="text-center mb-8 md:mb-10">
            <Link
              href="/home"
              className="inline-flex items-center gap-2 text-[0.95rem] text-[rgba(245,239,230,0.62)] hover:text-[var(--gold-light)] transition-colors duration-300 mb-5"
            >
              <span aria-hidden="true">←</span>
              <span className="font-sans">На головну</span>
            </Link>

            <h1 className="font-serif text-[2.65rem] leading-none md:text-[3.8rem] font-light text-[rgba(245,239,230,0.96)] mb-3">
              Реєстрація
            </h1>

            <p className="font-sans text-[1rem] md:text-[1.08rem] text-[rgba(245,239,230,0.72)]">
              Створіть акаунт і почніть свій шлях у KAYA
            </p>
          </div>

          <div className="rounded-[20px] border border-[rgba(201,169,110,0.12)] bg-[rgba(10,10,14,0.3)] backdrop-blur-[6px] px-5 py-7 md:px-7 md:py-9 shadow-[0_0_0_1px_rgba(255,255,255,0.02),0_14px_40px_rgba(0,0,0,0.24)]">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label
                  htmlFor="name"
                  className="block font-sans text-[0.94rem] text-[rgba(245,239,230,0.78)] mb-2"
                >
                  Ім’я
                </label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ваше ім’я"
                  autoComplete="name"
                  required
                  className="w-full h-[54px] rounded-[12px] border border-[rgba(201,169,110,0.22)] bg-[rgba(201,169,110,0.045)] px-4 font-sans text-[1rem] text-[rgba(245,239,230,0.94)] placeholder:text-[rgba(245,239,230,0.34)] outline-none transition-all duration-300 focus:border-[rgba(227,196,136,0.88)] focus:bg-[rgba(201,169,110,0.075)] focus:shadow-[0_0_0_4px_rgba(201,169,110,0.08)]"
                />
              </div>

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
                  placeholder="Створіть пароль"
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
                  placeholder="Повторіть пароль"
                  autoComplete="new-password"
                  required
                  className="w-full h-[54px] rounded-[12px] border border-[rgba(201,169,110,0.22)] bg-[rgba(201,169,110,0.045)] px-4 font-sans text-[1rem] text-[rgba(245,239,230,0.94)] placeholder:text-[rgba(245,239,230,0.34)] outline-none transition-all duration-300 focus:border-[rgba(227,196,136,0.88)] focus:bg-[rgba(201,169,110,0.075)] focus:shadow-[0_0_0_4px_rgba(201,169,110,0.08)]"
                />
              </div>

              <label className="flex items-start gap-3 pt-1 cursor-pointer group select-none">
                <div className="relative shrink-0 mt-0.5">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={agree}
                    onChange={(e) => setAgree(e.target.checked)}
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

                <span className="font-sans text-[0.92rem] leading-6 text-[rgba(245,239,230,0.72)] transition-colors duration-300 group-hover:text-[rgba(245,239,230,0.9)]">
                  Я погоджуюся з{" "}
                  <Link
                    href="/terms"
                    className="text-[rgba(227,196,136,0.96)] hover:text-[var(--gold-light)] underline underline-offset-4"
                  >
                    умовами користування
                  </Link>{" "}
                  та{" "}
                  <Link
                    href="/privacy"
                    className="text-[rgba(227,196,136,0.96)] hover:text-[var(--gold-light)] underline underline-offset-4"
                  >
                    політикою конфіденційності
                  </Link>
                </span>
              </label>

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
                className="w-full h-[56px] rounded-[14px] border border-[rgba(201,169,110,0.5)] bg-[rgba(201,169,110,0.05)] font-sans text-[0.97rem] font-medium uppercase tracking-[0.28em] text-[rgba(245,239,230,0.96)] transition-all duration-300 hover:border-[rgba(227,196,136,0.92)] hover:bg-[rgba(201,169,110,0.09)] hover:shadow-[0_10px_26px_rgba(201,169,110,0.08),inset_0_0_0_1px_rgba(255,255,255,0.03)] active:scale-[0.995] disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? "Створення..." : "Створити акаунт"}
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
                onClick={() => handleOAuthRegister("google")}
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
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  <span>Продовжити з Google</span>
                </span>
              </button>
            </div>

            <p className="mt-7 text-center font-sans text-[0.94rem] text-[rgba(245,239,230,0.64)]">
              Уже маєте акаунт?{" "}
              <Link
                href="/login"
                className="text-[rgba(227,196,136,0.96)] hover:text-[var(--gold-light)] transition-colors duration-300"
              >
                Увійти
              </Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}