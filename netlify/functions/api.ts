import type { Handler } from "@netlify/functions";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { and, eq } from "drizzle-orm";
import { contentRewards, savingsEvents, subscriptions, vaultBalances } from "../../src/db/schema";

const json = (statusCode: number, body: unknown) => ({
  statusCode,
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(body),
});

function getDb() {
  if (!process.env.DATABASE_URL) return null;
  const sql = neon(process.env.DATABASE_URL);
  return drizzle(sql);
}

export const handler: Handler = async (event) => {
  const db = getDb();
  if (!db) return json(503, { error: "DATABASE_URL is not configured. Client will use local cache." });

  const path = event.path.replace("/.netlify/functions/api", "");
  const method = event.httpMethod;

  try {
    if (method === "GET" && path === "/bootstrap") {
      const deviceId = event.queryStringParameters?.deviceId;
      if (!deviceId) return json(400, { error: "deviceId is required" });

      const [subs, vaultRows, rewards] = await Promise.all([
        db.select().from(subscriptions).where(eq(subscriptions.deviceId, deviceId)),
        db.select().from(vaultBalances).where(eq(vaultBalances.deviceId, deviceId)),
        db.select().from(contentRewards).where(eq(contentRewards.deviceId, deviceId)),
      ]);

      return json(200, {
        subscriptions: subs,
        vault: vaultRows[0],
        rewards,
      });
    }

    if (method === "POST" && path === "/subscriptions") {
      const body = JSON.parse(event.body ?? "{}");
      await db
        .insert(subscriptions)
        .values({
          id: body.id,
          deviceId: body.deviceId,
          name: body.name,
          category: body.category,
          logoUrl: body.logoUrl ?? null,
          brandDomain: body.brandDomain ?? null,
          amount: String(body.amount),
          billingCycle: body.billingCycle,
          nextRenewalDate: body.nextRenewalDate,
          lastUsedAt: body.lastUsedAt ? new Date(body.lastUsedAt) : null,
          isActive: body.isActive,
          createdAt: new Date(body.createdAt),
        })
        .onConflictDoUpdate({
          target: subscriptions.id,
          set: {
            name: body.name,
            category: body.category,
            logoUrl: body.logoUrl ?? null,
            brandDomain: body.brandDomain ?? null,
            amount: String(body.amount),
            billingCycle: body.billingCycle,
            nextRenewalDate: body.nextRenewalDate,
            lastUsedAt: body.lastUsedAt ? new Date(body.lastUsedAt) : null,
            isActive: body.isActive,
          },
        });
      return json(200, { ok: true });
    }

    if (method === "DELETE" && path.startsWith("/subscriptions/")) {
      const id = path.split("/").at(-1);
      const deviceId = event.queryStringParameters?.deviceId;
      if (!id || !deviceId) return json(400, { error: "id and deviceId are required" });
      await db.delete(subscriptions).where(and(eq(subscriptions.id, id), eq(subscriptions.deviceId, deviceId)));
      return json(200, { ok: true });
    }

    if (method === "POST" && path === "/content-rewards") {
      const body = JSON.parse(event.body ?? "{}");
      await db.insert(contentRewards).values({
        id: body.id,
        deviceId: body.deviceId,
        articleId: body.articleId,
        rewardType: body.rewardType,
        rewardAmount: String(body.rewardAmount),
        createdAt: new Date(body.createdAt),
      });
      return json(200, { ok: true });
    }

    if (method === "POST" && path === "/save") {
      const body = JSON.parse(event.body ?? "{}");
      await db.insert(savingsEvents).values({
        deviceId: body.deviceId,
        subscriptionId: body.subscriptionId,
        amountSaved: String(body.amount),
        actionType: body.actionType,
      });
      await db.update(subscriptions).set({ isActive: false }).where(eq(subscriptions.id, body.subscriptionId));
      return json(200, { ok: true });
    }

    return json(404, { error: "Not found" });
  } catch (error) {
    console.error(error);
    return json(500, { error: "Unexpected API error" });
  }
};
