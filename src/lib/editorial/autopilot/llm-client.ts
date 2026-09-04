import { z } from "zod";
import { normalizeAutopilotPackage } from "./normalize";

function openAiApiKey(): string | undefined {
  return process.env.OPENAI_API_KEY?.trim() || undefined;
}

export function editorialLlmModel(): string {
  return process.env.EDITORIAL_LLM_MODEL?.trim() || process.env.OPENAI_LLM_MODEL?.trim() || "gpt-4o-mini";
}

export function autopilotEnabled(): boolean {
  return process.env.EDITORIAL_AUTOPILOT_ENABLED !== "false";
}

export async function completeStructuredJson<T>(input: {
  system: string;
  user: string;
  schema: z.ZodType<T>;
  schemaName: string;
  normalize?: (raw: unknown) => unknown;
}): Promise<T> {
  const apiKey = openAiApiKey();
  if (!apiKey) {
    throw new Error("Falta OPENAI_API_KEY para el autopilot editorial.");
  }

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: editorialLlmModel(),
      temperature: 0.3,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content: `${input.system}\nRespondé ÚNICAMENTE con JSON válido para ${input.schemaName}.`,
        },
        { role: "user", content: input.user },
      ],
    }),
    signal: AbortSignal.timeout(90_000),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`OpenAI ${response.status}: ${body.slice(0, 300)}`);
  }

  const payload = (await response.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
  };
  const content = payload.choices?.[0]?.message?.content;
  if (!content) throw new Error("OpenAI no devolvió contenido.");

  let parsed: unknown;
  try {
    parsed = JSON.parse(content);
  } catch {
    throw new Error("OpenAI devolvió JSON inválido.");
  }

  const normalized = input.normalize ? input.normalize(parsed) : parsed;
  const first = input.schema.safeParse(normalized);
  if (first.success) return first.data;

  throw new Error(first.error.issues.map((issue) => issue.message).join("; ") || `Respuesta inválida para ${input.schemaName}.`);
}
