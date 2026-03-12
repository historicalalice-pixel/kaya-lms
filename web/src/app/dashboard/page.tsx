import { createClient } from "@/lib/supabase/server";

export default async function Dashboard() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user?.id)
    .single();

  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center">

      <h1 className="text-3xl font-bold">
        Кабінет учня KAYA
      </h1>

      <p className="mt-4 text-gray-400">
        Користувач: {user?.email}
      </p>

      <p className="mt-2 text-gray-500">
        Роль: {profile?.role}
      </p>

    </main>
  );
}