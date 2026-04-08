import { NextResponse } from "next/server";
import { requireTeacherContext } from "../_utils";

const allowedStatuses = new Set([
  "draft",
  "scheduled",
  "published",
  "hidden",
  "archived",
]);

export async function GET() {
  const { context, response } = await requireTeacherContext();
  if (response || !context) return response;

  const { supabase, userId } = context;
  const { data, error } = await supabase
    .from("teacher_courses")
    .select("*")
    .eq("teacher_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json(
      { error: "Failed to load teacher courses", details: error.message },
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
    topic?: string;
    status?: string;
    publishAt?: string | null;
  };

  const title = payload.title?.trim();
  const topic = payload.topic?.trim() ?? "";
  const status = payload.status?.trim() ?? "draft";
  const publishAt = payload.publishAt ? new Date(payload.publishAt) : null;

  if (!title) {
    return NextResponse.json({ error: "Title is required" }, { status: 400 });
  }

  if (!allowedStatuses.has(status)) {
    return NextResponse.json({ error: "Invalid course status" }, { status: 400 });
  }

  if (publishAt && Number.isNaN(publishAt.getTime())) {
    return NextResponse.json(
      { error: "Invalid publishAt datetime" },
      { status: 400 },
    );
  }

  const { data, error } = await supabase
    .from("teacher_courses")
    .insert({
      teacher_id: userId,
      title,
      topic,
      status,
      publish_at: publishAt ? publishAt.toISOString() : null,
    })
    .select("*")
    .single();

  if (error) {
    return NextResponse.json(
      { error: "Failed to create teacher course", details: error.message },
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
    topic?: string;
    status?: string;
    publishAt?: string | null;
  };

  const id = payload.id?.trim();
  if (!id) return NextResponse.json({ error: "id is required" }, { status: 400 });

  const title = payload.title?.trim();
  if (!title) return NextResponse.json({ error: "Title is required" }, { status: 400 });

  const topic = payload.topic?.trim() ?? "";
  const status = payload.status?.trim() ?? "draft";
  if (!allowedStatuses.has(status)) {
    return NextResponse.json({ error: "Invalid course status" }, { status: 400 });
  }

  const publishAt = payload.publishAt ? new Date(payload.publishAt) : null;
  if (publishAt && Number.isNaN(publishAt.getTime())) {
    return NextResponse.json({ error: "Invalid publishAt datetime" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("teacher_courses")
    .update({ title, topic, status, publish_at: publishAt ? publishAt.toISOString() : null })
    .eq("id", id)
    .eq("teacher_id", userId)
    .select("*")
    .single();

  if (error) {
    return NextResponse.json(
      { error: "Failed to update teacher course", details: error.message },
      { status: 500 },
    );
  }

  return NextResponse.json(data);
}

export async function DELETE(request: Request) {
  const { context, response } = await requireTeacherContext();
  if (response || !context) return response;

  const { supabase, userId } = context;
  const id = new URL(request.url).searchParams.get("id")?.trim();
  if (!id) return NextResponse.json({ error: "id is required" }, { status: 400 });

  const { error } = await supabase
    .from("teacher_courses")
    .delete()
    .eq("id", id)
    .eq("teacher_id", userId);

  if (error) {
    return NextResponse.json(
      { error: "Failed to delete teacher course", details: error.message },
      { status: 500 },
    );
  }

  return NextResponse.json({ success: true });
}
