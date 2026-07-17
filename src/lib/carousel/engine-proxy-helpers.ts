import { NextResponse } from "next/server";
import { sesionAdminValida } from "@/lib/admin-auth";
import {
  carouselEngineFetch,
  carouselEngineBase,
} from "@/lib/carousel/engine-client";
import { esRuntimeServerless } from "@/lib/video/engine-client";

const OFFLINE_MSG =
  "Carousel engine offline. ¿video-engine + carousel-engine + túnel arriba?";

export async function requireAdminCarousel(): Promise<NextResponse | null> {
  if (!(await sesionAdminValida())) {
    return NextResponse.json(
      { ok: false, mensaje: "No autorizado.", error: "No autorizado" },
      { status: 401 },
    );
  }
  if (esRuntimeServerless()) {
    const base = carouselEngineBase();
    try {
      const host = new URL(base).hostname;
      const local =
        host === "localhost" || host === "127.0.0.1" || host === "::1";
      if (local) {
        return NextResponse.json(
          {
            ok: false,
            mensaje: "Falta VIDEO_ENGINE_URL (túnel) para el carousel en Vercel.",
            error: "Falta VIDEO_ENGINE_URL del worker",
          },
          { status: 501 },
        );
      }
    } catch {
      return NextResponse.json(
        {
          ok: false,
          mensaje: "URL del carousel engine inválida.",
          error: "Invalid carousel engine URL",
        },
        { status: 501 },
      );
    }
  }
  return null;
}

export async function proxyCarouselJson(
  path: string,
  init?: RequestInit,
): Promise<NextResponse> {
  try {
    const res = await carouselEngineFetch(path, init);
    const data = await res.json().catch(() => ({
      error: "Invalid response",
      mensaje: "Respuesta inválida del carousel engine",
    }));
    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    return NextResponse.json(
      {
        ok: false,
        error:
          err instanceof Error
            ? `Engine offline: ${err.message}`
            : "Engine offline",
        mensaje: OFFLINE_MSG,
      },
      { status: 502 },
    );
  }
}

export async function proxyCarouselBinary(
  path: string,
  opts?: { contentType?: string; filename?: string },
): Promise<NextResponse> {
  try {
    const res = await carouselEngineFetch(path);
    if (!res.ok) {
      return NextResponse.json(
        { ok: false, mensaje: "Recurso no encontrado." },
        { status: res.status },
      );
    }
    const buf = Buffer.from(await res.arrayBuffer());
    const headers: Record<string, string> = {
      "Content-Type":
        opts?.contentType ??
        res.headers.get("content-type") ??
        "application/octet-stream",
      "Cache-Control": "no-store",
    };
    if (opts?.filename) {
      headers["Content-Disposition"] =
        `attachment; filename="${opts.filename}"`;
    }
    return new NextResponse(buf, {
      status: 200,
      headers,
    });
  } catch (err) {
    return NextResponse.json(
      {
        ok: false,
        error:
          err instanceof Error
            ? `Engine offline: ${err.message}`
            : "Engine offline",
        mensaje: OFFLINE_MSG,
      },
      { status: 502 },
    );
  }
}
