import { NextResponse } from "next/server";
import { obtenerMecenasActivo, obtenerSesion } from "@/lib/auth";
import { opcionPorSlug } from "@/data/voto-fundador";
import { prisma } from "@/lib/db";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const sesion = await obtenerSesion();
  if (!sesion) {
    return NextResponse.json({ ok: false, mensaje: "Sesión requerida." }, { status: 401 });
  }

  const mecenas = await obtenerMecenasActivo();
  if (!mecenas?.esFundador) {
    return NextResponse.json(
      { ok: false, mensaje: "Solo fundadores pueden votar." },
      { status: 403 },
    );
  }

  const body = (await request.json()) as { opcionSlug?: string };
  const opcionSlug = String(body.opcionSlug ?? "").trim();
  if (!opcionPorSlug(opcionSlug)) {
    return NextResponse.json({ ok: false, mensaje: "Opción inválida." }, { status: 400 });
  }

  await prisma.votoCronicaFundador.upsert({
    where: { mecenasId: mecenas.id },
    create: { mecenasId: mecenas.id, opcionSlug },
    update: { opcionSlug },
  });

  return NextResponse.json({ ok: true, opcionSlug });
}
