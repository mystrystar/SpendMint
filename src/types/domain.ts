export type BillingCycle = "weekly" | "monthly" | "quarterly" | "yearly";
export type SavingsAction = "paused" | "cancelled";
export type RewardType = "gold" | "silver";
export type AllocationTarget = "gold" | "silver" | "cash";

export interface Subscription {
  id: string;
  deviceId: string;
  name: string;
  category: string;
  logoUrl?: string | null;
  brandDomain?: string | null;
  amount: number;
  billingCycle: BillingCycle;
  nextRenewalDate: string;
  lastUsedAt: string | null;
  isActive: boolean;
  createdAt: string;
}

export interface SavingsEvent {
  id: string;
  deviceId: string;
  subscriptionId: string;
  amountSaved: number;
  actionType: SavingsAction;
  createdAt: string;
}

export interface VaultBalance {
  id: string;
  deviceId: string;
  goldBalanceInr: number;
  silverBalanceInr: number;
  cashSaved: number;
  goldGrams: number;
  silverGrams: number;
  updatedAt: string;
}

export interface ContentReward {
  id: string;
  deviceId: string;
  articleId: string;
  rewardType: RewardType;
  rewardAmount: number;
  createdAt: string;
}

export interface Article {
  id: string;
  title: string;
  category: string;
  readTime: string;
  rewardAmount: number;
  rewardType: RewardType;
  excerpt: string;
}

export interface Preferences {
  renewalNotifications: boolean;
  defaultAllocation: AllocationTarget;
}
