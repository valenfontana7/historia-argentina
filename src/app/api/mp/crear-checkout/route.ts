import { NextResponse } from "next/server";
import { crearCheckout } from "@/lib/mp";
import type { PlanId } from "@/lib/membresia.config";
import { PlanNoDisponibleError } from "@/lib/membresia-settings";
import { idSolicitud, registrarError, registrarEvento } from "@/lib/observabilidad";
import { claveCliente, limitarSolicitud } from "@/lib/rate-limit";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const solicitudId = idSolicitud(request);
  const limite = limitarSolicitud({
    clave: `mp/crear-checkout:${claveCliente(request)}`,
    limite: 8,
    ventanaMs: 15 * 60 * 1_000,
  });
  if (!limite.permitido) {
    registrarEvento("warn", "checkout_limitado", { solicitudId });
    return NextResponse.json(
      { ok: false, mensaje: "Probá de nuevo en unos minutos." },
      { status: 429, headers: { "Retry-After": String(limite.reintentarEnSegundos) } },
    );
  }

  let planLog: PlanId | "desconocido" = "desconocido";

  try {
    if (!process.env.MP_ACCESS_TOKEN) {
      return NextResponse.json(
        {
          ok: false,
          mensaje:
            "MercadoPago todavía no está configurado. Agregá MP_ACCESS_TOKEN en las variables de entorno.",
        },
        { status: 503 },
      );
    }

    const body: unknown = await request.json();
    if (!body || typeof body !== "object" || Array.isArray(body)) {
      return NextResponse.json({ ok: false, mensaje: "Solicitud inválida." }, { status: 400 });
    }
    const { plan: planRecibido, email: emailRecibido } = body as {
      plan?: unknown;
      email?: unknown;
    };
    const plan = planRecibido as PlanId | undefined;
    const email = String(emailRecibido ?? "")
      .toLowerCase()
      .trim();

    if (plan !== "mensual" && plan !== "fundador") {
      return NextResponse.json({ ok: false, mensaje: "Plan inválido." }, { status: 400 });
    }
    planLog = plan;
    if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
      return NextResponse.json({ ok: false, mensaje: "Email inválido." }, { status: 400 });
    }

    const { initPoint } = await crearCheckout(plan, email);
    registrarEvento("info", "checkout_creado", { solicitudId, plan });
    return NextResponse.json({ ok: true, initPoint });
  } catch (error) {
    registrarError("checkout_error", error, { solicitudId, plan: planLog });
    if (error instanceof PlanNoDisponibleError) {
      return NextResponse.json({ ok: false, mensaje: error.message }, { status: 403 });
    }
    return NextResponse.json(
      { ok: false, mensaje: "No pudimos iniciar el pago. Reintentá más tarde." },
      { status: 500 },
    );
  }
}
