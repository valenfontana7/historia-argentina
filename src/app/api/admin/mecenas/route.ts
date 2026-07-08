import { NextResponse } from "next/server";
import { sesionAdminValida } from "@/lib/admin-auth";
import {
  getMembresiaSettings,
  precioValido,
  updateMembresiaSettings,
} from "@/lib/membresia-settings";

export const runtime = "nodejs";

export async function GET() {
  if (!(await sesionAdminValida())) {
    return NextResponse.json({ ok: false, mensaje: "No autorizado." }, { status: 401 });
  }

  const settings = await getMembresiaSettings();
  return NextResponse.json({ ok: true, settings });
}

export async function PATCH(request: Request) {
  if (!(await sesionAdminValida())) {
    return NextResponse.json({ ok: false, mensaje: "No autorizado." }, { status: 401 });
  }

  const body = (await request.json()) as {
    mensualHabilitado?: boolean;
    fundadorHabilitado?: boolean;
    precioMensual?: number;
    precioFundador?: number;
  };

  const patch: {
    mensualHabilitado?: boolean;
    fundadorHabilitado?: boolean;
    precioMensual?: number;
    precioFundador?: number;
  } = {};

  if (typeof body.mensualHabilitado === "boolean") {
    patch.mensualHabilitado = body.mensualHabilitado;
  }
  if (typeof body.fundadorHabilitado === "boolean") {
    patch.fundadorHabilitado = body.fundadorHabilitado;
  }
  if (body.precioMensual !== undefined) {
    if (!precioValido(body.precioMensual)) {
      return NextResponse.json(
        { ok: false, mensaje: "Precio mensual inválido (entero ≥ 100 ARS)." },
        { status: 400 },
      );
    }
    patch.precioMensual = body.precioMensual;
  }
  if (body.precioFundador !== undefined) {
    if (!precioValido(body.precioFundador)) {
      return NextResponse.json(
        { ok: false, mensaje: "Precio fundador inválido (entero ≥ 100 ARS)." },
        { status: 400 },
      );
    }
    patch.precioFundador = body.precioFundador;
  }

  if (Object.keys(patch).length === 0) {
    return NextResponse.json({ ok: false, mensaje: "Nada que actualizar." }, { status: 400 });
  }

  const settings = await updateMembresiaSettings(patch);
  return NextResponse.json({ ok: true, settings });
}
