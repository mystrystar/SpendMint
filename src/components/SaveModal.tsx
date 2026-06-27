import { Coins, Gem, PiggyBank, Sparkles, Wallet } from "lucide-react";
import { ALLOCATION_COPY, GOLD_RATE_INR, SILVER_RATE_INR } from "../lib/constants";
import { cn, formatCurrency, formatDecimal } from "../lib/utils";
import type { AllocationTarget, Subscription } from "../types/domain";
import { Button } from "./ui/Button";

export function SaveModal({
  subscription,
  action,
  onClose,
  onSelect,
}: {
  subscription: Subscription | null;
  action: "paused" | "cancelled";
  onClose: () => void;
  onSelect: (target: AllocationTarget) => void;
}) {
  if (!subscription) return null;

  const options: { target: AllocationTarget; label: string; value: string; icon: typeof Gem }[] = [
    { target: "gold", label: ALLOCATION_COPY.gold.label, value: `≈ ${formatDecimal(subscription.amount / GOLD_RATE_INR)} ${ALLOCATION_COPY.gold.unit}`, icon: Gem },
    { target: "silver", label: ALLOCATION_COPY.silver.label, value: `≈ ${formatDecimal(subscription.amount / SILVER_RATE_INR)} ${ALLOCATION_COPY.silver.unit}`, icon: Coins },
    { target: "cash", label: ALLOCATION_COPY.cash.label, value: formatCurrency(subscription.amount), icon: Wallet },
  ];

  return (
    <div className="fixed inset-0 z-40 grid place-items-center bg-slate-900/30 p-4 backdrop-blur-[2px]" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="save-modal-title"
        className="relative z-50 w-full max-w-lg overflow-hidden rounded-2xl border border-border bg-white p-7 text-center shadow-[0_24px_70px_rgba(95,184,165,0.18)] sm:p-9"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-primary-soft/90 to-transparent" />
        <Sparkles className="absolute left-1/4 top-8 h-4 w-4 text-gold" />
        <Sparkles className="absolute right-1/4 top-14 h-3 w-3 text-primary" />
        <div className="relative mx-auto mb-5 grid h-14 w-14 place-items-center rounded-full bg-primary-soft text-primary-deep ring-8 ring-primary-soft/50">
          <PiggyBank className="h-7 w-7" />
        </div>
        <h2 id="save-modal-title" className="relative text-xl font-extrabold text-text sm:text-2xl">{ALLOCATION_COPY.heading(formatCurrency(subscription.amount))}</h2>
        <p className="relative mx-auto mt-2 max-w-sm text-sm leading-6 text-muted">{ALLOCATION_COPY.description(action, subscription.name)}</p>
        <div className="relative mt-6 grid grid-cols-3 gap-3">
          {options.map(({ target, label, value, icon: Icon }) => (
            <button
              key={target}
              type="button"
              onClick={() => onSelect(target)}
              className="group grid min-h-32 place-items-center gap-2 rounded-xl border border-border bg-white p-3 text-sm font-bold text-text shadow-sm transition hover:-translate-y-0.5 hover:border-primary hover:bg-primary-soft/40 hover:shadow-glow focus:outline-none focus:ring-2 focus:ring-[#B8E6DA] focus:ring-offset-2"
            >
              <Icon className={cn("h-7 w-7 transition group-hover:scale-110", target === "gold" ? "text-gold" : target === "silver" ? "text-silver" : "text-cash")} />
              <span>{label}</span>
              <span className={cn("rounded-md px-2 py-1 text-xs font-semibold", target === "gold" ? "bg-gold-soft text-[#8D7437]" : target === "silver" ? "bg-silver-soft text-muted" : "bg-primary-soft text-primary-deep")}>{value}</span>
            </button>
          ))}
        </div>
        <Button type="button" variant="ghost" className="mt-5 w-full text-primary-deep" onClick={onClose}>{ALLOCATION_COPY.close}</Button>
      </div>
    </div>
  );
}
