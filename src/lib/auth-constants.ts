import { sitio } from "@/lib/site.config";

export const COOKIE_SESION = "argent_sesion";
export const COOKIE_ADMIN = "argent_admin";
/** Evita re-sincronizar mecenas desde sesión admin tras un cierre explícito. */
export const COOKIE_BLOQUEO_AUTO_MECENAS = "argent_bloqueo_mecenas";

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

/** Mismas opciones de ámbito que al crear la cookie (necesario para borrarla en producción). */
export function opcionesBorrarCookie() {
  const domain = dominioCookieCompartido();
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: 0,
    expires: new Date(0),
    ...(domain ? { domain } : {}),
  };
}
