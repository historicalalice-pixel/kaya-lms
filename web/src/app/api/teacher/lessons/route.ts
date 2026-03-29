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
    .from("teacher_lessons")
    .select("*")
    .eq("teacher_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json(
      { error: "Failed to load teacher lessons", details: error.message },
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
    courseId?: string | null;
    groupName?: string;
    status?: string;
    publishAt?: string | null;
    zoomLink?: string;
    contentSummary?: string;
  };

  const title = payload.title?.trim();
  const courseId = payload.courseId?.trim() || null;
  const groupName = payload.groupName?.trim() || "Без групи";
  const status = payload.status?.trim() ?? "draft";
  const publishAt = payload.publishAt ? new Date(payload.publishAt) : null;
  const zoomLink = payload.zoomLink?.trim() || null;
  const contentSummary = payload.contentSummary?.trim() ?? "";

  if (!title) {
    return NextResponse.json({ error: "Title is required" }, { status: 400 });
  }

  if (!allowedStatuses.has(status)) {
    return NextResponse.json({ error: "Invalid lesson status" }, { status: 400 });
  }

  if (publishAt && Number.isNaN(publishAt.getTime())) {
    return NextResponse.json(
      { error: "Invalid publishAt datetime" },
      { status: 400 },
    );
  }

  const { data, error } = await supabase
    .from("teacher_lessons")
    .insert({
      teacher_id: userId,
      course_id: courseId,
      title,
      group_name: groupName,
      status,
      publish_at: publishAt ? publishAt.toISOString() : null,
      zoom_link: zoomLink,
      content_summary: contentSummary,
    })
    .select("*")
    .single();

  if (error) {
    return NextResponse.json(
      { error: "Failed to create teacher lesson", details: error.message },
      { status: 500 },
    );
  }

  if (courseId) {
    const { count } = await supabase
      .from("teacher_lessons")
      .select("*", { count: "exact", head: true })
      .eq("teacher_id", userId)
      .eq("course_id", courseId);

    if (typeof count === "number") {
      await supabase
        .from("teacher_courses")
        .update({ lessons_count: count })
        .eq("teacher_id", userId)
        .eq("id", courseId);
    }
  }

  return NextResponse.json(data, { status: 201 });
}
