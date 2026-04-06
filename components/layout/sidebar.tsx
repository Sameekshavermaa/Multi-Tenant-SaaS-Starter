import Link from "next/link";
import { Building2, CreditCard, LayoutDashboard, Settings, Users } from "lucide-react";

const links = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/team", label: "Team", icon: Users },
  { href: "/dashboard/billing", label: "Billing", icon: CreditCard },
  { href: "/dashboard/settings", label: "Settings", icon: Settings }
];

export function Sidebar({ orgName }: { orgName: string }) {
  return (
    <aside className="w-64 border-r border-border p-4">
      <div className="mb-6 flex items-center gap-2 font-semibold">
        <Building2 size={16} />
        <span>{orgName}</span>
      </div>
      <nav className="space-y-1">
        {links.map((link) => {
          const Icon = link.icon;
          return (
            <Link
              key={link.href}
              href={link.href}
              className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-muted transition hover:bg-slate-100 hover:text-foreground dark:hover:bg-slate-800"
            >
              <Icon size={16} />
              {link.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
