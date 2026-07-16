import { NextResponse } from "next/server";
import { engineFetch } from "@/lib/video/engine-client";
import { requireAdminEngine } from "@/lib/video/engine-proxy-helpers";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string; scene: string }> },
) {
  const denied = await requireAdminEngine();
  if (denied) return denied;
  const { id, scene } = await context.params;
  const headers: HeadersInit = {};
  const range = request.headers.get("range");
  if (range) headers.Range = range;
  try {
    const res = await engineFetch(
      `/jobs/${encodeURIComponent(id)}/media/preview/${encodeURIComponent(scene)}`,
      { headers },
    );
    if (!res.ok) {
      const errBody = await res.text().catch(() => "");
      return NextResponse.json(
        { error: errBody || `Media ${res.status}` },
        { status: res.status },
      );
    }
    const outHeaders = new Headers();
    for (const h of [
      "content-type",
      "content-length",
      "content-range",
      "accept-ranges",
      "content-disposition",
      "cache-control",
    ]) {
      const v = res.headers.get(h);
      if (v) outHeaders.set(h, v);
    }
    return new NextResponse(res.body, { status: res.status, headers: outHeaders });
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
