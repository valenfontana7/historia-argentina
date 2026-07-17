/**
 * Cliente HTTP hacia el carousel-engine.
 * En producción reutiliza VIDEO_ENGINE_URL/carousel (proxy del video-engine)
 * y VIDEO_ENGINE_API_KEY como clave media compartida.
 */

import { existsSync, readFileSync } from "node:fs";
import path from "node:path";

function esHostLocal(hostname: string): boolean {
  const h = hostname.toLowerCase();
  return h === "localhost" || h === "127.0.0.1" || h === "::1";
}

function stripTrailingSlash(url: string): string {
  return url.replace(/\/$/, "");
}

/** En monorepo local: si Next no tiene la key, leer apps/video-engine/.env. */
function hydrateMediaApiKeyFromVideoEnv(): void {
  if (process.env.VIDEO_ENGINE_API_KEY?.trim()) return;
  if (process.env.CAROUSEL_ENGINE_API_KEY?.trim()) return;
  const candidates = [
    path.join(process.cwd(), "apps/video-engine/.env"),
    path.join(process.cwd(), "../video-engine/.env"),
  ];
  for (const file of candidates) {
    if (!existsSync(file)) continue;
    const m = /^VIDEO_ENGINE_API_KEY=(.+)$/m.exec(readFileSync(file, "utf8"));
    const raw = m?.[1]?.trim().replace(/^["']|["']$/g, "");
    if (raw) {
      process.env.VIDEO_ENGINE_API_KEY = raw;
      return;
    }
  }
}

export function carouselEngineBase(): string {
  const explicit = process.env.CAROUSEL_ENGINE_URL?.trim();
  if (explicit) return stripTrailingSlash(explicit);

  const videoUrl = process.env.VIDEO_ENGINE_URL?.trim();
  if (videoUrl) {
    try {
      const host = new URL(videoUrl).hostname;
      if (!esHostLocal(host)) {
        return `${stripTrailingSlash(videoUrl)}/carousel`;
      }
    } catch {
      // ignore invalid VIDEO_ENGINE_URL
    }
  }

  return "http://127.0.0.1:4120";
}

export function carouselEngineKey(): string {
  hydrateMediaApiKeyFromVideoEnv();
  return (
    process.env.CAROUSEL_ENGINE_API_KEY ??
    process.env.VIDEO_ENGINE_API_KEY ??
    "dev-video-engine-key"
  );
}

export async function carouselEngineFetch(
  path: string,
  init?: RequestInit,
): Promise<Response> {
  const url = `${carouselEngineBase()}${path.startsWith("/") ? path : `/${path}`}`;
  const headers = new Headers(init?.headers);
  headers.set("x-api-key", carouselEngineKey());
  if (init?.body && !headers.has("content-type")) {
    headers.set("content-type", "application/json");
  }
  return fetch(url, { ...init, headers });
}
