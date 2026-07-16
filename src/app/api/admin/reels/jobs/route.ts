import { NextResponse } from "next/server";
import { sesionAdminValida } from "@/lib/admin-auth";
import { listJobsFromDisk } from "@/lib/admin-video-jobs";

export const runtime = "nodejs";

/** GET /api/admin/reels/jobs — lista jobs desde disco. */
export async function GET() {
  if (!(await sesionAdminValida())) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const jobs = await listJobsFromDisk();
  return NextResponse.json({ jobs });
}

function engineBase(): string {
  return (process.env.VIDEO_ENGINE_URL ?? "http://127.0.0.1:4100").replace(
    /\/$/,
    "",
  );
}

function engineKey(): string {
  return process.env.VIDEO_ENGINE_API_KEY ?? "dev-video-engine-key";
}

/** POST /api/admin/reels/jobs — proxy opcional al video-engine Nest. */
export async function POST(request: Request) {
  if (!(await sesionAdminValida())) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const body = await request.json();
  const res = await fetch(`${engineBase()}/jobs`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-api-key": engineKey(),
    },
    body: JSON.stringify(body),
  });

  const data = await res.json().catch(() => ({ error: "Invalid engine response" }));
  return NextResponse.json(data, { status: res.status });
}
