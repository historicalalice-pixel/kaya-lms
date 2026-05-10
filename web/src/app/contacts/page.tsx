"use client";

import Link from "next/link";
import Header from "@/app/components/header";
import { Starfield } from "@/components/ui";

export default function ContactsPage() {
  return (
    <div className="min-h-screen flex flex-col overflow-hidden">
      <Starfield count={150} />
      <Header activePage="contacts" />
      <main className="relative z-10 flex-1 py-10 md:py-16 px-5 md:px-6">
        <div className="max-w-[800px] mx-auto">
          <div className="text-center mb-10 md:mb-16">
            <Link href="/home" className="inline-flex items-center gap-2 text-[var(--text-dim)] hover:text-[var(--gold-light)] transition-colors mb-5">
              <span>←</span>
              <span className="font-sans text-[0.8rem]">На головну</span>
            </Link>
            <p className="font-sans text-[0.75rem] tracking-[0.4em] uppercase text-[var(--gold-dim)] mb-3">Зв'язок</p>
            <h1 className="font-serif text-[clamp(1.8rem,4vw,3rem)] font-light text-[var(--text)] mb-5">Контакти</h1>
            <p className="font-sans text-[0.95rem] md:text-[1rem] font-light leading-[1.9] text-[var(--text-dim)] max-w-[500px] mx-auto">
              Маєте питання? Зв'яжіться з нами зручним способом
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-5 mb-10 md:mb-12">
            <a href="mailto:hello@kaya.education" className="kaya-card group p-6 md:p-7 text-center hover:border-[var(--gold-light)] transition-all">
              <div className="text-2xl mb-3 md:mb-4 opacity-60 group-hover:opacity-100 transition-opacity">✉</div>
              <h3 className="font-serif text-[1.1rem] text-[var(--gold-light)] mb-2">Email</h3>
              <p className="font-sans text-[0.85rem] md:text-[0.9rem] text-[var(--text-dim)]">hello@kaya.education</p>
            </a>
            <a href="https://t.me/kaya_support" target="_blank" rel="noopener noreferrer" className="kaya-card group p-6 md:p-7 text-center hover:border-[var(--gold-light)] transition-all">
              <div className="text-2xl mb-3 md:mb-4 opacity-60 group-hover:opacity-100 transition-opacity">💬</div>
              <h3 className="font-serif text-[1.1rem] text-[var(--gold-light)] mb-2">Telegram</h3>
              <p className="font-sans text-[0.85rem] md:text-[0.9rem] text-[var(--text-dim)]">@kaya_support</p>
            </a>
            <a href="https://instagram.com/kaya.education" target="_blank" rel="noopener noreferrer" className="kaya-card group p-6 md:p-7 text-center hover:border-[var(--gold-light)] transition-all">
              <div className="text-2xl mb-3 md:mb-4 opacity-60 group-hover:opacity-100 transition-opacity">📷</div>
              <h3 className="font-serif text-[1.1rem] text-[var(--gold-light)] mb-2">Instagram</h3>
              <p className="font-sans text-[0.85rem] md:text-[0.9rem] text-[var(--text-dim)]">@kaya.education</p>
            </a>
            <div className="kaya-card group p-6 md:p-7 text-center">
              <div className="text-2xl mb-3 md:mb-4 opacity-60">📍</div>
              <h3 className="font-serif text-[1.1rem] text-[var(--gold-light)] mb-2">Локація</h3>
              <p className="font-sans text-[0.85rem] md:text-[0.9rem] text-[var(--text-dim)]">Україна, онлайн</p>
            </div>
          </div>

          <div className="kaya-card p-6 md:p-8">
            <h2 className="font-serif text-[1.3rem] text-[var(--gold-light)] mb-5 md:mb-6 text-center">Написати нам</h2>
            <form className="space-y-4 md:space-y-5">
              <div>
                <label className="block font-sans text-[0.8rem] text-[var(--text-dim)] mb-2">Ваше ім'я</label>
                <input type="text" className="w-full bg-[rgba(201,169,110,0.05)] border border-[rgba(201,169,110,0.15)] rounded px-4 py-3 font-sans text-[0.9rem] text-[var(--text)] focus:border-[var(--gold-light)] focus:outline-none transition-colors" placeholder="Введіть ім'я" />
              </div>
              <div>
                <label className="block font-sans text-[0.8rem] text-[var(--text-dim)] mb-2">Email</label>
                <input type="email" className="w-full bg-[rgba(201,169,110,0.05)] border border-[rgba(201,169,110,0.15)] rounded px-4 py-3 font-sans text-[0.9rem] text-[var(--text)] focus:border-[var(--gold-light)] focus:outline-none transition-colors" placeholder="your@email.com" />
              </div>
              <div>
                <label className="block font-sans text-[0.8rem] text-[var(--text-dim)] mb-2">Повідомлення</label>
                <textarea rows={4} className="w-full bg-[rgba(201,169,110,0.05)] border border-[rgba(201,169,110,0.15)] rounded px-4 py-3 font-sans text-[0.9rem] text-[var(--text)] focus:border-[var(--gold-light)] focus:outline-none transition-colors resize-none" placeholder="Ваше питання або коментар..." />
              </div>
              <button type="submit" className="hero-cta w-full">Надіслати</button>
            </form>
          </div>
        </div>
      </main>
      <footer className="relative z-10 py-5 md:py-6 px-5 border-t border-[rgba(201,169,110,0.08)]">
        <div className="max-w-[1400px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <span className="font-serif text-lg tracking-[0.15em] text-[var(--text-dim)]">KAYA</span>
          <span className="font-sans text-[0.75rem] text-[var(--text-dim)]">© 2026 KAYA LMS</span>
        </div>
      </footer>
    </div>
  );
}