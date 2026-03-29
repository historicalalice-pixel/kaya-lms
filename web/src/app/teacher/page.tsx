
"use client";

import { useEffect, useMemo, useState, type CSSProperties } from "react";

type SectionKey =
  | "dashboard"
  | "courses"
  | "lessons"
  | "groups"
  | "students"
  | "assignments"
  | "tests"
  | "gradebook"
  | "attendance"
  | "analytics"
  | "messages"
  | "files"
  | "calendar"
  | "drafts"
  | "archive"
  | "settings";

type Tone = "gold" | "green" | "blue" | "red" | "gray";

type CourseStatus = "draft" | "scheduled" | "published" | "hidden" | "archived";
type StudentStatus = "active" | "inactive" | "blocked";
type AssignmentStatus = "missing" | "submitted" | "checked";
type DashboardBlockId = "today" | "review" | "actions" | "deadlines" | "hours" | "alerts";
type FileType = "pdf" | "presentation" | "doc" | "video" | "other";
type MessageChannel = "lms" | "telegram";

type DashboardBlock = { id: DashboardBlockId; label: string; visible: boolean };

type Student = {
  id: string;
  name: string;
  group: string;
  email: string;
  phone: string;
  telegram: string;
  note: string;
  status: StudentStatus;
  lastLogin: string;
  progress: number;
};

type Course = {
  id: string;
  title: string;
  topic: string;
  lessons: number;
  status: CourseStatus;
  publishAt: string;
};

type Assignment = {
  id: string;
  title: string;
  target: string;
  deadline: string;
  status: AssignmentStatus;
  comment: string;
};

type SearchResult = {
  id: string;
  kind: string;
  title: string;
  subtitle: string;
  section: SectionKey;
};

const sections: Array<{ key: SectionKey; label: string; note: string }> = [
  { key: "dashboard", label: "Дашборд", note: "Ключові події та навантаження" },
  { key: "courses", label: "Курси", note: "Створення, публікація, архів" },
  { key: "lessons", label: "Уроки", note: "Контент, Zoom, графік" },
  { key: "groups", label: "Групи", note: "Запрошення, призначення" },
  { key: "students", label: "Учні", note: "Картки, статуси, доступ" },
  { key: "assignments", label: "Завдання", note: "Призначення та перевірка" },
  { key: "tests", label: "Тести", note: "Імпорт із zno.osvita.ua" },
  { key: "gradebook", label: "Журнал оцінок", note: "Оцінки та експорт" },
  { key: "attendance", label: "Відвідуваність", note: "Присутність і причини" },
  { key: "analytics", label: "Аналітика", note: "Прогрес і динаміка" },
  { key: "messages", label: "Повідомлення", note: "LMS + Telegram" },
  { key: "files", label: "Файли", note: "Матеріали та фільтри" },
  { key: "calendar", label: "Календар", note: "Уроки й дедлайни" },
  { key: "drafts", label: "Чернетки", note: "Повернення до редагування" },
  { key: "archive", label: "Архів", note: "Відновлення і видалення" },
  { key: "settings", label: "Налаштування", note: "Профіль та інтеграції" },
];

const defaultBlocks: DashboardBlock[] = [
  { id: "today", label: "Уроки сьогодні", visible: true },
  { id: "review", label: "Перевірка ДЗ", visible: true },
  { id: "actions", label: "Останні дії учнів", visible: true },
  { id: "deadlines", label: "Дедлайни й нагадування", visible: true },
  { id: "hours", label: "Навантаження по годинах", visible: true },
  { id: "alerts", label: "Критичні сигнали", visible: true },
];

const tones: Record<Tone, { bg: string; border: string; color: string }> = {
  gold: { bg: "rgba(201,169,110,0.10)", border: "1px solid rgba(201,169,110,0.22)", color: "rgba(230,202,148,0.95)" },
  green: { bg: "rgba(52,168,83,0.12)", border: "1px solid rgba(52,168,83,0.24)", color: "rgba(129,221,155,0.95)" },
  blue: { bg: "rgba(52,130,200,0.12)", border: "1px solid rgba(52,130,200,0.24)", color: "rgba(144,200,255,0.95)" },
  red: { bg: "rgba(220,80,60,0.12)", border: "1px solid rgba(220,80,60,0.24)", color: "rgba(244,150,138,0.96)" },
  gray: { bg: "rgba(150,145,136,0.12)", border: "1px solid rgba(150,145,136,0.22)", color: "rgba(206,202,195,0.90)" },
};

const statusTone: Record<CourseStatus | StudentStatus | AssignmentStatus, Tone> = {
  draft: "gray",
  scheduled: "blue",
  published: "green",
  hidden: "gold",
  archived: "red",
  active: "green",
  inactive: "gray",
  blocked: "red",
  missing: "red",
  submitted: "blue",
  checked: "green",
};

