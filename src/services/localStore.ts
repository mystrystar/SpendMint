import { addDays, formatISO } from "date-fns";
import { defaultPreferences, GOLD_RATE_INR, SILVER_RATE_INR, STORAGE_KEYS } from "../lib/constants";
import type { AllocationTarget, ContentReward, Preferences, SavingsAction, SavingsEvent, Subscription, VaultBalance } from "../types/domain";

function readJson<T>(key: string, fallback: T): T {
  const raw = localStorage.getItem(key);
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function writeJson<T>(key: string, value: T) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function seedSubscriptions(deviceId: string): Subscription[] {
  const now = new Date();
  return [
    {
      id: crypto.randomUUID(),
      deviceId,
      name: "Netflix",
      category: "Entertainment",
      logoUrl: "https://logo.clearbit.com/netflix.com",
      brandDomain: "netflix.com",
      amount: 649,
      billingCycle: "monthly",
      nextRenewalDate: formatISO(addDays(now, 1), { representation: "date" }),
      lastUsedAt: formatISO(addDays(now, -38)),
      isActive: true,
      createdAt: now.toISOString(),
    },
    {
      id: crypto.randomUUID(),
      deviceId,
      name: "Spotify",
      category: "Music",
      logoUrl: "https://logo.clearbit.com/spotify.com",
      brandDomain: "spotify.com",
      amount: 119,
      billingCycle: "monthly",
      nextRenewalDate: formatISO(addDays(now, 6), { representation: "date" }),
      lastUsedAt: formatISO(addDays(now, -18)),
      isActive: true,
      createdAt: now.toISOString(),
    },
    {
      id: crypto.randomUUID(),
      deviceId,
      name: "Cloud Storage",
      category: "Productivity",
      logoUrl: "https://logo.clearbit.com/google.com",
      brandDomain: "google.com",
      amount: 1499,
      billingCycle: "yearly",
      nextRenewalDate: formatISO(addDays(now, 22), { representation: "date" }),
      lastUsedAt: formatISO(addDays(now, -3)),
      isActive: true,
      createdAt: now.toISOString(),
    },
  ];
}

export function emptyVault(deviceId: string): VaultBalance {
  return {
    id: crypto.randomUUID(),
    deviceId,
    goldBalanceInr: 0,
    silverBalanceInr: 0,
    cashSaved: 0,
    goldGrams: 0,
    silverGrams: 0,
    updatedAt: new Date().toISOString(),
  };
}

export const localStore = {
  getSubscriptions(deviceId: string) {
    const current = readJson<Subscription[] | null>(STORAGE_KEYS.subscriptions, null);
    if (current) return current;
    const seeded = seedSubscriptions(deviceId);
    writeJson(STORAGE_KEYS.subscriptions, seeded);
    return seeded;
  },
  setSubscriptions(subscriptions: Subscription[]) {
    writeJson(STORAGE_KEYS.subscriptions, subscriptions);
  },
  getVault(deviceId: string) {
    const vault = readJson<VaultBalance | null>(STORAGE_KEYS.vault, null);
    if (vault) return vault;
    const created = emptyVault(deviceId);
    writeJson(STORAGE_KEYS.vault, created);
    return created;
  },
  setVault(vault: VaultBalance) {
    writeJson(STORAGE_KEYS.vault, vault);
  },
  getSavings() {
    return readJson<SavingsEvent[]>(STORAGE_KEYS.savings, []);
  },
  setSavings(events: SavingsEvent[]) {
    writeJson(STORAGE_KEYS.savings, events);
  },
  getRewards() {
    return readJson<ContentReward[]>(STORAGE_KEYS.rewards, []);
  },
  setRewards(rewards: ContentReward[]) {
    writeJson(STORAGE_KEYS.rewards, rewards);
  },
  getPreferences() {
    return readJson<Preferences>(STORAGE_KEYS.preferences, defaultPreferences);
  },
  setPreferences(preferences: Preferences) {
    writeJson(STORAGE_KEYS.preferences, preferences);
  },
};

export function allocateVault(vault: VaultBalance, amount: number, target: AllocationTarget): VaultBalance {
  const next = { ...vault, updatedAt: new Date().toISOString() };
  if (target === "gold") {
    next.goldBalanceInr += amount;
    next.goldGrams += amount / GOLD_RATE_INR;
  } else if (target === "silver") {
    next.silverBalanceInr += amount;
    next.silverGrams += amount / SILVER_RATE_INR;
  } else {
    next.cashSaved += amount;
  }
  return next;
}

export function createSavingsEvent(deviceId: string, subscriptionId: string, amountSaved: number, actionType: SavingsAction): SavingsEvent {
  return {
    id: crypto.randomUUID(),
    deviceId,
    subscriptionId,
    amountSaved,
    actionType,
    createdAt: new Date().toISOString(),
  };
}
