import { CreditCard } from "lucide-react";
import { Link } from "react-router-dom";
import { daysUntilRenewal } from "../lib/billing";
import { DASHBOARD_COPY } from "../lib/constants";
import { formatCurrency } from "../lib/utils";
import type { Subscription } from "../types/domain";
import { BrandLogo } from "./BrandLogo";

const CARD_THEMES = [
  "from-[#DDF4EE] to-[#C9EAE2]",
  "from-[#F7EFD8] to-[#F2E4BE]",
  "from-[#F3F5F7] to-[#E5ECEA]",
] as const;

function themeFor(id: string) {
  const index = [...id].reduce((total, character) => total + character.charCodeAt(0), 0) % CARD_THEMES.length;
  return CARD_THEMES[index];
}

export function SubscriptionCard({ subscription }: { subscription: Subscription }) {
  const daysLeft = daysUntilRenewal(subscription);
  const renewalDate = new Date(subscription.nextRenewalDate).toLocaleDateString("en-IN", { month: "2-digit", year: "2-digit" });

  return (
    <Link
      to={`/subscription/${subscription.id}`}
      aria-label={`View ${subscription.name}`}
      className={`group relative isolate min-h-64 overflow-hidden rounded-2xl border border-white/80 bg-gradient-to-br ${themeFor(subscription.id)} p-6 text-text shadow-sm transition hover:-translate-y-1 hover:shadow-glow focus:outline-none focus:ring-2 focus:ring-[#B8E6DA] focus:ring-offset-2`}
    >
      <div className="absolute -right-12 -top-16 h-44 w-44 rounded-full bg-white/40 blur-2xl" />
      <CreditCard className="absolute -bottom-8 -right-5 -z-10 h-36 w-36 rotate-[-10deg] text-white/50" />
      <div className="relative flex items-start justify-between">
        <div className="flex items-center gap-3">
          <BrandLogo name={subscription.name} logoUrl={subscription.logoUrl} className="h-12 w-12 bg-white shadow-sm" />
          <span className="text-xs font-bold uppercase tracking-[0.16em] text-primary-deep">{subscription.category}</span>
        </div>
        <CreditCard className="h-7 w-7 text-gold" />
      </div>
      <p className="relative mt-10 text-xl font-extrabold uppercase tracking-[0.2em]">{subscription.name}</p>
      <p className="relative mt-2 text-xs font-semibold uppercase tracking-wide text-muted">
        {subscription.billingCycle} · {formatCurrency(subscription.amount)}
      </p>
      <div className="relative mt-9 flex items-end justify-between">
        <div>
          <p className="text-[10px] font-bold uppercase text-muted">{DASHBOARD_COPY.renews}</p>
          <p className="mt-1 font-mono text-base">{renewalDate}</p>
        </div>
        <div className="text-right">
          <p className="text-3xl font-extrabold">{formatCurrency(subscription.amount)}</p>
          <span className="mt-1 inline-block rounded-full bg-white/60 px-2 py-1 text-[11px] font-bold text-primary-deep">
            {Math.max(daysLeft, 0)}d {DASHBOARD_COPY.left}
          </span>
        </div>
      </div>
    </Link>
  );
}
