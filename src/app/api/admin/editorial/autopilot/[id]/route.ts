import { NextResponse } from "next/server";
import { obtenerSesionAdmin } from "@/lib/admin-auth";
import { queueAutopilot, runAutopilot } from "@/lib/editorial/autopilot/pipeline";

export const runtime = "nodejs";
export const maxDuration = 300;

export async function POST(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await obtenerSesionAdmin();
  if (!session) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  try {
    await queueAutopilot(id);
    const result = await runAutopilot(id, session.email);
    return NextResponse.json({ ok: true, ...result });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
