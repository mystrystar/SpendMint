import { daysSinceLastUse, daysUntilRenewal, monthlyAmount } from "../lib/billing";
import type { Subscription } from "../types/domain";

export type WasteLevel = "none" | "possible" | "high" | "urgent";

export interface WasteInsight {
  subscriptionId: string;
  level: WasteLevel;
  label: string;
  recommendation: string;
  estimatedMonthlyWaste: number;
  renewsSoon: boolean;
}

export function evaluateWaste(subscription: Subscription): WasteInsight {
  const daysUnused = daysSinceLastUse(subscription);
  const renewsSoon = daysUntilRenewal(subscription) < 3;
  const amount = monthlyAmount(subscription);
  const lowUsage = daysUnused > 14;
  const highWaste = subscription.amount > 500 && daysUnused > 30;

  if (!subscription.isActive) {
    return {
      subscriptionId: subscription.id,
      level: "none",
      label: "Paused",
      recommendation: `${subscription.name} is already paused.`,
      estimatedMonthlyWaste: 0,
      renewsSoon: false,
    };
  }

  if (renewsSoon && lowUsage) {
    return {
      subscriptionId: subscription.id,
      level: "urgent",
      label: "Renewal alert",
      recommendation: `Pause ${subscription.name} before it renews and save ${Math.round(subscription.amount)}`,
      estimatedMonthlyWaste: amount,
      renewsSoon,
    };
  }

  if (highWaste) {
    return {
      subscriptionId: subscription.id,
      level: "high",
      label: "High waste",
      recommendation: `Cancel ${subscription.name} and save ${Math.round(subscription.amount)}`,
      estimatedMonthlyWaste: amount,
      renewsSoon,
    };
  }

  if (lowUsage) {
    return {
      subscriptionId: subscription.id,
      level: "possible",
      label: "Possibly wasted",
      recommendation: `Pause ${subscription.name} and save ${Math.round(subscription.amount)}`,
      estimatedMonthlyWaste: amount,
      renewsSoon,
    };
  }

  return {
    subscriptionId: subscription.id,
    level: "none",
    label: "Healthy",
    recommendation: `${subscription.name} looks active.`,
    estimatedMonthlyWaste: 0,
    renewsSoon,
  };
}

export function detectedWaste(subscriptions: Subscription[]) {
  return subscriptions
    .map(evaluateWaste)
    .filter((insight) => insight.level !== "none")
    .reduce((total, insight) => total + insight.estimatedMonthlyWaste, 0);
}
