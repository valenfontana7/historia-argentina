import { spawn, type ChildProcess } from "node:child_process";
import path from "node:path";
import { NextResponse } from "next/server";
import { sesionAdminValida } from "@/lib/admin-auth";
import { cronicas } from "@/content/cronicas/registro";

export const runtime = "nodejs";
export const maxDuration = 120;

const ENQUEUE_TIMEOUT_MS = 120_000;

/** Vercel (y similares) no permiten spawn + FFmpeg + disco persistente. */
function esRuntimeServerless(): boolean {
  return Boolean(process.env.VERCEL) || Boolean(process.env.AWS_LAMBDA_FUNCTION_NAME);
}

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
 * POST /api/admin/reels/generate — arranca el pipeline en background y
 * responde apenas aparece `{ "msg": "job enqueued", "id": "..." }`.
 * Si el arranque tarda más del timeout pero el hijo sigue vivo → pending.
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

  if (esRuntimeServerless()) {
    return NextResponse.json(
      {
        ok: false,
        mensaje:
          "La generación de reels no corre en Vercel (necesita FFmpeg, tsx y disco local). Generá en tu máquina con el panel en localhost o: npm run video:generate -- " +
          slug,
      },
      { status: 501 },
    );
  }

  const root = process.cwd();
  const script = path.join(root, "scripts", "video-generate.ts");
  // Usar node + tsx del proyecto (evita `npx` que intenta escribir en $HOME).
  const args = ["--import", "tsx", script, slug];
  if (body.force) args.push("--force");

  const formatId =
    body.formatId && FORMAT_IDS.has(body.formatId) ? body.formatId : "reel";
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
  if (body.cta?.trim()) {
    args.push("--cta", body.cta.trim());
  }
  if (body.tone?.trim()) {
    args.push("--tone", body.tone.trim());
  }

  const childEnv: NodeJS.ProcessEnv = { ...process.env };
  if (body.llmModel?.trim()) {
    childEnv.OPENAI_LLM_MODEL = body.llmModel.trim();
  }
  if (body.ttsVoice?.trim()) {
    childEnv.OPENAI_TTS_VOICE = body.ttsVoice.trim();
  }
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
      // El hijo sigue en background: el cliente recuperará el job por slug.
      unrefChild(child);
      resolve({ kind: "pending" });
    }, ENQUEUE_TIMEOUT_MS);

    const onChunk = (chunk: Buffer | string) => {
      buffer += String(chunk);
      if (buffer.length > 200_000) {
        buffer = buffer.slice(-50_000);
      }
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
