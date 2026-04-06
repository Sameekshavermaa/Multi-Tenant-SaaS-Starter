import { Button } from "@/components/ui/button";

export function InviteForm() {
  return (
    <form action="/api/invitations" method="post" className="flex gap-2">
      <input
        className="flex-1 rounded-md border border-border bg-transparent px-3 py-2 text-sm"
        name="email"
        type="email"
        required
        placeholder="teammate@company.com"
      />
      <select name="role" className="rounded-md border border-border bg-transparent px-3 py-2 text-sm">
        <option value="member">Member</option>
        <option value="admin">Admin</option>
      </select>
      <Button type="submit">Send invite</Button>
    </form>
  );
}
