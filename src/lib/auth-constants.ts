import { sitio } from "@/lib/site.config";

export const COOKIE_SESION = "argent_sesion";
export const COOKIE_ADMIN = "argent_admin";

/** Comparte cookies entre museoargent.com.ar y www.museoargent.com.ar */
export function dominioCookieCompartido(): string | undefined {
  const raw = process.env.NEXT_PUBLIC_SITE_URL ?? sitio.url;
  try {
    const host = new URL(raw).hostname;
    if (host.endsWith(".vercel.app") || host === "localhost" || host === "127.0.0.1") {
      return undefined;
    }
    const base = host.startsWith("www.") ? host.slice(4) : host;
    const partes = base.split(".");
    if (partes.length >= 2) return `.${base}`;
  } catch {
    return undefined;
  }
  return undefined;
}

export function opcionesCookieSesion(maxAgeSegundos: number) {
  const domain = dominioCookieCompartido();
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: maxAgeSegundos,
    ...(domain ? { domain } : {}),
  };
}
