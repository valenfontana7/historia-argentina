import { NextResponse } from "next/server";
import type { JobView } from "@museoargent/video-contracts";
import { normalizeAdminJob } from "@/lib/admin-job-normalize";
import { engineFetch } from "@/lib/video/engine-client";
import { requireAdminEngine } from "@/lib/video/engine-proxy-helpers";

export const runtime = "nodejs";

export async function POST(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const denied = await requireAdminEngine();
  if (denied) return denied;
  const { id } = await context.params;
  try {
    const res = await engineFetch(
      `/jobs/${encodeURIComponent(id)}/approve-preview`,
      { method: "POST" },
    );
    const data = await res.json().catch(() => ({ error: "Invalid response" }));
    if (!res.ok) return NextResponse.json(data, { status: res.status });
    return NextResponse.json(normalizeAdminJob(data as JobView));
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
