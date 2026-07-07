import { NextResponse } from "next/server";
import { EstadoMecenas } from "@prisma/client";
import { prisma } from "@/lib/db";
import { establecerSesion, verificarMagicToken } from "@/lib/auth";
import { sitio } from "@/lib/site.config";

export const runtime = "nodejs";

function baseUrl() {
  return process.env.NEXT_PUBLIC_SITE_URL ?? sitio.url;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get("token");
  const next = searchParams.get("next") || "/mecenas";

  if (!token) {
    return NextResponse.redirect(new URL("/membresia/acceder?error=token", baseUrl()));
  }

  const email = await verificarMagicToken(token);
  if (!email) {
    return NextResponse.redirect(new URL("/membresia/acceder?error=expirado", baseUrl()));
  }

  const mecenas = await prisma.mecenas.findUnique({ where: { email } });
  const activo =
    mecenas?.estado === EstadoMecenas.activo &&
    (!mecenas.periodEnd || mecenas.periodEnd.getTime() > Date.now());

  if (!mecenas || !activo) {
    return NextResponse.redirect(new URL("/membresia?error=inactivo", baseUrl()));
  }

  await establecerSesion({
    email: mecenas.email,
    mecenasId: mecenas.id,
    plan: mecenas.plan,
    esFundador: mecenas.esFundador,
  });

  const destino = next.startsWith("/") ? next : "/mecenas";
  return NextResponse.redirect(new URL(destino, baseUrl()));
}
