import { createServerFn } from "@tanstack/react-start";
import { generateText } from "ai";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { createLovableAiGatewayProvider } from "@/lib/ai-gateway.server";

function model() {
  const key = process.env.LOVABLE_API_KEY;
  if (!key) throw new Error("Missing LOVABLE_API_KEY");
  return createLovableAiGatewayProvider(key)("google/gemini-3-flash-preview");
}

const EmailInput = z.object({
  type: z.enum(["referral", "reminder", "insurance", "follow-up", "internal"]),
  tone: z.enum(["professional", "friendly", "formal"]).default("professional"),
  context: z.string().min(1).max(4000),
});

export const generateEmail = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => EmailInput.parse(d))
  .handler(async ({ data }) => {
    const { text } = await generateText({
      model: model(),
      system: `You draft ${data.tone} medical ${data.type} emails for doctors. Output ONLY the email (subject + body). Use markdown.`,
      prompt: data.context,
    });
    return { text };
  });

const SummaryInput = z.object({
  notes: z.string().min(10).max(20000),
});

export const generateSummary = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => SummaryInput.parse(d))
  .handler(async ({ data }) => {
    const { text } = await generateText({
      model: model(),
      system: `You summarize medical notes for doctors. Produce sections: **Key Findings**, **Diagnosis**, **Recommendations**, **Follow-up Plan**. Use markdown. Include the disclaimer at the end.`,
      prompt: data.notes,
    });
    return { text };
  });

const ResearchInput = z.object({
  query: z.string().min(3).max(500),
  specialty: z.string().optional(),
});

export const researchQuery = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => ResearchInput.parse(d))
  .handler(async ({ data }) => {
    const { text } = await generateText({
      model: model(),
      system: `You are a medical research assistant. Provide an evidence-based summary of the latest guidelines and notable studies. Cite organizations (e.g. NICE, WHO, AHA) where applicable. Sections: **Current Guidelines**, **Recent Evidence**, **Key Trials**, **Practical Implications**. Markdown. Note that this is informational and not a replacement for primary sources.`,
      prompt: `Topic: ${data.query}\nSpecialty: ${data.specialty ?? "General"}`,
    });
    return { text };
  });

const DictationInput = z.object({
  transcript: z.string().min(5).max(20000),
});

export const structureDictation = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => DictationInput.parse(d))
  .handler(async ({ data }) => {
    const { text } = await generateText({
      model: model(),
      system: `Convert raw spoken doctor dictation into a structured consultation note. Sections: **Chief Complaint**, **History**, **Examination**, **Assessment**, **Plan**. Preserve clinical detail. Markdown.`,
      prompt: data.transcript,
    });
    return { text };
  });

const TemplateInput = z.object({
  templateKind: z.string(),
  context: z.string().min(1).max(4000),
});

export const generateFromTemplate = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => TemplateInput.parse(d))
  .handler(async ({ data }) => {
    const { text } = await generateText({
      model: model(),
      system: `Generate a professional medical document of type "${data.templateKind}" based on the provided context. Use markdown.`,
      prompt: data.context,
    });
    return { text };
  });
