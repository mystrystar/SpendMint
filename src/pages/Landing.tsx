import { Link } from "react-router-dom";
import { ArrowRight, Bell, Coins, ShieldCheck } from "lucide-react";
import { Button } from "../components/ui/Button";

export function Landing() {
  return (
    <section className="grid min-h-[calc(100vh-9rem)] items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
      <div>
        <p className="text-sm font-bold uppercase tracking-[0.18em] text-primary">Vaultwise</p>
        <h1 className="mt-4 max-w-3xl text-5xl font-extrabold leading-tight text-slate-900 sm:text-6xl">Turn forgotten subscriptions into future wealth.</h1>
        <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
          Track recurring spends, detect waste before renewal day, and convert avoided payments into simulated gold, silver, or cash savings.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link to="/dashboard">
            <Button>
              Open dashboard
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <Link to="/add">
            <Button variant="secondary">Add subscription</Button>
          </Link>
        </div>
      </div>
      <div className="grid gap-4">
        {[
          { icon: Bell, title: "Renewal alerts", text: "Know what renews tomorrow while there is still time to act." },
          { icon: ShieldCheck, title: "Waste detection", text: "Deterministic rules flag low-usage and high-cost subscriptions." },
          { icon: Coins, title: "Gold and silver vault", text: "Savings convert at static INR rates for a clean simulated wealth view." },
        ].map(({ icon: Icon, title, text }) => (
          <div key={title} className="rounded-lg border border-slate-200 bg-white p-5 shadow-soft">
            <Icon className="h-6 w-6 text-primary" />
            <h2 className="mt-4 text-lg font-bold text-slate-900">{title}</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">{text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
