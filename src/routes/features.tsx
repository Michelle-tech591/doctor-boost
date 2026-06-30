import { createFileRoute } from "@tanstack/react-router";
import { MarketingNav } from "@/components/MarketingNav";
import { Footer } from "@/components/Footer";
import { Sparkles, Mail, FileText, Search, Calendar, Mic, LibraryBig, BarChart3, ShieldCheck, Moon, Smartphone, Zap } from "lucide-react";

export const Route = createFileRoute("/features")({
  head: () => ({
    meta: [
      { title: "Features — MedSorts" },
      { name: "description", content: "Every tool a modern medical practice needs: AI assistant, summaries, research, scheduling, dictation, templates, and analytics." },
      { property: "og:title", content: "Features — MedSorts" },
      { property: "og:description", content: "AI-powered tools for clinicians." },
    ],
  }),
  component: FeaturesPage,
});

const groups = [
  { icon: Sparkles, title: "AI Medical Assistant", desc: "ChatGPT-style assistant tuned for clinical writing: emails, notes, referrals, reports." },
  { icon: Mail, title: "Email Drafting", desc: "Tone-aware drafts for referrals, reminders, insurance and patient follow-ups. Copy or export." },
  { icon: FileText, title: "Patient Summaries", desc: "Paste notes or labs; get key findings, diagnosis, recommendations and follow-up plan." },
  { icon: Search, title: "Research Assistant", desc: "Latest guidelines, clinical trials, and drug information — with citations and filters." },
  { icon: Calendar, title: "Smart Scheduler", desc: "Daily, weekly and monthly views. Save your own appointments and manage your day." },
  { icon: Mic, title: "Voice Dictation", desc: "Speak naturally; AI structures it into consultation notes, diagnoses and follow-ups." },
  { icon: LibraryBig, title: "Templates Library", desc: "Sick notes, prescriptions, certificates, referral letters — one-click generation." },
  { icon: BarChart3, title: "Productivity Analytics", desc: "Track time saved, emails generated, summaries created and research completed." },
  { icon: ShieldCheck, title: "Enterprise Security", desc: "End-to-end encryption, secure authentication, role-based access and audit logging." },
  { icon: Moon, title: "Dark Mode", desc: "Comfortable late-shift reading with a polished dark theme." },
  { icon: Smartphone, title: "Fully Responsive", desc: "Works on desktop, tablet and mobile — touch-optimized controls." },
  { icon: Zap, title: "Fast & Intuitive", desc: "Apple-inspired interface that feels great on day one." },
];

function FeaturesPage() {
  return (
    <div className="min-h-screen">
      <MarketingNav />
      <section className="mx-auto max-w-6xl px-6 pb-20 pt-16">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Features built for clinical workflow</h1>
          <p className="mt-4 text-muted-foreground">Twelve focused tools designed around how doctors actually work.</p>
        </div>
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {groups.map((f) => (
            <div key={f.title} className="rounded-3xl border border-border bg-card p-6 shadow-glass">
              <div className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <f.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 text-base font-semibold">{f.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>
      <Footer />
    </div>
  );
}
