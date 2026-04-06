import { Card } from "@/components/ui/card";

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Organization settings</h1>
      <Card>
        <h2 className="mb-3 text-lg font-medium">Create organization</h2>
        <form action="/api/organizations" method="post" className="space-y-3">
          <input
            className="w-full rounded-md border border-border bg-transparent px-3 py-2 text-sm"
            name="name"
            placeholder="Acme Inc."
            required
          />
          <button className="rounded-md bg-accent px-4 py-2 text-sm text-white" type="submit">
            Create
          </button>
        </form>
      </Card>
      <Card>
        <h2 className="mb-3 text-lg font-medium">Update organization</h2>
        <form action="/api/organizations" method="post" className="space-y-3">
          <input type="hidden" name="_method" value="patch" />
          <input className="w-full rounded-md border border-border bg-transparent px-3 py-2 text-sm" name="name" placeholder="New org name" required />
          <button className="rounded-md border border-border px-4 py-2 text-sm" type="submit">
            Rename
          </button>
        </form>
      </Card>
      <Card>
        <h2 className="mb-3 text-lg font-medium">Danger zone</h2>
        <form action="/api/organizations" method="post">
          <input type="hidden" name="_method" value="delete" />
          <button className="rounded-md border border-red-400 px-4 py-2 text-sm text-red-500" type="submit">
            Delete organization
          </button>
        </form>
      </Card>
    </div>
  );
}
