import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { researchQuery } from "@/lib/ai.functions";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Search, Bookmark, BookmarkCheck } from "lucide-react";
import ReactMarkdown from "react-markdown";

export const Route = createFileRoute("/_authenticated/research")({
  component: Research,
});

function Research() {
  const { user } = Route.useRouteContext();
  const run = useServerFn(researchQuery);
  const qc = useQueryClient();
  const [query, setQuery] = useState("");
  const [specialty, setSpecialty] = useState("General");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const { data: saved = [] } = useQuery({
    queryKey: ["saved-research", user.id],
    queryFn: async () => {
      const { data } = await supabase.from("saved_research").select("*").order("created_at", { ascending: false });
      return data ?? [];
    },
  });

  async function go() {
    if (!query.trim()) return;
    setLoading(true);
    try {
      const { text } = await run({ data: { query, specialty } });
      setResult(text);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed");
    } finally { setLoading(false); }
  }

  async function save() {
    if (!result) return;
    const { error } = await supabase.from("saved_research").insert({
      user_id: user.id, title: query, snippet: result.slice(0, 500), tags: [specialty],
    });
    if (error) return toast.error(error.message);
    toast.success("Saved to bookmarks");
    qc.invalidateQueries({ queryKey: ["saved-research"] });
  }

  return (
    <div className="space-y-6">
      <header>
        <h1 className="flex items-center gap-2 text-3xl font-bold tracking-tight"><Search className="h-7 w-7 text-primary" /> Research Assistant</h1>
        <p className="mt-1 text-muted-foreground">Latest guidelines, clinical trials, drug information.</p>
      </header>

      <Card className="rounded-3xl border-border shadow-glass">
        <CardContent className="pt-6">
          <div className="flex flex-col gap-3 sm:flex-row">
            <Input placeholder="e.g. Latest hypertension guidelines" value={query} onChange={(e) => setQuery(e.target.value)} onKeyDown={(e) => e.key === "Enter" && go()} />
            <Select value={specialty} onValueChange={setSpecialty}>
              <SelectTrigger className="sm:w-56"><SelectValue /></SelectTrigger>
              <SelectContent>
                {["General","Cardiology","Endocrinology","Neurology","Oncology","Pediatrics","Psychiatry","Surgery"].map((s) => (
                  <SelectItem key={s} value={s}>{s}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button onClick={go} disabled={loading || !query.trim()} className="rounded-full sm:w-32">
              {loading ? "Searching…" : "Research"}
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
        <Card className="rounded-3xl border-border shadow-glass">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Results</CardTitle>
            {result && (
              <Button variant="ghost" size="sm" onClick={save}><Bookmark className="mr-2 h-4 w-4" /> Save</Button>
            )}
          </CardHeader>
          <CardContent>
            {result ? (
              <div className="prose prose-sm max-w-none text-foreground"><ReactMarkdown>{result}</ReactMarkdown></div>
            ) : (
              <p className="text-sm text-muted-foreground">Search to see AI-curated guidelines and evidence.</p>
            )}
          </CardContent>
        </Card>

        <Card className="rounded-3xl border-border shadow-glass">
          <CardHeader><CardTitle className="text-base">Saved Research</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {saved.length === 0 && <p className="text-xs text-muted-foreground">Bookmark research to find it later.</p>}
            {saved.map((s) => (
              <div key={s.id} className="rounded-xl border border-border p-3 text-sm">
                <p className="flex items-start gap-2 font-medium"><BookmarkCheck className="mt-0.5 h-4 w-4 shrink-0 text-secondary" /> {s.title}</p>
                {s.snippet && <p className="mt-1 line-clamp-3 text-xs text-muted-foreground">{s.snippet}</p>}
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
