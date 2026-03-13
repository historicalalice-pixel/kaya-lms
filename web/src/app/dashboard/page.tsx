import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import LogoutButton from "../components/logout-button";

export default async function Dashboard() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, full_name")
    .eq("id", user.id)
    .single();

  const displayName = profile?.full_name || user.email;

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--bg, #0a0a0c)",
        color: "var(--text, #e8e4dd)",
        fontFamily: "var(--font-sans, 'Manrope', sans-serif)",
      }}
    >
      {/* HEADER */}
      <header
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          paddingLeft: "clamp(28px, 7vw, 140px)",
          paddingRight: "clamp(28px, 7vw, 140px)",
          paddingTop: 28,
          paddingBottom: 20,
          borderBottom: "1px solid rgba(201,169,110,0.08)",
        }}
      >
        <Link
          href="/home"
          style={{
            fontFamily: "var(--font-serif, 'Cormorant Garamond', serif)",
            fontSize: "clamp(1.8rem, 3vw, 2.4rem)",
            letterSpacing: "0.24em",
            color: "rgba(245,239,230,0.94)",
            textDecoration: "none",
            fontWeight: 300,
          }}
        >
          KAYA
        </Link>

        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <span
            style={{
              fontFamily: "var(--font-sans, 'Manrope', sans-serif)",
              fontSize: "0.85rem",
              color: "var(--text-dim, #9a958d)",
              maxWidth: 260,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {displayName}
          </span>
          <LogoutButton />
        </div>
      </header>

      {/* MAIN */}
      <main
        style={{
          maxWidth: 1100,
          margin: "0 auto",
          padding: "clamp(32px, 5vw, 64px) clamp(20px, 5vw, 40px)",
          display: "flex",
          flexDirection: "column",
          gap: 40,
        }}
      >
        {/* ВІТАННЯ */}
        <div>
          <p
            style={{
              fontFamily: "var(--font-sans, 'Manrope', sans-serif)",
              fontSize: "0.7rem",
              letterSpacing: "0.35em",
              textTransform: "uppercase",
              color: "var(--gold-dim, #8a7444)",
              marginBottom: 16,
            }}
          >
            Навчальний кабінет
          </p>
          <h1
            style={{
              fontFamily: "var(--font-serif, 'Cormorant Garamond', serif)",
              fontSize: "clamp(2rem, 4vw, 3.2rem)",
              fontWeight: 300,
              color: "var(--text, #e8e4dd)",
              marginBottom: 12,
              lineHeight: 1.2,
            }}
          >
            Вітаємо, {displayName}
          </h1>
          <p
            style={{
              fontFamily: "var(--font-serif, 'Cormorant Garamond', serif)",
              fontSize: "1.05rem",
              fontStyle: "italic",
              fontWeight: 300,
              color: "var(--gold-light, #e2c992)",
              opacity: 0.7,
            }}
          >
            Твій шлях крізь час починається тут.
          </p>
        </div>

        {/* СТАТИСТИКА */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: 20,
          }}
        >
          {[
            { label: "Активний курс", value: "Немає" },
            { label: "Завершено уроків", value: "0" },
            { label: "Загальний прогрес", value: "0%" },
          ].map((item) => (
            <div
              key={item.label}
              style={{
                border: "1px solid rgba(201,169,110,0.12)",
                background: "rgba(201,169,110,0.02)",
                padding: "24px 28px",
                transition: "border-color 0.3s",
              }}
            >
              <p
                style={{
                  fontSize: "0.68rem",
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  color: "var(--text-dim, #9a958d)",
                  marginBottom: 12,
                }}
              >
                {item.label}
              </p>
              <p
                style={{
                  fontFamily: "var(--font-serif, 'Cormorant Garamond', serif)",
                  fontSize: "1.8rem",
                  fontWeight: 300,
                  color: "var(--gold-light, #e2c992)",
                }}
              >
                {item.value}
              </p>
              {/* Progress bar */}
              <div
                style={{
                  marginTop: 14,
                  height: 1,
                  background: "rgba(201,169,110,0.1)",
                  position: "relative",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    height: "100%",
                    width: "0%",
                    background: "linear-gradient(90deg, transparent, var(--gold, #c9a96e))",
                  }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* НАСТУПНИЙ УРОК */}
        <div
          style={{
            border: "1px solid rgba(201,169,110,0.15)",
            background: "rgba(201,169,110,0.02)",
            padding: "28px 32px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 20,
            flexWrap: "wrap",
          }}
        >
          <div>
            <p
              style={{
                fontSize: "0.68rem",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: "var(--gold-dim, #8a7444)",
                marginBottom: 10,
              }}
            >
              Наступний урок
            </p>
            <p
              style={{
                fontFamily: "var(--font-serif, 'Cormorant Garamond', serif)",
                fontSize: "1.3rem",
                fontWeight: 300,
                color: "var(--text, #e8e4dd)",
              }}
            >
              Курс ще не обрано
            </p>
          </div>
          <Link
            href="/courses"
            style={{
              display: "inline-block",
              padding: "14px 32px",
              border: "1px solid rgba(201,169,110,0.4)",
              color: "var(--gold-light, #e2c992)",
              textDecoration: "none",
              fontFamily: "var(--font-sans, 'Manrope', sans-serif)",
              fontSize: "0.68rem",
              letterSpacing: "0.25em",
              textTransform: "uppercase",
              transition: "all 0.3s",
              whiteSpace: "nowrap",
            }}
          >
            Обрати курс →
          </Link>
        </div>

        {/* МОЇ КУРСИ */}
        <div>
          <p
            style={{
              fontSize: "0.68rem",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "var(--gold-dim, #8a7444)",
              marginBottom: 20,
            }}
          >
            Мої курси
          </p>
          <div
            style={{
              border: "1px solid rgba(201,169,110,0.1)",
              background: "rgba(201,169,110,0.015)",
              padding: "40px 32px",
              textAlign: "center",
            }}
          >
            <p
              style={{
                fontFamily: "var(--font-serif, 'Cormorant Garamond', serif)",
                fontSize: "1.1rem",
                fontWeight: 300,
                fontStyle: "italic",
                color: "var(--text-dim, #9a958d)",
                marginBottom: 20,
              }}
            >
              Ти ще не записаний на жоден курс
            </p>
            <Link
              href="/courses"
              style={{
                display: "inline-block",
                padding: "12px 28px",
                border: "1px solid rgba(201,169,110,0.35)",
                color: "var(--gold-light, #e2c992)",
                textDecoration: "none",
                fontFamily: "var(--font-sans, 'Manrope', sans-serif)",
                fontSize: "0.65rem",
                letterSpacing: "0.25em",
                textTransform: "uppercase",
              }}
            >
              Переглянути каталог
            </Link>
          </div>
        </div>

        {/* ДОМАШНІ ЗАВДАННЯ */}
        <div>
          <p
            style={{
              fontSize: "0.68rem",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "var(--gold-dim, #8a7444)",
              marginBottom: 20,
            }}
          >
            Домашні завдання
          </p>

          {/* Порожній стан */}
          <div
            style={{
              border: "1px solid rgba(201,169,110,0.1)",
              background: "rgba(201,169,110,0.015)",
              padding: "32px",
              display: "flex",
              flexDirection: "column",
              gap: 0,
            }}
          >
            {/* Приклад ДЗ — буде динамічним */}
            <div
              style={{
                padding: "24px 0",
                borderBottom: "1px solid rgba(201,169,110,0.08)",
                display: "flex",
                flexDirection: "column",
                gap: 12,
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  justifyContent: "space-between",
                  gap: 16,
                  flexWrap: "wrap",
                }}
              >
                <div>
                  <p
                    style={{
                      fontFamily: "var(--font-serif, 'Cormorant Garamond', serif)",
                      fontSize: "1.1rem",
                      fontWeight: 300,
                      color: "var(--text, #e8e4dd)",
                      marginBottom: 6,
                    }}
                  >
                    Завдань поки немає
                  </p>
                  <p
                    style={{
                      fontSize: "0.72rem",
                      color: "var(--text-dim, #9a958d)",
                      letterSpacing: "0.05em",
                    }}
                  >
                    Нові завдання з&apos;являться після запису на курс
                  </p>
                </div>
                <span
                  style={{
                    fontSize: "0.6rem",
                    letterSpacing: "0.2em",
                    textTransform: "uppercase",
                    color: "var(--text-dim, #9a958d)",
                    border: "1px solid rgba(201,169,110,0.15)",
                    padding: "4px 12px",
                    whiteSpace: "nowrap",
                  }}
                >
                  Очікується
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ОЦІНКИ ТА КОМЕНТАРІ ВЧИТЕЛЯ */}
        <div>
          <p
            style={{
              fontSize: "0.68rem",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "var(--gold-dim, #8a7444)",
              marginBottom: 20,
            }}
          >
            Оцінки та коментарі вчителя
          </p>

          <div
            style={{
              border: "1px solid rgba(201,169,110,0.1)",
              background: "rgba(201,169,110,0.015)",
              padding: "32px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 20,
                paddingBottom: 20,
                borderBottom: "1px solid rgba(201,169,110,0.08)",
                flexWrap: "wrap",
              }}
            >
              {/* Оцінка */}
              <div
                style={{
                  width: 64,
                  height: 64,
                  border: "1px solid rgba(201,169,110,0.2)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <span
                  style={{
                    fontFamily: "var(--font-serif, 'Cormorant Garamond', serif)",
                    fontSize: "1.8rem",
                    fontWeight: 300,
                    color: "var(--gold-dim, #8a7444)",
                  }}
                >
                  —
                </span>
              </div>
              <div>
                <p
                  style={{
                    fontFamily: "var(--font-serif, 'Cormorant Garamond', serif)",
                    fontSize: "1.05rem",
                    fontWeight: 300,
                    color: "var(--text-dim, #9a958d)",
                    fontStyle: "italic",
                    marginBottom: 6,
                  }}
                >
                  Оцінок поки немає
                </p>
                <p
                  style={{
                    fontSize: "0.7rem",
                    color: "rgba(154,149,141,0.6)",
                    letterSpacing: "0.05em",
                  }}
                >
                  Вчитель залишить оцінку та коментар після перевірки ДЗ
                </p>
              </div>
            </div>

            {/* Коментар вчителя */}
            <div style={{ paddingTop: 20 }}>
              <p
                style={{
                  fontSize: "0.65rem",
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  color: "rgba(138,116,68,0.6)",
                  marginBottom: 10,
                }}
              >
                Коментар вчителя
              </p>
              <p
                style={{
                  fontFamily: "var(--font-serif, 'Cormorant Garamond', serif)",
                  fontSize: "1rem",
                  fontWeight: 300,
                  fontStyle: "italic",
                  color: "rgba(154,149,141,0.5)",
                  lineHeight: 1.7,
                }}
              >
                Коментарі з&apos;являться тут після перевірки робіт
              </p>
            </div>
          </div>
        </div>

        {/* ШВИДКІ ПОСИЛАННЯ */}
        <div
          style={{
            display: "flex",
            gap: 24,
            flexWrap: "wrap",
            paddingTop: 8,
            borderTop: "1px solid rgba(201,169,110,0.08)",
          }}
        >
          {[
            { href: "/courses", label: "Каталог курсів" },
            { href: "/about", label: "Про платформу" },
            { href: "/contacts", label: "Зв'язатися з нами" },
          ].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              style={{
                fontFamily: "var(--font-sans, 'Manrope', sans-serif)",
                fontSize: "0.7rem",
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: "var(--text-dim, #9a958d)",
                textDecoration: "none",
                transition: "color 0.3s",
              }}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}