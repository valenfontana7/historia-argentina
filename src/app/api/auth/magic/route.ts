import { NextResponse } from "next/server";
import { EstadoMecenas } from "@prisma/client";
import { prisma } from "@/lib/db";
import { crearMagicToken } from "@/lib/auth";
import { enviarMagicLink, mensajeErrorEmail } from "@/lib/email";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { email?: string; next?: string };
    const email = String(body.email ?? "")
      .toLowerCase()
      .trim();
    const next =
      body.next && body.next.startsWith("/") && !body.next.startsWith("//")
        ? body.next
        : undefined;

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
      return NextResponse.json({ ok: false, mensaje: "Email inválido." }, { status: 400 });
    }

    const mecenas = await prisma.mecenas.findUnique({ where: { email } });
    const activo =
      mecenas?.estado === EstadoMecenas.activo &&
      (!mecenas.periodEnd || mecenas.periodEnd.getTime() > Date.now());

    // Respuesta constante anti-enumeración.
    const mensaje =
      "Si ese email es de un mecenas activo, te mandamos el enlace de acceso.";

    if (!activo) {
      return NextResponse.json({ ok: true, mensaje });
    }

    const token = await crearMagicToken(email);
    const envio = await enviarMagicLink(email, token, next);
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
    console.error("[auth/magic]", error);
    return NextResponse.json(
      { ok: false, mensaje: "Error interno. Reintentá más tarde." },
      { status: 500 },
    );
  }
}
