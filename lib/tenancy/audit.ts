import { createServerClient } from "@/lib/supabase/server";

export async function createAuditLog(organizationId: string, actorId: string, action: string, metadata: Record<string, unknown> = {}) {
  const supabase = await createServerClient();

  await supabase.from("audit_logs").insert({
    organization_id: organizationId,
    actor_id: actorId,
    action,
    metadata
  });
}
