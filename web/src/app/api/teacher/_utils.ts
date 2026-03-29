import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export type TeacherContext = {
  supabase: Awaited<ReturnType<typeof createClient>>;
  userId: string;
};

export async function requireTeacherContext() {
  const supabase = await createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return {
      response: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
    };
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profileError) {
    return {
      response: NextResponse.json(
        { error: "Failed to resolve profile role" },
        { status: 500 },
      ),
    };
  }

  const role = profile?.role ?? "student";
  const isTeacher = role === "teacher" || role === "admin";

  if (!isTeacher) {
    return {
      response: NextResponse.json({ error: "Forbidden" }, { status: 403 }),
    };
  }

  return {
    context: {
      supabase,
      userId: user.id,
    } satisfies TeacherContext,
  };
}

export function isPostgresRelationMissing(errorMessage: string | undefined) {
  if (!errorMessage) return false;
  return errorMessage.includes("does not exist");
}
