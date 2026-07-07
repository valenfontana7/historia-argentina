import { NextResponse } from "next/server";
import { cerrarSesion } from "@/lib/auth";
import { sitio } from "@/lib/site.config";

export const runtime = "nodejs";

export async function POST() {
  await cerrarSesion();
  return NextResponse.redirect(new URL("/membresia", process.env.NEXT_PUBLIC_SITE_URL ?? sitio.url));
}

export async function GET() {
  await cerrarSesion();
  return NextResponse.redirect(new URL("/membresia", process.env.NEXT_PUBLIC_SITE_URL ?? sitio.url));
}
