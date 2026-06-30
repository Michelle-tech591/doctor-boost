import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { generateSummary } from "@/lib/ai.functions";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Copy, Download, FileText, Upload } from "lucide-react";
import ReactMarkdown from "react-markdown";

export const Route = createFileRoute("/_authenticated/summaries")({
  component: Summaries,
});

function Summaries() {
  const run = useServerFn(generateSummary);
  const [notes, setNotes] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    if (f.type.startsWith("text/") || f.name.endsWith(".txt") || f.name.endsWith(".md")) {
      setNotes(await f.text());
    } else {
      toast.info("PDF/DOCX parsing is coming soon — paste the text for now.");
    }
  }

  async function go() {
    if (!notes.trim()) return;
    setLoading(true);
    try {
      const { text } = await run({ data: { notes } });
      setResult(text);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed");
    } finally { setLoading(false); }
  }

  function copy() { navigator.clipboard.writeText(result); toast.success("Copied"); }
  function downloadPdf() {
    const w = window.open("", "_blank");
    if (!w) return;
    w.document.write(`<pre style="font-family:Inter,sans-serif;white-space:pre-wrap;padding:40px;max-width:720px;margin:auto">${result.replace(/</g, "&lt;")}</pre>`);
    w.document.close(); w.print();
  }

  return (
    <div className="space-y-6">
      <header>
        <h1 className="flex items-center gap-2 text-3xl font-bold tracking-tight"><FileText className="h-7 w-7 text-primary" /> Medical Summary Generator</h1>
        <p className="mt-1 text-muted-foreground">Paste consultation notes or labs; get a structured clinical summary.</p>
      </header>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="rounded-3xl border-border shadow-glass">
          <CardHeader><CardTitle>Source</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <label className="flex cursor-pointer items-center gap-2 rounded-2xl border border-dashed border-border p-4 text-sm text-muted-foreground hover:border-primary/50">
              <Upload className="h-4 w-4" /> Upload .txt / .md (PDF/DOCX soon)
              <input type="file" className="hidden" accept=".txt,.md,text/*" onChange={onFile} />
            </label>
            <Textarea rows={14} placeholder="Paste consultation notes, lab results, or history…" value={notes} onChange={(e) => setNotes(e.target.value)} />
            <Button onClick={go} disabled={loading || !notes.trim()} className="w-full rounded-full">
              {loading ? "Summarizing…" : "Generate Summary"}
            </Button>
          </CardContent>
        </Card>

        <Card className="rounded-3xl border-border shadow-glass">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Summary</CardTitle>
            {result && (
              <div className="flex gap-1">
                <Button variant="ghost" size="sm" onClick={copy}><Copy className="h-4 w-4" /></Button>
                <Button variant="ghost" size="sm" onClick={downloadPdf}><Download className="h-4 w-4" /></Button>
              </div>
            )}
          </CardHeader>
          <CardContent>
            {result ? (
              <div className="prose prose-sm max-w-none text-foreground"><ReactMarkdown>{result}</ReactMarkdown></div>
            ) : (
              <p className="text-sm text-muted-foreground">Key findings, diagnosis, recommendations and follow-up will appear here.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
