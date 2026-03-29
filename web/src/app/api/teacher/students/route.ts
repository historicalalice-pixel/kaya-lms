import { NextResponse } from "next/server";
import { requireTeacherContext } from "../_utils";

const allowedStatuses = new Set(["active", "inactive", "blocked"]);

function toLogin(email: string | undefined, fullName: string) {
  if (email && email.includes("@")) {
    return email.split("@")[0]!.trim().toLowerCase();
  }

  return fullName
    .trim()
    .toLowerCase()
    .replace(/[^a-zа-яіїєґ0-9]+/g, ".")
    .replace(/\.+/g, ".")
    .replace(/^\.|\.$/g, "")
    .slice(0, 30);
}

export async function GET() {
  const { context, response } = await requireTeacherContext();
  if (response || !context) return response;

  const { supabase, userId } = context;
  const { data, error } = await supabase
    .from("teacher_students")
    .select("*")
    .eq("teacher_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json(
      { error: "Failed to load teacher students", details: error.message },
      { status: 500 },
    );
  }

  const { data: groupsData, error: groupsError } = await supabase
    .from("teacher_groups")
    .select("id, name")
    .eq("teacher_id", userId);

  if (groupsError) {
    return NextResponse.json(
      { error: "Failed to load teacher groups", details: groupsError.message },
      { status: 500 },
    );
  }

  const groupsMap = new Map<string, string>();
  (groupsData ?? []).forEach((group) => {
    groupsMap.set(group.id, group.name);
  });

  const normalized = (data ?? []).map((row) => {
    const groupName = row.group_id ? groupsMap.get(row.group_id) : null;

    return {
      ...row,
      group_name: groupName ?? "Без групи",
    };
  });

  return NextResponse.json(normalized);
}

export async function POST(request: Request) {
  const { context, response } = await requireTeacherContext();
  if (response || !context) return response;

  const { supabase, userId } = context;
  const payload = (await request.json()) as {
    fullName?: string;
    email?: string;
    phone?: string;
    telegram?: string;
    note?: string;
    groupId?: string | null;
  };

  const fullName = payload.fullName?.trim();
  const email = payload.email?.trim().toLowerCase();
  const phone = payload.phone?.trim() || null;
  const telegram = payload.telegram?.trim() || null;
  const note = payload.note?.trim() ?? "";
  const groupId = payload.groupId?.trim() || null;

  if (!fullName) {
    return NextResponse.json({ error: "fullName is required" }, { status: 400 });
  }

  if (!email) {
    return NextResponse.json({ error: "email is required" }, { status: 400 });
  }

  const login = toLogin(email, fullName);

  const { data, error } = await supabase
    .from("teacher_students")
    .insert({
      teacher_id: userId,
      group_id: groupId,
      full_name: fullName,
      phone,
      email,
      login,
      telegram,
      note,
      status: "active",
      progress: 0,
    })
    .select("*")
    .single();

  if (error) {
    return NextResponse.json(
      { error: "Failed to create teacher student", details: error.message },
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
    status?: string;
  };

  const id = payload.id?.trim();
  const status = payload.status?.trim();

  if (!id) {
    return NextResponse.json({ error: "id is required" }, { status: 400 });
  }

  if (!status || !allowedStatuses.has(status)) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("teacher_students")
    .update({ status })
    .eq("id", id)
    .eq("teacher_id", userId)
    .select("*")
    .single();

  if (error) {
    return NextResponse.json(
      { error: "Failed to update teacher student", details: error.message },
      { status: 500 },
    );
  }

  return NextResponse.json(data);
}
