import { redirect } from "next/navigation";
import { Sidebar } from "@/components/layout/sidebar";
import { getActiveOrganization } from "@/lib/tenancy/queries";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const activeOrg = await getActiveOrganization();

  if (!activeOrg) {
    redirect("/dashboard/settings?create_org=1");
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar orgName={activeOrg.name} />
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
