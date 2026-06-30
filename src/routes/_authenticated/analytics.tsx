import { createFileRoute } from "@tanstack/react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3 } from "lucide-react";
import { Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export const Route = createFileRoute("/_authenticated/analytics")({
  component: Analytics,
});

const monthly = [
  { month: "Jan", emails: 18, summaries: 9, research: 12 },
  { month: "Feb", emails: 24, summaries: 14, research: 16 },
  { month: "Mar", emails: 32, summaries: 19, research: 22 },
  { month: "Apr", emails: 41, summaries: 26, research: 28 },
  { month: "May", emails: 54, summaries: 33, research: 34 },
  { month: "Jun", emails: 67, summaries: 41, research: 45 },
];

const hours = [
  { week: "W1", hours: 4 }, { week: "W2", hours: 6 },
  { week: "W3", hours: 9 }, { week: "W4", hours: 12 },
];

function Analytics() {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="flex items-center gap-2 text-3xl font-bold tracking-tight"><BarChart3 className="h-7 w-7 text-primary" /> Analytics</h1>
        <p className="mt-1 text-muted-foreground">Your AI-assisted productivity at a glance.</p>
      </header>

      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { label: "AI tasks this month", value: "126" },
          { label: "Hours saved", value: "34h" },
          { label: "Satisfaction", value: "98%" },
        ].map((s) => (
          <Card key={s.label} className="rounded-3xl border-border shadow-glass">
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">{s.label}</p>
              <p className="mt-1 text-3xl font-bold text-primary">{s.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="rounded-3xl border-border shadow-glass">
          <CardHeader><CardTitle>AI tasks by month</CardTitle></CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthly}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis dataKey="month" fontSize={12} />
                <YAxis fontSize={12} />
                <Tooltip />
                <Bar dataKey="emails" fill="oklch(0.55 0.14 245)" radius={6} />
                <Bar dataKey="summaries" fill="oklch(0.7 0.12 180)" radius={6} />
                <Bar dataKey="research" fill="oklch(0.55 0.22 275)" radius={6} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="rounded-3xl border-border shadow-glass">
          <CardHeader><CardTitle>Hours saved per week</CardTitle></CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={hours}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis dataKey="week" fontSize={12} />
                <YAxis fontSize={12} />
                <Tooltip />
                <Line type="monotone" dataKey="hours" stroke="oklch(0.55 0.14 245)" strokeWidth={3} dot={{ r: 5 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <p className="text-xs text-muted-foreground">Sample data shown — usage tracking ships next.</p>
    </div>
  );
}
