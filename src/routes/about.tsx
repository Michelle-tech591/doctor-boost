import { createFileRoute } from "@tanstack/react-router";
import { MarketingNav } from "@/components/MarketingNav";
import { Footer } from "@/components/Footer";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — MedSorts" },
      { name: "description", content: "MedSorts is built by clinicians and engineers to reduce administrative burden in modern medicine." },
      { property: "og:title", content: "About — MedSorts" },
      { property: "og:description", content: "Our mission: more time with patients, less time on paperwork." },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <div className="min-h-screen">
      <MarketingNav />
      <section className="mx-auto max-w-3xl px-6 pb-20 pt-16">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">About MedSorts</h1>
        <p className="mt-5 text-lg text-muted-foreground">
          Doctors spend hours every week on paperwork. We built MedSorts to give that time back.
        </p>
        <div className="prose prose-slate mt-8 max-w-none text-foreground">
          <p>
            MedSorts combines a clean, Apple-inspired interface with modern AI to handle the most
            repetitive parts of clinical practice: drafting referral letters, summarising consultations,
            staying current with guidelines, and keeping a calm calendar.
          </p>
          <p>
            We work alongside doctors, not around them. Every output is editable. Every clinical decision
            remains the clinician's. Our job is to remove friction so you can focus on patients.
          </p>
          <h2 className="mt-8 text-2xl font-semibold">Our principles</h2>
          <ul>
            <li>Doctors first — built with practising clinicians.</li>
            <li>Privacy by design — encrypted, role-based, audit-logged.</li>
            <li>Useful by default — the first thing you try should work.</li>
          </ul>
        </div>
      </section>
      <Footer />
    </div>
  );
}
