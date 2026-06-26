import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { AlertTriangle, CalendarDays, Gem, Plus } from "lucide-react";
import { EmptyState } from "../components/EmptyState";
import { SaveModal } from "../components/SaveModal";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { annualAmount, daysUntilRenewal, monthlyAmount } from "../lib/billing";
import { formatCurrency, formatDecimal } from "../lib/utils";
import { useVaultwise } from "../hooks/useVaultwise";
import { detectedWaste, evaluateWaste } from "../services/wasteEngine";
import type { AllocationTarget, Subscription } from "../types/domain";

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

  if (isLoading) return <Card>Loading your vault...</Card>;
  if (!subscriptions.length) return <EmptyState />;

  function allocate(target: AllocationTarget) {
    if (!pending) return;
    markSaved.mutate({ subscription: pending.subscription, actionType: pending.action, target });
    setPending(null);
  }

  return (
    <div className="grid gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900">Dashboard</h1>
          <p className="mt-1 text-sm text-slate-600">Active plans, renewal risk, and wealth converted from avoided spends.</p>
        </div>
        <Link to="/add">
          <Button>
            <Plus className="h-4 w-4" />
            Add
          </Button>
        </Link>
      </div>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {[
          ["Monthly Spend", formatCurrency(monthly)],
          ["Annual Spend", formatCurrency(annual)],
          ["Wasted Spend", formatCurrency(waste)],
          ["Wealth Saved", formatCurrency(wealth)],
        ].map(([label, value]) => (
          <Card key={label}>
            <p className="text-sm font-semibold text-slate-500">{label}</p>
            <p className="mt-3 text-3xl font-extrabold text-slate-900">{value}</p>
          </Card>
        ))}
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <Card>
          <p className="text-sm font-semibold text-slate-500">Active subscriptions</p>
          <p className="mt-3 text-3xl font-extrabold text-slate-900">{active.length}</p>
        </Card>
        <Card>
          <p className="text-sm font-semibold text-slate-500">Gold grams</p>
          <p className="mt-3 text-3xl font-extrabold text-gold">{formatDecimal(vault?.goldGrams ?? 0)}</p>
        </Card>
        <Card>
          <p className="text-sm font-semibold text-slate-500">Silver grams</p>
          <p className="mt-3 text-3xl font-extrabold text-slate-500">{formatDecimal(vault?.silverGrams ?? 0)}</p>
        </Card>
      </section>

      <section className="grid gap-4 lg:grid-cols-[1.25fr_0.75fr]">
        <Card>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900">Upcoming renewals</h2>
            <CalendarDays className="h-5 w-5 text-primary" />
          </div>
          <div className="grid gap-3">
            {sorted.map((subscription) => {
              const insight = evaluateWaste(subscription);
              return (
                <div key={subscription.id} className="grid gap-3 rounded-lg border border-slate-200 p-4 sm:grid-cols-[1fr_auto] sm:items-center">
                  <Link to={`/subscription/${subscription.id}`}>
                    <p className="font-bold text-slate-900">{subscription.name}</p>
                    <p className="mt-1 text-sm text-slate-500">
                      {subscription.category} • {formatCurrency(subscription.amount)} • renews in {daysUntilRenewal(subscription)} days
                    </p>
                  </Link>
                  <span className="rounded-full bg-stone-100 px-3 py-1 text-xs font-bold text-slate-600">{insight.label}</span>
                </div>
              );
            })}
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-600" />
            <h2 className="text-xl font-bold text-slate-900">Recommendations</h2>
          </div>
          <div className="mt-4 grid gap-3">
            {active
              .map(evaluateWaste)
              .filter((insight) => insight.level !== "none")
              .slice(0, 4)
              .map((insight) => {
                const subscription = active.find((item) => item.id === insight.subscriptionId)!;
                return (
                  <div key={insight.subscriptionId} className="rounded-lg bg-teal-50 p-4">
                    <p className="font-bold text-slate-900">{insight.recommendation.replace("save ", "save ₹")}</p>
                    <Button className="mt-3 w-full" variant="secondary" onClick={() => setPending({ subscription, action: "paused" })}>
                      <Gem className="h-4 w-4" />
                      Save to vault
                    </Button>
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
