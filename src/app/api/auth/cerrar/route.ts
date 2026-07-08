import { NextResponse } from "next/server";
import {
  COOKIE_BLOQUEO_AUTO_MECENAS,
  COOKIE_SESION,
  opcionesBorrarCookie,
  opcionesCookieSesion,
} from "@/lib/auth-constants";
import { sitio } from "@/lib/site.config";

export const runtime = "nodejs";

function baseUrl() {
  return process.env.NEXT_PUBLIC_SITE_URL ?? sitio.url;
}

function respuestaCierreSesion() {
  const res = NextResponse.redirect(new URL("/membresia", baseUrl()));
  const borrar = opcionesBorrarCookie();
  res.cookies.set(COOKIE_SESION, "", borrar);
  res.cookies.set(
    COOKIE_BLOQUEO_AUTO_MECENAS,
    "1",
    opcionesCookieSesion(60 * 60 * 24 * 30),
  );
  return res;
}

export async function POST() {
  return respuestaCierreSesion();
}

export async function GET() {
  return respuestaCierreSesion();
}
