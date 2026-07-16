import { open, stat } from "node:fs/promises";
import { NextResponse } from "next/server";
import { sesionAdminValida } from "@/lib/admin-auth";
import { getJobFromDisk, mp4PathForJob } from "@/lib/admin-video-jobs";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * GET /api/admin/reels/media/:id — sirve output.mp4 con Range.
 * ?download=1 → Content-Disposition attachment (guardar desde iPhone/desktop).
 */
export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  if (!(await sesionAdminValida())) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const { id } = await context.params;
  const url = new URL(request.url);
  const wantsDownload =
    url.searchParams.get("download") === "1" ||
    url.searchParams.get("download") === "true";

  let filePath: string;
  try {
    const resolved = await mp4PathForJob(id);
    if (!resolved) {
      return NextResponse.json({ error: "MP4 no encontrado" }, { status: 404 });
    }
    filePath = resolved;
  } catch {
    return NextResponse.json({ error: "jobId inválido" }, { status: 400 });
  }

  const job = await getJobFromDisk(id);
  const filename = downloadFilename(job?.slug ?? "reel", id);
  const disposition = wantsDownload
    ? `attachment; filename="${filename}"`
    : `inline; filename="${filename}"`;

  const fileStat = await stat(filePath);
  const size = fileStat.size;
  const range = request.headers.get("range");

  if (range) {
    const match = /^bytes=(\d+)-(\d*)$/.exec(range);
    if (!match) {
      return new NextResponse("Invalid range", { status: 416 });
    }
    const start = Number(match[1]);
    const end = match[2]
      ? Number(match[2])
      : Math.min(start + 1024 * 1024 - 1, size - 1);
    if (
      Number.isNaN(start) ||
      Number.isNaN(end) ||
      start >= size ||
      start > end
    ) {
      return new NextResponse("Range not satisfiable", {
        status: 416,
        headers: { "Content-Range": `bytes */${size}` },
      });
    }
    const safeEnd = Math.min(end, size - 1);
    const chunkSize = safeEnd - start + 1;
    const chunk = await readFileSlice(filePath, start, chunkSize);
    return new NextResponse(Buffer.from(chunk), {
      status: 206,
      headers: {
        "Content-Type": "video/mp4",
        "Content-Length": String(chunkSize),
        "Content-Range": `bytes ${start}-${safeEnd}/${size}`,
        "Accept-Ranges": "bytes",
        "Cache-Control": "private, max-age=0",
        "Content-Disposition": disposition,
      },
    });
  }

  const whole = await readFileSlice(filePath, 0, size);
  return new NextResponse(Buffer.from(whole), {
    status: 200,
    headers: {
      "Content-Type": "video/mp4",
      "Content-Length": String(size),
      "Accept-Ranges": "bytes",
      "Cache-Control": "private, max-age=0",
      "Content-Disposition": disposition,
    },
  });
}

function downloadFilename(slug: string, jobId: string): string {
  const safeSlug =
    slug
      .toLowerCase()
      .replace(/[^a-z0-9-_]+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 48) || "reel";
  const shortId = jobId.replace(/[^a-zA-Z0-9_-]/g, "").slice(-8) || "job";
  return `museoargent-${safeSlug}-${shortId}.mp4`;
}

async function readFileSlice(
  filePath: string,
  start: number,
  length: number,
): Promise<Uint8Array> {
  const handle = await open(filePath, "r");
  try {
    const buffer = Buffer.allocUnsafe(length);
    const { bytesRead } = await handle.read(buffer, 0, length, start);
    return bytesRead === length ? buffer : buffer.subarray(0, bytesRead);
  } finally {
    await handle.close();
  }
}
