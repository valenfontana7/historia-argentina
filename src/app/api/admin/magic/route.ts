import { NextResponse } from "next/server";
import { crearMagicToken } from "@/lib/auth";
import { enviarMagicLinkAdmin, mensajeErrorEmail } from "@/lib/email";
import { esEmailCreador } from "@/lib/membresia-settings";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { email?: string };
    const email = String(body.email ?? "")
      .toLowerCase()
      .trim();

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
      return NextResponse.json({ ok: false, mensaje: "Email inválido." }, { status: 400 });
    }

    const mensaje =
      "Si ese email es de un creador autorizado, te mandamos el enlace de acceso.";

    if (!esEmailCreador(email)) {
      return NextResponse.json({ ok: true, mensaje });
    }

    const token = await crearMagicToken(email);
    const envio = await enviarMagicLinkAdmin(email, token);
    if (!envio.ok) {
      return NextResponse.json(
        {
          ok: false,
          mensaje: mensajeErrorEmail(envio.error ?? "Error desconocido"),
        },
        { status: 502 },
      );
    }

    return NextResponse.json({ ok: true, mensaje });
  } catch (error) {
    console.error("[admin/magic]", error);
    return NextResponse.json(
      { ok: false, mensaje: "Error interno. Reintentá más tarde." },
      { status: 500 },
    );
  }
}
