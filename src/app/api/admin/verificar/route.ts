import { NextResponse } from "next/server";
import { verificarMagicToken } from "@/lib/auth";
import { destinoAdminSeguro, establecerSesionAdmin } from "@/lib/admin-auth";
import { esEmailCreador } from "@/lib/membresia-settings";
import { sitio } from "@/lib/site.config";

export const runtime = "nodejs";

function baseUrl() {
  return process.env.NEXT_PUBLIC_SITE_URL ?? sitio.url;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get("token");
  const next = destinoAdminSeguro(searchParams.get("next"));

  if (!token) {
    return NextResponse.redirect(new URL("/admin/acceder?error=token", baseUrl()));
  }

  const email = await verificarMagicToken(token);
  if (!email || !esEmailCreador(email)) {
    return NextResponse.redirect(new URL("/admin/acceder?error=expirado", baseUrl()));
  }

  await establecerSesionAdmin(email);
  return NextResponse.redirect(new URL(next, baseUrl()));
}
