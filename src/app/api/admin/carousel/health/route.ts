import { NextResponse } from "next/server";
import { requireAdminCarousel } from "@/lib/carousel/engine-proxy-helpers";
import {
  carouselEngineBase,
  carouselEngineFetch,
} from "@/lib/carousel/engine-client";
import { engineFetch } from "@/lib/video/engine-client";

export const runtime = "nodejs";

type EngineHealth = {
  ok?: boolean;
  renderer?: "playwright" | "fake";
  chromiumOk?: boolean;
  storageRoot?: string;
};

/**
 * Diagnóstico: distingue túnel/video caído vs carousel-engine vs Playwright missing.
 */
export async function GET() {
  const denied = await requireAdminCarousel();
  if (denied) return denied;

  const base = carouselEngineBase();
  let mode: "local" | "tunnel" = "local";
  try {
    const host = new URL(base).hostname;
    const local =
      host === "localhost" || host === "127.0.0.1" || host === "::1";
    mode = local ? "local" : "tunnel";
  } catch {
    mode = "local";
  }

  let carouselOk = false;
  let videoOk: boolean | undefined;
  let renderer: "playwright" | "fake" | undefined;
  let chromiumOk: boolean | undefined;

  try {
    const res = await carouselEngineFetch("/health");
    carouselOk = res.ok;
    if (res.ok) {
      const data = (await res.json().catch(() => ({}))) as EngineHealth;
      renderer = data.renderer;
      chromiumOk = data.chromiumOk;
    }
  } catch {
    carouselOk = false;
  }

  if (mode === "tunnel") {
    try {
      const res = await engineFetch("/health");
      videoOk = res.ok;
    } catch {
      videoOk = false;
    }
  }

  let mensaje: string | undefined;
  if (carouselOk && (videoOk === undefined || videoOk)) {
    if (renderer === "fake" || chromiumOk === false) {
      mensaje =
        "Carousel responde con renderer fake — instalá Chromium: en apps/carousel-engine ejecutá npm run playwright:install y reiniciá el engine.";
      return NextResponse.json({
        ok: true,
        mode,
        carouselOk,
        videoOk,
        renderer,
        chromiumOk,
        mensaje,
        warning: "fake_renderer",
      });
    }
    return NextResponse.json({
      ok: true,
      mode,
      carouselOk,
      videoOk,
      renderer,
      chromiumOk,
    });
  }

  if (mode === "tunnel" && videoOk === false) {
    mensaje =
      "Túnel/video-engine inaccesible — ¿`npm run video:tunnel` y VIDEO_ENGINE_URL actualizada en Vercel?";
  } else if (mode === "tunnel" && videoOk && !carouselOk) {
    mensaje =
      "Video/túnel OK, pero carousel no responde — ¿`npm run carousel:engine:start` en la PC?";
  } else if (!carouselOk) {
    mensaje =
      "Carousel engine offline — ¿`npm run carousel:engine:start` (puerto 4120)?";
  }

  return NextResponse.json(
    {
      ok: false,
      mode,
      carouselOk,
      videoOk,
      renderer,
      chromiumOk,
      mensaje,
    },
    { status: 502 },
  );
}