const PAGE_MAX_WIDTH = 1680;

const panel: CSSProperties = {
  borderRadius: 26,
  border: "1px solid rgba(201,169,110,0.20)",
  background: "linear-gradient(180deg, rgba(22,18,16,0.98) 0%, rgba(13,11,12,0.97) 100%)",
  boxShadow: "0 18px 40px rgba(0,0,0,0.34), inset 0 1px 0 rgba(255,255,255,0.04)",
};

const inset: CSSProperties = {
  borderRadius: 18,
  border: "1px solid rgba(201,169,110,0.16)",
  background: "rgba(23,19,17,0.72)",
};

const sectionTitle: CSSProperties = {
  fontSize: "0.66rem",
  textTransform: "uppercase",
  letterSpacing: "0.22em",
  color: "rgba(162,141,96,0.78)",
};

const button: CSSProperties = {
  minHeight: 36,
  borderRadius: 12,
  border: "1px solid rgba(201,169,110,0.18)",
  background: "rgba(255,255,255,0.02)",
  color: "rgba(223,217,207,0.82)",
  padding: "0 12px",
  fontSize: "0.70rem",
  letterSpacing: "0.10em",
  textTransform: "uppercase",
};

const chipBase: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  borderRadius: 999,
  padding: "4px 10px",
  fontSize: "0.62rem",
  letterSpacing: "0.10em",
  textTransform: "uppercase",
};

function chip(tone: Tone): CSSProperties {
  return { ...chipBase, background: tones[tone].bg, border: tones[tone].border, color: tones[tone].color };
}
const courses: Course[] = [
  { id: "c1", title: "Історія України: Київська Русь", topic: "Середньовіччя", lessons: 12, status: "published", publishAt: "20.03.2026, 09:00" },
  { id: "c2", title: "Козацька держава", topic: "Ранньомодерний період", lessons: 9, status: "scheduled", publishAt: "02.04.2026, 18:00" },
  { id: "c3", title: "Україна у XX столітті", topic: "Новітня історія", lessons: 16, status: "draft", publishAt: "Чернетка" },
  { id: "c4", title: "НМТ інтенсив", topic: "Підготовка", lessons: 20, status: "hidden", publishAt: "Приховано" },
];

const studentsSeed: Student[] = [
  {
    id: "s1",
    name: "Дмитро Коваль",
    group: "Група А",
    email: "d.koval@example.com",
    phone: "+380671112233",
    telegram: "@dmytro_k",
    note: "Потрібно більше практики НМТ (внутрішня нотатка).",
    status: "active",
    lastLogin: "29.03.2026, 17:42",
    progress: 78,
  },
  {
    id: "s2",
    name: "Аліна Савченко",
    group: "Група А",
    email: "a.savchenko@example.com",
    phone: "+380501234567",
    telegram: "@alina_s",
    note: "Нагадування про дедлайн за 24 години.",
    status: "active",
    lastLogin: "29.03.2026, 21:03",
    progress: 64,
  },
  {
    id: "s3",
    name: "Максим Петренко",
    group: "Група Б",
    email: "m.petrenko@example.com",
    phone: "+380631234567",
    telegram: "@maksym_p",
    note: "Часто здає ДЗ із запізненням.",
    status: "inactive",
    lastLogin: "25.03.2026, 19:20",
    progress: 46,
  },
  {
    id: "s4",
    name: "Ірина Бондар",
    group: "Група Б",
    email: "i.bondar@example.com",
    phone: "+380931234567",
    telegram: "@iryna_b",
    note: "Акаунт заблоковано до уточнення даних.",
    status: "blocked",
    lastLogin: "20.03.2026, 14:10",
    progress: 34,
  },
];

const assignments: Assignment[] = [
  { id: "a1", title: "Есе: Причини занепаду Київської Русі", target: "Група А", deadline: "Сьогодні, 23:59", status: "submitted", comment: "Чекає перевірки" },
  { id: "a2", title: "Таблиця: доба козаччини", target: "Група Б", deadline: "30.03.2026, 20:00", status: "missing", comment: "Нагадування відправлено в LMS і Telegram" },
  { id: "a3", title: "Джерельний аналіз УЦР", target: "Дмитро Коваль", deadline: "28.03.2026, 18:00", status: "checked", comment: "Оцінка виставлена" },
];

const todayLessons = [
  { id: "t1", title: "Група А - Походження Русі", time: "18:00", details: "Zoom, 14 учнів" },
  { id: "t2", title: "Індивідуально - НМТ симуляція", time: "20:00", details: "LMS + Zoom" },
];

