import { Link } from "react-router-dom";
import { ArrowRight, Bell, BookOpen, Check, Coins, Gem, PiggyBank, ShieldCheck, Sprout, WalletCards } from "lucide-react";
import { Button } from "../components/ui/Button";
import { APP_COPY, GOLD_RATE_INR, LANDING_COPY, SILVER_RATE_INR } from "../lib/constants";
import { formatCurrency } from "../lib/utils";

const FEATURES = [
  { icon: Bell, title: "Renewal clarity", text: "See what is due, when it renews, and how much it costs before the charge lands." },
  { icon: ShieldCheck, title: "Waste signals", text: "Simple usage and cost rules surface plans that may deserve another look." },
  { icon: Coins, title: "Visible progress", text: "Convert avoided spending into transparent simulated gold, silver, or cash balances." },
] as const;

export function Landing() {
  return (
    <div className="grid gap-24 pb-10">
      <section className="grid min-h-[38rem] items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full bg-primary-soft px-4 py-2 text-xs font-bold text-primary-deep"><Sprout className="h-4 w-4" />{LANDING_COPY.proof}</span>
          <p className="mt-6 text-sm font-bold uppercase tracking-[0.18em] text-primary-deep">{APP_COPY.name} · {APP_COPY.tagline}</p>
          <h1 className="mt-4 max-w-3xl text-5xl font-extrabold leading-[1.08] text-text sm:text-6xl">{APP_COPY.statement}</h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-muted">{APP_COPY.vision}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/dashboard"><Button>Open dashboard<ArrowRight className="h-4 w-4" /></Button></Link>
            <Link to="/add"><Button variant="secondary">Add subscription</Button></Link>
          </div>
          <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm font-semibold text-muted">
            {["No bank connection", "Clear calculations", "Local-first prototype"].map((item) => <span key={item} className="flex items-center gap-2"><Check className="h-4 w-4 text-primary" />{item}</span>)}
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-lg">
          <div className="absolute -inset-8 -z-10 rounded-full bg-primary-soft/70 blur-3xl" />
          <div className="rounded-[2rem] border border-border bg-white p-6 shadow-glow">
            <div className="flex items-center justify-between"><div><p className="text-sm font-semibold text-muted">Your monthly overview</p><p className="mt-1 text-3xl font-extrabold text-text">₹2,267</p></div><div className="grid h-12 w-12 place-items-center rounded-2xl bg-primary-soft"><WalletCards className="h-6 w-6 text-primary-deep" /></div></div>
            <div className="mt-6 rounded-2xl bg-gradient-to-br from-primary to-cash p-5 text-white"><p className="text-xs font-bold uppercase tracking-wider text-white/75">Potential annual saving</p><p className="mt-2 text-3xl font-extrabold">₹9,228</p><div className="mt-5 h-2 overflow-hidden rounded-full bg-white/25"><div className="h-full w-2/3 rounded-full bg-white" /></div></div>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="rounded-2xl bg-gold-soft p-4"><Gem className="h-5 w-5 text-gold" /><p className="mt-3 text-xs font-semibold text-muted">Gold rate</p><p className="font-extrabold text-text">{formatCurrency(GOLD_RATE_INR)}/g</p></div>
              <div className="rounded-2xl bg-silver-soft p-4"><Coins className="h-5 w-5 text-silver" /><p className="mt-3 text-xs font-semibold text-muted">Silver rate</p><p className="font-extrabold text-text">{formatCurrency(SILVER_RATE_INR)}/g</p></div>
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="mx-auto max-w-2xl text-center"><p className="text-sm font-bold uppercase tracking-wider text-primary-deep">Why SpendMint</p><h2 className="mt-3 text-3xl font-extrabold text-text">Money decisions without the pressure</h2></div>
        <div className="mt-10 grid gap-5 md:grid-cols-3">{FEATURES.map(({ icon: Icon, title, text }) => <article key={title} className="rounded-2xl border border-border bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-glow"><div className="grid h-12 w-12 place-items-center rounded-2xl bg-primary-soft"><Icon className="h-6 w-6 text-primary-deep" /></div><h3 className="mt-5 text-xl font-extrabold text-text">{title}</h3><p className="mt-3 text-sm leading-6 text-muted">{text}</p></article>)}</div>
      </section>

      <section className="rounded-[2rem] border border-border bg-white p-7 shadow-sm sm:p-10">
        <div className="max-w-2xl"><h2 className="text-3xl font-extrabold text-text">{LANDING_COPY.howTitle}</h2><p className="mt-3 text-muted">{LANDING_COPY.howSubtitle}</p></div>
        <div className="mt-9 grid gap-6 md:grid-cols-3">{LANDING_COPY.steps.map(([title, text], index) => <div key={title}><span className="grid h-10 w-10 place-items-center rounded-full bg-primary text-sm font-extrabold text-white">{index + 1}</span><h3 className="mt-4 text-lg font-extrabold text-text">{title}</h3><p className="mt-2 text-sm leading-6 text-muted">{text}</p></div>)}</div>
      </section>

      <section className="grid items-center gap-10 rounded-[2rem] bg-primary-soft p-8 lg:grid-cols-2 lg:p-12">
        <div><BookOpen className="h-9 w-9 text-primary-deep" /><h2 className="mt-5 text-3xl font-extrabold text-text">{LANDING_COPY.learnTitle}</h2><p className="mt-4 max-w-xl leading-7 text-muted">{LANDING_COPY.learnText}</p><Link className="mt-6 inline-block" to="/content"><Button>Explore Learn & Earn<ArrowRight className="h-4 w-4" /></Button></Link></div>
        <div className="grid gap-3">{["Subscription audits and renewal habits", "Gold and silver quantity explainers", "Personal-finance and money briefs", "Transparent reward calculations"].map((item) => <div key={item} className="flex items-center gap-3 rounded-xl border border-white bg-white/80 p-4 font-semibold text-text"><PiggyBank className="h-5 w-5 text-primary" />{item}</div>)}</div>
      </section>

      <section className="mx-auto w-full max-w-4xl"><h2 className="text-center text-3xl font-extrabold text-text">{LANDING_COPY.faqTitle}</h2><div className="mt-8 grid gap-3">{LANDING_COPY.faq.map(([question, answer]) => <details key={question} className="rounded-xl border border-border bg-white p-5 shadow-sm"><summary className="cursor-pointer list-none font-bold text-text">{question}</summary><p className="mt-3 text-sm leading-6 text-muted">{answer}</p></details>)}</div></section>

      <section className="rounded-[2rem] bg-text px-6 py-12 text-center text-white"><h2 className="text-3xl font-extrabold">{LANDING_COPY.ctaTitle}</h2><p className="mx-auto mt-3 max-w-xl text-white/65">Start with one recurring plan. SpendMint will help make the next decision clearer.</p><Link className="mt-7 inline-block" to="/add"><Button>Add your first subscription<ArrowRight className="h-4 w-4" /></Button></Link></section>
    </div>
  );
}
