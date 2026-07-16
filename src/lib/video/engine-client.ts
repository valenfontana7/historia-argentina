/**
 * Cliente HTTP hacia el video-engine remoto (VPS).
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

/**
 * Usar proxy HTTP al engine en vez de spawn local.
 * - En Vercel: solo si VIDEO_ENGINE_URL apunta a un host público.
 * - En local: si VIDEO_ENGINE_URL apunta fuera de localhost.
 */
export function usarVideoEngineRemoto(): boolean {
  const raw = process.env.VIDEO_ENGINE_URL?.trim();
  if (!raw) return false;
  try {
    const host = new URL(raw).hostname;
    if (esHostLocal(host)) return false;
    return true;
  } catch {
    return false;
  }
}

export function esRuntimeServerless(): boolean {
  return (
    Boolean(process.env.VERCEL) ||
    Boolean(process.env.AWS_LAMBDA_FUNCTION_NAME)
  );
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
