import { NextResponse } from "next/server";
import { sesionAdminValida } from "@/lib/admin-auth";
import { runDiscovery } from "@/lib/editorial/discovery/orchestrator";

export const runtime = "nodejs";
export const maxDuration = 120;

function authorizedCron(request: Request): boolean {
  const secret = process.env.CRON_SECRET?.trim();
  if (!secret) return false;
  const header = request.headers.get("authorization");
  return header === `Bearer ${secret}`;
}

export async function POST(request: Request) {
  const isCron = authorizedCron(request);
  const isAdmin = !isCron ? await sesionAdminValida() : false;
  if (!isCron && !isAdmin) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  try {
    const result = await runDiscovery();
    return NextResponse.json({ ok: true, ...result });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
