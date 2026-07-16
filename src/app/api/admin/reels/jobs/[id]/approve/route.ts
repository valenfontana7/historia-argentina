import { NextResponse } from "next/server";
import type { JobView } from "@museoargent/video-contracts";
import { sesionAdminValida } from "@/lib/admin-auth";
import { normalizeAdminJob } from "@/lib/admin-job-normalize";
import {
  engineFetch,
  esRuntimeServerless,
  videoEngineUrlConfigurada,
} from "@/lib/video/engine-client";

export const runtime = "nodejs";

/** POST /api/admin/reels/jobs/:id/approve */
export async function POST(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  if (!(await sesionAdminValida())) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const { id } = await context.params;

  if (esRuntimeServerless() && !videoEngineUrlConfigurada()) {
    return NextResponse.json(
      { error: "Falta VIDEO_ENGINE_URL del worker" },
      { status: 501 },
    );
  }

  try {
    const res = await engineFetch(`/jobs/${encodeURIComponent(id)}/approve`, {
      method: "POST",
    });
    const data = await res.json().catch(() => ({ error: "Invalid response" }));
    if (!res.ok) {
      return NextResponse.json(data, { status: res.status });
    }
    return NextResponse.json(normalizeAdminJob(data as JobView), {
      status: 200,
    });
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
