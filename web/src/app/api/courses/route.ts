import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
  const supabase = await createClient();
  const { data: courses, error } = await supabase
    .from("courses")
    .select("*")
    .order("order_index");

  if (error) return NextResponse.json([], { status: 500 });
  return NextResponse.json(courses);
}