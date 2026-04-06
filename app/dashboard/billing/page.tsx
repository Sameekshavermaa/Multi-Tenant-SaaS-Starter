import { Card } from "@/components/ui/card";
import { getSubscriptionForOrg } from "@/lib/billing/queries";

export default async function BillingPage() {
  const subscription = await getSubscriptionForOrg();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Billing</h1>
      <Card>
        <p className="text-sm text-muted">Current plan</p>
        <p className="text-2xl font-semibold capitalize">{subscription?.plan ?? "free"}</p>
        <p className="mt-2 text-sm text-muted">
          {subscription?.status === "active"
            ? "Your paid plan is active."
            : "Upgrade to unlock unlimited members and analytics exports."}
        </p>
        <form className="mt-4" method="post" action="/api/stripe/checkout">
          <button className="rounded-md bg-accent px-4 py-2 text-sm text-white" type="submit">
            {subscription?.status === "active" ? "Manage billing" : "Upgrade to Pro"}
          </button>
        </form>
      </Card>
    </div>
  );
}
