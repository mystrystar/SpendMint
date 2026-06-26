import { NavLink, Outlet } from "react-router-dom";
import { BarChart3, Gauge, Landmark, Plus, Settings, Sparkles } from "lucide-react";
import { cn } from "../lib/utils";

const links = [
  { to: "/dashboard", label: "Dashboard", icon: Gauge },
  { to: "/add", label: "Add", icon: Plus },
  { to: "/vault", label: "Vault", icon: Landmark },
  { to: "/content", label: "Earn", icon: Sparkles },
  { to: "/analytics", label: "Analytics", icon: BarChart3 },
  { to: "/settings", label: "Settings", icon: Settings },
];

export function AppLayout() {
  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-20 border-b border-slate-200/70 bg-background/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
          <NavLink to="/" className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-lg bg-primary font-bold text-white">V</span>
            <span>
              <span className="block text-base font-extrabold text-slate-800">Vaultwise</span>
              <span className="hidden text-xs font-medium text-slate-500 sm:block">Turn forgotten subscriptions into future wealth</span>
            </span>
          </NavLink>
          <nav className="hidden items-center gap-1 md:flex">
            {links.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  cn(
                    "inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-slate-600 transition hover:bg-white",
                    isActive && "bg-white text-primary shadow-sm",
                  )
                }
              >
                <Icon className="h-4 w-4" />
                {label}
              </NavLink>
            ))}
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-4 py-6 pb-24 md:py-8">
        <Outlet />
      </main>
      <nav className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-6 border-t border-slate-200 bg-white md:hidden">
        {links.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) => cn("grid place-items-center gap-1 px-1 py-2 text-[11px] font-semibold text-slate-500", isActive && "text-primary")}
          >
            <Icon className="h-5 w-5" />
            {label}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
