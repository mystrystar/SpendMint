import { z } from "zod";

export const subscriptionSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  category: z.string().min(2, "Category is required"),
  logoUrl: z.string().url().optional().or(z.literal("")),
  brandDomain: z.string().optional(),
  amount: z.coerce.number().positive("Amount must be greater than zero"),
  billingCycle: z.enum(["weekly", "monthly", "quarterly", "yearly"]),
  nextRenewalDate: z.string().min(1, "Renewal date is required"),
  lastUsedAt: z.string().optional(),
});

export type SubscriptionFormValues = z.infer<typeof subscriptionSchema>;
