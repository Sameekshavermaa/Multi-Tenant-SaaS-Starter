import { InviteForm } from "@/components/team/invite-form";
import { Card } from "@/components/ui/card";
import { getTeamSnapshot } from "@/lib/tenancy/queries";

export default async function TeamPage() {
  const { members, invitations } = await getTeamSnapshot();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Team</h1>
      <Card>
        <h2 className="mb-4 text-lg font-medium">Members</h2>
        <div className="space-y-3">
          {members.map((member) => (
            <div key={member.user_id} className="flex items-center justify-between rounded-md border border-border px-3 py-2 text-sm">
              <span>{member.user_email}</span>
              <span className="text-muted">{member.role}</span>
            </div>
          ))}
        </div>
      </Card>
      <Card>
        <h2 className="mb-4 text-lg font-medium">Invite teammate</h2>
        <InviteForm />
      </Card>
      <Card>
        <h2 className="mb-4 text-lg font-medium">Pending invitations</h2>
        <div className="space-y-3">
          {invitations.map((invitation) => (
            <div key={invitation.id} className="flex items-center justify-between rounded-md border border-border px-3 py-2 text-sm">
              <span>{invitation.email}</span>
              <span className="text-muted">{invitation.status}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
