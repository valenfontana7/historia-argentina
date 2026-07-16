import type { NextRequest } from "next/server";
import {
  proxyEngine,
  requireAdminEngine,
} from "@/lib/video/engine-proxy-helpers";

export const runtime = "nodejs";

export async function POST(
  _request: NextRequest,
  context: { params: Promise<{ id: string; scene: string }> },
) {
  const denied = await requireAdminEngine();
  if (denied) return denied;
  const { id, scene } = await context.params;
  return proxyEngine(
    `/jobs/${encodeURIComponent(id)}/preview/${encodeURIComponent(scene)}/regenerate`,
    { method: "POST" },
  );
}
