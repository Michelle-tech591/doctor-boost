import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { generateFromTemplate } from "@/lib/ai.functions";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { LibraryBig, Wand2 } from "lucide-react";
import { toast } from "sonner";
import ReactMarkdown from "react-markdown";

export const Route = createFileRoute("/_authenticated/templates")({
  component: Templates,
});

const TEMPLATES = [
  { kind: "Referral Letter", desc: "Formal referral to a specialist." },
  { kind: "Sick Note", desc: "Medical certificate for time off." },
  { kind: "Prescription Note", desc: "Patient medication instructions." },
  { kind: "Insurance Letter", desc: "Letter of medical necessity." },
  { kind: "Medical Certificate", desc: "General medical certificate." },
  { kind: "Patient Follow-up", desc: "Post-visit follow-up message." },
];

function Templates() {
  const run = useServerFn(generateFromTemplate);
  const [open, setOpen] = useState<string | null>(null);
  const [context, setContext] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  async function go() {
    if (!open || !context.trim()) return;
    setLoading(true);
    try {
      const { text } = await run({ data: { templateKind: open, context } });
      setResult(text);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed");
    } finally { setLoading(false); }
  }

  function close() { setOpen(null); setContext(""); setResult(""); }

  return (
    <div className="space-y-6">
      <header>
        <h1 className="flex items-center gap-2 text-3xl font-bold tracking-tight"><LibraryBig className="h-7 w-7 text-primary" /> Templates Library</h1>
        <p className="mt-1 text-muted-foreground">One-click clinical document generation.</p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {TEMPLATES.map((t) => (
          <Card key={t.kind} className="rounded-3xl border-border shadow-glass transition-shadow hover:shadow-elegant">
            <CardHeader>
              <div className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <Wand2 className="h-5 w-5" />
              </div>
              <CardTitle className="mt-3 text-base">{t.kind}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{t.desc}</p>
              <Button onClick={() => setOpen(t.kind)} className="mt-4 w-full rounded-full">Generate</Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={!!open} onOpenChange={(v) => !v && close()}>
        <DialogContent className="max-w-2xl">
          <DialogHeader><DialogTitle>{open}</DialogTitle></DialogHeader>
          <Textarea rows={5} placeholder="Patient details, reason, key facts…" value={context} onChange={(e) => setContext(e.target.value)} />
          <Button onClick={go} disabled={loading || !context.trim()} className="rounded-full">{loading ? "Generating…" : "Generate"}</Button>
          {result && (
            <div className="prose prose-sm mt-2 max-h-[400px] max-w-none overflow-y-auto rounded-2xl bg-muted/40 p-4">
              <ReactMarkdown>{result}</ReactMarkdown>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
