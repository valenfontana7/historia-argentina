import { NextResponse } from "next/server";
import {
  adminConfigurado,
  establecerSesionAdmin,
  verificarAdminSecreto,
} from "@/lib/admin-auth";

export const runtime = "nodejs";

export async function POST(request: Request) {
  if (!adminConfigurado()) {
    return NextResponse.json(
      { ok: false, mensaje: "ADMIN_SECRET no está configurado." },
      { status: 503 },
    );
  }

  const body = (await request.json()) as { secreto?: string };
  const secreto = String(body.secreto ?? "");

  if (!verificarAdminSecreto(secreto)) {
    return NextResponse.json({ ok: false, mensaje: "Secreto incorrecto." }, { status: 401 });
  }

  await establecerSesionAdmin();
  return NextResponse.json({ ok: true });
}
