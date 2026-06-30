import { createFileRoute } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { structureDictation } from "@/lib/ai.functions";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mic, MicOff, Wand2 } from "lucide-react";
import { toast } from "sonner";
import ReactMarkdown from "react-markdown";

export const Route = createFileRoute("/_authenticated/dictation")({
  component: Dictation,
});

function Dictation() {
  const run = useServerFn(structureDictation);
  const [transcript, setTranscript] = useState("");
  const [result, setResult] = useState("");
  const [recording, setRecording] = useState(false);
  const [loading, setLoading] = useState(false);
  const recognizerRef = useRef<any>(null);

  function toggleRecord() {
    const SR = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
    if (!SR) return toast.error("Browser speech recognition not supported. Try Chrome or Edge.");
    if (recording) {
      recognizerRef.current?.stop();
      setRecording(false);
      return;
    }
    const r = new SR();
    r.continuous = true;
    r.interimResults = true;
    r.lang = "en-US";
    r.onresult = (e: any) => {
      let out = "";
      for (let i = 0; i < e.results.length; i++) out += e.results[i][0].transcript + " ";
      setTranscript(out);
    };
    r.onerror = () => setRecording(false);
    r.onend = () => setRecording(false);
    r.start();
    recognizerRef.current = r;
    setRecording(true);
  }

  async function go() {
    if (!transcript.trim()) return;
    setLoading(true);
    try {
      const { text } = await run({ data: { transcript } });
      setResult(text);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed");
    } finally { setLoading(false); }
  }

  return (
    <div className="space-y-6">
      <header>
        <h1 className="flex items-center gap-2 text-3xl font-bold tracking-tight"><Mic className="h-7 w-7 text-primary" /> Voice Dictation</h1>
        <p className="mt-1 text-muted-foreground">Speak naturally; AI structures it into a consultation note.</p>
      </header>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="rounded-3xl border-border shadow-glass">
          <CardHeader><CardTitle>Transcript</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <Button onClick={toggleRecord} variant={recording ? "destructive" : "default"} className="rounded-full">
                {recording ? <><MicOff className="mr-2 h-4 w-4" /> Stop</> : <><Mic className="mr-2 h-4 w-4" /> Record</>}
              </Button>
              {recording && <span className="text-sm text-destructive"><span className="mr-1 inline-block h-2 w-2 animate-pulse rounded-full bg-destructive" /> Listening…</span>}
            </div>
            <Textarea rows={12} value={transcript} onChange={(e) => setTranscript(e.target.value)} placeholder="Or type / paste raw dictation here…" />
            <Button onClick={go} disabled={loading || !transcript.trim()} className="w-full rounded-full">
              <Wand2 className="mr-2 h-4 w-4" /> {loading ? "Structuring…" : "Structure Note"}
            </Button>
          </CardContent>
        </Card>

        <Card className="rounded-3xl border-border shadow-glass">
          <CardHeader><CardTitle>Structured Note</CardTitle></CardHeader>
          <CardContent>
            {result ? (
              <div className="prose prose-sm max-w-none text-foreground"><ReactMarkdown>{result}</ReactMarkdown></div>
            ) : (
              <p className="text-sm text-muted-foreground">Chief complaint, history, examination, assessment and plan will appear here.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
