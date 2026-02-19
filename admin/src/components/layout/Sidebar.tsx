import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  Leaf,
  Users,
  Shield,
  Settings,
  LayoutDashboard,
} from "lucide-react";

const nav = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/species", label: "Flora Species", icon: Leaf },
  { to: "/users", label: "Users", icon: Users },
  { to: "/roles", label: "Roles", icon: Shield },
  { to: "/settings", label: "Settings", icon: Settings },
];

export function Sidebar() {
  const location = useLocation();
  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-gray-200 bg-white">
      <div className="flex h-full flex-col">
        <div className="flex h-16 items-center border-b border-gray-200 px-6">
          <span className="text-lg font-semibold text-primary">Flora Admin</span>
        </div>
        <nav className="flex-1 space-y-1 p-4">
          {nav.map(({ to, label, icon: Icon }) => {
            const isActive =
              to === "/"
                ? location.pathname === "/"
                : location.pathname.startsWith(to);
            return (
              <Link
                key={to}
                to={to}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                )}
              >
                <Icon className="h-5 w-5 shrink-0" />
                {label}
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
