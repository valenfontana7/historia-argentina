import type { VoiceTrack } from "@museoargent/video-contracts";
import type { VoiceProvider } from "../../application/ports/voice-provider";

function isRecoverableOpenAiError(err: unknown): boolean {
  if (!err || typeof err !== "object") return false;
  const e = err as {
    status?: number;
    code?: string | null;
    type?: string;
    message?: string;
    error?: { code?: string; type?: string; message?: string };
  };
  const status = e.status;
  const code = e.code ?? e.error?.code ?? "";
  const type = e.type ?? e.error?.type ?? "";
  const message = `${e.message ?? ""} ${e.error?.message ?? ""}`.toLowerCase();

  if (
    status === 429 ||
    status === 401 ||
    status === 403 ||
    status === 500 ||
    status === 502 ||
    status === 503
  ) {
    return true;
  }
  if (
    code === "insufficient_quota" ||
    type === "insufficient_quota" ||
    code === "rate_limit_exceeded"
  ) {
    return true;
  }
  if (
    message.includes("insufficient_quota") ||
    message.includes("rate limit") ||
    message.includes("quota")
  ) {
    return true;
  }
  return false;
}

/** Intenta TTS real; ante cuota/auth/errores de servicio cae al fallback. */
export class ResilientVoiceProvider implements VoiceProvider {
  constructor(
    private readonly primary: VoiceProvider,
    private readonly fallback: VoiceProvider,
  ) {}

  get name(): string {
    return this.primary.name;
  }

  async synthesize(input: {
    text: string;
    voice?: string;
    outputUri: string;
    scene?: number;
  }): Promise<VoiceTrack> {
    try {
      return await this.primary.synthesize(input);
    } catch (err) {
      if (!isRecoverableOpenAiError(err)) throw err;
      console.warn(
        JSON.stringify({
          msg: "TTS primary failed, using fallback",
          primary: this.primary.name,
          fallback: this.fallback.name,
          error: err instanceof Error ? err.message : String(err),
        }),
      );
      return this.fallback.synthesize(input);
    }
  }
}
