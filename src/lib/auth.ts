import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";
import { EstadoMecenas } from "@prisma/client";
import { obtenerSesionAdmin } from "@/lib/admin-auth";
import { COOKIE_SESION, opcionesCookieSesion } from "@/lib/auth-constants";
import { prisma } from "@/lib/db";

const MAGIC_TTL = "15m";
const SESSION_TTL = "30d";

export type SesionMecenas = {
  email: string;
  mecenasId: string;
  plan: "mensual" | "fundador";
  esFundador: boolean;
};

function secreto(): Uint8Array {
  const valor = process.env.AUTH_SECRET;
  if (!valor) {
    throw new Error("Falta AUTH_SECRET en las variables de entorno.");
  }
  return new TextEncoder().encode(valor);
}

function puedeVerificarSinSecret(): boolean {
  return Boolean(process.env.AUTH_SECRET);
}

export async function crearMagicToken(email: string): Promise<string> {
  return new SignJWT({ email: email.toLowerCase().trim(), tipo: "magic" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(MAGIC_TTL)
    .sign(secreto());
}

export async function verificarMagicToken(token: string): Promise<string | null> {
  try {
    const { payload } = await jwtVerify(token, secreto());
    if (payload.tipo !== "magic" || typeof payload.email !== "string") return null;
    return payload.email;
  } catch {
    return null;
  }
}

export async function crearSesionToken(sesion: SesionMecenas): Promise<string> {
  return new SignJWT({ ...sesion, tipo: "sesion" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(SESSION_TTL)
    .sign(secreto());
}

export async function verificarSesionToken(token: string): Promise<SesionMecenas | null> {
  if (!puedeVerificarSinSecret()) return null;
  try {
    const { payload } = await jwtVerify(token, secreto());
    if (
      payload.tipo !== "sesion" ||
      typeof payload.email !== "string" ||
      typeof payload.mecenasId !== "string"
    ) {
      return null;
    }
    return {
      email: payload.email,
      mecenasId: payload.mecenasId,
      plan: payload.plan === "fundador" ? "fundador" : "mensual",
      esFundador: Boolean(payload.esFundador),
    };
  } catch {
    return null;
  }
}

export async function establecerSesion(sesion: SesionMecenas) {
  const token = await crearSesionToken(sesion);
  const jar = await cookies();
  jar.set(COOKIE_SESION, token, opcionesCookieSesion(60 * 60 * 24 * 30));
}

export async function cerrarSesion() {
  const jar = await cookies();
  jar.delete(COOKIE_SESION);
}

export async function obtenerSesion(): Promise<SesionMecenas | null> {
  try {
    const jar = await cookies();
    const token = jar.get(COOKIE_SESION)?.value;
    if (!token) return null;
    return verificarSesionToken(token);
  } catch (error) {
    console.error("[auth] no se pudo leer sesión:", error);
    return null;
  }
}

/** Mecenas activo (o con periodo vigente) ligado a la cookie de sesión. */
export async function obtenerMecenasActivo() {
  try {
    const sesion = await obtenerSesion();
    if (!sesion) return null;

    const mecenas = await prisma.mecenas.findUnique({ where: { id: sesion.mecenasId } });
    if (!mecenas) return null;
    if (mecenas.estado !== EstadoMecenas.activo) return null;
    if (mecenas.periodEnd && mecenas.periodEnd.getTime() < Date.now()) {
      await prisma.mecenas.update({
        where: { id: mecenas.id },
        data: { estado: EstadoMecenas.vencido },
      });
      return null;
    }
    return mecenas;
  } catch (error) {
    console.error("[auth] no se pudo leer mecenas activo:", error);
    return null;
  }
}

export async function esMecenasActivo(): Promise<boolean> {
  return Boolean(await obtenerMecenasActivo());
}

function mecenasDbVigente(mecenas: {
  estado: EstadoMecenas;
  periodEnd: Date | null;
}): boolean {
  if (mecenas.estado !== EstadoMecenas.activo) return false;
  if (mecenas.periodEnd && mecenas.periodEnd.getTime() < Date.now()) return false;
  return true;
}

/**
 * Acceso a exclusivas: sesión mecenas activa, o admin creador con membresía activa
 * (sincroniza cookie de mecenas en ese caso).
 */
export async function puedeVerContenidoMecenas(): Promise<boolean> {
  if (await esMecenasActivo()) return true;

  try {
    const admin = await obtenerSesionAdmin();
    if (!admin) return false;

    const mecenas = await prisma.mecenas.findUnique({ where: { email: admin.email } });
    if (!mecenas || !mecenasDbVigente(mecenas)) return false;

    await establecerSesion({
      email: mecenas.email,
      mecenasId: mecenas.id,
      plan: mecenas.plan,
      esFundador: mecenas.esFundador,
    });
    return true;
  } catch (error) {
    console.error("[auth] puente admin→mecenas falló:", error);
    return false;
  }
}

export { COOKIE_SESION };
