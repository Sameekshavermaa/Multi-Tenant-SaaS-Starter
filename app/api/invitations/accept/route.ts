import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth/guards";
import { createServerClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const user = await requireUser();
  const url = new URL(request.url);
  const token = url.searchParams.get("token") ?? (await request.formData()).get("token");

  if (!token) return NextResponse.json({ error: "Token required" }, { status: 400 });

  const supabase = await createServerClient();

  const { data: invite } = await supabase
    .from("invitations")
    .select("id, organization_id, role, email")
    .eq("token", token)
    .eq("status", "pending")
    .single();

  if (!invite || invite.email.toLowerCase() !== user.email?.toLowerCase()) {
    return NextResponse.json({ error: "Invitation not found" }, { status: 404 });
  }

  await supabase.from("memberships").insert({
    organization_id: invite.organization_id,
    user_id: user.id,
    user_email: user.email,
    role: invite.role
  });

  await supabase.from("invitations").update({ status: "accepted" }).eq("id", invite.id);

  return NextResponse.redirect(new URL("/dashboard", request.url));
}
