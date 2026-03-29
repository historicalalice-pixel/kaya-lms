import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  let next = requestUrl.searchParams.get("next") ?? "/home";

  if (!next.startsWith("/")) {
    next = "/home";
  }

  if (code) {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error && data.user) {
      const normalizedEmail = data.user.email?.trim().toLowerCase();
      const { data: blockedStudent, error: blockedCheckError } = await supabase
        .from("teacher_students")
        .select("id, status")
        .eq("email", normalizedEmail ?? "")
        .eq("status", "blocked")
        .maybeSingle();

      if (blockedCheckError && blockedCheckError.code !== "42P01") {
        console.error("BLOCKED STATUS CHECK ERROR:", blockedCheckError.message);
      }

      if (blockedStudent) {
        await supabase.auth.signOut();
        return NextResponse.redirect(
          new URL("/login?error=blocked_student", requestUrl.origin),
        );
      }

      // Якщо next не вказаний явно — визначаємо за роллю
      if (next === "/home" || next === "/dashboard") {
        const { data: profile } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", data.user.id)
          .single();

        const role = profile?.role ?? "student";
        const isTeacher = role === "teacher" || role === "admin";
        next = isTeacher ? "/teacher" : "/dashboard";
      }

      return NextResponse.redirect(new URL(next, requestUrl.origin));
    }
  }

  return NextResponse.redirect(new URL("/login", requestUrl.origin));
}
