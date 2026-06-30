import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles, FileText, Search, Calendar, ArrowRight, Bell } from "lucide-react";
import { format } from "date-fns";

export const Route = createFileRoute("/_authenticated/dashboard")({
  component: Dashboard,
});

function Dashboard() {
  const { user } = Route.useRouteContext();

  const { data: profile } = useQuery({
    queryKey: ["profile", user.id],
    queryFn: async () => {
      const { data } = await supabase.from("profiles").select("*").eq("id", user.id).maybeSingle();
      return data;
    },
  });

  const { data: appts = [] } = useQuery({
    queryKey: ["appointments-today", user.id],
    queryFn: async () => {
      const start = new Date(); start.setHours(0, 0, 0, 0);
      const end = new Date(); end.setHours(23, 59, 59, 999);
      const { data } = await supabase
        .from("appointments")
        .select("*")
        .gte("starts_at", start.toISOString())
        .lte("starts_at", end.toISOString())
        .order("starts_at");
      return data ?? [];
    },
  });

  const firstName = profile?.full_name?.split(" ")[0] ?? user.email?.split("@")[0] ?? "Doctor";

  const cards = [
    { to: "/assistant" as const, icon: Sparkles, title: "AI Assistant", desc: "Emails, referral letters, notes, reports.", cta: "Open Assistant" },
    { to: "/summaries" as const, icon: FileText, title: "Patient Summaries", desc: "Summarize consultations, labs, history.", cta: "Generate Summary" },
    { to: "/research" as const, icon: Search, title: "Research Assistant", desc: "Latest guidelines, trials, drug info.", cta: "Research" },
    { to: "/schedule" as const, icon: Calendar, title: "Today's Schedule", desc: "Manage your appointments.", cta: "Manage Calendar" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Welcome, Dr. {firstName}</h1>
        <p className="mt-1 text-muted-foreground">Here's your practice at a glance.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => (
          <Card key={c.to} className="rounded-3xl border-border shadow-glass transition-shadow hover:shadow-elegant">
            <CardHeader>
              <div className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <c.icon className="h-5 w-5" />
              </div>
              <CardTitle className="mt-3 text-base">{c.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{c.desc}</p>
              <Button asChild variant="ghost" className="mt-3 -ml-3 rounded-full text-primary hover:bg-primary/10 hover:text-primary">
                <Link to={c.to}>{c.cta} <ArrowRight className="ml-1 h-4 w-4" /></Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="rounded-3xl border-border shadow-glass lg:col-span-2">
          <CardHeader><CardTitle>Today's Appointments</CardTitle></CardHeader>
          <CardContent>
            {appts.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
                Nothing scheduled today. <Link to="/schedule" className="text-primary hover:underline">Add an appointment</Link>.
              </div>
            ) : (
              <ul className="divide-y divide-border">
                {appts.map((a) => (
                  <li key={a.id} className="flex items-center justify-between py-3">
                    <div>
                      <p className="font-medium">{a.title}</p>
                      <p className="text-xs text-muted-foreground capitalize">{a.kind}</p>
                    </div>
                    <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                      {format(new Date(a.starts_at), "HH:mm")}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        <Card className="rounded-3xl border-border shadow-glass">
          <CardHeader className="flex flex-row items-center gap-2">
            <Bell className="h-4 w-4 text-primary" />
            <CardTitle className="text-base">Notifications</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="rounded-xl bg-muted/60 p-3">
              <p className="font-medium">Welcome to MedSorts</p>
              <p className="text-xs text-muted-foreground">Try the AI Assistant to draft your first referral letter.</p>
            </div>
            <div className="rounded-xl bg-muted/60 p-3">
              <p className="font-medium">Research updates</p>
              <p className="text-xs text-muted-foreground">Search the latest guidelines in seconds.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
