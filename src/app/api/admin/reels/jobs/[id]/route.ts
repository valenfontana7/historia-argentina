import { NextResponse } from "next/server";
import type { JobView } from "@museoargent/video-contracts";
import { sesionAdminValida } from "@/lib/admin-auth";
import { normalizeAdminJob } from "@/lib/admin-job-normalize";
import { getJobFromDisk } from "@/lib/admin-video-jobs";
import {
  engineFetch,
  esRuntimeServerless,
  usarVideoEngineRemoto,
  videoEngineUrlConfigurada,
} from "@/lib/video/engine-client";

export const runtime = "nodejs";

/** GET /api/admin/reels/jobs/:id — en prod el VPS; local disco o engine. */
export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  if (!(await sesionAdminValida())) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const { id } = await context.params;

  if (esRuntimeServerless() && !videoEngineUrlConfigurada()) {
    return NextResponse.json(
      { error: "Falta VIDEO_ENGINE_URL del worker VPS" },
      { status: 501 },
    );
  }

  if (usarVideoEngineRemoto()) {
    try {
      const res = await engineFetch(`/jobs/${encodeURIComponent(id)}`);
      const data = await res.json().catch(() => ({ error: "Invalid response" }));
      if (!res.ok) {
        return NextResponse.json(data, { status: res.status });
      }
      return NextResponse.json(
        normalizeAdminJob(data as JobView),
        { status: 200 },
      );
    } catch (err) {
      return NextResponse.json(
        {
          error:
            err instanceof Error
              ? `Engine offline: ${err.message}`
              : "Engine offline",
        },
        { status: 502 },
      );
    }
  }

  const fromDisk = await getJobFromDisk(id);
  if (fromDisk) {
    return NextResponse.json(fromDisk);
  }

  try {
    const res = await engineFetch(`/jobs/${encodeURIComponent(id)}`);
    if (res.ok) {
      const data = (await res.json()) as JobView;
      return NextResponse.json(normalizeAdminJob(data), { status: res.status });
    }
  } catch {
    // engine offline
  }

  return NextResponse.json({ error: "Job no encontrado" }, { status: 404 });
}
