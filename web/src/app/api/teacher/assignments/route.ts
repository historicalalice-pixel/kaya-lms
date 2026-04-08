import { NextResponse } from "next/server";
import { requireTeacherContext } from "../_utils";

const allowedStatuses = new Set(["missing", "submitted", "checked"]);

export async function GET() {
  const { context, response } = await requireTeacherContext();
  if (response || !context) return response;

  const { supabase, userId } = context;
  const { data, error } = await supabase
    .from("teacher_assignments")
    .select("*")
    .eq("teacher_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json(
      { error: "Failed to load teacher assignments", details: error.message },
      { status: 500 },
    );
  }

  return NextResponse.json(data ?? []);
}

export async function POST(request: Request) {
  const { context, response } = await requireTeacherContext();
  if (response || !context) return response;

  const { supabase, userId } = context;
  const payload = (await request.json()) as {
    title?: string;
    target?: string;
    status?: string;
    comment?: string;
    deadlineAt?: string | null;
    lessonId?: string | null;
  };

  const title = payload.title?.trim();
  const target = payload.target?.trim() || "Без цілі";
  const status = payload.status?.trim() ?? "submitted";
  const comment = payload.comment?.trim() ?? "";
  const lessonId = payload.lessonId?.trim() || null;
  const deadlineAt = payload.deadlineAt ? new Date(payload.deadlineAt) : null;

  if (!title) {
    return NextResponse.json({ error: "Title is required" }, { status: 400 });
  }

  if (!allowedStatuses.has(status)) {
    return NextResponse.json({ error: "Invalid assignment status" }, { status: 400 });
  }

  if (deadlineAt && Number.isNaN(deadlineAt.getTime())) {
    return NextResponse.json({ error: "Invalid deadlineAt datetime" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("teacher_assignments")
    .insert({
      teacher_id: userId,
      lesson_id: lessonId,
      title,
      target,
      status,
      comment,
      deadline_at: deadlineAt ? deadlineAt.toISOString() : null,
    })
    .select("*")
    .single();

  if (error) {
    return NextResponse.json(
      { error: "Failed to create teacher assignment", details: error.message },
      { status: 500 },
    );
  }

  return NextResponse.json(data, { status: 201 });
}

export async function PATCH(request: Request) {
  const { context, response } = await requireTeacherContext();
  if (response || !context) return response;

  const { supabase, userId } = context;
  const payload = (await request.json()) as {
    id?: string;
    title?: string;
    target?: string;
    status?: string;
    comment?: string;
    deadlineAt?: string | null;
  };

  const id = payload.id?.trim();
  if (!id) return NextResponse.json({ error: "id is required" }, { status: 400 });

  const updates: Record<string, string | null> = {};

  if (typeof payload.title === "string") {
    const title = payload.title.trim();
    if (!title) return NextResponse.json({ error: "Title is required" }, { status: 400 });
    updates.title = title;
  }

  if (typeof payload.target === "string") {
    updates.target = payload.target.trim() || "Без цілі";
  }

  if (typeof payload.comment === "string") {
    updates.comment = payload.comment.trim();
  }

  if (typeof payload.status === "string") {
    const status = payload.status.trim();
    if (!allowedStatuses.has(status)) {
      return NextResponse.json({ error: "Invalid assignment status" }, { status: 400 });
    }
    updates.status = status;
  }

  if (payload.deadlineAt !== undefined) {
    if (payload.deadlineAt === null || payload.deadlineAt === "") {
      updates.deadline_at = null;
    } else {
      const parsed = new Date(payload.deadlineAt);
      if (Number.isNaN(parsed.getTime())) {
        return NextResponse.json({ error: "Invalid deadlineAt datetime" }, { status: 400 });
      }
      updates.deadline_at = parsed.toISOString();
    }
  }

  const { data, error } = await supabase
    .from("teacher_assignments")
    .update(updates)
    .eq("id", id)
    .eq("teacher_id", userId)
    .select("*")
    .single();

  if (error) {
    return NextResponse.json(
      { error: "Failed to update teacher assignment", details: error.message },
      { status: 500 },
    );
  }

  return NextResponse.json(data);
}

export async function DELETE(request: Request) {
  const { context, response } = await requireTeacherContext();
  if (response || !context) return response;

  const { supabase, userId } = context;
  const requestUrl = new URL(request.url);
  const id = requestUrl.searchParams.get("id")?.trim();

  if (!id) return NextResponse.json({ error: "id is required" }, { status: 400 });

  const { error } = await supabase
    .from("teacher_assignments")
    .delete()
    .eq("id", id)
    .eq("teacher_id", userId);

  if (error) {
    return NextResponse.json(
      { error: "Failed to delete teacher assignment", details: error.message },
      { status: 500 },
    );
  }

  return NextResponse.json({ success: true });
}
