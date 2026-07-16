import OpenAI from "openai";
import type { z } from "zod";
import type { LlmProvider } from "../../application/ports/llm-provider";
import { normalizeLlmPayload } from "./normalize-llm-payload";

const SCHEMA_HINTS: Record<string, string> = {
  ScriptDocument: `Formato JSON exacto:
{
  "musicCategoryHint": "epica",
  "scenes": [
    { "scene": 1, "durationSec": 6, "narration": "Texto hablado..." },
    { "scene": 2, "durationSec": 5, "narration": "..." }
  ]
}
Cada escena DEBE tener: scene (number), durationSec (number), narration (string).
5–7 escenas; suma de durationSec entre 35 y 45; narración 5–8s por escena (CTA final puede ser más corto).`,
  StoryboardDocument: `Formato JSON exacto:
{
  "musicCategoryHint": "epica",
  "scenes": [
    {
      "scene": 1,
      "durationSec": 6,
      "narration": "...",
      "shotType": "retrato",
      "assetHint": { "preferredTypes": ["retrato"], "tags": [], "characters": [], "places": [] },
      "motion": "kenBurns",
      "transition": "crossfade",
      "onScreenText": "Gancho corto"
    }
  ]
}
shotType SOLO: retrato | plano-general | detalle | mapa | documento | simbolo
(nunca "plano-detalle"; usá "detalle").
Si hay personaje en la exhibición, preferí shotType "retrato" en al menos 1–2 escenas.
motion SOLO: kenBurns | zoomIn | zoomOut | panLeft | panRight | static
transition SOLO: cut | fade | crossfade
onScreenText: solo escena 1 + como máximo 1 beat más; máx 28 chars; SIN punto final; no copies la narración literal.`,
};

function isGpt5Family(model: string): boolean {
  return /^gpt-5/i.test(model.trim());
}

export class OpenAiLlmProvider implements LlmProvider {
  readonly name = "openai";
  private readonly client: OpenAI;

  constructor(
    apiKey: string,
    readonly model: string,
  ) {
    this.client = new OpenAI({ apiKey });
  }

  async completeStructured<T>(input: {
    system: string;
    user: string;
    schema: z.ZodType<T>;
    schemaName: string;
  }): Promise<T> {
    const hint = SCHEMA_HINTS[input.schemaName] ?? "";
    const params: OpenAI.Chat.ChatCompletionCreateParamsNonStreaming = {
      model: this.model,
      messages: [
        {
          role: "system",
          content: `${input.system}\n\nRespondé ÚNICAMENTE con JSON válido para ${input.schemaName}.\n${hint}`,
        },
        { role: "user", content: input.user },
      ],
      response_format: { type: "json_object" },
    };
    // gpt-5.* a menudo rechaza temperature distinta del default; omitirla.
    if (!isGpt5Family(this.model)) {
      params.temperature = 0.3;
    }

    const response = await this.client.chat.completions.create(params);
    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error("OpenAI returned empty response");
    }
    let parsed: unknown;
    try {
      parsed = JSON.parse(content);
    } catch {
      throw new Error(`OpenAI returned invalid JSON: ${content.slice(0, 200)}`);
    }
    const normalized = normalizeLlmPayload(input.schemaName, parsed);
    return input.schema.parse(normalized);
  }
}
