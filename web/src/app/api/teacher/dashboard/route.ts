import { NextResponse } from "next/server";
import { requireTeacherContext } from "../_utils";
import type { TeacherDashboardLayout } from "@/lib/dashboard/dashboard-types";

export async function GET() {
  const { context, response } = await requireTeacherContext();
  if (response || !context) return response;

  const { supabase, userId } = context;
  const { data, error } = await supabase
    .from("teacher_dashboard_preferences")
    .select("layout_json")
    .eq("teacher_id", userId)
    .maybeSingle();

  if (error) {
    return NextResponse.json({ error: "Failed to load dashboard preferences", details: error.message }, { status: 500 });
  }

  return NextResponse.json({ layout: (data?.layout_json as TeacherDashboardLayout | null) ?? null });
}

export async function PUT(request: Request) {
  const { context, response } = await requireTeacherContext();
  if (response || !context) return response;

  const { supabase, userId } = context;
  const payload = (await request.json()) as { layout?: TeacherDashboardLayout };

  if (!payload.layout || payload.layout.version !== 1 || !Array.isArray(payload.layout.items)) {
    return NextResponse.json({ error: "Invalid layout payload" }, { status: 400 });
  }

  const { error } = await supabase
    .from("teacher_dashboard_preferences")
    .upsert(
      {
        teacher_id: userId,
        layout_json: payload.layout,
      },
      { onConflict: "teacher_id" },
    );

  if (error) {
    return NextResponse.json({ error: "Failed to save dashboard preferences", details: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}

export async function DELETE() {
  const { context, response } = await requireTeacherContext();
  if (response || !context) return response;

  const { supabase, userId } = context;

  const { error } = await supabase
    .from("teacher_dashboard_preferences")
    .delete()
    .eq("teacher_id", userId);

  if (error) {
    return NextResponse.json({ error: "Failed to reset dashboard preferences", details: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
