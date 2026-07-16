import type { NextRequest } from "next/server";
import {
  proxyEngine,
  requireAdminEngine,
} from "@/lib/video/engine-proxy-helpers";

export const runtime = "nodejs";

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  const denied = await requireAdminEngine();
  if (denied) return denied;
  const { id } = await context.params;
  return proxyEngine(`/jobs/${encodeURIComponent(id)}/memory`);
}

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  const denied = await requireAdminEngine();
  if (denied) return denied;
  const { id } = await context.params;
  const body = await request.json();
  return proxyEngine(`/jobs/${encodeURIComponent(id)}/memory`, {
    method: "PATCH",
    body: JSON.stringify(body),
  });
}
