import { createClient } from "@/lib/supabase/server";

export default async function Dashboard() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center">
      <h1 className="text-3xl font-bold">
        Кабінет учня KAYA
      </h1>

      <p className="mt-4 text-gray-400">
        Користувач: {user?.email}
      </p>
    </main>
  );
}