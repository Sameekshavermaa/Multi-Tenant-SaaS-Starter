import { getActiveOrganization } from "@/lib/tenancy/queries";
import { createServerClient } from "@/lib/supabase/server";

export async function getSubscriptionForOrg() {
  const org = await getActiveOrganization();
  if (!org) return null;

  const supabase = await createServerClient();
  const { data } = await supabase
    .from("subscriptions")
    .select("plan, status, stripe_customer_id, stripe_subscription_id")
    .eq("organization_id", org.id)
    .maybeSingle();

  return data;
}

export async function hasPaidPlan(orgId: string) {
  const supabase = await createServerClient();
  const { data } = await supabase
    .from("subscriptions")
    .select("plan, status")
    .eq("organization_id", orgId)
    .eq("status", "active")
    .maybeSingle();

  return data?.plan === "pro";
}
