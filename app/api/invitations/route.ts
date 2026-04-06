import { randomUUID } from "crypto";
import { NextResponse } from "next/server";
import { z } from "zod";
import { requireUser } from "@/lib/auth/guards";
import { createServerClient } from "@/lib/supabase/server";
import { createAuditLog } from "@/lib/tenancy/audit";
import { getActiveOrganization, requireOrgMembership } from "@/lib/tenancy/queries";

const inviteSchema = z.object({
  email: z.string().email(),
  role: z.enum(["admin", "member"])
});

export async function POST(request: Request) {
  const user = await requireUser();
  const organization = await getActiveOrganization();

  if (!organization) return NextResponse.json({ error: "No active org" }, { status: 404 });

  const membership = await requireOrgMembership(organization.id);
  if (membership.role !== "admin") return NextResponse.json({ error: "Admins only" }, { status: 403 });

  const form = await request.formData();
  const parsed = inviteSchema.safeParse({ email: form.get("email"), role: form.get("role") });
  if (!parsed.success) return NextResponse.json({ error: "Invalid payload" }, { status: 422 });

  const token = randomUUID();
  const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7).toISOString();

  const supabase = await createServerClient();
  const { error } = await supabase.from("invitations").insert({
    organization_id: organization.id,
    email: parsed.data.email,
    role: parsed.data.role,
    token,
    invited_by: user.id,
    status: "pending",
    expires_at: expiresAt
  });

  if (error) return NextResponse.json({ error: "Failed to create invite" }, { status: 400 });

  await createAuditLog(organization.id, user.id, "invite.sent", { email: parsed.data.email, role: parsed.data.role });

  return NextResponse.redirect(new URL("/dashboard/team", request.url));
}
