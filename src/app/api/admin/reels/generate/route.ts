import { spawn, type ChildProcess } from "node:child_process";
import path from "node:path";
import { NextResponse } from "next/server";
import {
  NarrativePaceSchema,
  type ProfileOverrides,
  type VideoFormatId,
} from "@museoargent/video-contracts";
import { sesionAdminValida } from "@/lib/admin-auth";
import { cronicas } from "@/content/cronicas/registro";
import {
  engineFetch,
  esRuntimeServerless,
  usarVideoEngineRemoto,
} from "@/lib/video/engine-client";
import { exhibitionFromCronica } from "@/lib/video/exhibition-from-cronica";

export const runtime = "nodejs";
export const maxDuration = 120;

const ENQUEUE_TIMEOUT_MS = 120_000;

const FORMAT_IDS = new Set([
  "reel",
  "short",
  "historia",
  "documental",
  "curiosidad",
  "efemeride",
]);
const PACES = new Set(["rapido", "medio", "pausado"]);

type GenerateBody = {
  slug?: string;
  force?: boolean;
  formatId?: string;
  targetDurationSec?: number;
  narrativePace?: string;
  cta?: string;
  tone?: string;
  ttsVoice?: string;
  ttsInstructions?: string;
  llmModel?: string;
};

type EnqueueResult =
  | { kind: "enqueued"; jobId: string }
  | { kind: "pending" };

/**
 * POST /api/admin/reels/generate — remoto (VPS) o spawn local.
 */
export async function POST(request: Request) {
  if (!(await sesionAdminValida())) {
    return NextResponse.json({ ok: false, mensaje: "No autorizado." }, { status: 401 });
  }

  const body = (await request.json()) as GenerateBody;
  const slug = body.slug?.trim();
  if (!slug) {
    return NextResponse.json({ ok: false, mensaje: "Falta slug." }, { status: 400 });
  }
  if (!cronicas.some((c) => c.slug === slug)) {
    return NextResponse.json({ ok: false, mensaje: "Crónica no encontrada." }, { status: 404 });
  }

  const formatId = (
    body.formatId && FORMAT_IDS.has(body.formatId) ? body.formatId : "reel"
  ) as VideoFormatId;

  const profileOverrides = buildProfileOverrides(body);

  if (usarVideoEngineRemoto()) {
    return enqueueRemoto(slug, body.force === true, formatId, profileOverrides);
  }

  if (esRuntimeServerless()) {
    return NextResponse.json(
      {
        ok: false,
        mensaje:
          "Configurá VIDEO_ENGINE_URL (URL pública del worker en tu VPS) y VIDEO_ENGINE_API_KEY en Vercel para generar reels en producción.",
      },
      { status: 501 },
    );
  }

  return enqueueLocal(slug, body, formatId);
}

async function enqueueRemoto(
  slug: string,
  force: boolean,
  formatId: VideoFormatId,
  profileOverrides: ProfileOverrides | undefined,
) {
  const built = exhibitionFromCronica(slug);
  if (!built) {
    return NextResponse.json({ ok: false, mensaje: "Crónica no encontrada." }, { status: 404 });
  }

  try {
    const res = await engineFetch("/jobs", {
      method: "POST",
      body: JSON.stringify({
        exhibition: built.exhibition,
        formatId,
        force,
        profileOverrides,
        imageCatalog: built.imageCatalog,
      }),
    });
    const data = (await res.json().catch(() => ({}))) as {
      id?: string;
      message?: string;
      mensaje?: string;
    };
    if (res.status === 409) {
      return NextResponse.json(
        {
          ok: false,
          mensaje:
            data.message ??
            data.mensaje ??
            "Ya hay un reel en generación. Esperá a que termine.",
        },
        { status: 409 },
      );
    }
    if (!res.ok || typeof data.id !== "string") {
      return NextResponse.json(
        {
          ok: false,
          mensaje:
            data.message ??
            data.mensaje ??
            `El video-engine respondió ${res.status}.`,
        },
        { status: res.status >= 400 ? res.status : 502 },
      );
    }
    return NextResponse.json({ ok: true, jobId: data.id });
  } catch (err) {
    return NextResponse.json(
      {
        ok: false,
        mensaje:
          err instanceof Error
            ? `No se pudo contactar el video-engine: ${err.message}`
            : String(err),
      },
      { status: 502 },
    );
  }
}

