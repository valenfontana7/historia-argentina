import { NextResponse } from "next/server";
import { EstadoMecenas } from "@prisma/client";
import { sesionAdminValida } from "@/lib/admin-auth";
import {
  MecenasAdminError,
  actualizarMecenas,
} from "@/lib/mecenas-admin";
import type { PlanId } from "@/lib/membresia.config";

export const runtime = "nodejs";

type RouteContext = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, context: RouteContext) {
  if (!(await sesionAdminValida())) {
    return NextResponse.json({ ok: false, mensaje: "No autorizado." }, { status: 401 });
  }

  const { id } = await context.params;
  const body = (await request.json()) as {
    estado?: EstadoMecenas;
    exentoFacturacion?: boolean;
    periodEnd?: string | null;
    sinVencimiento?: boolean;
    plan?: PlanId;
    esFundador?: boolean;
    nombrePublico?: string | null;
    mostrarCredito?: boolean;
    notasAdmin?: string | null;
  };

  if (body.estado && !Object.values(EstadoMecenas).includes(body.estado)) {
    return NextResponse.json({ ok: false, mensaje: "Estado inválido." }, { status: 400 });
  }
  if (body.plan && body.plan !== "mensual" && body.plan !== "fundador") {
    return NextResponse.json({ ok: false, mensaje: "Plan inválido." }, { status: 400 });
  }

  let periodEnd: Date | null | undefined;
  if (body.sinVencimiento) {
    periodEnd = null;
  } else if (body.periodEnd !== undefined) {
    if (body.periodEnd === null) {
      periodEnd = null;
    } else {
      const parsed = new Date(body.periodEnd);
      if (Number.isNaN(parsed.getTime())) {
        return NextResponse.json(
          { ok: false, mensaje: "Fecha de vencimiento inválida." },
          { status: 400 },
        );
      }
      periodEnd = parsed;
    }
  }

  try {
    const resultado = await actualizarMecenas(id, {
      estado: body.estado,
      exentoFacturacion: body.exentoFacturacion,
      periodEnd,
      sinVencimiento: body.sinVencimiento,
      plan: body.plan,
      esFundador: body.esFundador,
      nombrePublico: body.nombrePublico,
      mostrarCredito: body.mostrarCredito,
      notasAdmin: body.notasAdmin,
    });

    return NextResponse.json({
      ok: true,
      datos: resultado.mecenas,
      advertenciaMp: resultado.advertenciaMp,
    });
  } catch (error) {
    if (error instanceof MecenasAdminError) {
      const status = error.codigo === "no_encontrado" ? 404 : 400;
      return NextResponse.json({ ok: false, mensaje: error.message }, { status });
    }
    console.error("[admin/mecenas/personas PATCH]", error);
    return NextResponse.json({ ok: false, mensaje: "Error interno." }, { status: 500 });
  }
}
