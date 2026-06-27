import { NavLink, Outlet } from "react-router-dom";
import { BookOpenText, ChartNoAxesColumnIncreasing, CirclePlus, LayoutGrid, Settings, Vault } from "lucide-react";
import { cn } from "../lib/utils";
import { APP_COPY, NAV_ITEMS } from "../lib/constants";
import { SpendMintLogo } from "./SpendMintLogo";

const links = [
  { to: "/dashboard", label: NAV_ITEMS.dashboard, icon: LayoutGrid },
  { to: "/add", label: NAV_ITEMS.add, icon: CirclePlus },
  { to: "/vault", label: NAV_ITEMS.vault, icon: Vault },
  { to: "/content", label: NAV_ITEMS.earn, icon: BookOpenText },
  { to: "/analytics", label: NAV_ITEMS.analytics, icon: ChartNoAxesColumnIncreasing },
  { to: "/settings", label: NAV_ITEMS.settings, icon: Settings },
];

export function AppLayout() {
  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-20 border-b border-border bg-background/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
          <NavLink to="/" className="flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-xl border border-border bg-white shadow-sm"><SpendMintLogo className="h-10 w-10" /></span>
            <span>
              <span className="block text-base font-extrabold text-slate-800">{APP_COPY.name}</span>
              <span className="hidden text-xs font-medium text-slate-500 sm:block">{APP_COPY.tagline}</span>
            </span>
          </NavLink>
          <nav className="hidden items-center gap-1 md:flex">
            {links.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  cn(
                    "inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold text-muted transition hover:bg-primary-soft/60 hover:text-primary-deep",
                    isActive && "bg-white text-primary-deep shadow-sm",
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
      <nav className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-6 border-t border-border bg-white/95 backdrop-blur md:hidden">
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