async function enqueueLocal(
  slug: string,
  body: GenerateBody,
  formatId: VideoFormatId,
) {
  const root = process.cwd();
  const script = path.join(root, "scripts", "video-generate.ts");
  const args = ["--import", "tsx", script, slug];
  if (body.force) args.push("--force");
  args.push("--format", formatId);

  if (
    typeof body.targetDurationSec === "number" &&
    Number.isFinite(body.targetDurationSec) &&
    body.targetDurationSec > 0
  ) {
    args.push("--duration", String(Math.round(body.targetDurationSec)));
  }
  if (body.narrativePace && PACES.has(body.narrativePace)) {
    args.push("--pace", body.narrativePace);
  }
  if (body.cta?.trim()) args.push("--cta", body.cta.trim());
  if (body.tone?.trim()) args.push("--tone", body.tone.trim());

  const childEnv: NodeJS.ProcessEnv = { ...process.env };
  if (body.llmModel?.trim()) childEnv.OPENAI_LLM_MODEL = body.llmModel.trim();
  if (body.ttsVoice?.trim()) childEnv.OPENAI_TTS_VOICE = body.ttsVoice.trim();
  if (body.ttsInstructions?.trim()) {
    childEnv.OPENAI_TTS_INSTRUCTIONS = body.ttsInstructions.trim();
  }

  try {
    const result = await spawnUntilEnqueued(
      process.execPath,
      args,
      root,
      childEnv,
    );
    if (result.kind === "pending") {
      return NextResponse.json({ ok: true, pending: true, slug });
    }
    return NextResponse.json({ ok: true, jobId: result.jobId });
  } catch (err) {
    return NextResponse.json(
      {
        ok: false,
        mensaje: err instanceof Error ? err.message : String(err),
      },
      { status: 500 },
    );
  }
}

function buildProfileOverrides(body: GenerateBody): ProfileOverrides | undefined {
  const overrides: ProfileOverrides = {};
  if (
    typeof body.targetDurationSec === "number" &&
    Number.isFinite(body.targetDurationSec) &&
    body.targetDurationSec > 0
  ) {
    overrides.targetDurationSec = Math.round(body.targetDurationSec);
  }
  if (body.narrativePace) {
    const pace = NarrativePaceSchema.safeParse(body.narrativePace);
    if (pace.success) overrides.narrativePace = pace.data;
  }
  if (body.cta?.trim()) overrides.cta = body.cta.trim();
  if (body.tone?.trim()) overrides.tone = body.tone.trim();
  return Object.keys(overrides).length ? overrides : undefined;
}

function spawnUntilEnqueued(
  cmd: string,
  args: string[],
  cwd: string,
  env: NodeJS.ProcessEnv,
): Promise<EnqueueResult> {
  return new Promise((resolve, reject) => {
    const child = spawn(cmd, args, {
      cwd,
      shell: false,
      env,
      detached: true,
      stdio: ["ignore", "pipe", "pipe"],
    });

    let settled = false;
    let buffer = "";
    const timeout = setTimeout(() => {
      if (settled) return;
      settled = true;
      unrefChild(child);
      resolve({ kind: "pending" });
    }, ENQUEUE_TIMEOUT_MS);

    const onChunk = (chunk: Buffer | string) => {
      buffer += String(chunk);
      if (buffer.length > 200_000) buffer = buffer.slice(-50_000);
      const id = extractEnqueuedId(buffer);
      if (id && !settled) {
        settled = true;
        clearTimeout(timeout);
        unrefChild(child);
        resolve({ kind: "enqueued", jobId: id });
      }
    };

    child.stdout?.on("data", onChunk);
    child.stderr?.on("data", onChunk);

    child.on("error", (err) => {
      if (settled) return;
      settled = true;
      clearTimeout(timeout);
      reject(err);
    });

    child.on("close", (code) => {
      if (settled) return;
      settled = true;
      clearTimeout(timeout);
      const id = extractEnqueuedId(buffer);
      if (id) {
        resolve({ kind: "enqueued", jobId: id });
        return;
      }
      reject(
        new Error(
          code === 0
            ? "El proceso terminó sin reportar job enqueued."
            : `Proceso salió con código ${code}. ${buffer.slice(-800)}`,
        ),
      );
    });
  });
}

function unrefChild(child: ChildProcess) {
  try {
    child.unref();
  } catch {
    // ignore
  }
}

function extractEnqueuedId(text: string): string | null {
  const lines = text.split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed.startsWith("{")) continue;
    try {
      const obj = JSON.parse(trimmed) as { msg?: string; id?: string };
      if (obj.msg === "job enqueued" && typeof obj.id === "string") {
        return obj.id;
      }
    } catch {
      // línea no JSON
    }
  }
  return null;
}
