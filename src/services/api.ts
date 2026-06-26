import type { AllocationTarget, ContentReward, Preferences, SavingsAction, Subscription, VaultBalance } from "../types/domain";
import { allocateVault, createSavingsEvent, localStore } from "./localStore";

async function request<T>(path: string, init?: RequestInit): Promise<T | null> {
  try {
    const response = await fetch(`/.netlify/functions/api${path}`, {
      headers: { "Content-Type": "application/json" },
      ...init,
    });
    if (!response.ok) return null;
    return (await response.json()) as T;
  } catch {
    return null;
  }
}

export const vaultwiseApi = {
  async bootstrap(deviceId: string) {
    const remote = await request<{ subscriptions: Subscription[]; vault: VaultBalance; rewards: ContentReward[] }>(`/bootstrap?deviceId=${deviceId}`);
    if (remote) {
      localStore.setSubscriptions(remote.subscriptions);
      localStore.setVault(remote.vault);
      localStore.setRewards(remote.rewards);
      return remote;
    }
    return {
      subscriptions: localStore.getSubscriptions(deviceId),
      vault: localStore.getVault(deviceId),
      rewards: localStore.getRewards(),
    };
  },
  async upsertSubscription(subscription: Subscription) {
    const current = localStore.getSubscriptions(subscription.deviceId);
    const next = current.some((item) => item.id === subscription.id)
      ? current.map((item) => (item.id === subscription.id ? subscription : item))
      : [subscription, ...current];
    localStore.setSubscriptions(next);
    await request("/subscriptions", { method: "POST", body: JSON.stringify(subscription) });
    return subscription;
  },
  async deleteSubscription(deviceId: string, id: string) {
    localStore.setSubscriptions(localStore.getSubscriptions(deviceId).filter((item) => item.id !== id));
    await request(`/subscriptions/${id}?deviceId=${deviceId}`, { method: "DELETE" });
  },
  async markSaved(deviceId: string, subscription: Subscription, actionType: SavingsAction, target: AllocationTarget) {
    const updated = { ...subscription, isActive: false };
    const subscriptions = localStore.getSubscriptions(deviceId).map((item) => (item.id === subscription.id ? updated : item));
    const event = createSavingsEvent(deviceId, subscription.id, subscription.amount, actionType);
    const vault = allocateVault(localStore.getVault(deviceId), subscription.amount, target);
    localStore.setSubscriptions(subscriptions);
    localStore.setSavings([event, ...localStore.getSavings()]);
    localStore.setVault(vault);
    await request("/save", { method: "POST", body: JSON.stringify({ subscriptionId: subscription.id, actionType, target, amount: subscription.amount, deviceId }) });
    return { subscriptions, vault };
  },
  async rewardArticle(deviceId: string, articleId: string, rewardType: "gold" | "silver", rewardAmount: number) {
    const existing = localStore.getRewards();
    if (existing.some((reward) => reward.articleId === articleId)) {
      return { reward: null, vault: localStore.getVault(deviceId) };
    }
    const reward: ContentReward = {
      id: crypto.randomUUID(),
      deviceId,
      articleId,
      rewardType,
      rewardAmount,
      createdAt: new Date().toISOString(),
    };
    const vault = allocateVault(localStore.getVault(deviceId), rewardAmount, rewardType);
    localStore.setRewards([reward, ...existing]);
    localStore.setVault(vault);
    await request("/content-rewards", { method: "POST", body: JSON.stringify(reward) });
    return { reward, vault };
  },
  getSavings() {
    return localStore.getSavings();
  },
  getPreferences() {
    return localStore.getPreferences();
  },
  setPreferences(preferences: Preferences) {
    localStore.setPreferences(preferences);
  },
};
