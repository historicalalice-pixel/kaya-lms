"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Starfield, Input, Button } from "@/components/ui";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    try {
      setLoading(true);
      const supabase = createClient();
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      });

      if (error) {
        setErrorMessage(error.message);
        return;
      }

      setSuccessMessage("Лист для відновлення пароля надіслано. Перевірте пошту.");
      setEmail("");
    } catch (error) {
      console.error("FORGOT PASSWORD ERROR:", error);
      setErrorMessage("Сталася помилка. Спробуйте ще раз.");
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
        <div className="w-full max-w-[500px] md:translate-y-4">
          <div className="mb-8 text-center md:mb-10">
            <Link
              href="/login"
              className="mb-5 inline-flex items-center gap-2 font-sans text-[0.95rem] text-[rgba(245,239,230,0.62)] transition-colors duration-[var(--dur-popover)] ease-[var(--ease-out)] hover:text-[var(--gold-light)]"
            >
              <span aria-hidden="true">←</span>
              <span>Назад до входу</span>
            </Link>
            <h1 className="mb-3 font-serif text-[2.4rem] font-light leading-none text-[rgba(245,239,230,0.96)] md:text-[3.2rem]">
              Відновлення пароля
            </h1>
            <p className="font-sans text-[1rem] text-[rgba(245,239,230,0.72)] md:text-[1.08rem]">
              Введіть email, і ми надішлемо вам посилання для скидання пароля
            </p>
          </div>

          <div className="rounded-[20px] border border-[rgba(201,169,110,0.12)] bg-[rgba(10,10,14,0.3)] px-5 py-7 backdrop-blur-[6px] shadow-[0_0_0_1px_rgba(255,255,255,0.02),0_14px_40px_rgba(0,0,0,0.24)] md:px-7 md:py-9">
            <form onSubmit={handleSubmit} className="space-y-5" noValidate>
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
                {loading ? "Надсилання..." : "Надіслати посилання"}
              </Button>
            </form>

            <p className="mt-7 text-center font-sans text-[0.94rem] text-[rgba(245,239,230,0.64)]">
              Згадали пароль?{" "}
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
