import { useEffect } from "react";
import { daysUntilRenewal } from "../lib/billing";
import type { Preferences, Subscription } from "../types/domain";
import { APP_COPY } from "../lib/constants";

export function useRenewalNotifications(subscriptions: Subscription[], preferences: Preferences) {
  useEffect(() => {
    if (!preferences.renewalNotifications || !("Notification" in window)) return;

    if (Notification.permission === "default") {
      void Notification.requestPermission();
      return;
    }

    if (Notification.permission !== "granted") return;

    subscriptions
      .filter((subscription) => subscription.isActive && daysUntilRenewal(subscription) === 1)
      .forEach((subscription) => {
        new Notification(`${subscription.name} renews tomorrow. Still using it?`, {
          body: `Open ${APP_COPY.name} to keep, pause, or cancel this renewal.`,
          tag: `spendmint-${subscription.id}`,
        });
      });
  }, [subscriptions, preferences.renewalNotifications]);
}
