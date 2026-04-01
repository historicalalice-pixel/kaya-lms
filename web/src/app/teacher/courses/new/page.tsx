import Link from "next/link";

export default function TeacherCreateCoursePage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-12 text-[var(--text-light,#f5efe6)]">
      <p className="text-xs uppercase tracking-[0.24em] text-[rgba(138,116,68,0.8)]">Кабінет вчителя</p>
      <h1 className="mt-3 font-serif text-4xl">Створення курсу</h1>
      <p className="mt-4 text-sm text-[rgba(232,228,221,0.7)]">
        Форма створення курсу ще не реалізована. Розділ підготовлено як тимчасову заглушку, щоб навігація не вела на 404.
      </p>
      <Link href="/teacher" className="mt-8 inline-flex rounded-xl border border-[rgba(201,169,110,0.35)] px-4 py-2 text-xs uppercase tracking-[0.18em]">
        ← Назад до дашборду
      </Link>
    </main>
  );
}
