import Link from "next/link";

export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-5xl flex-col justify-center px-6">
      <p className="mb-3 text-sm uppercase text-muted">Multi-Tenant SaaS Starter</p>
      <h1 className="mb-6 text-4xl font-semibold tracking-tight">Ship your SaaS faster.</h1>
      <p className="mb-8 max-w-2xl text-muted">
        Includes Supabase Auth, organizations, invitations, tenant isolation, Stripe subscriptions,
        audit logs, and usage analytics.
      </p>
      <div className="flex gap-4">
        <Link className="rounded-md bg-accent px-4 py-2 text-white" href="/signup">
          Start free
        </Link>
        <Link className="rounded-md border border-border px-4 py-2" href="/login">
          Sign in
        </Link>
      </div>
    </main>
  );
}
