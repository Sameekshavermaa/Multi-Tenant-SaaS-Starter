import { cache } from "react";
import { requireUser } from "@/lib/auth/guards";
import { createServerClient } from "@/lib/supabase/server";

export const getActiveOrganization = cache(async () => {
  const user = await requireUser();
  const supabase = await createServerClient();

  const { data } = await supabase
    .from("memberships")
    .select("organization:organizations(id, name)")
    .eq("user_id", user.id)
    .limit(1)
    .maybeSingle();

  return data?.organization ?? null;
});

export async function requireOrgMembership(organizationId: string) {
  const user = await requireUser();
  const supabase = await createServerClient();

  const { data, error } = await supabase
    .from("memberships")
    .select("role")
    .eq("organization_id", organizationId)
    .eq("user_id", user.id)
    .single();

  if (error || !data) {
    throw new Error("Unauthorized org access");
  }

  return { user, role: data.role as "admin" | "member" };
}

export async function getDashboardSnapshot() {
  const org = await getActiveOrganization();
  if (!org) return { memberCount: 0, pendingInvites: 0, monthlyEvents: 0, auditLogs: [] };

  const supabase = await createServerClient();
  const [members, invitations, logs, analytics] = await Promise.all([
    supabase.from("memberships").select("organization_id", { count: "exact", head: true }).eq("organization_id", org.id),
    supabase.from("invitations").select("organization_id", { count: "exact", head: true }).eq("organization_id", org.id).eq("status", "pending"),
    supabase.from("audit_logs").select("id, action, created_at").eq("organization_id", org.id).order("created_at", { ascending: false }).limit(8),
    supabase.from("usage_events").select("id", { count: "exact", head: true }).eq("organization_id", org.id).gte("created_at", new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString())
  ]);

  return {
    memberCount: members.count ?? 0,
    pendingInvites: invitations.count ?? 0,
    monthlyEvents: analytics.count ?? 0,
    auditLogs: logs.data ?? []
  };
}

export async function getTeamSnapshot() {
  const org = await getActiveOrganization();
  if (!org) return { members: [], invitations: [] };

  const supabase = await createServerClient();
  const [members, invitations] = await Promise.all([
    supabase.from("memberships").select("user_id, user_email, role").eq("organization_id", org.id).order("created_at"),
    supabase.from("invitations").select("id, email, status").eq("organization_id", org.id).eq("status", "pending")
  ]);

  return {
    members: members.data ?? [],
    invitations: invitations.data ?? []
  };
}
