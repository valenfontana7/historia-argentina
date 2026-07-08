import { NextResponse } from "next/server";
import { sincronizarMecenasPorEmail } from "@/lib/mp";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { email?: string };
    const email = String(body.email ?? "")
      .toLowerCase()
      .trim();

    if (!email) {
      return NextResponse.json({ ok: false, mensaje: "Email requerido." }, { status: 400 });
    }

    const resultado = await sincronizarMecenasPorEmail(email);
    return NextResponse.json(resultado);
  } catch (error) {
    console.error("[mp/sincronizar]", error);
    const mensaje =
      error instanceof Error ? error.message : "No pudimos verificar el pago.";
    return NextResponse.json({ ok: false, mensaje }, { status: 500 });
  }
}
