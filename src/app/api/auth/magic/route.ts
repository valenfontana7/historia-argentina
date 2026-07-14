import { NextResponse } from "next/server";
import { EstadoMecenas } from "@prisma/client";
import { prisma } from "@/lib/db";
import { crearMagicToken } from "@/lib/auth";
import { enviarMagicLink, mensajeErrorEmail } from "@/lib/email";
import { idSolicitud, registrarError, registrarEvento } from "@/lib/observabilidad";
import { claveCliente, limitarSolicitud } from "@/lib/rate-limit";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const solicitudId = idSolicitud(request);
  const limite = limitarSolicitud({
    clave: `auth/magic:${claveCliente(request)}`,
    limite: 5,
    ventanaMs: 15 * 60 * 1_000,
  });
  if (!limite.permitido) {
    registrarEvento("warn", "auth_magic_limitado", { solicitudId });
    return NextResponse.json(
      { ok: false, mensaje: "Probá de nuevo en unos minutos." },
      { status: 429, headers: { "Retry-After": String(limite.reintentarEnSegundos) } },
    );
  }

  try {
    const body: unknown = await request.json();
    if (!body || typeof body !== "object" || Array.isArray(body)) {
      return NextResponse.json({ ok: false, mensaje: "Solicitud inválida." }, { status: 400 });
    }
    const { email: emailRecibido, next: nextRecibido } = body as {
      email?: unknown;
      next?: unknown;
    };
    const email = String(emailRecibido ?? "")
      .toLowerCase()
      .trim();
    const next =
      typeof nextRecibido === "string" &&
      nextRecibido.startsWith("/") &&
      !nextRecibido.startsWith("//")
        ? nextRecibido
        : undefined;

    if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
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
      registrarEvento("info", "auth_magic_solicitado", { solicitudId, activo: false });
      return NextResponse.json({ ok: true, mensaje });
    }

    const token = await crearMagicToken(email);
    const envio = await enviarMagicLink(email, token, next);
    if (!envio.ok) {
      registrarEvento("warn", "auth_magic_email_fallido", { solicitudId });
      return NextResponse.json(
        {
          ok: false,
          mensaje: mensajeErrorEmail(envio.error ?? "Error desconocido"),
        },
        { status: 502 },
      );
    }

    registrarEvento("info", "auth_magic_solicitado", { solicitudId, activo: true });
    return NextResponse.json({ ok: true, mensaje });
  } catch (error) {
    registrarError("auth_magic_error", error, { solicitudId });
    return NextResponse.json(
      { ok: false, mensaje: "Error interno. Reintentá más tarde." },
      { status: 500 },
    );
  }
}
