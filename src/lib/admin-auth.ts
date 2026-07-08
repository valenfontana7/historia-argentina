import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";
import { emailsCreador, esEmailCreador } from "@/lib/membresia-settings";

export const COOKIE_ADMIN = "argent_admin";
const ADMIN_TTL = "7d";

export type SesionAdmin = {
  email: string;
};

function secreto(): Uint8Array {
  const valor = process.env.AUTH_SECRET;
  if (!valor) {
    throw new Error("Falta AUTH_SECRET en las variables de entorno.");
  }
  return new TextEncoder().encode(valor);
}

export function adminConfigurado(): boolean {
  return emailsCreador().length > 0;
}

export async function crearAdminToken(email: string): Promise<string> {
  return new SignJWT({ tipo: "admin", email: email.toLowerCase().trim() })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(ADMIN_TTL)
    .sign(secreto());
}

export async function verificarAdminToken(token: string): Promise<SesionAdmin | null> {
  if (!process.env.AUTH_SECRET) return null;
  try {
    const { payload } = await jwtVerify(token, secreto());
    if (payload.tipo !== "admin" || typeof payload.email !== "string") return null;
    const email = payload.email.toLowerCase().trim();
    if (!esEmailCreador(email)) return null;
    return { email };
  } catch {
    return null;
  }
}

export async function establecerSesionAdmin(email: string) {
  const token = await crearAdminToken(email);
  const jar = await cookies();
  jar.set(COOKIE_ADMIN, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function cerrarSesionAdmin() {
  const jar = await cookies();
  jar.delete(COOKIE_ADMIN);
}

export async function obtenerSesionAdmin(): Promise<SesionAdmin | null> {
  try {
    const jar = await cookies();
    const token = jar.get(COOKIE_ADMIN)?.value;
    if (!token) return null;
    return verificarAdminToken(token);
  } catch {
    return null;
  }
}

export async function sesionAdminValida(): Promise<boolean> {
  return Boolean(await obtenerSesionAdmin());
}

/** Solo permite redirects internos bajo /admin. */
export function destinoAdminSeguro(next: string | null | undefined): string {
  if (!next || !next.startsWith("/admin") || next.startsWith("//")) {
    return "/admin";
  }
  return next;
}
