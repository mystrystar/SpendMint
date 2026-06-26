import type { Article, Preferences } from "../types/domain";

export const GOLD_RATE_INR = 8500;
export const SILVER_RATE_INR = 100;

export const STORAGE_KEYS = {
  deviceId: "vaultwise_device_id",
  subscriptions: "vaultwise_subscriptions",
  vault: "vaultwise_vault",
  preferences: "vaultwise_preferences",
  savings: "vaultwise_savings_events",
  rewards: "vaultwise_content_rewards",
} as const;

export const defaultPreferences: Preferences = {
  renewalNotifications: true,
  defaultAllocation: "silver",
};

export const seededArticles: Article[] = [
  {
    id: "subscription-audit-101",
    title: "The 15-minute subscription audit",
    category: "Budgeting",
    readTime: "4 min",
    rewardAmount: 2,
    rewardType: "silver",
    excerpt: "A quick framework for spotting duplicate tools, trial renewals, and low-usage entertainment plans.",
  },
  {
    id: "small-savings-compound",
    title: "How small avoided renewals stack up",
    category: "Wealth",
    readTime: "5 min",
    rewardAmount: 5,
    rewardType: "gold",
    excerpt: "See how a few paused plans can become a visible simulated vault over a full year.",
  },
  {
    id: "renewal-calendar",
    title: "Build a renewal calendar that protects cashflow",
    category: "Planning",
    readTime: "3 min",
    rewardAmount: 2,
    rewardType: "silver",
    excerpt: "Use renewal timing to decide what to keep, pause, or cancel before money leaves your account.",
  },
];
