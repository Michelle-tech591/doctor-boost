import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { generateEmail } from "@/lib/ai.functions";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Copy, Download, Mail } from "lucide-react";
import ReactMarkdown from "react-markdown";

export const Route = createFileRoute("/_authenticated/email-generator")({
  component: EmailGen,
});

function EmailGen() {
  const run = useServerFn(generateEmail);
  const [type, setType] = useState<"referral" | "reminder" | "insurance" | "follow-up" | "internal">("referral");
  const [tone, setTone] = useState<"professional" | "friendly" | "formal">("professional");
  const [context, setContext] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  async function go() {
    if (!context.trim()) return;
    setLoading(true);
    try {
      const { text } = await run({ data: { type, tone, context } });
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
        <h1 className="flex items-center gap-2 text-3xl font-bold tracking-tight"><Mail className="h-7 w-7 text-primary" /> Email Generator</h1>
        <p className="mt-1 text-muted-foreground">Generate professional medical emails in seconds.</p>
      </header>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="rounded-3xl border-border shadow-glass">
          <CardHeader><CardTitle>Inputs</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Type</Label>
                <Select value={type} onValueChange={(v) => setType(v as any)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="referral">Referral letter</SelectItem>
                    <SelectItem value="reminder">Appointment reminder</SelectItem>
                    <SelectItem value="insurance">Insurance communication</SelectItem>
                    <SelectItem value="follow-up">Patient follow-up</SelectItem>
                    <SelectItem value="internal">Internal hospital email</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Tone</Label>
                <Select value={tone} onValueChange={(v) => setTone(v as any)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="professional">Professional</SelectItem>
                    <SelectItem value="friendly">Friendly</SelectItem>
                    <SelectItem value="formal">Formal</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label>Context</Label>
              <Textarea
                rows={10}
                placeholder="e.g. Patient: John Doe, 58M. Refer to cardiology for new-onset atrial fibrillation, HR 110…"
                value={context}
                onChange={(e) => setContext(e.target.value)}
              />
            </div>
            <Button onClick={go} disabled={loading || !context.trim()} className="w-full rounded-full">
              {loading ? "Drafting…" : "Generate Email"}
            </Button>
          </CardContent>
        </Card>

        <Card className="rounded-3xl border-border shadow-glass">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Draft</CardTitle>
            {result && (
              <div className="flex gap-1">
                <Button variant="ghost" size="sm" onClick={copy}><Copy className="h-4 w-4" /></Button>
                <Button variant="ghost" size="sm" onClick={downloadPdf}><Download className="h-4 w-4" /></Button>
              </div>
            )}
          </CardHeader>
          <CardContent>
            {result ? (
              <div className="prose prose-sm max-w-none text-foreground">
                <ReactMarkdown>{result}</ReactMarkdown>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Your draft will appear here.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
