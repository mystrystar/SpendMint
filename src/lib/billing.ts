import { differenceInCalendarDays, parseISO } from "date-fns";
import type { BillingCycle, Subscription } from "../types/domain";

const monthlyMultipliers: Record<BillingCycle, number> = {
  weekly: 52 / 12,
  monthly: 1,
  quarterly: 1 / 3,
  yearly: 1 / 12,
};

export function monthlyAmount(subscription: Pick<Subscription, "amount" | "billingCycle">) {
  return subscription.amount * monthlyMultipliers[subscription.billingCycle];
}

export function annualAmount(subscription: Pick<Subscription, "amount" | "billingCycle">) {
  return monthlyAmount(subscription) * 12;
}

export function daysUntilRenewal(subscription: Pick<Subscription, "nextRenewalDate">) {
  return differenceInCalendarDays(parseISO(subscription.nextRenewalDate), new Date());
}

export function daysSinceLastUse(subscription: Pick<Subscription, "lastUsedAt">) {
  if (!subscription.lastUsedAt) return Number.POSITIVE_INFINITY;
  return differenceInCalendarDays(new Date(), parseISO(subscription.lastUsedAt));
}