const deadlines = [
  { id: "d1", label: "ДЗ: Есе по Русі", date: "Сьогодні, 23:59", type: "assignment" },
  { id: "d2", label: "Тест: Козаччина", date: "03.04, 18:30", type: "test" },
  { id: "d3", label: "Zoom-урок: Гетьманщина", date: "31.03, 16:00", type: "lesson" },
  { id: "d4", label: "Підтвердити оцінки тестів", date: "Завтра, 10:00", type: "reminder" },
];

const feed = [
  { id: "f1", who: "Дмитро К.", action: "здав ДЗ", when: "2 год тому" },
  { id: "f2", who: "Група Б", action: "відкрила Zoom-посилання", when: "5 год тому" },
  { id: "f3", who: "Аліна С.", action: "пройшла тест на 82%", when: "вчора" },
];

const fileLibrary: Array<{ id: string; name: string; type: FileType; target: string; updated: string }> = [
  { id: "f1", name: "Презентація: Київська Русь", type: "presentation", target: "Група А", updated: "29.03.2026" },
  { id: "f2", name: "PDF: Джерела козаччини", type: "pdf", target: "Група Б", updated: "28.03.2026" },
  { id: "f3", name: "Методичка НМТ", type: "doc", target: "Усі", updated: "27.03.2026" },
  { id: "f4", name: "Відео: Розбір тесту", type: "video", target: "Індивідуально", updated: "27.03.2026" },
];

const messageThreads: Array<{ id: string; target: string; channel: MessageChannel; text: string; status: "отримано" | "відкрито" | "Zoom"; time: string }> = [
  { id: "m1", target: "Група А", channel: "lms", text: "Нагадування про дедлайн", status: "відкрито", time: "18:40" },
  { id: "m2", target: "Дмитро К.", channel: "telegram", text: "Надішліть фінальну версію есе", status: "отримано", time: "17:14" },
  { id: "m3", target: "Група Б", channel: "telegram", text: "Zoom-посилання на урок", status: "Zoom", time: "21:12" },
];

const quickReadiness = [
  "Створення курсу і уроку",
  "Додавання PDF, презентації, YouTube, Zoom",
  "Групи, учні, ручне створення",
  "Призначення завдань і тестів",
  "Журнал оцінок і відвідуваність",
  "Календар, чернетки, архів, автозбереження",
];

function SectionHead({ title, text }: { title: string; text: string }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <p style={sectionTitle}>{title}</p>
      <p style={{ fontSize: "0.84rem", color: "rgba(231,226,216,0.70)" }}>{text}</p>
    </div>
  );
}

