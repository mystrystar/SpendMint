import { BarChart3, PiggyBank, TrendingDown, WalletCards } from "lucide-react";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card } from "../components/ui/Card";
import { annualAmount, monthlyAmount } from "../lib/billing";
import { formatCurrency } from "../lib/utils";
import { useVaultwise } from "../hooks/useVaultwise";

const CHART_COLORS = {
  mint: "#5FB8A5",
  deepMint: "#2F8F83",
  softMint: "#DDF4EE",
  gold: "#D9B86C",
  silver: "#BFC6CE",
  grid: "#E6F0EC",
  muted: "#6B7280",
} as const;

const axisProps = {
  axisLine: false,
  tickLine: false,
  tick: { fill: CHART_COLORS.muted, fontSize: 12 },
} as const;

const tooltipProps = {
  cursor: { fill: CHART_COLORS.softMint, opacity: 0.45 },
  contentStyle: {
    border: `1px solid ${CHART_COLORS.grid}`,
    borderRadius: "12px",
    boxShadow: "0 8px 28px rgba(47, 143, 131, 0.12)",
    color: "#1F2937",
  },
  formatter: (value: number | string) => formatCurrency(Number(value)),
} as const;

export function Analytics() {
  const { data, savings } = useVaultwise();
  const subscriptions = data?.subscriptions ?? [];
  const monthlySpend = subscriptions.reduce((total, item) => total + monthlyAmount(item), 0);
  const annualSpend = subscriptions.reduce((total, item) => total + annualAmount(item), 0);
  const savingsTotal = savings.reduce((total, item) => total + item.amountSaved, 0);
  const vault = data?.vault;
  const wealth = (vault?.goldBalanceInr ?? 0) + (vault?.silverBalanceInr ?? 0) + (vault?.cashSaved ?? 0);

  const trend = Array.from({ length: 6 }).map((_, index) => {
    const month = new Date();
    month.setMonth(month.getMonth() - (5 - index));
    return {
      month: month.toLocaleString("en-IN", { month: "short" }),
      spend: Math.round(monthlySpend * (0.78 + index * 0.045)),
      savings: Math.round((savingsTotal / 6) * (index + 1)),
      wealth: Math.round((wealth / 6) * (index + 1)),
    };
  });

  const category = Object.values(
    subscriptions.reduce<Record<string, { category: string; annual: number }>>((acc, item) => {
      acc[item.category] = acc[item.category] ?? { category: item.category, annual: 0 };
      acc[item.category].annual += annualAmount(item);
      return acc;
    }, {}),
  );

  const metrics = [
    { label: "Monthly spend", value: formatCurrency(monthlySpend), helper: "Current recurring cost", icon: WalletCards, tone: "bg-primary-soft text-primary-deep" },
    { label: "Annual commitment", value: formatCurrency(annualSpend), helper: "Projected over 12 months", icon: BarChart3, tone: "bg-silver-soft text-muted" },
    { label: "Avoided spend", value: formatCurrency(savingsTotal), helper: `${savings.length} renewal${savings.length === 1 ? "" : "s"} avoided`, icon: TrendingDown, tone: "bg-gold-soft text-[#8D7437]" },
    { label: "Simulated wealth", value: formatCurrency(wealth), helper: "Gold, silver, and cash", icon: PiggyBank, tone: "bg-primary-soft text-primary-deep" },
  ] as const;

  return (
    <div className="grid gap-7">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <span className="rounded-full bg-primary-soft px-3 py-1 text-xs font-bold text-primary-deep">Money insights</span>
          <h1 className="mt-4 text-3xl font-extrabold text-text">Analytics</h1>
          <p className="mt-2 text-sm text-muted">A calm view of recurring spend, avoided renewals, and savings progress.</p>
        </div>
        <span className="rounded-full border border-border bg-white px-4 py-2 text-xs font-semibold text-muted">Last 6 months</span>
      </div>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map(({ label, value, helper, icon: Icon, tone }) => (
          <Card key={label} className="group overflow-hidden">
            <div className="flex items-start justify-between gap-3">
              <div className={`grid h-11 w-11 place-items-center rounded-xl ${tone}`}><Icon className="h-5 w-5" /></div>
              <span className="h-2 w-2 rounded-full bg-primary/40 transition group-hover:bg-primary" />
            </div>
            <p className="mt-5 text-sm font-semibold text-muted">{label}</p>
            <p className="mt-2 text-2xl font-extrabold text-text">{value}</p>
            <p className="mt-2 text-xs text-muted">{helper}</p>
          </Card>
        ))}
      </section>

      <section className="grid gap-5 xl:grid-cols-2">
        <ChartCard title="Monthly subscription trend" subtitle="Estimated recurring spend over time" accent="mint">
          <AreaChart data={trend} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
            <defs><linearGradient id="spendGradient" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={CHART_COLORS.mint} stopOpacity={0.35} /><stop offset="100%" stopColor={CHART_COLORS.mint} stopOpacity={0.02} /></linearGradient></defs>
            <CartesianGrid vertical={false} stroke={CHART_COLORS.grid} strokeDasharray="4 6" />
            <XAxis dataKey="month" {...axisProps} /><YAxis {...axisProps} />
            <Tooltip {...tooltipProps} />
            <Area type="monotone" dataKey="spend" name="Spend" stroke={CHART_COLORS.deepMint} strokeWidth={3} fill="url(#spendGradient)" />
          </AreaChart>
        </ChartCard>

        <ChartCard title="Savings progress" subtitle="Avoided subscription spend accumulated" accent="gold">
          <BarChart data={trend} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
            <CartesianGrid vertical={false} stroke={CHART_COLORS.grid} strokeDasharray="4 6" />
            <XAxis dataKey="month" {...axisProps} /><YAxis {...axisProps} />
            <Tooltip {...tooltipProps} />
            <Bar dataKey="savings" name="Savings" fill={CHART_COLORS.gold} radius={[8, 8, 2, 2]} maxBarSize={36} />
          </BarChart>
        </ChartCard>

        <ChartCard title="Wealth accumulation" subtitle="Simulated gold, silver, and cash value" accent="silver">
          <AreaChart data={trend} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
            <defs><linearGradient id="wealthGradient" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={CHART_COLORS.silver} stopOpacity={0.5} /><stop offset="100%" stopColor={CHART_COLORS.silver} stopOpacity={0.04} /></linearGradient></defs>
            <CartesianGrid vertical={false} stroke={CHART_COLORS.grid} strokeDasharray="4 6" />
            <XAxis dataKey="month" {...axisProps} /><YAxis {...axisProps} />
            <Tooltip {...tooltipProps} />
            <Area type="monotone" dataKey="wealth" name="Wealth" stroke={CHART_COLORS.muted} strokeWidth={3} fill="url(#wealthGradient)" />
          </AreaChart>
        </ChartCard>

        <ChartCard title="Annual spend by category" subtitle="Where recurring money is committed" accent="mint">
          <BarChart data={category.length ? category : [{ category: "None", annual: 0 }]} layout="vertical" margin={{ top: 8, right: 12, left: 12, bottom: 0 }}>
            <CartesianGrid horizontal={false} stroke={CHART_COLORS.grid} strokeDasharray="4 6" />
            <XAxis type="number" {...axisProps} /><YAxis type="category" dataKey="category" width={82} {...axisProps} />
            <Tooltip {...tooltipProps} />
            <Bar dataKey="annual" name="Annual spend" fill={CHART_COLORS.mint} radius={[0, 8, 8, 0]} maxBarSize={28} />
          </BarChart>
        </ChartCard>
      </section>
    </div>
  );
}

function ChartCard({ title, subtitle, accent, children }: { title: string; subtitle: string; accent: "mint" | "gold" | "silver"; children: React.ReactElement }) {
  const accentClass = accent === "gold" ? "bg-gold" : accent === "silver" ? "bg-silver" : "bg-primary";
  return (
    <Card className="p-6">
      <div className="flex items-start gap-3"><span className={`mt-1 h-9 w-1 rounded-full ${accentClass}`} /><div><h2 className="text-lg font-extrabold text-text">{title}</h2><p className="mt-1 text-xs text-muted">{subtitle}</p></div></div>
      <div className="mt-6 h-72"><ResponsiveContainer width="100%" height="100%">{children}</ResponsiveContainer></div>
    </Card>
  );
}
