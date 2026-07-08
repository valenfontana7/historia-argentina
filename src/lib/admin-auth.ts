import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";

export const COOKIE_ADMIN = "argent_admin";
const ADMIN_TTL = "7d";

function secreto(): Uint8Array {
  const valor = process.env.AUTH_SECRET;
  if (!valor) {
    throw new Error("Falta AUTH_SECRET en las variables de entorno.");
  }
  return new TextEncoder().encode(valor);
}

export function adminConfigurado(): boolean {
  return Boolean(process.env.ADMIN_SECRET?.trim());
}

export async function crearAdminToken(): Promise<string> {
  return new SignJWT({ tipo: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(ADMIN_TTL)
    .sign(secreto());
}

export async function verificarAdminToken(token: string): Promise<boolean> {
  if (!process.env.AUTH_SECRET) return false;
  try {
    const { payload } = await jwtVerify(token, secreto());
    return payload.tipo === "admin";
  } catch {
    return false;
  }
}

export async function establecerSesionAdmin() {
  const token = await crearAdminToken();
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

export async function sesionAdminValida(): Promise<boolean> {
  try {
    const jar = await cookies();
    const token = jar.get(COOKIE_ADMIN)?.value;
    if (!token) return false;
    return verificarAdminToken(token);
  } catch {
    return false;
  }
}

export function verificarAdminSecreto(secretoIngresado: string): boolean {
  const esperado = process.env.ADMIN_SECRET?.trim();
  if (!esperado) return false;
  return secretoIngresado.trim() === esperado;
}