function Kpi({ label, value, note, tone }: { label: string; value: string; note: string; tone: Tone }) {
  return (
    <article className="p-4" style={inset}>
      <p style={sectionTitle}>{label}</p>
      <p className="font-serif" style={{ marginTop: 12, fontSize: "2rem", lineHeight: 1, color: tones[tone].color }}>{value}</p>
      <p style={{ marginTop: 8, fontSize: "0.78rem", color: "rgba(211,205,194,0.66)" }}>{note}</p>
    </article>
  );
}
export default function TeacherCabinetPage() {
  const [activeSection, setActiveSection] = useState<SectionKey>("dashboard");
  const [query, setQuery] = useState("");
  const [blocks, setBlocks] = useState<DashboardBlock[]>(defaultBlocks);
  const [showBlockSettings, setShowBlockSettings] = useState(false);
  const [students, setStudents] = useState<Student[]>(studentsSeed);
  const [fileFilter, setFileFilter] = useState<"all" | FileType>("all");
  const [channelFilter, setChannelFilter] = useState<"all" | MessageChannel>("all");
  const [isDesktop, setIsDesktop] = useState(() => {
    if (typeof window === "undefined") return true;
    return window.matchMedia("(min-width: 1280px)").matches;
  });

  useEffect(() => {
    const media = window.matchMedia("(min-width: 1280px)");
    const onChange = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);

  const queryNorm = query.trim().toLocaleLowerCase("uk-UA");

  const searchResults = useMemo(() => {
    if (!queryNorm) return [] as SearchResult[];

    const results: SearchResult[] = [];
    const pushIfMatch = (candidate: SearchResult) => {
      const text = `${candidate.title} ${candidate.subtitle}`.toLocaleLowerCase("uk-UA");
      if (text.includes(queryNorm)) results.push(candidate);
    };

    students.forEach((s) => pushIfMatch({ id: `s-${s.id}`, kind: "Учень", title: s.name, subtitle: `${s.group} · ${s.email}`, section: "students" }));
    courses.forEach((c) => pushIfMatch({ id: `c-${c.id}`, kind: "Курс", title: c.title, subtitle: c.topic, section: "courses" }));
    assignments.forEach((a) => pushIfMatch({ id: `a-${a.id}`, kind: "Завдання", title: a.title, subtitle: `${a.target} · ${a.deadline}`, section: "assignments" }));
    fileLibrary.forEach((f) => pushIfMatch({ id: `f-${f.id}`, kind: "Файл", title: f.name, subtitle: `${f.target} · ${f.updated}`, section: "files" }));

    return results.slice(0, 8);
  }, [queryNorm, students]);

  const filesShown = useMemo(() => {
    if (fileFilter === "all") return fileLibrary;
    return fileLibrary.filter((f) => f.type === fileFilter);
  }, [fileFilter]);

  const messagesShown = useMemo(() => {
    if (channelFilter === "all") return messageThreads;
    return messageThreads.filter((m) => m.channel === channelFilter);
  }, [channelFilter]);

  const studentsBehind = students.filter((s) => s.progress < 60 || s.status !== "active").length;

  const toggleStudentBlock = (id: string) => {
    setStudents((prev) =>
      prev.map((s) => {
        if (s.id !== id) return s;
        return { ...s, status: s.status === "blocked" ? "active" : "blocked" };
      }),
    );
  };

  const toggleBlock = (id: DashboardBlockId) => {
    setBlocks((prev) => prev.map((b) => (b.id === id ? { ...b, visible: !b.visible } : b)));
  };

  const moveBlock = (id: DashboardBlockId, dir: "up" | "down") => {
    setBlocks((prev) => {
      const idx = prev.findIndex((b) => b.id === id);
      if (idx < 0) return prev;
      const swapIdx = dir === "up" ? idx - 1 : idx + 1;
      if (swapIdx < 0 || swapIdx >= prev.length) return prev;
      const next = [...prev];
      [next[idx], next[swapIdx]] = [next[swapIdx], next[idx]];
      return next;
    });
  };

  const renderDashboardBlock = (b: DashboardBlock) => {
    if (!b.visible) return null;

    if (b.id === "today") {
      return (
        <article key={b.id} className="p-5" style={panel}>
          <SectionHead title="Уроки сьогодні" text="Онлайн-уроки, Zoom та найближчі заняття" />
          <div style={{ marginTop: 12, display: "grid", gap: 10 }}>
            {todayLessons.map((l) => (
              <div key={l.id} className="p-3" style={inset}>
                <p style={{ fontSize: "0.82rem", color: "rgba(229,223,212,0.88)" }}>{l.title}</p>
                <p style={{ marginTop: 4, fontSize: "0.72rem", color: "rgba(175,165,149,0.74)" }}>{l.time} · {l.details}</p>
              </div>
            ))}
          </div>
        </article>
      );
    }

    if (b.id === "review") {
      return (
        <article key={b.id} className="p-5" style={panel}>
          <SectionHead title="Перевірка ДЗ" text="Оцінка, коментар, файл-відповідь, зараховано/не зараховано" />
          <div style={{ marginTop: 12, display: "grid", gap: 10 }}>
            {assignments.filter((a) => a.status !== "checked").map((a) => (
              <div key={a.id} className="p-3" style={inset}>
                <p style={{ fontSize: "0.82rem", color: "rgba(229,223,212,0.88)" }}>{a.title}</p>
                <p style={{ marginTop: 4, fontSize: "0.72rem", color: "rgba(175,165,149,0.74)" }}>{a.target} · {a.deadline}</p>
                <p style={{ marginTop: 6, fontSize: "0.70rem", color: "rgba(175,165,149,0.74)" }}>{a.comment}</p>
              </div>
            ))}
          </div>
        </article>
      );
    }

    if (b.id === "actions") {
      return (
        <article key={b.id} className="p-5" style={panel}>
          <SectionHead title="Останні дії учнів" text="Активність у курсах, тестах, матеріалах і Zoom" />
          <div style={{ marginTop: 12, display: "grid", gap: 8 }}>
            {feed.map((item) => (
              <div key={item.id} className="p-3" style={inset}>
                <p style={{ fontSize: "0.80rem", color: "rgba(229,223,212,0.88)" }}>{item.who} {item.action}</p>
                <p style={{ marginTop: 4, fontSize: "0.68rem", color: "rgba(175,165,149,0.70)" }}>{item.when}</p>
              </div>
            ))}
          </div>
        </article>
      );
    }

    if (b.id === "deadlines") {
      return (
        <article key={b.id} className="p-5" style={panel}>
          <SectionHead title="Дедлайни і нагадування" text="Уроки, тести, ДЗ та календарні події" />
          <div style={{ marginTop: 12, display: "grid", gap: 8 }}>
            {deadlines.map((d) => (
              <div key={d.id} className="p-3" style={inset}>
                <p style={{ fontSize: "0.80rem", color: "rgba(229,223,212,0.88)" }}>{d.label}</p>
                <p style={{ marginTop: 4, fontSize: "0.68rem", color: "rgba(175,165,149,0.70)" }}>{d.date}</p>
              </div>
            ))}
          </div>
        </article>
      );
    }

    if (b.id === "hours") {
      return (
        <article key={b.id} className="p-5" style={panel}>
          <SectionHead title="Навантаження по годинах" text="Години поточного і наступного тижня" />
          <div style={{ marginTop: 12, display: "grid", gridTemplateColumns: isDesktop ? "repeat(3,1fr)" : "1fr", gap: 10 }}>
            <Kpi label="Поточний тиждень" value="11 год" note="6 уроків" tone="green" />
            <Kpi label="Наступний тиждень" value="14 год" note="8 уроків" tone="blue" />
            <Kpi label="Баланс" value="+3" note="навантаження зростає" tone="gold" />
          </div>
        </article>
      );
    }

    return (
      <article key={b.id} className="p-5" style={panel}>
        <SectionHead title="Критичні сигнали" text="Відстаючі учні, ручне підтвердження результатів, синхронізації" />
        <div style={{ marginTop: 12, display: "grid", gridTemplateColumns: isDesktop ? "repeat(3,1fr)" : "1fr", gap: 10 }}>
          <Kpi label="Відстають" value={`${studentsBehind}`} note="потрібен індивідуальний супровід" tone="red" />
          <Kpi label="Тести на підтвердженні" value="2" note="до внесення в журнал" tone="gold" />
          <Kpi label="Telegram sync" value="100%" note="доставлено в обидва канали" tone="green" />
        </div>
      </article>
    );
  };
  const renderSection = () => {
    if (activeSection === "dashboard") {
      return (
        <section className="space-y-4">
          <article className="p-5 sm:p-6" style={panel}>
            <SectionHead title="Дашборд" text="Огляд найважливішої інформації без переходу в інші розділи" />
            <div style={{ marginTop: 14, display: "grid", gridTemplateColumns: isDesktop ? "repeat(5,1fr)" : "repeat(2,minmax(0,1fr))", gap: 10 }}>
              <Kpi label="Уроки сьогодні" value={`${todayLessons.length}`} note="включно з Zoom" tone="blue" />
              <Kpi label="Перевірка ДЗ" value={`${assignments.filter((a) => a.status === "submitted").length}`} note="очікують оцінювання" tone="red" />
              <Kpi label="Учні" value={`${students.length}`} note="в активних і неактивних групах" tone="gold" />
              <Kpi label="Годин цього тижня" value="11" note="проведено" tone="green" />
              <Kpi label="Наступний тиждень" value="14" note="заплановано" tone="blue" />
            </div>

            <div style={{ marginTop: 16, display: "flex", flexWrap: "wrap", gap: 8, alignItems: "center" }}>
              <button style={button} onClick={() => setShowBlockSettings((v) => !v)}>
                {showBlockSettings ? "Сховати налаштування" : "Налаштувати блоки"}
              </button>
              <span style={{ fontSize: "0.74rem", color: "rgba(176,166,151,0.72)" }}>
                Блоки можна переставляти і приховувати.
              </span>
            </div>

            {showBlockSettings ? (
              <div className="mt-3 p-3" style={inset}>
                {blocks.map((b, idx) => (
                  <div key={b.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8, padding: "8px 0" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ fontSize: "0.70rem", color: "rgba(176,166,151,0.72)" }}>{idx + 1}.</span>
                      <span style={{ fontSize: "0.78rem", color: "rgba(229,223,212,0.84)" }}>{b.label}</span>
                      {!b.visible ? <span style={chip("gray")}>Приховано</span> : null}
                    </div>
                    <div style={{ display: "flex", gap: 6 }}>
                      <button style={button} onClick={() => moveBlock(b.id, "up")}>Вгору</button>
                      <button style={button} onClick={() => moveBlock(b.id, "down")}>Вниз</button>
                      <button style={button} onClick={() => toggleBlock(b.id)}>{b.visible ? "Сховати" : "Показати"}</button>
                    </div>
                  </div>
                ))}
              </div>
            ) : null}
          </article>
          {blocks.map((b) => renderDashboardBlock(b))}
        </section>
      );
    }

    if (activeSection === "courses") {
      return (
        <section className="p-5 sm:p-6" style={panel}>
          <SectionHead title="Курси" text="Створення, редагування, копіювання, архівація та планування публікації" />
          <div className="mt-4 overflow-x-auto">
            <table style={table}>
              <thead>
                <tr>
                  <th style={th}>Курс</th>
                  <th style={th}>Тема</th>
                  <th style={th}>Уроків</th>
                  <th style={th}>Публікація</th>
                  <th style={th}>Статус</th>
                </tr>
              </thead>
              <tbody>
                {courses.map((c) => (
                  <tr key={c.id} style={row}>
                    <td style={td}>{c.title}</td>
                    <td style={td}>{c.topic}</td>
                    <td style={td}>{c.lessons}</td>
                    <td style={td}>{c.publishAt}</td>
                    <td style={td}><span style={chip(statusTone[c.status])}>{c.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      );
    }

    if (activeSection === "lessons") {
      return (
        <section className="p-5 sm:p-6" style={panel}>
          <SectionHead title="Уроки" text="Текст, фото, відео, файли, тести, ДЗ, Zoom, презентації, зовнішні джерела" />
          <div style={{ marginTop: 12, display: "flex", flexWrap: "wrap", gap: 8 }}>
            <span style={chip("gray")}>PDF вбудовано в LMS</span>
            <span style={chip("gray")}>Презентації вбудовано в LMS</span>
            <span style={chip("gray")}>YouTube авто-вбудування</span>
            <span style={chip("gray")}>Статуси: чернетка / заплановано / опубліковано / приховано / архів</span>
          </div>
        </section>
      );
    }

    if (activeSection === "groups") {
      return (
        <section className="p-5 sm:p-6" style={panel}>
          <SectionHead title="Групи" text="Ручне створення, запрошення за кодом/посиланням, призначення курсів і тестів" />
          <div style={{ marginTop: 12, display: "grid", gridTemplateColumns: isDesktop ? "repeat(3,1fr)" : "1fr", gap: 10 }}>
            {["Група А", "Група Б", "Індивідуальні"].map((g, i) => (
              <article key={g} className="p-4" style={inset}>
                <p style={{ fontSize: "0.84rem", color: "rgba(229,223,212,0.88)" }}>{g}</p>
                <p style={{ marginTop: 6, fontSize: "0.72rem", color: "rgba(175,165,149,0.74)" }}>Код: HIST-{i + 1}-2026</p>
                <p style={{ marginTop: 4, fontSize: "0.72rem", color: "rgba(175,165,149,0.74)" }}>Призначено: курси, уроки, завдання, тести</p>
              </article>
            ))}
          </div>
        </section>
      );
    }
    if (activeSection === "students") {
      return (
        <section className="p-5 sm:p-6" style={panel}>
          <SectionHead title="Учні" text="Картки, блокування доступу, історія входу, внутрішні примітки (непублічні)" />
          <div className="mt-4 overflow-x-auto">
            <table style={table}>
              <thead>
                <tr>
                  <th style={th}>Учень</th>
                  <th style={th}>Контакти</th>
                  <th style={th}>Група</th>
                  <th style={th}>Статус</th>
                  <th style={th}>Останній вхід</th>
                  <th style={th}>Внутрішня нотатка</th>
                  <th style={th}>Дія</th>
                </tr>
              </thead>
              <tbody>
                {students.map((s) => (
                  <tr key={s.id} style={row}>
                    <td style={td}>{s.name}<br /><span style={{ fontSize: "0.68rem", color: "rgba(175,165,149,0.74)" }}>{s.telegram}</span></td>
                    <td style={td}>{s.phone}<br />{s.email}</td>
                    <td style={td}>{s.group}</td>
                    <td style={td}><span style={chip(statusTone[s.status])}>{s.status}</span></td>
                    <td style={td}>{s.lastLogin}</td>
                    <td style={td}>{s.note}</td>
                    <td style={td}><button style={button} onClick={() => toggleStudentBlock(s.id)}>{s.status === "blocked" ? "Розблокувати" : "Заблокувати"}</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      );
    }

    if (activeSection === "assignments") {
      return (
        <section className="p-5 sm:p-6" style={panel}>
          <SectionHead title="Завдання" text="Призначення групі/учню, перевірка, оцінювання, шаблони та дедлайни" />
          <div style={{ marginTop: 12, display: "grid", gap: 10 }}>
            {assignments.map((a) => (
              <article key={a.id} className="p-4" style={inset}>
                <p style={{ fontSize: "0.84rem", color: "rgba(229,223,212,0.88)" }}>{a.title}</p>
                <p style={{ marginTop: 4, fontSize: "0.72rem", color: "rgba(175,165,149,0.74)" }}>{a.target} · {a.deadline}</p>
                <p style={{ marginTop: 4, fontSize: "0.72rem", color: "rgba(175,165,149,0.74)" }}>{a.comment}</p>
                <span style={{ ...chip(statusTone[a.status]), marginTop: 8 }}>{a.status}</span>
              </article>
            ))}
          </div>
        </section>
      );
    }

    if (activeSection === "tests") {
      return <section className="p-5 sm:p-6" style={panel}><SectionHead title="Тести" text="Імпорт із zno.osvita.ua, налаштування спроб/часу/відповідей, авто або ручне внесення в журнал" /></section>;
    }

    if (activeSection === "gradebook") {
      return <section className="p-5 sm:p-6" style={panel}><SectionHead title="Журнал оцінок" text="Оцінки по ДЗ, тестах і темах, середній бал, фільтри, Excel-експорт" /></section>;
    }

    if (activeSection === "attendance") {
      return <section className="p-5 sm:p-6" style={panel}><SectionHead title="Відвідуваність" text="Присутній/відсутній, причини, редагування заднім числом, Excel-експорт" /></section>;
    }

    if (activeSection === "analytics") {
      return <section className="p-5 sm:p-6" style={panel}><SectionHead title="Аналітика" text="Середній бал, виконання завдань, відвідуваність, прогрес, хто відстає і хто найкращий" /></section>;
    }

    if (activeSection === "messages") {
      return (
        <section className="p-5 sm:p-6" style={panel}>
          <SectionHead title="Повідомлення / чат" text="Листування з учнями і групами, LMS + Telegram, статуси отримано/відкрито/Zoom" />
          <div style={{ marginTop: 12, display: "flex", gap: 8, flexWrap: "wrap" }}>
            <button style={button} onClick={() => setChannelFilter("all")}>Усі</button>
            <button style={button} onClick={() => setChannelFilter("lms")}>LMS</button>
            <button style={button} onClick={() => setChannelFilter("telegram")}>Telegram</button>
          </div>
          <div style={{ marginTop: 12, display: "grid", gap: 10 }}>
            {messagesShown.map((m) => (
              <article key={m.id} className="p-4" style={inset}>
                <p style={{ fontSize: "0.82rem", color: "rgba(229,223,212,0.88)" }}>{m.target} · {m.channel.toUpperCase()}</p>
                <p style={{ marginTop: 4, fontSize: "0.72rem", color: "rgba(175,165,149,0.74)" }}>{m.text}</p>
                <p style={{ marginTop: 4, fontSize: "0.68rem", color: "rgba(175,165,149,0.70)" }}>{m.status} · {m.time}</p>
              </article>
            ))}
          </div>
        </section>
      );
    }

    if (activeSection === "files") {
      return (
        <section className="p-5 sm:p-6" style={panel}>
          <SectionHead title="Файли / матеріали" text="PDF, презентації, методички, фільтри по групі/учню/типу, редагування і видалення" />
          <div style={{ marginTop: 12, display: "flex", gap: 8, flexWrap: "wrap" }}>
            <button style={button} onClick={() => setFileFilter("all")}>Усі</button>
            <button style={button} onClick={() => setFileFilter("pdf")}>PDF</button>
            <button style={button} onClick={() => setFileFilter("presentation")}>Презентації</button>
            <button style={button} onClick={() => setFileFilter("doc")}>Методички</button>
            <button style={button} onClick={() => setFileFilter("video")}>Відео</button>
          </div>
          <div style={{ marginTop: 12, display: "grid", gap: 10 }}>
            {filesShown.map((f) => (
              <article key={f.id} className="p-4" style={inset}>
                <p style={{ fontSize: "0.82rem", color: "rgba(229,223,212,0.88)" }}>{f.name}</p>
                <p style={{ marginTop: 4, fontSize: "0.72rem", color: "rgba(175,165,149,0.74)" }}>{f.type} · {f.target} · {f.updated}</p>
              </article>
            ))}
          </div>
        </section>
      );
    }

    if (activeSection === "calendar") return <section className="p-5 sm:p-6" style={panel}><SectionHead title="Календар / розклад" text="Онлайн-уроки, дедлайни, заплановані заняття, нагадування" /></section>;
    if (activeSection === "drafts") return <section className="p-5 sm:p-6" style={panel}><SectionHead title="Чернетки" text="Окремий розділ для уроків, курсів, завдань і повідомлень із продовженням з того ж місця" /></section>;
    if (activeSection === "archive") return <section className="p-5 sm:p-6" style={panel}><SectionHead title="Архів" text="Відновлення або остаточне видалення після одного підтвердження" /></section>;

    return (
      <section className="p-5 sm:p-6" style={panel}>
        <SectionHead title="Налаштування" text="Профіль, логін/пароль, Telegram-інтеграція, шаблони, сповіщення, зовнішні інтеграції" />
        <div style={{ marginTop: 12, display: "flex", flexWrap: "wrap", gap: 8 }}>
          <span style={chip("green")}>Telegram підключено</span>
          <span style={chip("green")}>Zoom активний</span>
          <span style={chip("gold")}>Імпорт тестів потребує технічної/правової оцінки</span>
        </div>
      </section>
    );
  };

  const activeMeta = sections.find((s) => s.key === activeSection);

  return (
    <div className="mx-auto w-full px-4 pb-14 pt-4 sm:px-6 lg:px-8" style={{ maxWidth: `${PAGE_MAX_WIDTH}px` }}>
      <section className="mb-6 p-5 sm:p-6" style={{ ...panel, background: "linear-gradient(180deg, rgba(201,169,110,0.10) 0%, rgba(16,13,14,0.96) 100%)" }}>
        <p style={{ ...sectionTitle, letterSpacing: "0.30em" }}>Кабінет вчителя</p>
        <h1 className="font-serif" style={{ marginTop: 10, fontSize: isDesktop ? "2.3rem" : "1.8rem", color: "rgba(245,239,230,0.96)" }}>LMS з історії України</h1>
        <p style={{ marginTop: 8, maxWidth: 820, fontSize: "0.86rem", color: "rgba(224,216,205,0.74)" }}>Єдиний робочий простір: курси, уроки, групи, учні, завдання, тести, журнал, відвідуваність, аналітика, LMS+Telegram, Zoom, файли, календар, чернетки, архів, налаштування.</p>
        <div style={{ marginTop: 12, display: "flex", flexWrap: "wrap", gap: 8 }}>
          <button style={button} onClick={() => setActiveSection("courses")}>+ Курс</button>
          <button style={button} onClick={() => setActiveSection("lessons")}>+ Урок</button>
          <button style={button} onClick={() => setActiveSection("assignments")}>+ Завдання</button>
          <button style={button} onClick={() => setActiveSection("calendar")}>Календар</button>
        </div>
      </section>
      <section className="mb-6 p-5 sm:p-6" style={panel}>
        <p style={sectionTitle}>Глобальний пошук</p>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Учні, курси, завдання, файли"
          style={{
            marginTop: 8,
            width: "100%",
            minHeight: 42,
            borderRadius: 12,
            border: "1px solid rgba(201,169,110,0.22)",
            background: "rgba(11,10,11,0.72)",
            color: "rgba(235,230,223,0.90)",
            padding: "0 12px",
            fontSize: "0.82rem",
          }}
        />

        {queryNorm ? (
          <div className="mt-3 p-3" style={inset}>
            <p style={sectionTitle}>Результати</p>
            {searchResults.length ? (
              <div style={{ marginTop: 8, display: "grid", gap: 8 }}>
                {searchResults.map((r) => (
                  <button key={r.id} onClick={() => setActiveSection(r.section)} style={{ textAlign: "left", ...button }}>
                    {r.kind}: {r.title}
                    <div style={{ fontSize: "0.66rem", color: "rgba(170,160,146,0.70)" }}>{r.subtitle}</div>
                  </button>
                ))}
              </div>
            ) : (
              <p style={{ marginTop: 8, fontSize: "0.74rem", color: "rgba(170,160,146,0.70)" }}>Нічого не знайдено</p>
            )}
          </div>
        ) : null}
      </section>

      <section className="mb-6 p-4 sm:p-5" style={panel}>
        <div style={{ overflowX: "auto", paddingBottom: 4 }}>
          <div style={{ display: "inline-flex", gap: 8, minWidth: "max-content" }}>
            {sections.map((s) => {
              const active = s.key === activeSection;
              return (
                <button
                  key={s.key}
                  onClick={() => setActiveSection(s.key)}
                  style={{ ...button, border: active ? "1px solid rgba(201,169,110,0.42)" : button.border, background: active ? "rgba(201,169,110,0.14)" : button.background, color: active ? "rgba(230,202,148,0.95)" : button.color }}
                >
                  {s.label}
                </button>
              );
            })}
          </div>
        </div>
        <p style={{ marginTop: 10, fontSize: "0.78rem", color: "rgba(175,165,149,0.74)" }}>{activeMeta?.note}</p>
      </section>

      {renderSection()}

      <section className="mt-6 p-5" style={panel}>
        <SectionHead title="Критерії готовності (чекліст)" text="MVP-контроль відповідності ТЗ" />
        <div style={{ marginTop: 10, display: "flex", flexWrap: "wrap", gap: 8 }}>
          {quickReadiness.map((item) => (
            <span key={item} style={chip("gray")}>{item}</span>
          ))}
        </div>
      </section>
    </div>
  );
}

const table: CSSProperties = {
  width: "100%",
  borderCollapse: "separate",
  borderSpacing: "0 8px",
};

const th: CSSProperties = {
  textAlign: "left",
  padding: "0 12px",
  fontSize: "0.64rem",
  letterSpacing: "0.14em",
  textTransform: "uppercase",
  color: "rgba(165,145,103,0.78)",
  fontWeight: 500,
};

const row: CSSProperties = {
  background: "rgba(23,19,17,0.72)",
};

const td: CSSProperties = {
  padding: "12px",
  fontSize: "0.74rem",
  color: "rgba(217,210,198,0.82)",
  verticalAlign: "top",
};
