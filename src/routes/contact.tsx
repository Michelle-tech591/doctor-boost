import { createFileRoute } from "@tanstack/react-router";
import { MarketingNav } from "@/components/MarketingNav";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useState, type FormEvent } from "react";
import { Mail, Phone } from "lucide-react";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — MedSorts" },
      { name: "description", content: "Talk to our team about MedSorts for your practice or hospital." },
      { property: "og:title", content: "Contact — MedSorts" },
      { property: "og:description", content: "Get in touch with the MedSorts team." },
    ],
  }),
  component: Contact,
});

function Contact() {
  const [loading, setLoading] = useState(false);
  function submit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast.success("Thanks — we'll be in touch within one business day.");
      (e.target as HTMLFormElement).reset();
    }, 600);
  }
  return (
    <div className="min-h-screen">
      <MarketingNav />
      <section className="mx-auto grid max-w-5xl gap-10 px-6 pb-20 pt-16 lg:grid-cols-2">
        <div>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Let's talk</h1>
          <p className="mt-4 text-muted-foreground">
            Whether you're a solo GP or a hospital lead, we'd love to hear how MedSorts can help.
          </p>
          <div className="mt-8 space-y-3 text-sm">
            <div className="flex items-center gap-3"><Mail className="h-4 w-4 text-primary" /> hello@medsorts.app</div>
            <div className="flex items-center gap-3"><Phone className="h-4 w-4 text-primary" /> +1 (555) 010-0100</div>
          </div>
        </div>
        <form onSubmit={submit} className="rounded-3xl border border-border bg-card p-6 shadow-glass">
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input id="name" required placeholder="Dr. Jane Smith" />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" required placeholder="jane@hospital.org" />
            </div>
            <div>
              <Label htmlFor="msg">How can we help?</Label>
              <Textarea id="msg" required rows={5} placeholder="Tell us about your practice…" />
            </div>
            <Button type="submit" className="w-full rounded-full" disabled={loading}>
              {loading ? "Sending…" : "Send message"}
            </Button>
          </div>
        </form>
      </section>
      <Footer />
    </div>
  );
}
