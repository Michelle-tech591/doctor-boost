import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { format, addDays, startOfWeek } from "date-fns";

export const Route = createFileRoute("/_authenticated/schedule")({
  component: Schedule,
});

function Schedule() {
  const { user } = Route.useRouteContext();
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [kind, setKind] = useState("consultation");
  const [datetime, setDatetime] = useState("");
  const [duration, setDuration] = useState(30);

  const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 });
  const weekEnd = addDays(weekStart, 7);

  const { data: appts = [] } = useQuery({
    queryKey: ["appointments-week", user.id],
    queryFn: async () => {
      const { data } = await supabase.from("appointments").select("*")
        .gte("starts_at", weekStart.toISOString()).lt("starts_at", weekEnd.toISOString()).order("starts_at");
      return data ?? [];
    },
  });

  async function add() {
    if (!title || !datetime) return;
    const start = new Date(datetime);
    const end = new Date(start.getTime() + duration * 60000);
    const { error } = await supabase.from("appointments").insert({
      user_id: user.id, title, kind, starts_at: start.toISOString(), ends_at: end.toISOString(),
    });
    if (error) return toast.error(error.message);
    toast.success("Appointment added");
    setOpen(false); setTitle(""); setDatetime("");
    qc.invalidateQueries({ queryKey: ["appointments-week"] });
    qc.invalidateQueries({ queryKey: ["appointments-today"] });
  }

  async function remove(id: string) {
    await supabase.from("appointments").delete().eq("id", id);
    qc.invalidateQueries({ queryKey: ["appointments-week"] });
    qc.invalidateQueries({ queryKey: ["appointments-today"] });
  }

  const days = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="flex items-center gap-2 text-3xl font-bold tracking-tight"><Calendar className="h-7 w-7 text-primary" /> Schedule</h1>
          <p className="mt-1 text-muted-foreground">{format(weekStart, "MMM d")} – {format(addDays(weekEnd, -1), "MMM d, yyyy")}</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="rounded-full"><Plus className="mr-2 h-4 w-4" /> New</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>New appointment</DialogTitle></DialogHeader>
            <div className="space-y-3">
              <div><Label>Title</Label><Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Follow-up: John Doe" /></div>
              <div><Label>Type</Label>
                <Select value={kind} onValueChange={setKind}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="consultation">Consultation</SelectItem>
                    <SelectItem value="surgery">Surgery</SelectItem>
                    <SelectItem value="follow-up">Follow-up</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div><Label>Date & time</Label><Input type="datetime-local" value={datetime} onChange={(e) => setDatetime(e.target.value)} /></div>
              <div><Label>Duration (min)</Label><Input type="number" value={duration} min={5} onChange={(e) => setDuration(+e.target.value)} /></div>
              <Button onClick={add} className="w-full rounded-full">Add</Button>
            </div>
          </DialogContent>
        </Dialog>
      </header>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-7">
        {days.map((d) => {
          const dayAppts = appts.filter((a) => new Date(a.starts_at).toDateString() === d.toDateString());
          return (
            <Card key={d.toISOString()} className="rounded-2xl border-border shadow-glass">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  {format(d, "EEE")} <span className="text-muted-foreground">{format(d, "d")}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {dayAppts.length === 0 ? (
                  <p className="text-xs text-muted-foreground">—</p>
                ) : dayAppts.map((a) => (
                  <div key={a.id} className="group rounded-xl bg-primary/10 p-2 text-xs">
                    <div className="flex items-start justify-between gap-1">
                      <div>
                        <p className="font-semibold text-primary">{format(new Date(a.starts_at), "HH:mm")}</p>
                        <p className="line-clamp-2">{a.title}</p>
                      </div>
                      <button onClick={() => remove(a.id)} className="opacity-0 transition-opacity group-hover:opacity-100" aria-label="Delete">
                        <Trash2 className="h-3 w-3 text-destructive" />
                      </button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          );
        })}
      </div>

      <p className="text-xs text-muted-foreground">Coming soon: Google Calendar & Outlook sync.</p>
    </div>
  );
}
