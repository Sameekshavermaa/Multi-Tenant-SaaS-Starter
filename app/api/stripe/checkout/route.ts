import { NextResponse } from "next/server";
import { getSubscriptionForOrg } from "@/lib/billing/queries";
import { PRO_PRICE_ID, stripe } from "@/lib/billing/stripe";
import { requireUser } from "@/lib/auth/guards";
import { createServerClient } from "@/lib/supabase/server";
import { getActiveOrganization } from "@/lib/tenancy/queries";

export async function POST(request: Request) {
  const user = await requireUser();
  const organization = await getActiveOrganization();

  if (!organization) return NextResponse.json({ error: "No active org" }, { status: 404 });

  const appUrl = process.env.NEXT_PUBLIC_APP_URL!;
  const supabase = await createServerClient();
  const existing = await getSubscriptionForOrg();

  const customerId = existing?.stripe_customer_id
    ? existing.stripe_customer_id
    : (
        await stripe.customers.create({
          email: user.email,
          metadata: { organizationId: organization.id }
        })
      ).id;

  if (!existing?.stripe_customer_id) {
    await supabase
      .from("subscriptions")
      .upsert({ organization_id: organization.id, stripe_customer_id: customerId, plan: "free", status: "inactive" });
  }

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    customer: customerId,
    line_items: [{ price: PRO_PRICE_ID, quantity: 1 }],
    success_url: `${appUrl}/dashboard/billing?success=1`,
    cancel_url: `${appUrl}/dashboard/billing?cancel=1`,
    metadata: { organizationId: organization.id }
  });

  return NextResponse.redirect(session.url!);
}
