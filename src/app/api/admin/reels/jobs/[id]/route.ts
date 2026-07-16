import { NextResponse } from "next/server";
import { sesionAdminValida } from "@/lib/admin-auth";
import { getJobFromDisk } from "@/lib/admin-video-jobs";
import {
  engineFetch,
  usarVideoEngineRemoto,
} from "@/lib/video/engine-client";

export const runtime = "nodejs";

/** GET /api/admin/reels/jobs/:id — disco local o engine remoto. */
export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  if (!(await sesionAdminValida())) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const { id } = await context.params;

  if (usarVideoEngineRemoto()) {
    try {
      const res = await engineFetch(`/jobs/${encodeURIComponent(id)}`);
      const data = await res.json().catch(() => ({ error: "Invalid response" }));
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

  const fromDisk = await getJobFromDisk(id);
  if (fromDisk) {
    return NextResponse.json(fromDisk);
  }

  try {
    const res = await engineFetch(`/jobs/${encodeURIComponent(id)}`);
    if (res.ok) {
      const data = await res.json();
      return NextResponse.json(data, { status: res.status });
    }
  } catch {
    // engine offline
  }

  return NextResponse.json({ error: "Job no encontrado" }, { status: 404 });
}
