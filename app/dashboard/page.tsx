import { Card } from "@/components/ui/card";
import { getDashboardSnapshot } from "@/lib/tenancy/queries";

export default async function DashboardPage() {
  const snapshot = await getDashboardSnapshot();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Dashboard</h1>
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <p className="text-sm text-muted">Members</p>
          <p className="text-2xl font-semibold">{snapshot.memberCount}</p>
        </Card>
        <Card>
          <p className="text-sm text-muted">Pending invites</p>
          <p className="text-2xl font-semibold">{snapshot.pendingInvites}</p>
        </Card>
        <Card>
          <p className="text-sm text-muted">Monthly events</p>
          <p className="text-2xl font-semibold">{snapshot.monthlyEvents}</p>
        </Card>
      </div>
      <Card>
        <h2 className="mb-2 text-lg font-medium">Recent activity</h2>
        <ul className="space-y-2 text-sm text-muted">
          {snapshot.auditLogs.map((log) => (
            <li key={log.id}>{log.action} · {new Date(log.created_at).toLocaleString()}</li>
          ))}
        </ul>
      </Card>
    </div>
  );
}
