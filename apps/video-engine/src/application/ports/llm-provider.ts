import type { z } from "zod";

export interface LlmProvider {
  readonly name: string;
  readonly model: string;
  completeStructured<T>(input: {
    system: string;
    user: string;
    schema: z.ZodType<T>;
    schemaName: string;
  }): Promise<T>;
}
