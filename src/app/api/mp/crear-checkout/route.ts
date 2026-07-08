import { NextResponse } from "next/server";
import { crearCheckout } from "@/lib/mp";
import type { PlanId } from "@/lib/membresia.config";
import { PlanNoDisponibleError } from "@/lib/membresia-settings";

export const runtime = "nodejs";

export async function POST(request: Request) {
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

    const body = (await request.json()) as { plan?: string; email?: string };
    const plan = body.plan as PlanId | undefined;
    const email = String(body.email ?? "")
      .toLowerCase()
      .trim();

    if (plan !== "mensual" && plan !== "fundador") {
      return NextResponse.json({ ok: false, mensaje: "Plan inválido." }, { status: 400 });
    }

    const { initPoint } = await crearCheckout(plan, email);
    return NextResponse.json({ ok: true, initPoint });
  } catch (error) {
    console.error("[mp/crear-checkout]", error);
    if (error instanceof PlanNoDisponibleError) {
      return NextResponse.json({ ok: false, mensaje: error.message }, { status: 403 });
    }
    const mensaje =
      error instanceof Error ? error.message : "No pudimos iniciar el pago.";
    return NextResponse.json({ ok: false, mensaje }, { status: 500 });
  }
}
