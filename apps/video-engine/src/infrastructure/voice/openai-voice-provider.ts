import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import OpenAI from "openai";
import type { VoiceTrack } from "@museoargent/video-contracts";
import type { VoiceProvider } from "../../application/ports/voice-provider";
import type { ObjectStorage } from "../../application/ports/object-storage";
import { spawn } from "node:child_process";

export class OpenAiVoiceProvider implements VoiceProvider {
  readonly name = "openai";
  private readonly client: OpenAI;

  constructor(
    apiKey: string,
    private readonly storage: ObjectStorage,
    private readonly model: string,
    private readonly defaultVoice: string,
    private readonly ffprobePath: string,
    private readonly instructions?: string,
  ) {
    this.client = new OpenAI({ apiKey });
  }

  async synthesize(input: {
    text: string;
    voice?: string;
    outputUri: string;
    scene?: number;
  }): Promise<VoiceTrack> {
    const voice = input.voice ?? this.defaultVoice;
    const response = await this.client.audio.speech.create({
      model: this.model,
      voice: voice as "alloy",
      input: input.text,
      response_format: "mp3",
      ...(this.instructions ? { instructions: this.instructions } : {}),
    });
    const buffer = Buffer.from(await response.arrayBuffer());
    const outPath = this.storage.resolvePath(input.outputUri);
    await mkdir(path.dirname(outPath), { recursive: true });
    await writeFile(outPath, buffer);
    const durationSec = await probeDuration(this.ffprobePath, outPath);
    return {
      provider: this.name,
      voice,
      fileUri: `file://${outPath}`,
      durationSec,
      scene: input.scene,
    };
  }
}

function probeDuration(ffprobe: string, file: string): Promise<number> {
  return new Promise((resolve, reject) => {
    const child = spawn(
      ffprobe,
      [
        "-v",
        "error",
        "-show_entries",
        "format=duration",
        "-of",
        "default=noprint_wrappers=1:nokey=1",
        file,
      ],
      { stdio: ["ignore", "pipe", "pipe"] },
    );
    let out = "";
    child.stdout.on("data", (d) => {
      out += String(d);
    });
    child.on("error", reject);
    child.on("close", (code) => {
      if (code !== 0) reject(new Error("ffprobe failed"));
      else resolve(Math.max(0.1, Number(out.trim()) || 1));
    });
  });
}
