import { mkdir, readFile, unlink, writeFile } from "node:fs/promises";
import path from "node:path";
import { spawn } from "node:child_process";
import type { VoiceTrack } from "@museoargent/video-contracts";
import type { VoiceProvider } from "../../application/ports/voice-provider";
import type { ObjectStorage } from "../../application/ports/object-storage";

/**
 * Fallback de narración cuando OpenAI TTS no está disponible.
 * En Windows usa SAPI (voces del sistema, preferencia es-*).
 * Solo como último recurso genera un tono corto.
 */
export class FakeVoiceProvider implements VoiceProvider {
  readonly name = "fake";

  constructor(
    private readonly storage: ObjectStorage,
    private readonly ffmpegPath: string,
  ) {}

  async synthesize(input: {
    text: string;
    voice?: string;
    instructions?: string;
    outputUri: string;
    scene?: number;
  }): Promise<VoiceTrack> {
    const outPath = this.storage.resolvePath(input.outputUri);
    await mkdir(path.dirname(outPath), { recursive: true });
    const wavPath = outPath.replace(/\.mp3$/i, ".wav");

    const spoken = await synthesizeWithSapi(input.text, wavPath);
    if (spoken) {
      const durationSec = await wavDurationSec(wavPath);
      const mp3Ok = await tryEncodeMp3(this.ffmpegPath, wavPath, outPath);
      return {
        provider: this.name,
        voice: spoken.voice,
        fileUri: mp3Ok
          ? input.outputUri.startsWith("file://")
            ? input.outputUri
            : `file://${outPath}`
          : `file://${wavPath}`,
        durationSec,
        sampleRate: spoken.sampleRate,
        scene: input.scene,
      };
    }

    // Último recurso: tono corto (mejor que silencio; no es narración).
    const durationSec = Math.max(2, Math.min(12, input.text.length / 18));
    await writeFile(wavPath, toneWav(durationSec));
    const mp3Ok = await tryEncodeMp3(this.ffmpegPath, wavPath, outPath);
    return {
      provider: this.name,
      voice: input.voice ?? "tone",
      fileUri: mp3Ok
        ? input.outputUri.startsWith("file://")
          ? input.outputUri
          : `file://${outPath}`
        : `file://${wavPath}`,
      durationSec,
      sampleRate: 24000,
      scene: input.scene,
    };
  }
}

async function synthesizeWithSapi(
  text: string,
  wavPath: string,
): Promise<{ voice: string; sampleRate: number } | null> {
  if (process.platform !== "win32") return null;

  const textPath = `${wavPath}.txt`;
  const scriptPath = `${wavPath}.ps1`;
  const trimmed = text.trim();
  if (!trimmed) return null;

  await writeFile(textPath, trimmed, "utf8");

  // Paths JSON-escaped so PowerShell gets literal strings.
  const wavLit = JSON.stringify(wavPath);
  const textLit = JSON.stringify(textPath);
  const script = `
$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Speech
$s = New-Object System.Speech.Synthesis.SpeechSynthesizer
$voices = @($s.GetInstalledVoices() | ForEach-Object { $_.VoiceInfo })
$es = $voices | Where-Object { $_.Culture.Name -like 'es-*' } | Select-Object -First 1
if (-not $es) { $es = $voices | Select-Object -First 1 }
if (-not $es) { throw 'No SAPI voices installed' }
$s.SelectVoice($es.Name)
$s.Rate = 0
$s.Volume = 100
$s.SetOutputToWaveFile(${wavLit})
$t = Get-Content -Raw -Encoding UTF8 ${textLit}
$s.Speak($t)
$s.Dispose()
Write-Output $es.Name
`;
  await writeFile(scriptPath, script, "utf8");

  try {
    const voiceName = await runCapture("powershell.exe", [
      "-NoProfile",
      "-ExecutionPolicy",
      "Bypass",
      "-File",
      scriptPath,
    ]);
    const sampleRate = await wavSampleRate(wavPath);
    return {
      voice: voiceName.trim() || "sapi",
      sampleRate,
    };
  } catch (err) {
    console.warn(
      JSON.stringify({
        msg: "SAPI TTS failed, will use tone fallback",
        error: err instanceof Error ? err.message.slice(0, 300) : String(err),
      }),
    );
    return null;
  } finally {
    await unlink(textPath).catch(() => undefined);
    await unlink(scriptPath).catch(() => undefined);
  }
}

