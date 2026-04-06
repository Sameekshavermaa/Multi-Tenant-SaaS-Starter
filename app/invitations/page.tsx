import Link from "next/link";

export default function InvitationsPage() {
  return (
    <main className="mx-auto max-w-xl p-6">
      <h1 className="mb-4 text-2xl font-semibold">Invitation received</h1>
      <p className="mb-6 text-muted">Choose whether to join this workspace.</p>
      <div className="flex gap-3">
        <form method="post" action="/api/invitations/accept">
          <button className="rounded-md bg-accent px-4 py-2 text-sm text-white" type="submit">
            Accept
          </button>
        </form>
        <form method="post" action="/api/invitations/decline">
          <button className="rounded-md border border-border px-4 py-2 text-sm" type="submit">
            Decline
          </button>
        </form>
        <Link href="/dashboard" className="rounded-md border border-border px-4 py-2 text-sm">
          Back
        </Link>
      </div>
    </main>
  );
}
