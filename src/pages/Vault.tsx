import { Coins, Gem, Wallet } from "lucide-react";
import { Card } from "../components/ui/Card";
import { formatCurrency, formatDecimal } from "../lib/utils";
import { seededArticles } from "../lib/constants";
import { useVaultwise } from "../hooks/useVaultwise";

export function Vault() {
  const { data, savings } = useVaultwise();
  const vault = data?.vault;
  const rewards = data?.rewards ?? [];
  const total = (vault?.goldBalanceInr ?? 0) + (vault?.silverBalanceInr ?? 0) + (vault?.cashSaved ?? 0);
  const history = [
    ...savings.map((item) => ({ id: item.id, title: `${item.actionType} subscription`, amount: item.amountSaved, date: item.createdAt })),
    ...rewards.map((item) => ({
      id: item.id,
      title: `${item.rewardType} reward: ${seededArticles.find((article) => article.id === item.articleId)?.title ?? "Article"}`,
      amount: item.rewardAmount,
      date: item.createdAt,
    })),
  ].sort((a, b) => +new Date(b.date) - +new Date(a.date));

  return (
    <div className="grid gap-6">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900">Wealth vault</h1>
        <p className="mt-1 text-sm text-slate-600">Static rates: gold ₹8,500/g and silver ₹100/g.</p>
      </div>
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card>
          <Gem className="h-5 w-5 text-gold" />
          <p className="mt-3 text-sm font-semibold text-slate-500">Gold balance</p>
          <p className="mt-2 text-2xl font-extrabold text-slate-900">{formatCurrency(vault?.goldBalanceInr ?? 0)}</p>
          <p className="text-sm text-slate-500">{formatDecimal(vault?.goldGrams ?? 0)} g</p>
        </Card>
        <Card>
          <Coins className="h-5 w-5 text-slate-400" />
          <p className="mt-3 text-sm font-semibold text-slate-500">Silver balance</p>
          <p className="mt-2 text-2xl font-extrabold text-slate-900">{formatCurrency(vault?.silverBalanceInr ?? 0)}</p>
          <p className="text-sm text-slate-500">{formatDecimal(vault?.silverGrams ?? 0)} g</p>
        </Card>
        <Card>
          <Wallet className="h-5 w-5 text-primary" />
          <p className="mt-3 text-sm font-semibold text-slate-500">Cash saved</p>
          <p className="mt-2 text-2xl font-extrabold text-slate-900">{formatCurrency(vault?.cashSaved ?? 0)}</p>
        </Card>
        <Card>
          <p className="text-sm font-semibold text-slate-500">Total wealth</p>
          <p className="mt-3 text-3xl font-extrabold text-primary">{formatCurrency(total)}</p>
        </Card>
      </section>
      <Card>
        <h2 className="text-xl font-bold text-slate-900">Transaction history</h2>
        <div className="mt-4 grid gap-3">
          {history.length ? (
            history.map((item) => (
              <div key={item.id} className="flex items-center justify-between rounded-lg border border-slate-200 p-4">
                <div>
                  <p className="font-bold text-slate-800">{item.title}</p>
                  <p className="text-sm text-slate-500">{new Date(item.date).toLocaleDateString("en-IN")}</p>
                </div>
                <p className="font-extrabold text-primary">{formatCurrency(item.amount)}</p>
              </div>
            ))
          ) : (
            <p className="text-sm text-slate-500">Pause a plan or complete an article to start your vault history.</p>
          )}
        </div>
      </Card>
    </div>
  );
}
