import { NextResponse } from "next/server";
import { sesionAdminValida } from "@/lib/admin-auth";
import { listJobsFromDisk } from "@/lib/admin-video-jobs";
import {
  engineFetch,
  esRuntimeServerless,
  usarVideoEngineRemoto,
  videoEngineUrlConfigurada,
} from "@/lib/video/engine-client";

export const runtime = "nodejs";

/** GET /api/admin/reels/jobs — en prod siempre el VPS; local puede usar disco. */
export async function GET() {
  if (!(await sesionAdminValida())) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  if (esRuntimeServerless() && !videoEngineUrlConfigurada()) {
    return NextResponse.json(
      { error: "Falta VIDEO_ENGINE_URL del worker VPS", jobs: [] },
      { status: 501 },
    );
  }

  if (usarVideoEngineRemoto()) {
    try {
      const res = await engineFetch("/jobs");
      const data = await res.json().catch(() => ({ jobs: [] }));
      return NextResponse.json(data, { status: res.status });
    } catch (err) {
      return NextResponse.json(
        {
          error:
            err instanceof Error
              ? `Engine offline: ${err.message}`
              : "Engine offline",
          jobs: [],
        },
        { status: 502 },
      );
    }
  }

  const jobs = await listJobsFromDisk();
  return NextResponse.json({ jobs });
}

/** POST /api/admin/reels/jobs — proxy al video-engine. */
export async function POST(request: Request) {
  if (!(await sesionAdminValida())) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const body = await request.json();
  try {
    const res = await engineFetch("/jobs", {
      method: "POST",
      body: JSON.stringify(body),
    });
    const data = await res.json().catch(() => ({ error: "Invalid engine response" }));
    return NextResponse.json(data, { status: res.status });
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
