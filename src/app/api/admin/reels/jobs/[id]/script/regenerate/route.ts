import type { NextRequest } from "next/server";
import {
  proxyEngine,
  requireAdminEngine,
} from "@/lib/video/engine-proxy-helpers";

export const runtime = "nodejs";

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  const denied = await requireAdminEngine();
  if (denied) return denied;
  const { id } = await context.params;
  const body = await request.json().catch(() => ({}));
  return proxyEngine(
    `/jobs/${encodeURIComponent(id)}/script/regenerate`,
    {
      method: "POST",
      body: JSON.stringify(body),
    },
  );
}
