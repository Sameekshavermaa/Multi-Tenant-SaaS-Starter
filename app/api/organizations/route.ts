import { NextResponse } from "next/server";
import { z } from "zod";
import { requireUser } from "@/lib/auth/guards";
import { createServerClient } from "@/lib/supabase/server";
import { createAuditLog } from "@/lib/tenancy/audit";
import { getActiveOrganization, requireOrgMembership } from "@/lib/tenancy/queries";

const bodySchema = z.object({
  name: z.string().min(2).max(80)
});

export async function POST(request: Request) {
  const user = await requireUser();
  const formData = await request.formData();
  const methodOverride = String(formData.get("_method") ?? "post").toLowerCase();

  if (methodOverride === "patch") return PATCH(request);
  if (methodOverride === "delete") return DELETE();

  const parsed = bodySchema.safeParse({ name: formData.get("name") });
  if (!parsed.success) return NextResponse.json({ error: "Invalid payload" }, { status: 422 });

  const supabase = await createServerClient();

  const { data: organization, error } = await supabase
    .from("organizations")
    .insert({ name: parsed.data.name, owner_id: user.id })
    .select("id")
    .single();

  if (error || !organization) return NextResponse.json({ error: "Failed to create org" }, { status: 400 });

  await supabase.from("memberships").insert({
    organization_id: organization.id,
    user_id: user.id,
    user_email: user.email,
    role: "admin"
  });

  await createAuditLog(organization.id, user.id, "organization.created", { name: parsed.data.name });

  return NextResponse.redirect(new URL("/dashboard", request.url));
}

export async function PATCH(request: Request) {
  const user = await requireUser();
  const org = await getActiveOrganization();

  if (!org) return NextResponse.json({ error: "No active org" }, { status: 404 });

  const { role } = await requireOrgMembership(org.id);
  if (role !== "admin") return NextResponse.json({ error: "Admins only" }, { status: 403 });

  const formData = await request.formData();
  const parsed = bodySchema.safeParse({ name: formData.get("name") });
  if (!parsed.success) return NextResponse.json({ error: "Invalid payload" }, { status: 422 });

  const supabase = await createServerClient();
  const { error } = await supabase.from("organizations").update({ name: parsed.data.name }).eq("id", org.id);

  if (error) return NextResponse.json({ error: "Failed to update org" }, { status: 400 });

  await createAuditLog(org.id, user.id, "organization.updated", { name: parsed.data.name });

  return NextResponse.redirect(new URL("/dashboard/settings", request.url));
}

export async function DELETE() {
  const user = await requireUser();
  const org = await getActiveOrganization();

  if (!org) return NextResponse.json({ error: "No active org" }, { status: 404 });

  const { role } = await requireOrgMembership(org.id);
  if (role !== "admin") return NextResponse.json({ error: "Admins only" }, { status: 403 });

  const supabase = await createServerClient();
  const { error } = await supabase.from("organizations").delete().eq("id", org.id);

  if (error) return NextResponse.json({ error: "Failed to delete org" }, { status: 400 });

  await createAuditLog(org.id, user.id, "organization.deleted");

  return NextResponse.json({ ok: true });
}
