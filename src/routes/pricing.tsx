import { createFileRoute, Link } from "@tanstack/react-router";
import { MarketingNav } from "@/components/MarketingNav";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

export const Route = createFileRoute("/pricing")({
  head: () => ({
    meta: [
      { title: "Pricing — MedSorts" },
      { name: "description", content: "Simple pricing for solo doctors, busy practices, and hospitals." },
      { property: "og:title", content: "Pricing — MedSorts" },
      { property: "og:description", content: "Free, Professional, and Enterprise plans." },
    ],
  }),
  component: Pricing,
});

const tiers = [
  {
    name: "Starter",
    price: "Free",
    desc: "Get a feel for AI-assisted medicine.",
    features: ["30 AI requests / month", "Email drafting", "Basic summaries"],
    cta: "Start free",
    highlight: false,
  },
  {
    name: "Professional",
    price: "$29",
    suffix: "/month",
    desc: "Everything an independent doctor needs.",
    features: ["Unlimited AI Assistant", "Research & guidelines", "Smart scheduling", "Templates library", "Voice notes"],
    cta: "Start Professional",
    highlight: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    desc: "For hospitals and clinic groups.",
    features: ["Team management", "Admin dashboard", "API access", "Detailed analytics", "Dedicated support"],
    cta: "Contact sales",
    highlight: false,
  },
];

function Pricing() {
  return (
    <div className="min-h-screen">
      <MarketingNav />
      <section className="mx-auto max-w-6xl px-6 pb-20 pt-16">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Simple, transparent pricing</h1>
          <p className="mt-4 text-muted-foreground">Start free. Upgrade when MedSorts is paying for itself.</p>
        </div>
        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {tiers.map((t) => (
            <div
              key={t.name}
              className={`rounded-3xl border p-8 ${
                t.highlight ? "border-primary/40 bg-card shadow-elegant" : "border-border bg-card shadow-glass"
              }`}
            >
              {t.highlight && (
                <div className="mb-3 inline-flex rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                  Most popular
                </div>
              )}
              <h3 className="text-lg font-semibold">{t.name}</h3>
              <div className="mt-2 flex items-end gap-1">
                <span className="text-4xl font-bold">{t.price}</span>
                {t.suffix && <span className="pb-1 text-sm text-muted-foreground">{t.suffix}</span>}
              </div>
              <p className="mt-2 text-sm text-muted-foreground">{t.desc}</p>
              <ul className="mt-6 space-y-3 text-sm">
                {t.features.map((f) => (
                  <li key={f} className="flex items-start gap-2">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-secondary" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <Button asChild className="mt-8 w-full rounded-full" variant={t.highlight ? "default" : "outline"}>
                <Link to="/auth">{t.cta}</Link>
              </Button>
            </div>
          ))}
        </div>
      </section>
      <Footer />
    </div>
  );
}
