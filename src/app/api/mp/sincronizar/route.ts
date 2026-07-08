import { NextResponse } from "next/server";
import { EstadoMecenas } from "@prisma/client";
import { establecerSesion } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { sincronizarMecenasPorEmail } from "@/lib/mp";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      email?: string;
      reenviarEmail?: boolean;
      establecerSesion?: boolean;
    };
    const email = String(body.email ?? "")
      .toLowerCase()
      .trim();

    if (!email) {
      return NextResponse.json({ ok: false, mensaje: "Email requerido." }, { status: 400 });
    }

    const resultado = await sincronizarMecenasPorEmail(email, {
      reenviarEmail: body.reenviarEmail,
    });

    const activo =
      resultado.estado === "activado" || resultado.estado === "activo";

    if (body.establecerSesion && activo) {
      const mecenas = await prisma.mecenas.findUnique({ where: { email } });
      if (mecenas && mecenas.estado === EstadoMecenas.activo) {
        await establecerSesion({
          email: mecenas.email,
          mecenasId: mecenas.id,
          plan: mecenas.plan,
          esFundador: mecenas.esFundador,
        });
        return NextResponse.json({ ...resultado, sesion: true });
      }
    }

    return NextResponse.json({ ...resultado, sesion: false });
  } catch (error) {
    console.error("[mp/sincronizar]", error);
    const mensaje =
      error instanceof Error ? error.message : "No pudimos verificar el pago.";
    return NextResponse.json({ ok: false, mensaje }, { status: 500 });
  }
}
