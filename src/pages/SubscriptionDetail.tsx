import { useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Trash2 } from "lucide-react";
import { SaveModal } from "../components/SaveModal";
import { SubscriptionForm } from "../components/SubscriptionForm";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { formatCurrency } from "../lib/utils";
import type { SubscriptionFormValues } from "../lib/validation";
import { useVaultwise } from "../hooks/useVaultwise";
import type { AllocationTarget } from "../types/domain";

export function SubscriptionDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data, saveSubscription, deleteSubscription, markSaved } = useVaultwise();
  const [pendingAction, setPendingAction] = useState<"paused" | "cancelled" | null>(null);
  const subscription = useMemo(() => data?.subscriptions.find((item) => item.id === id), [data, id]);

  if (!subscription) {
    return (
      <Card>
        <h1 className="text-xl font-bold text-slate-900">Subscription not found</h1>
        <Link className="mt-3 inline-block text-sm font-bold text-primary" to="/dashboard">
          Back to dashboard
        </Link>
      </Card>
    );
  }

  const currentSubscription = subscription;

  function submit(values: SubscriptionFormValues) {
    saveSubscription.mutate(
      {
        ...currentSubscription,
        ...values,
        lastUsedAt: values.lastUsedAt || null,
      },
      { onSuccess: () => navigate("/dashboard") },
    );
  }

  function allocate(target: AllocationTarget) {
    if (!pendingAction) return;
    markSaved.mutate({ subscription: currentSubscription, actionType: pendingAction, target }, { onSuccess: () => navigate("/vault") });
    setPendingAction(null);
  }

  return (
    <div className="mx-auto grid max-w-3xl gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900">{currentSubscription.name}</h1>
          <p className="mt-1 text-sm text-slate-600">{formatCurrency(currentSubscription.amount)} per {currentSubscription.billingCycle}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={() => setPendingAction("paused")} disabled={!currentSubscription.isActive}>
            Pause
          </Button>
          <Button variant="danger" onClick={() => setPendingAction("cancelled")} disabled={!currentSubscription.isActive}>
            Cancel
          </Button>
          <Button variant="ghost" onClick={() => deleteSubscription.mutate(currentSubscription.id, { onSuccess: () => navigate("/dashboard") })}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <Card>
        <SubscriptionForm initial={currentSubscription} onSubmit={submit} submitting={saveSubscription.isPending} />
      </Card>
      <SaveModal subscription={pendingAction ? currentSubscription : null} action={pendingAction ?? "paused"} onClose={() => setPendingAction(null)} onSelect={allocate} />
    </div>
  );
}
