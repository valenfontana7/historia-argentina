import { NextResponse } from "next/server";
import type { JobDraft } from "@museoargent/video-contracts";
import { sesionAdminValida } from "@/lib/admin-auth";
import {
  engineFetch,
  esRuntimeServerless,
  videoEngineUrlConfigurada,
} from "@/lib/video/engine-client";

export const runtime = "nodejs";

/** GET /api/admin/reels/jobs/:id/draft */
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
      { error: "Falta VIDEO_ENGINE_URL del worker" },
      { status: 501 },
    );
  }

  try {
    const res = await engineFetch(`/jobs/${encodeURIComponent(id)}/draft`);
    const data = await res.json().catch(() => ({ error: "Invalid response" }));
    if (!res.ok) {
      return NextResponse.json(data, { status: res.status });
    }
    return NextResponse.json(data as JobDraft, { status: 200 });
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

/** PATCH /api/admin/reels/jobs/:id/draft */
export async function PATCH(
  request: Request,
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
    const body = await request.json();
    const res = await engineFetch(`/jobs/${encodeURIComponent(id)}/draft`, {
      method: "PATCH",
      body: JSON.stringify(body),
    });
    const data = await res.json().catch(() => ({ error: "Invalid response" }));
    if (!res.ok) {
      return NextResponse.json(data, { status: res.status });
    }
    return NextResponse.json(data as JobDraft, { status: 200 });
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
