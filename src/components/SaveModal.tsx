import { Coins, Gem, Wallet } from "lucide-react";
import { formatCurrency } from "../lib/utils";
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

  const options: { target: AllocationTarget; label: string; icon: typeof Gem }[] = [
    { target: "gold", label: "Gold", icon: Gem },
    { target: "silver", label: "Silver", icon: Coins },
    { target: "cash", label: "Cash", icon: Wallet },
  ];

  return (
    <div
    className="fixed inset-0 z-40 grid place-items-center bg-slate-950/40 p-4"
    onClick={onClose}
>     
    <div
      className="relative z-50 w-full max-w-md rounded-lg bg-white p-6 shadow-soft"
      onClick={(e) => e.stopPropagation()}
    >
        <h2 className="text-xl font-extrabold text-slate-900">You saved {formatCurrency(subscription.amount)}. Where should it go?</h2>
        <p className="mt-2 text-sm text-slate-600">
          {action === "paused" ? "Pausing" : "Cancelling"} {subscription.name} adds the avoided renewal to your simulated vault.
        </p>
        <div className="mt-6 grid grid-cols-3 gap-3">
          {options.map(({ target, label, icon: Icon }) => (
            <button
              key={target}
              onClick={() => onSelect(target)}
              className="grid min-h-24 place-items-center gap-2 rounded-lg border border-slate-200 bg-stone-50 p-3 text-sm font-bold text-slate-700 transition hover:border-primary hover:bg-teal-50"
            >
              <Icon className="h-6 w-6 text-primary" />
              {label}
            </button>
          ))}
        </div>
        <Button variant="ghost" className="mt-5 w-full" onClick={onClose}>
          Close
        </Button>
      </div>
    </div>
  );
}
