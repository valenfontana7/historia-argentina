import { NextResponse } from "next/server";
import { cerrarSesionAdmin } from "@/lib/admin-auth";

export const runtime = "nodejs";

export async function POST() {
  await cerrarSesionAdmin();
  return NextResponse.json({ ok: true });
}
