"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Starfield, Input, Button } from "@/components/ui";

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

    if (password.length < 6) {
      setErrorMessage("Пароль має містити щонайменше 6 символів.");
      return;
    }

    if (!agree) {
      setErrorMessage("Потрібно погодитися з умовами користування.");
      return;
    }

    try {
      setLoading(true);
      const supabase = createClient();
      const redirectBase = process.env.NEXT_PUBLIC_SITE_URL || window.location.origin;

      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${redirectBase}/auth/callback?next=/home`,
          data: { full_name: name },
        },
      });

      if (error) {
        setErrorMessage(error.message);
        return;
      }

      setSuccessMessage("Акаунт створено. Перевірте пошту, щоб підтвердити email.");
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
      const redirectBase = process.env.NEXT_PUBLIC_SITE_URL || window.location.origin;

      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: { redirectTo: `${redirectBase}/auth/callback?next=/home` },
      });

      if (error) setErrorMessage(error.message);
    } catch (error) {
      console.error("OAUTH REGISTER ERROR:", error);
      setErrorMessage("Не вдалося виконати реєстрацію через Google.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col overflow-hidden bg-[var(--bg)]">
      <Starfield count={150} />

      <header className="relative z-10 w-full">
        <div className="flex items-center justify-center px-6 pb-4 pt-6 md:px-10 md:pb-5 md:pt-8">
          <Link
            href="/home"
            className="press font-serif text-[2rem] tracking-[0.24em] text-[rgba(245,239,230,0.92)] transition-colors duration-[var(--dur-popover)] ease-[var(--ease-out)] hover:text-[var(--text)] md:text-[2.35rem]"
          >
            KAYA
          </Link>
        </div>
      </header>

      <main className="relative z-10 flex flex-1 items-center justify-center px-6 py-6 md:px-10 md:py-8">
        <div className="w-full max-w-[560px] md:translate-y-4">
          <div className="mb-8 text-center md:mb-10">
            <Link
              href="/home"
              className="mb-5 inline-flex items-center gap-2 font-sans text-[0.95rem] text-[rgba(245,239,230,0.62)] transition-colors duration-[var(--dur-popover)] ease-[var(--ease-out)] hover:text-[var(--gold-light)]"
            >
              <span aria-hidden="true">←</span>
              <span>На головну</span>
            </Link>
            <h1 className="mb-3 font-serif text-[2.65rem] font-light leading-none text-[rgba(245,239,230,0.96)] md:text-[3.8rem]">
              Реєстрація
            </h1>
            <p className="font-sans text-[1rem] text-[rgba(245,239,230,0.72)] md:text-[1.08rem]">
              Створіть акаунт і почніть свій шлях у KAYA
            </p>
          </div>

          <div className="rounded-[20px] border border-[rgba(201,169,110,0.12)] bg-[rgba(10,10,14,0.3)] px-5 py-7 backdrop-blur-[6px] shadow-[0_0_0_1px_rgba(255,255,255,0.02),0_14px_40px_rgba(0,0,0,0.24)] md:px-7 md:py-9">
            <form onSubmit={handleSubmit} className="space-y-5" noValidate>
              <Input
                label="Ім’я"
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ваше ім’я"
                autoComplete="name"
                required
              />

              <Input
                label="Email"
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                autoComplete="email"
                required
              />

              <Input
                label="Пароль"
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Створіть пароль"
                autoComplete="new-password"
                required
                hint="Мінімум 6 символів"
              />

              <Input
                label="Підтвердіть пароль"
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Повторіть пароль"
                autoComplete="new-password"
                required
              />

              <label className="group flex cursor-pointer select-none items-start gap-3 pt-1">
                <span className="relative mt-0.5 shrink-0">
                  <input
                    type="checkbox"
                    className="peer sr-only"
                    checked={agree}
                    onChange={(e) => setAgree(e.target.checked)}
                  />
                  <span className="block h-5 w-5 rounded-[6px] border border-[rgba(201,169,110,0.32)] bg-transparent transition-colors duration-[var(--dur-popover)] ease-[var(--ease-out)] peer-checked:border-[var(--gold)] peer-checked:bg-[var(--gold)] peer-focus-visible:shadow-[0_0_0_4px_rgba(201,169,110,0.08)]" />
                  <svg
                    className="absolute left-1 top-1 h-3 w-3 text-[var(--bg)] opacity-0 transition-opacity duration-[var(--dur-popover)] ease-[var(--ease-out)] peer-checked:opacity-100"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    aria-hidden="true"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </span>
                <span className="font-sans text-[0.92rem] leading-6 text-[rgba(245,239,230,0.72)] transition-colors duration-[var(--dur-popover)] ease-[var(--ease-out)] group-hover:text-[rgba(245,239,230,0.9)]">
                  Я погоджуюся з{" "}
                  <Link
                    href="/terms"
                    className="text-[rgba(227,196,136,0.96)] underline underline-offset-4 hover:text-[var(--gold-light)]"
                  >
                    умовами користування
                  </Link>{" "}
                  та{" "}
                  <Link
                    href="/privacy"
                    className="text-[rgba(227,196,136,0.96)] underline underline-offset-4 hover:text-[var(--gold-light)]"
                  >
                    політикою конфіденційності
                  </Link>
                </span>
              </label>

              {errorMessage ? (
                <p role="alert" className="font-sans text-[0.92rem] text-red-400">
                  {errorMessage}
                </p>
              ) : null}

              {successMessage ? (
                <p role="status" className="font-sans text-[0.92rem] text-emerald-400">
                  {successMessage}
                </p>
              ) : null}

              <Button
                type="submit"
                variant="primary"
                size="lg"
                fullWidth
                isLoading={loading}
                disabled={loading}
              >
                {loading ? "Створення..." : "Створити акаунт"}
              </Button>
            </form>

            <div className="my-7 flex items-center gap-4 md:my-8" aria-hidden="true">
              <div className="h-px flex-1 bg-[rgba(201,169,110,0.14)]" />
              <span className="font-sans text-[0.88rem] text-[rgba(245,239,230,0.48)]">або</span>
              <div className="h-px flex-1 bg-[rgba(201,169,110,0.14)]" />
            </div>

            <Button
              type="button"
              variant="secondary"
              size="lg"
              fullWidth
              onClick={() => handleOAuthRegister("google")}
              disabled={loading}
              leftIcon={
                <svg className="h-5 w-5" viewBox="0 0 24 24" aria-hidden="true">
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
              }
            >
              Продовжити з Google
            </Button>

            <p className="mt-7 text-center font-sans text-[0.94rem] text-[rgba(245,239,230,0.64)]">
              Уже маєте акаунт?{" "}
              <Link
                href="/login"
                className="text-[rgba(227,196,136,0.96)] transition-colors duration-[var(--dur-popover)] ease-[var(--ease-out)] hover:text-[var(--gold-light)]"
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
