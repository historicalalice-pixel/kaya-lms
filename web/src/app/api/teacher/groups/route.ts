import { NextResponse } from "next/server";
import { requireTeacherContext } from "../_utils";

function makeInviteCode(sourceName: string) {
  const normalized = sourceName
    .trim()
    .toUpperCase()
    .replace(/[^A-ZА-ЯІЇЄҐ0-9]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 18);

  const suffix = Math.floor(1000 + Math.random() * 9000);
  return `${normalized || "GROUP"}-${suffix}`;
}

export async function GET() {
  const { context, response } = await requireTeacherContext();
  if (response || !context) return response;

  const { supabase, userId } = context;
  const { data, error } = await supabase
    .from("teacher_groups")
    .select("*")
    .eq("teacher_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json(
      { error: "Failed to load teacher groups", details: error.message },
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
    name?: string;
  };

  const name = payload.name?.trim();
  if (!name) {
    return NextResponse.json({ error: "Name is required" }, { status: 400 });
  }

  const inviteCode = makeInviteCode(name);
  const origin = new URL(request.url).origin;
  const inviteUrl = `${origin}/invite/${inviteCode}`;

  const { data, error } = await supabase
    .from("teacher_groups")
    .insert({
      teacher_id: userId,
      name,
      invite_code: inviteCode,
      invite_url: inviteUrl,
    })
    .select("*")
    .single();

  if (error) {
    return NextResponse.json(
      { error: "Failed to create teacher group", details: error.message },
      { status: 500 },
    );
  }

  return NextResponse.json(data, { status: 201 });
}
