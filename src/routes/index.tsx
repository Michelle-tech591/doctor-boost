import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Mail, FileText, Search, Calendar, Mic, LibraryBig, BarChart3, ShieldCheck } from "lucide-react";
import { MarketingNav } from "@/components/MarketingNav";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import heroImg from "@/assets/hero.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "MedSorts — AI Assistant for Modern Healthcare" },
      { name: "description", content: "Spend more time treating patients. MedSorts automates medical emails, summaries, research and scheduling with AI." },
      { property: "og:title", content: "MedSorts — AI Assistant for Modern Healthcare" },
      { property: "og:description", content: "AI-powered productivity platform for doctors." },
    ],
  }),
  component: Landing,
});

const features = [
  { icon: Sparkles, title: "AI Assistant", desc: "Draft emails, notes, referrals and reports in seconds." },
  { icon: FileText, title: "Patient Summaries", desc: "Turn long notes and lab results into clear clinical summaries." },
  { icon: Search, title: "Research", desc: "Latest guidelines, clinical trials and drug information at hand." },
  { icon: Calendar, title: "Smart Scheduler", desc: "Optimize appointments and sync with your calendar." },
  { icon: Mic, title: "Voice Dictation", desc: "Speak naturally; we structure it into consultation notes." },
  { icon: LibraryBig, title: "Templates Library", desc: "Sick notes, prescriptions, certificates — one click." },
  { icon: Mail, title: "Email Drafting", desc: "Insurance, referrals, follow-ups in the right tone." },
  { icon: BarChart3, title: "Productivity Analytics", desc: "See the hours you've reclaimed each month." },
  { icon: ShieldCheck, title: "Enterprise Security", desc: "Encrypted, role-based access, audit logging." },
];

function Landing() {
  return (
    <div className="min-h-screen">
      <MarketingNav />
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div
          className="pointer-events-none absolute inset-0 -z-10 opacity-60"
          style={{ background: "var(--gradient-hero)", filter: "blur(80px) opacity(0.35)" }}
        />
        <div className="mx-auto grid max-w-6xl gap-12 px-6 pb-20 pt-16 lg:grid-cols-2 lg:items-center lg:pt-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-3 py-1 text-xs font-medium text-muted-foreground backdrop-blur">
              <Sparkles className="h-3 w-3 text-primary" /> Built for clinicians
            </div>
            <h1 className="mt-5 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              Your AI Assistant for{" "}
              <span className="bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
                Modern Healthcare
              </span>
            </h1>
            <p className="mt-5 max-w-xl text-lg text-muted-foreground">
              Spend more time treating patients and less time on administrative work. MedSorts automates
              emails, documentation, scheduling, research and clinical summaries with AI.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg" className="rounded-full shadow-elegant">
                <Link to="/auth">
                  Get Started <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="rounded-full">
                <Link to="/contact">Book Demo</Link>
              </Button>
            </div>
            <p className="mt-4 text-xs text-muted-foreground">Free tier · No credit card required</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="relative"
          >
            <div className="absolute -inset-4 -z-10 rounded-3xl bg-gradient-to-tr from-primary/20 via-accent/10 to-secondary/20 blur-2xl" />
            <img
              src={heroImg}
              alt="MedSorts dashboard preview"
              className="w-full rounded-3xl border border-border shadow-elegant"
              width={1280}
              height={1024}
            />
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="mx-auto max-w-6xl px-6 py-20">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Everything your practice needs</h2>
          <p className="mt-3 text-muted-foreground">One platform for the paperwork of modern medicine.</p>
        </div>
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className="group rounded-3xl border border-border bg-card p-6 shadow-glass transition-shadow hover:shadow-elegant"
            >
              <div className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <f.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 text-base font-semibold">{f.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-6xl px-6 pb-20">
        <div
          className="relative overflow-hidden rounded-3xl p-10 text-center text-primary-foreground shadow-elegant sm:p-16"
          style={{ background: "var(--gradient-hero)" }}
        >
          <h2 className="text-3xl font-bold sm:text-4xl">Reclaim hours every week</h2>
          <p className="mx-auto mt-3 max-w-xl opacity-90">
            Join doctors using MedSorts to handle the paperwork so they can focus on patients.
          </p>
          <Button asChild size="lg" className="mt-6 rounded-full bg-white text-primary hover:bg-white/90">
            <Link to="/auth">Start free <ArrowRight className="ml-2 h-4 w-4" /></Link>
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
}
