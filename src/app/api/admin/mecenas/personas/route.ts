import { NextResponse } from "next/server";
import { EstadoMecenas, PlanMecenas } from "@prisma/client";
import { sesionAdminValida } from "@/lib/admin-auth";
import {
  MecenasAdminError,
  crearMecenasManual,
  listarMecenas,
} from "@/lib/mecenas-admin";
import type { PlanId } from "@/lib/membresia.config";

export const runtime = "nodejs";

function parseEstado(valor: string | null): EstadoMecenas | undefined {
  if (!valor) return undefined;
  if (Object.values(EstadoMecenas).includes(valor as EstadoMecenas)) {
    return valor as EstadoMecenas;
  }
  return undefined;
}

function parsePlan(valor: string | null): PlanMecenas | undefined {
  if (!valor) return undefined;
  if (valor === PlanMecenas.mensual || valor === PlanMecenas.fundador) {
    return valor;
  }
  return undefined;
}

export async function GET(request: Request) {
  if (!(await sesionAdminValida())) {
    return NextResponse.json({ ok: false, mensaje: "No autorizado." }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const pagina = Number.parseInt(searchParams.get("pagina") ?? "1", 10);
  const exentoRaw = searchParams.get("exento");

  const resultado = await listarMecenas({
    q: searchParams.get("q") ?? undefined,
    estado: parseEstado(searchParams.get("estado")),
    plan: parsePlan(searchParams.get("plan")),
    exento: exentoRaw === "true" ? true : exentoRaw === "false" ? false : undefined,
    pagina: Number.isFinite(pagina) ? pagina : 1,
  });

  return NextResponse.json({
    ok: true,
    datos: resultado.datos,
    total: resultado.total,
    pagina: resultado.pagina,
    totalPaginas: resultado.totalPaginas,
  });
}

export async function POST(request: Request) {
  if (!(await sesionAdminValida())) {
    return NextResponse.json({ ok: false, mensaje: "No autorizado." }, { status: 401 });
  }

  const body = (await request.json()) as {
    email?: string;
    plan?: PlanId;
    exentoFacturacion?: boolean;
    periodEnd?: string | null;
    sinVencimiento?: boolean;
    esFundador?: boolean;
    nombrePublico?: string;
    notasAdmin?: string;
    enviarEmail?: boolean;
  };

  if (!body.email?.trim()) {
    return NextResponse.json({ ok: false, mensaje: "El email es obligatorio." }, { status: 400 });
  }
  if (body.plan !== "mensual" && body.plan !== "fundador") {
    return NextResponse.json({ ok: false, mensaje: "Plan inválido." }, { status: 400 });
  }

  let periodEnd: Date | null | undefined;
  if (body.sinVencimiento) {
    periodEnd = null;
  } else if (body.periodEnd) {
    const parsed = new Date(body.periodEnd);
    if (Number.isNaN(parsed.getTime())) {
      return NextResponse.json({ ok: false, mensaje: "Fecha de vencimiento inválida." }, { status: 400 });
    }
    periodEnd = parsed;
  }

  try {
    const mecenas = await crearMecenasManual({
      email: body.email,
      plan: body.plan,
      exentoFacturacion: Boolean(body.exentoFacturacion),
      periodEnd,
      sinVencimiento: body.sinVencimiento,
      esFundador: body.esFundador,
      nombrePublico: body.nombrePublico,
      notasAdmin: body.notasAdmin,
      enviarEmail: body.enviarEmail,
    });

    return NextResponse.json({ ok: true, datos: mecenas });
  } catch (error) {
    if (error instanceof MecenasAdminError) {
      const status = error.codigo === "ya_existe" ? 409 : 400;
      return NextResponse.json({ ok: false, mensaje: error.message }, { status });
    }
    console.error("[admin/mecenas/personas POST]", error);
    return NextResponse.json({ ok: false, mensaje: "Error interno." }, { status: 500 });
  }
}
