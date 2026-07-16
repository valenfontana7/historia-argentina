import { NextResponse } from "next/server";
import { sesionAdminValida } from "@/lib/admin-auth";
import { getJobFromDisk } from "@/lib/admin-video-jobs";

export const runtime = "nodejs";

function engineBase(): string {
  return (process.env.VIDEO_ENGINE_URL ?? "http://127.0.0.1:4100").replace(
    /\/$/,
    "",
  );
}

function engineKey(): string {
  return process.env.VIDEO_ENGINE_API_KEY ?? "dev-video-engine-key";
}

/** GET /api/admin/reels/jobs/:id — job.json del disco; fallback Nest. */
export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  if (!(await sesionAdminValida())) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const { id } = await context.params;
  const fromDisk = await getJobFromDisk(id);
  if (fromDisk) {
    return NextResponse.json(fromDisk);
  }

  try {
    const res = await fetch(`${engineBase()}/jobs/${encodeURIComponent(id)}`, {
      headers: { "x-api-key": engineKey() },
    });
    if (res.ok) {
      const data = await res.json();
      return NextResponse.json(data, { status: res.status });
    }
  } catch {
    // engine offline
  }

  return NextResponse.json({ error: "Job no encontrado" }, { status: 404 });
}
