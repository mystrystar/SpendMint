import { useNavigate } from "react-router-dom";
import { Card } from "../components/ui/Card";
import { SubscriptionForm } from "../components/SubscriptionForm";
import { useVaultwise } from "../hooks/useVaultwise";
import type { Subscription } from "../types/domain";
import type { SubscriptionFormValues } from "../lib/validation";

export function AddSubscription() {
  const navigate = useNavigate();
  const { deviceId, saveSubscription } = useVaultwise();

  function submit(values: SubscriptionFormValues) {
    const subscription: Subscription = {
      id: crypto.randomUUID(),
      deviceId,
      name: values.name,
      category: values.category,
      amount: values.amount,
      billingCycle: values.billingCycle,
      nextRenewalDate: values.nextRenewalDate,
      lastUsedAt: values.lastUsedAt || null,
      isActive: true,
      createdAt: new Date().toISOString(),
    };
    saveSubscription.mutate(subscription, { onSuccess: () => navigate("/dashboard") });
  }

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="text-3xl font-extrabold text-slate-900">Add subscription</h1>
      <Card className="mt-6">
        <SubscriptionForm onSubmit={submit} submitting={saveSubscription.isPending} />
      </Card>
    </div>
  );
}
