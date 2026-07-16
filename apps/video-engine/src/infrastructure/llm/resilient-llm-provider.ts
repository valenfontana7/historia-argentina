import { ZodError } from "zod";
import type { z } from "zod";
import type { LlmProvider } from "../../application/ports/llm-provider";

function isRecoverableLlmError(err: unknown): boolean {
  if (err instanceof ZodError) return true;
  if (!err || typeof err !== "object") return false;
  const e = err as {
    status?: number;
    code?: string;
    type?: string;
    name?: string;
  };
  return (
    e.name === "ZodError" ||
    e.status === 429 ||
    e.status === 401 ||
    e.code === "insufficient_quota" ||
    e.type === "insufficient_quota"
  );
}

/** Intenta OpenAI; ante cuota/auth/schema inválido cae al fallback (fake). */
export class ResilientLlmProvider implements LlmProvider {
  constructor(
    private readonly primary: LlmProvider,
    private readonly fallback: LlmProvider,
  ) {}

  get name(): string {
    return this.primary.name;
  }

  get model(): string {
    return this.primary.model;
  }

  async completeStructured<T>(input: {
    system: string;
    user: string;
    schema: z.ZodType<T>;
    schemaName: string;
  }): Promise<T> {
    try {
      return await this.primary.completeStructured(input);
    } catch (err) {
      if (!isRecoverableLlmError(err)) throw err;
      console.warn(
        JSON.stringify({
          msg: "LLM primary failed, using fallback",
          primary: this.primary.name,
          fallback: this.fallback.name,
          schemaName: input.schemaName,
          error: err instanceof Error ? err.message.slice(0, 400) : String(err),
        }),
      );
      return this.fallback.completeStructured(input);
    }
  }
}
