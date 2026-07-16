/**
 * Cliente HTTP hacia el video-engine (VPS).
 * En Vercel / producción siempre se usa el engine remoto.
 * Auth admin la hace Next; hacia el engine va VIDEO_ENGINE_API_KEY.
 */

export function videoEngineBase(): string {
  return (process.env.VIDEO_ENGINE_URL ?? "http://127.0.0.1:4100").replace(
    /\/$/,
    "",
  );
}

export function videoEngineKey(): string {
  return process.env.VIDEO_ENGINE_API_KEY ?? "dev-video-engine-key";
}

function esHostLocal(hostname: string): boolean {
  const h = hostname.toLowerCase();
  return h === "localhost" || h === "127.0.0.1" || h === "::1";
}

export function esRuntimeServerless(): boolean {
  return (
    Boolean(process.env.VERCEL) ||
    Boolean(process.env.AWS_LAMBDA_FUNCTION_NAME)
  );
}

/**
 * Proxy al video-engine en vez de spawn/disco local.
 * - En Vercel: siempre (requiere VIDEO_ENGINE_URL pública).
 * - En local: si VIDEO_ENGINE_URL apunta fuera de localhost.
 */
export function usarVideoEngineRemoto(): boolean {
  if (esRuntimeServerless()) return true;
  const raw = process.env.VIDEO_ENGINE_URL?.trim();
  if (!raw) return false;
  try {
    return !esHostLocal(new URL(raw).hostname);
  } catch {
    return false;
  }
}

/** VIDEO_ENGINE_URL configurada y usable en serverless. */
export function videoEngineUrlConfigurada(): boolean {
  const raw = process.env.VIDEO_ENGINE_URL?.trim();
  if (!raw) return false;
  try {
    const host = new URL(raw).hostname;
    return !esHostLocal(host);
  } catch {
    return false;
  }
}

export async function engineFetch(
  path: string,
  init?: RequestInit,
): Promise<Response> {
  const headers = new Headers(init?.headers);
  headers.set("x-api-key", videoEngineKey());
  if (init?.body && !headers.has("content-type")) {
    headers.set("content-type", "application/json");
  }
  return fetch(`${videoEngineBase()}${path}`, {
    ...init,
    headers,
  });
}
