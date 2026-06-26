export interface BrandOption {
  name: string;
  category: string;
  domain: string;
  suggestedAmount: number;
  billingCycle: "weekly" | "monthly" | "quarterly" | "yearly";
}

export const brandCategories = [
  {
    name: "Entertainment",
    prompt: "Movies, shows, sports and streaming plans",
    brands: [
      { name: "Netflix", category: "Entertainment", domain: "netflix.com", suggestedAmount: 649, billingCycle: "monthly" },
      { name: "Amazon Prime", category: "Entertainment", domain: "primevideo.com", suggestedAmount: 299, billingCycle: "monthly" },
      { name: "Disney+ Hotstar", category: "Entertainment", domain: "hotstar.com", suggestedAmount: 299, billingCycle: "monthly" },
      { name: "YouTube Premium", category: "Entertainment", domain: "youtube.com", suggestedAmount: 149, billingCycle: "monthly" },
    ],
  },
  {
    name: "Music",
    prompt: "Songs, podcasts and audio subscriptions",
    brands: [
      { name: "Spotify", category: "Music", domain: "spotify.com", suggestedAmount: 119, billingCycle: "monthly" },
      { name: "Apple Music", category: "Music", domain: "apple.com", suggestedAmount: 99, billingCycle: "monthly" },
      { name: "Gaana", category: "Music", domain: "gaana.com", suggestedAmount: 99, billingCycle: "monthly" },
      { name: "JioSaavn", category: "Music", domain: "jiosaavn.com", suggestedAmount: 99, billingCycle: "monthly" },
    ],
  },
  {
    name: "Productivity",
    prompt: "Cloud storage, software and work tools",
    brands: [
      { name: "Google One", category: "Productivity", domain: "google.com", suggestedAmount: 130, billingCycle: "monthly" },
      { name: "Microsoft 365", category: "Productivity", domain: "microsoft.com", suggestedAmount: 489, billingCycle: "monthly" },
      { name: "Notion", category: "Productivity", domain: "notion.so", suggestedAmount: 830, billingCycle: "monthly" },
      { name: "Canva", category: "Productivity", domain: "canva.com", suggestedAmount: 499, billingCycle: "monthly" },
    ],
  },
  {
    name: "Lifestyle",
    prompt: "Fitness, food, learning and everyday memberships",
    brands: [
      { name: "Cult Fit", category: "Fitness", domain: "cult.fit", suggestedAmount: 999, billingCycle: "monthly" },
      { name: "Audible", category: "Learning", domain: "audible.in", suggestedAmount: 199, billingCycle: "monthly" },
      { name: "Zomato Gold", category: "Food", domain: "zomato.com", suggestedAmount: 299, billingCycle: "quarterly" },
      { name: "Swiggy One", category: "Food", domain: "swiggy.com", suggestedAmount: 299, billingCycle: "quarterly" },
    ],
  },
] satisfies { name: string; prompt: string; brands: BrandOption[] }[];

export const customBrand: BrandOption = {
  name: "Custom subscription",
  category: "Other",
  domain: "",
  suggestedAmount: 199,
  billingCycle: "monthly",
};

export function logoUrlForDomain(domain?: string | null) {
  return domain ? `https://logo.clearbit.com/${domain}` : "";
}
