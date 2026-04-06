import { NextResponse } from "next/server";
import { z } from "zod";
import { requireUser } from "@/lib/auth/guards";
import { hasPaidPlan } from "@/lib/billing/queries";
import { createServerClient } from "@/lib/supabase/server";
import { getActiveOrganization } from "@/lib/tenancy/queries";

const usageSchema = z.object({
  eventName: z.string().min(2).max(100)
});

export async function POST(request: Request) {
  const user = await requireUser();
  const org = await getActiveOrganization();

  if (!org) return NextResponse.json({ error: "No active org" }, { status: 404 });

  const isPaid = await hasPaidPlan(org.id);

  if (!isPaid) {
    const supabase = await createServerClient();
    const { count } = await supabase
      .from("usage_events")
      .select("id", { count: "exact", head: true })
      .eq("organization_id", org.id)
      .gte("created_at", new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString());

    if ((count ?? 0) >= 1000) {
      return NextResponse.json({ error: "Free plan usage limit reached" }, { status: 402 });
    }
  }

  const payload = usageSchema.safeParse(await request.json());
  if (!payload.success) return NextResponse.json({ error: "Invalid payload" }, { status: 422 });

  const supabase = await createServerClient();
  await supabase.from("usage_events").insert({
    organization_id: org.id,
    actor_id: user.id,
    event_name: payload.data.eventName
  });

  return NextResponse.json({ ok: true });
}
