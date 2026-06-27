import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { CalendarClock, CirclePlus, Gem, Lightbulb } from "lucide-react";
import { EmptyState } from "../components/EmptyState";
import { SaveModal } from "../components/SaveModal";
import { SubscriptionCard } from "../components/SubscriptionCard";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { annualAmount, daysUntilRenewal, monthlyAmount } from "../lib/billing";
import { DASHBOARD_COPY, NAV_ITEMS } from "../lib/constants";
import { formatCurrency, formatDecimal } from "../lib/utils";
import { useVaultwise } from "../hooks/useVaultwise";
import { detectedWaste, evaluateWaste } from "../services/wasteEngine";
import type { AllocationTarget, Subscription } from "../types/domain";

const SUMMARY_LABELS = {
  monthly: "Monthly Spend",
  annual: "Annual Spend",
  waste: "Wasted Spend",
  wealth: "Wealth Saved",
  active: "Active subscriptions",
  gold: "Gold grams",
  silver: "Silver grams",
  loading: "Loading your savings...",
} as const;

export function Dashboard() {
  const { data, isLoading, markSaved } = useVaultwise();
  const [pending, setPending] = useState<{ subscription: Subscription; action: "paused" | "cancelled" } | null>(null);
  const subscriptions = data?.subscriptions ?? [];
  const active = subscriptions.filter((item) => item.isActive);
  const vault = data?.vault;
  const sorted = useMemo(() => [...active].sort((a, b) => daysUntilRenewal(a) - daysUntilRenewal(b)), [active]);
  const monthly = active.reduce((total, item) => total + monthlyAmount(item), 0);
  const annual = active.reduce((total, item) => total + annualAmount(item), 0);
  const waste = detectedWaste(active);
  const wealth = vault ? vault.goldBalanceInr + vault.silverBalanceInr + vault.cashSaved : 0;

  if (isLoading) return <Card>{SUMMARY_LABELS.loading}</Card>;
  if (!subscriptions.length) return <EmptyState />;

  function allocate(target: AllocationTarget) {
    if (!pending) return;
    markSaved.mutate({ subscription: pending.subscription, actionType: pending.action, target });
    setPending(null);
  }

  const summaries = [
    [SUMMARY_LABELS.monthly, formatCurrency(monthly)],
    [SUMMARY_LABELS.annual, formatCurrency(annual)],
    [SUMMARY_LABELS.waste, formatCurrency(waste)],
    [SUMMARY_LABELS.wealth, formatCurrency(wealth)],
  ];

  return (
    <div className="grid gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900">{DASHBOARD_COPY.title}</h1>
          <p className="mt-1 text-sm text-slate-600">{DASHBOARD_COPY.subtitle}</p>
        </div>
        <Link to="/add"><Button><CirclePlus className="h-4 w-4" />{NAV_ITEMS.add}</Button></Link>
      </div>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {summaries.map(([label, value]) => (
          <Card key={label}><p className="text-sm font-semibold text-slate-500">{label}</p><p className="mt-3 text-3xl font-extrabold text-slate-900">{value}</p></Card>
        ))}
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <Card><p className="text-sm font-semibold text-slate-500">{SUMMARY_LABELS.active}</p><p className="mt-3 text-3xl font-extrabold text-slate-900">{active.length}</p></Card>
        <Card><p className="text-sm font-semibold text-slate-500">{SUMMARY_LABELS.gold}</p><p className="mt-3 text-3xl font-extrabold text-gold">{formatDecimal(vault?.goldGrams ?? 0)}</p></Card>
        <Card><p className="text-sm font-semibold text-slate-500">{SUMMARY_LABELS.silver}</p><p className="mt-3 text-3xl font-extrabold text-slate-500">{formatDecimal(vault?.silverGrams ?? 0)}</p></Card>
      </section>

      <section className="grid gap-4 lg:grid-cols-[1.5fr_0.5fr]">
        <Card>
          <div className="mb-4 flex items-center justify-between"><h2 className="text-xl font-bold text-slate-900">{DASHBOARD_COPY.upcomingRenewals}</h2><CalendarClock className="h-5 w-5 text-primary-deep" /></div>
          <div className="grid gap-4 sm:grid-cols-2">{sorted.map((subscription) => <SubscriptionCard key={subscription.id} subscription={subscription} />)}</div>
        </Card>
        <Card>
          <div className="flex items-center gap-2"><Lightbulb className="h-5 w-5 text-primary-deep" /><h2 className="text-xl font-bold text-slate-900">{DASHBOARD_COPY.recommendations}</h2></div>
          <div className="mt-4 grid gap-3">
            {active.map(evaluateWaste).filter((insight) => insight.level !== "none").slice(0, 4).map((insight) => {
              const subscription = active.find((item) => item.id === insight.subscriptionId);
              if (!subscription) return null;
              return (
                <div key={insight.subscriptionId} className="rounded-xl border border-border bg-primary-soft/45 p-4">
                  <p className="font-bold text-slate-900">{insight.recommendation.replace("save ", "save ₹")}</p>
                  <Button className="mt-3 w-full" variant="secondary" onClick={() => setPending({ subscription, action: "paused" })}><Gem className="h-4 w-4" />{DASHBOARD_COPY.saveToVault}</Button>
                </div>
              );
            })}
          </div>
        </Card>
      </section>

      <SaveModal subscription={pending?.subscription ?? null} action={pending?.action ?? "paused"} onClose={() => setPending(null)} onSelect={allocate} />
    </div>
  );
}
