import { createFileRoute } from "@tanstack/react-router";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { ArrowUp, Sparkles, Plus, MessageSquare } from "lucide-react";
import ReactMarkdown from "react-markdown";
import logo from "@/assets/logo.png";

const STORAGE_KEY = "medsorts-conversations";

type Thread = { id: string; title: string; updatedAt: number; messages: any[] };

function loadThreads(): Thread[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as Thread[];
  } catch { return []; }
}

function saveThreads(threads: Thread[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(threads));
}

export const Route = createFileRoute("/_authenticated/assistant")({
  component: Assistant,
});

function Assistant() {
  const [threads, setThreads] = useState<Thread[]>([]);
  const [activeId, setActiveId] = useState<string>("");
  const [input, setInput] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const t = loadThreads();
    if (t.length === 0) {
      const fresh: Thread = { id: crypto.randomUUID(), title: "New conversation", updatedAt: Date.now(), messages: [] };
      saveThreads([fresh]);
      setThreads([fresh]);
      setActiveId(fresh.id);
    } else {
      setThreads(t);
      setActiveId(t[0].id);
    }
  }, []);

  const active = threads.find((t) => t.id === activeId);

  const { messages, sendMessage, status, setMessages } = useChat({
    id: activeId,
    transport: new DefaultChatTransport({ api: "/api/chat" }),
    onError: (e) => console.error(e),
  });

  // Load messages when switching threads
  useEffect(() => {
    if (active) setMessages(active.messages);
  }, [activeId]); // eslint-disable-line

  // Persist messages
  useEffect(() => {
    if (!activeId || status === "streaming") return;
    setThreads((curr) => {
      const updated = curr.map((t) => {
        if (t.id !== activeId) return t;
        const firstUser = messages.find((m) => m.role === "user");
        const title = firstUser
          ? (firstUser.parts.map((p: any) => p.type === "text" ? p.text : "").join("").slice(0, 40) || "New conversation")
          : t.title;
        return { ...t, messages, title, updatedAt: Date.now() };
      });
      saveThreads(updated);
      return updated;
    });
  }, [messages, status, activeId]);

  useEffect(() => { textareaRef.current?.focus(); }, [activeId, status]);

  function newThread() {
    const fresh: Thread = { id: crypto.randomUUID(), title: "New conversation", updatedAt: Date.now(), messages: [] };
    const next = [fresh, ...threads];
    setThreads(next);
    saveThreads(next);
    setActiveId(fresh.id);
    setMessages([]);
  }

  function selectThread(id: string) { setActiveId(id); }

  function submit(e: FormEvent) {
    e.preventDefault();
    const text = input.trim();
    if (!text || status === "streaming" || status === "submitted") return;
    setInput("");
    sendMessage({ text });
  }

  const isLoading = status === "submitted" || status === "streaming";

  const samples = [
    "Write a referral letter to a cardiologist for a 62-year-old with new-onset AF.",
    "Summarize the latest 2024 hypertension guidelines.",
    "Draft a friendly follow-up email to a diabetic patient after a 6-month review.",
  ];

  return (
    <div className="grid gap-4 lg:grid-cols-[260px_1fr]">
      <aside className="hidden lg:block">
        <Button onClick={newThread} className="w-full rounded-full"><Plus className="mr-2 h-4 w-4" /> New chat</Button>
        <div className="mt-4 space-y-1">
          {threads.map((t) => (
            <button
              key={t.id}
              onClick={() => selectThread(t.id)}
              className={`flex w-full items-center gap-2 truncate rounded-xl px-3 py-2 text-left text-sm ${t.id === activeId ? "bg-muted text-foreground" : "text-muted-foreground hover:bg-muted/60"}`}
            >
              <MessageSquare className="h-4 w-4 shrink-0" />
              <span className="truncate">{t.title}</span>
            </button>
          ))}
        </div>
      </aside>

      <Card className="flex h-[calc(100vh-10rem)] flex-col overflow-hidden rounded-3xl border-border shadow-glass">
        <div className="flex items-center justify-between border-b border-border px-5 py-3">
          <div className="flex items-center gap-2">
            <img src={logo} alt="" width={24} height={24} className="h-6 w-6" />
            <h2 className="font-semibold">AI Medical Assistant</h2>
          </div>
          <Button onClick={newThread} size="sm" variant="ghost" className="rounded-full lg:hidden">
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
          {messages.length === 0 ? (
            <div className="mx-auto max-w-xl text-center">
              <div className="mx-auto inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <Sparkles className="h-6 w-6" />
              </div>
              <h3 className="mt-4 text-xl font-semibold">How can I help, Doctor?</h3>
              <p className="mt-1 text-sm text-muted-foreground">Ask me to draft, summarize, or research anything clinical.</p>
              <div className="mt-6 grid gap-2">
                {samples.map((s) => (
                  <button
                    key={s}
                    onClick={() => sendMessage({ text: s })}
                    className="rounded-2xl border border-border bg-card p-3 text-left text-sm text-muted-foreground transition-colors hover:border-primary/50 hover:text-foreground"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="mx-auto max-w-3xl space-y-5">
              {messages.map((m) => {
                const text = m.parts.map((p: any) => (p.type === "text" ? p.text : "")).join("");
                if (m.role === "user") {
                  return (
                    <div key={m.id} className="flex justify-end">
                      <div className="max-w-[85%] rounded-2xl rounded-tr-sm bg-primary px-4 py-2.5 text-primary-foreground">
                        <p className="whitespace-pre-wrap text-sm">{text}</p>
                      </div>
                    </div>
                  );
                }
                return (
                  <div key={m.id} className="prose prose-sm max-w-none text-foreground prose-headings:text-foreground prose-strong:text-foreground prose-a:text-primary">
                    <ReactMarkdown>{text}</ReactMarkdown>
                  </div>
                );
              })}
              {isLoading && (
                <div className="text-sm text-muted-foreground"><span className="animate-pulse">Thinking…</span></div>
              )}
            </div>
          )}
        </div>

        <form onSubmit={submit} className="border-t border-border bg-card/60 px-3 py-3 sm:px-6">
          <div className="mx-auto flex max-w-3xl items-end gap-2 rounded-2xl border border-border bg-background p-2 shadow-sm focus-within:border-primary/50">
            <Textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); submit(e as any); } }}
              placeholder="Ask MedSorts… (e.g. 'Write a referral letter')"
              rows={1}
              className="min-h-[40px] resize-none border-0 bg-transparent shadow-none focus-visible:ring-0"
            />
            <Button type="submit" size="icon" className="h-9 w-9 shrink-0 rounded-full" disabled={isLoading || !input.trim()}>
              <ArrowUp className="h-4 w-4" />
            </Button>
          </div>
          <p className="mx-auto mt-2 max-w-3xl text-center text-[10px] text-muted-foreground">
            MedSorts can make mistakes. Verify clinical content before use.
          </p>
        </form>
      </Card>
    </div>
  );
}
