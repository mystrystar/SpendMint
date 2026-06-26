import { FormEvent, useMemo, useState } from "react";
import { Check, ChevronLeft, Search } from "lucide-react";
import { BrandLogo } from "./BrandLogo";
import { Button } from "./ui/Button";
import { Field, Input, Select } from "./ui/Input";
import { brandCategories, customBrand, logoUrlForDomain, type BrandOption } from "../lib/brandCatalog";
import { subscriptionSchema, type SubscriptionFormValues } from "../lib/validation";
import type { Subscription } from "../types/domain";
import { cn, toDateInputValue } from "../lib/utils";

export function SubscriptionForm({
  initial,
  onSubmit,
  submitting,
}: {
  initial?: Subscription;
  onSubmit: (values: SubscriptionFormValues) => void;
  submitting?: boolean;
}) {
  const [step, setStep] = useState(initial ? 3 : 1);
  const initialBrand = useMemo<BrandOption>(() => {
    if (!initial) return customBrand;
    return {
      name: initial.name,
      category: initial.category,
      domain: initial.brandDomain ?? "",
      suggestedAmount: initial.amount,
      billingCycle: initial.billingCycle,
    };
  }, [initial]);
  const [selectedCategory, setSelectedCategory] = useState(initialBrand.category === "Other" ? brandCategories[0].name : initialBrand.category);
  const [selectedBrand, setSelectedBrand] = useState<BrandOption>(initialBrand);
  const [query, setQuery] = useState("");
  const [values, setValues] = useState<SubscriptionFormValues>({
    name: initial?.name ?? "",
    category: initial?.category ?? "",
    logoUrl: initial?.logoUrl ?? "",
    brandDomain: initial?.brandDomain ?? "",
    amount: initial?.amount ?? 0,
    billingCycle: initial?.billingCycle ?? "monthly",
    nextRenewalDate: toDateInputValue(initial?.nextRenewalDate),
    lastUsedAt: toDateInputValue(initial?.lastUsedAt),
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const currentCategory = brandCategories.find((category) => category.name === selectedCategory) ?? brandCategories[0];
  const brands = currentCategory.brands.filter((brand) => brand.name.toLowerCase().includes(query.toLowerCase()));

  function update<K extends keyof SubscriptionFormValues>(key: K, value: SubscriptionFormValues[K]) {
    setValues((current) => ({ ...current, [key]: value }));
  }

  function pickBrand(brand: BrandOption) {
    setSelectedBrand(brand);
    setValues((current) => ({
      ...current,
      name: brand.name === customBrand.name ? "" : brand.name,
      category: brand.category,
      brandDomain: brand.domain,
      logoUrl: logoUrlForDomain(brand.domain),
      amount: current.amount || brand.suggestedAmount,
      billingCycle: brand.billingCycle,
    }));
    setStep(3);
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const parsed = subscriptionSchema.safeParse(values);
    if (!parsed.success) {
      setErrors(
        parsed.error.errors.reduce<Record<string, string>>((acc, issue) => {
          acc[issue.path.join(".")] = issue.message;
          return acc;
        }, {}),
      );
      return;
    }
    setErrors({});
    onSubmit(parsed.data);
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-6">
      <div className="grid grid-cols-3 gap-2">
        {["Category", "Logo", "Details"].map((label, index) => {
          const active = step >= index + 1;
          return (
            <button
              key={label}
              type="button"
              onClick={() => setStep(index + 1)}
              className={cn(
                "flex min-h-12 items-center justify-center rounded-lg border px-2 text-xs font-extrabold uppercase tracking-wide transition",
                active ? "border-emerald-700 bg-emerald-900 text-amber-100" : "border-slate-200 bg-white text-slate-400",
              )}
            >
              {active && step > index + 1 ? <Check className="mr-1 h-4 w-4" /> : null}
              {index + 1}. {label}
            </button>
          );
        })}
      </div>

      {step === 1 ? (
        <section className="grid gap-4">
          <h2 className="text-xl font-extrabold text-slate-950">What type of subscription is this?</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {brandCategories.map((category) => (
              <button
                type="button"
                key={category.name}
                onClick={() => {
                  setSelectedCategory(category.name);
                  setStep(2);
                }}
                className="rounded-xl border border-slate-200 bg-white p-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-emerald-700 hover:shadow-soft"
              >
                <p className="font-extrabold text-slate-950">{category.name}</p>
                <p className="mt-2 text-sm leading-6 text-slate-600">{category.prompt}</p>
              </button>
            ))}
          </div>
        </section>
      ) : null}

      {step === 2 ? (
        <section className="grid gap-4">
          <div className="flex items-center justify-between gap-3">
            <Button type="button" variant="ghost" onClick={() => setStep(1)}>
              <ChevronLeft className="h-4 w-4" />
              Back
            </Button>
            <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-extrabold text-amber-800">{currentCategory.name}</span>
          </div>
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-3.5 h-4 w-4 text-slate-400" />
            <Input className="pl-9" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search Netflix, Spotify, Canva..." />
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {[...brands, customBrand].map((brand) => (
              <button
                type="button"
                key={`${brand.name}-${brand.domain}`}
                onClick={() => pickBrand(brand)}
                className="flex min-h-24 items-center gap-4 rounded-xl border border-slate-200 bg-white p-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-emerald-700 hover:shadow-soft"
              >
                <BrandLogo name={brand.name} logoUrl={logoUrlForDomain(brand.domain)} />
                <span>
                  <span className="block font-extrabold text-slate-950">{brand.name}</span>
                  <span className="mt-1 block text-sm text-slate-500">{brand.category}</span>
                </span>
              </button>
            ))}
          </div>
        </section>
      ) : null}

      {step === 3 ? (
        <section className="grid gap-5">
          <div className="flex items-center gap-4 rounded-xl border border-emerald-900/10 bg-gradient-to-r from-emerald-950 to-slate-900 p-4 text-white">
            <BrandLogo name={values.name || selectedBrand.name} logoUrl={values.logoUrl} className="h-14 w-14" />
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-amber-200">Selected subscription</p>
              <p className="mt-1 text-xl font-extrabold">{values.name || "Custom plan"}</p>
            </div>
          </div>
          <Field label="Name" error={errors.name}>
            <Input value={values.name} onChange={(event) => update("name", event.target.value)} placeholder="Netflix" />
          </Field>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Category" error={errors.category}>
              <Input value={values.category} onChange={(event) => update("category", event.target.value)} placeholder="Entertainment" />
            </Field>
            <Field label="Logo domain">
              <Input
                value={values.brandDomain ?? ""}
                onChange={(event) => {
                  update("brandDomain", event.target.value);
                  update("logoUrl", logoUrlForDomain(event.target.value));
                }}
                placeholder="netflix.com"
              />
            </Field>
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Amount" error={errors.amount}>
              <Input type="number" min="1" value={values.amount} onChange={(event) => update("amount", Number(event.target.value))} />
            </Field>
            <Field label="Billing cycle" error={errors.billingCycle}>
              <Select value={values.billingCycle} onChange={(event) => update("billingCycle", event.target.value as SubscriptionFormValues["billingCycle"])}>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="quarterly">Quarterly</option>
                <option value="yearly">Yearly</option>
              </Select>
            </Field>
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Renewal date" error={errors.nextRenewalDate}>
              <Input type="date" value={values.nextRenewalDate} onChange={(event) => update("nextRenewalDate", event.target.value)} />
            </Field>
            <Field label="Last used date">
              <Input type="date" value={values.lastUsedAt ?? ""} onChange={(event) => update("lastUsedAt", event.target.value)} />
            </Field>
          </div>
          <Button type="submit" disabled={submitting}>
            {submitting ? "Saving..." : "Save subscription"}
          </Button>
        </section>
      ) : null}
    </form>
  );
}
