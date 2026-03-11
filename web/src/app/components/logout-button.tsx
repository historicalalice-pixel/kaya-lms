"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function LogoutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    try {
      setLoading(true);

      const supabase = createClient();
      await supabase.auth.signOut();

      router.push("/login");
      router.refresh();
    } catch (error) {
      console.error("LOGOUT ERROR:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleLogout}
      disabled={loading}
      className="inline-flex items-center justify-center rounded-[12px] border border-[rgba(201,169,110,0.3)] bg-[rgba(201,169,110,0.04)] px-4 py-2.5 font-sans text-[0.92rem] text-[rgba(245,239,230,0.88)] transition-all duration-300 hover:border-[rgba(227,196,136,0.78)] hover:bg-[rgba(201,169,110,0.08)] disabled:opacity-60 disabled:cursor-not-allowed"
    >
      {loading ? "Вихід..." : "Вийти"}
    </button>
  );
}