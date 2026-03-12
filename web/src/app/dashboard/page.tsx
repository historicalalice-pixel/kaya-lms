import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

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
    <main className="min-h-screen bg-black text-white px-6 py-10">
      <div className="max-w-5xl mx-auto">
        <div className="rounded-2xl border border-[rgba(201,169,110,0.18)] bg-[rgba(255,255,255,0.02)] p-8">
          <p className="text-sm uppercase tracking-[0.28em] text-[rgba(201,169,110,0.78)]">
            KAYA
          </p>

          <h1 className="mt-4 text-3xl md:text-4xl font-semibold text-[rgba(245,239,230,0.96)]">
            Вітаємо, {displayName}
          </h1>

          <p className="mt-3 text-[rgba(245,239,230,0.68)] max-w-2xl">
            Це твій навчальний кабінет. Тут згодом будуть твої курси,
            прогрес і наступні кроки у навчанні.
          </p>

          <div className="mt-6 flex flex-col gap-2 text-sm text-[rgba(245,239,230,0.62)]">
            <p>Користувач: {user.email}</p>
            <p>Роль: {profile?.role}</p>
          </div>
        </div>
      </div>
    </main>
  );
}