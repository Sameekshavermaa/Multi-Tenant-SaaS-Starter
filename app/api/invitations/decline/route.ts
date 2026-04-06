import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const url = new URL(request.url);
  const token = url.searchParams.get("token") ?? (await request.formData()).get("token");

  if (!token) return NextResponse.json({ error: "Token required" }, { status: 400 });

  const supabase = await createServerClient();
  const { error } = await supabase.from("invitations").update({ status: "declined" }).eq("token", token);

  if (error) return NextResponse.json({ error: "Unable to decline" }, { status: 400 });

  return NextResponse.json({ ok: true });
}