async function tryEncodeMp3(
  ffmpegPath: string,
  wavPath: string,
  mp3Path: string,
): Promise<boolean> {
  try {
    await run(ffmpegPath, [
      "-y",
      "-i",
      wavPath,
      "-ac",
      "1",
      "-ar",
      "24000",
      "-b:a",
      "96k",
      mp3Path,
    ]);
    return true;
  } catch {
    return false;
  }
}

function toneWav(
  durationSec: number,
  sampleRate = 24000,
  frequencyHz = 440,
  amplitude = 0.2,
): Buffer {
  const samples = Math.max(1, Math.floor(durationSec * sampleRate));
  const dataSize = samples * 2;
  const buffer = Buffer.alloc(44 + dataSize);
  buffer.write("RIFF", 0);
  buffer.writeUInt32LE(36 + dataSize, 4);
  buffer.write("WAVE", 8);
  buffer.write("fmt ", 12);
  buffer.writeUInt32LE(16, 16);
  buffer.writeUInt16LE(1, 20);
  buffer.writeUInt16LE(1, 22);
  buffer.writeUInt32LE(sampleRate, 24);
  buffer.writeUInt32LE(sampleRate * 2, 28);
  buffer.writeUInt16LE(2, 32);
  buffer.writeUInt16LE(16, 34);
  buffer.write("data", 36);
  buffer.writeUInt32LE(dataSize, 40);
  const amp = Math.floor(32767 * amplitude);
  for (let i = 0; i < samples; i++) {
    const t = i / sampleRate;
    const env = Math.min(1, t * 8) * Math.min(1, (durationSec - t) * 8);
    const sample = Math.floor(
      Math.sin(2 * Math.PI * frequencyHz * t) * amp * env,
    );
    buffer.writeInt16LE(sample, 44 + i * 2);
  }
  return buffer;
}

/** SAPI suele usar fmt de 18 bytes (+ fact); no asumir data@offset 40. */
function parseWavFormat(buf: Buffer): {
  sampleRate: number;
  channels: number;
  bits: number;
  dataSize: number;
} {
  let sampleRate = 22050;
  let channels = 1;
  let bits = 16;
  let dataSize = Math.max(0, buf.length - 44);
  let pos = 12;
  while (pos + 8 <= buf.length) {
    const id = buf.subarray(pos, pos + 4).toString("ascii");
    const size = buf.readUInt32LE(pos + 4);
    const body = pos + 8;
    if (id === "fmt " && size >= 16) {
      channels = buf.readUInt16LE(body + 2) || 1;
      sampleRate = buf.readUInt32LE(body + 4) || 22050;
      bits = buf.readUInt16LE(body + 14) || 16;
    } else if (id === "data") {
      dataSize = size;
      break;
    }
    pos = body + size + (size & 1);
  }
  return { sampleRate, channels, bits, dataSize };
}

async function wavDurationSec(filePath: string): Promise<number> {
  const buf = await readFile(filePath);
  const { sampleRate, channels, bits, dataSize } = parseWavFormat(buf);
  const bytesPerSample = (bits / 8) * channels;
  if (!bytesPerSample || !sampleRate) return 2;
  const sec = dataSize / (sampleRate * bytesPerSample);
  // Tope de seguridad: evitar renders de horas si el header es raro.
  return Math.max(0.4, Math.min(45, sec));
}

async function wavSampleRate(filePath: string): Promise<number> {
  const buf = await readFile(filePath);
  return parseWavFormat(buf).sampleRate;
}

function run(bin: string, args: string[]): Promise<void> {
  return new Promise((resolve, reject) => {
    const child = spawn(bin, args, { stdio: ["ignore", "ignore", "pipe"] });
    let err = "";
    child.stderr.on("data", (d) => {
      err += String(d);
    });
    child.on("error", reject);
    child.on("close", (code) => {
      if (code === 0) resolve();
      else reject(new Error(`${bin} exited ${code}: ${err.slice(-500)}`));
    });
  });
}

function runCapture(bin: string, args: string[]): Promise<string> {
  return new Promise((resolve, reject) => {
    const child = spawn(bin, args, { stdio: ["ignore", "pipe", "pipe"] });
    let out = "";
    let err = "";
    child.stdout.on("data", (d) => {
      out += String(d);
    });
    child.stderr.on("data", (d) => {
      err += String(d);
    });
    child.on("error", reject);
    child.on("close", (code) => {
      if (code === 0) resolve(out.trim());
      else reject(new Error(`${bin} exited ${code}: ${err.slice(-500) || out.slice(-500)}`));
    });
  });
}
