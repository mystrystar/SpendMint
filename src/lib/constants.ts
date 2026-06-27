import type { Article, Preferences } from "../types/domain";

export const GOLD_RATE_INR = 8500;
export const SILVER_RATE_INR = 100;

export const APP_COPY = {
  name: "SpendMint",
  mark: "S",
  tagline: "Mint your savings",
  vision: "Most subscription trackers stop at reminders. SpendMint goes further by helping you cut waste, build savings, and develop better wealth habits.",
  statement: "Save smarter. Grow better.",
} as const;

export const NAV_ITEMS = {
  dashboard: "Dashboard",
  add: "Add Subscription",
  vault: "Vault",
  earn: "Learn & Earn",
  analytics: "Analytics",
  settings: "Settings",
} as const;

export const ALLOCATION_COPY = {
  gold: { label: "Gold", unit: "g" },
  silver: { label: "Silver", unit: "g" },
  cash: { label: "Cash", unit: "" },
  close: "Close",
  heading: (amount: string) => `You saved ${amount}. Where should it go?`,
  description: (action: "paused" | "cancelled", name: string) =>
    `${action === "paused" ? "Pausing" : "Cancelling"} ${name} adds the avoided renewal to your simulated savings.`,
} as const;

export const SUBSCRIPTION_FORM_COPY = {
  steps: ["Category", "Provider", "Details"],
  categoryQuestion: "What type of subscription is this?",
  providerTitle: "Choose your provider",
  providerHelp: "We’ll add the provider name and branding automatically.",
  providerSearch: "Search Netflix, Spotify, Canva...",
  selectedSubscription: "Selected subscription",
  customPlan: "Custom plan",
  back: "Back",
  providerWebsite: "Provider website",
} as const;

export const DASHBOARD_COPY = {
  title: "Dashboard",
  subtitle: "Active plans, renewal risk, and wealth converted from avoided spends.",
  upcomingRenewals: "Upcoming renewals",
  recommendations: "Recommendations",
  saveToVault: "Save to vault",
  renews: "Renews",
  left: "left",
} as const;

export const LEARN_COPY = {
  title: "Learn & Earn",
  subtitle: "Build healthier money habits with practical reads about subscriptions, gold, silver, and personal finance.",
  rewardBreakdown: "Reward breakdown",
  rate: "Conversion rate",
  rewardValue: "Reward value",
  metalCredited: "Metal credited",
  howRewardsWork: "How rewards work",
  qna: [
    ["Is this real gold or silver?", "No. SpendMint uses a simulated vault to help you visualize avoided spending and learning rewards."],
    ["Why is the gram amount small?", "A small rupee reward buys only a fraction of a gram. We show up to six decimals so the conversion stays transparent."],
    ["How is the quantity calculated?", "Reward value is divided by the displayed static rate. Rates are educational constants, not live market prices."],
    ["Can I claim the same reward twice?", "No. Each learning reward can be claimed once on this device."],
  ],
} as const;

export const LANDING_COPY = {
  proof: "A calmer way to manage recurring money",
  howTitle: "From recurring spend to visible progress",
  howSubtitle: "SpendMint connects subscription decisions with a simple savings habit.",
  steps: [
    ["Track", "Add recurring plans and see upcoming renewals in one clear view."],
    ["Decide", "Spot low-use subscriptions before they quietly charge again."],
    ["Redirect", "Move avoided spending into simulated gold, silver, or cash."],
  ],
  learnTitle: "Learn while your savings habit grows",
  learnText: "Explore practical subscription guides, gold and silver explainers, and personal-finance briefs. Every reward includes its rupee value, rate, and exact simulated metal quantity.",
  faqTitle: "Questions, answered",
  faq: [
    ["Does SpendMint move real money?", "No. It is a planning and simulation experience; it does not buy investments or debit your account."],
    ["What makes it different from a reminder app?", "It connects renewal decisions, avoided spending, learning, and visible wealth habits in one flow."],
    ["Are gold and silver rates live?", "No. Clearly displayed static rates keep the prototype predictable and the calculations easy to understand."],
  ],
  ctaTitle: "Ready to mint your first saving?",
} as const;

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
  {
    id: "gold-price-basics",
    title: "Gold price basics: grams, rates, and making sense of small amounts",
    category: "Gold",
    readTime: "6 min",
    rewardAmount: 4,
    rewardType: "gold",
    excerpt: "Understand how rupee values convert into fractional grams and why transparent rates matter.",
  },
  {
    id: "silver-for-beginners",
    title: "Silver for beginners: the affordable metal explained",
    category: "Silver",
    readTime: "5 min",
    rewardAmount: 3,
    rewardType: "silver",
    excerpt: "Learn the role of silver, how quantities are measured, and how a simulated balance is calculated.",
  },
  {
    id: "subscription-economy-brief",
    title: "The subscription economy: what to watch in your monthly budget",
    category: "Money brief",
    readTime: "4 min",
    rewardAmount: 2,
    rewardType: "silver",
    excerpt: "A practical briefing on price increases, overlapping services, and renewal habits worth reviewing.",
  },
];
