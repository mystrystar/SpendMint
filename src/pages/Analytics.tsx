import { Area, AreaChart, Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card } from "../components/ui/Card";
import { annualAmount, monthlyAmount } from "../lib/billing";
import { useVaultwise } from "../hooks/useVaultwise";

export function Analytics() {
  const { data, savings } = useVaultwise();
  const subscriptions = data?.subscriptions ?? [];
  const monthlySpend = subscriptions.reduce((total, item) => total + monthlyAmount(item), 0);
  const savingsTotal = savings.reduce((total, item) => total + item.amountSaved, 0);
  const vault = data?.vault;
  const wealth = (vault?.goldBalanceInr ?? 0) + (vault?.silverBalanceInr ?? 0) + (vault?.cashSaved ?? 0);

  const trend = Array.from({ length: 6 }).map((_, index) => {
    const month = new Date();
    month.setMonth(month.getMonth() - (5 - index));
    const factor = 0.78 + index * 0.045;
    return {
      month: month.toLocaleString("en-IN", { month: "short" }),
      spend: Math.round(monthlySpend * factor),
      savings: Math.round((savingsTotal / 6) * (index + 1)),
      wealth: Math.round((wealth / 6) * (index + 1)),
      avoided: savings.filter((_, eventIndex) => eventIndex <= index).length,
    };
  });

  const category = Object.values(
    subscriptions.reduce<Record<string, { category: string; annual: number }>>((acc, item) => {
      acc[item.category] = acc[item.category] ?? { category: item.category, annual: 0 };
      acc[item.category].annual += annualAmount(item);
      return acc;
    }, {}),
  );

  return (
    <div className="grid gap-6">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900">Analytics</h1>
        <p className="mt-1 text-sm text-slate-600">Spend trends, savings progress, wealth accumulation, and avoided renewals.</p>
      </div>
      <section className="grid gap-4 xl:grid-cols-2">
        <ChartCard title="Monthly subscription trend">
          <AreaChart data={trend}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Area type="monotone" dataKey="spend" stroke="#0F766E" fill="#0F766E" fillOpacity={0.16} />
          </AreaChart>
        </ChartCard>
        <ChartCard title="Savings trend">
          <BarChart data={trend}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="savings" fill="#D4AF37" />
          </BarChart>
        </ChartCard>
        <ChartCard title="Wealth accumulation">
          <AreaChart data={trend}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Area type="monotone" dataKey="wealth" stroke="#334155" fill="#C0C0C0" fillOpacity={0.35} />
          </AreaChart>
        </ChartCard>
        <ChartCard title="Avoided renewals by category">
          <BarChart data={category.length ? category : [{ category: "None", annual: 0 }]}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="category" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="annual" fill="#0F766E" />
          </BarChart>
        </ChartCard>
      </section>
    </div>
  );
}

function ChartCard({ title, children }: { title: string; children: React.ReactElement }) {
  return (
    <Card>
      <h2 className="text-lg font-bold text-slate-900">{title}</h2>
      <div className="mt-4 h-72">
        <ResponsiveContainer width="100%" height="100%">
          {children}
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
