import { NextResponse } from "next/server";
import { sesionAdminValida } from "@/lib/admin-auth";
import { listJobsFromDisk } from "@/lib/admin-video-jobs";
import {
  engineFetch,
  usarVideoEngineRemoto,
} from "@/lib/video/engine-client";

export const runtime = "nodejs";

/** GET /api/admin/reels/jobs — lista jobs (disco local o engine remoto). */
export async function GET() {
  if (!(await sesionAdminValida())) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
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

/** POST /api/admin/reels/jobs — proxy opcional al video-engine Nest. */
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
