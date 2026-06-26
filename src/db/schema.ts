import { boolean, date, index, numeric, pgEnum, pgTable, text, timestamp, uniqueIndex, uuid } from "drizzle-orm/pg-core";

export const billingCycleEnum = pgEnum("billing_cycle", ["weekly", "monthly", "quarterly", "yearly"]);
export const savingsActionEnum = pgEnum("savings_action", ["paused", "cancelled"]);
export const rewardTypeEnum = pgEnum("reward_type", ["gold", "silver"]);

export const subscriptions = pgTable(
  "subscriptions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    deviceId: text("device_id").notNull(),
    name: text("name").notNull(),
    category: text("category").notNull(),
    logoUrl: text("logo_url"),
    brandDomain: text("brand_domain"),
    amount: numeric("amount", { precision: 12, scale: 2 }).notNull(),
    billingCycle: billingCycleEnum("billing_cycle").notNull(),
    nextRenewalDate: date("next_renewal_date").notNull(),
    lastUsedAt: timestamp("last_used_at"),
    isActive: boolean("is_active").default(true).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => ({
    deviceIdx: index("subscriptions_device_id_idx").on(table.deviceId),
  }),
);

export const savingsEvents = pgTable(
  "savings_events",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    deviceId: text("device_id").notNull(),
    subscriptionId: uuid("subscription_id")
      .notNull()
      .references(() => subscriptions.id, { onDelete: "cascade" }),
    amountSaved: numeric("amount_saved", { precision: 12, scale: 2 }).notNull(),
    actionType: savingsActionEnum("action_type").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => ({
    deviceIdx: index("savings_events_device_id_idx").on(table.deviceId),
  }),
);

export const vaultBalances = pgTable(
  "vault_balances",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    deviceId: text("device_id").notNull(),
    goldBalanceInr: numeric("gold_balance_inr", { precision: 12, scale: 2 }).default("0").notNull(),
    silverBalanceInr: numeric("silver_balance_inr", { precision: 12, scale: 2 }).default("0").notNull(),
    cashSaved: numeric("cash_saved", { precision: 12, scale: 2 }).default("0").notNull(),
    goldGrams: numeric("gold_grams", { precision: 12, scale: 6 }).default("0").notNull(),
    silverGrams: numeric("silver_grams", { precision: 12, scale: 6 }).default("0").notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => ({
    deviceUnique: uniqueIndex("vault_balances_device_id_unique").on(table.deviceId),
  }),
);

export const contentRewards = pgTable(
  "content_rewards",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    deviceId: text("device_id").notNull(),
    articleId: text("article_id").notNull(),
    rewardType: rewardTypeEnum("reward_type").notNull(),
    rewardAmount: numeric("reward_amount", { precision: 12, scale: 2 }).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => ({
    deviceIdx: index("content_rewards_device_id_idx").on(table.deviceId),
  }),
);
