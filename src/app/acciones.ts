"use server";

import { prisma } from "@/lib/db";

export type EstadoSuscripcion = {
  ok: boolean;
  mensaje: string;
  upsell?: boolean;
};

/**
 * Captura de email para el boletín diario.
 * Persiste en Postgres; el envío automatizado es fase 2.
 */
export async function suscribir(
  _estadoAnterior: EstadoSuscripcion | null,
  formData: FormData,
): Promise<EstadoSuscripcion> {
  const email = String(formData.get("email") ?? "")
    .toLowerCase()
    .trim();
  const esValido = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);

  if (!esValido) {
    return { ok: false, mensaje: "Ese email no parece válido. Probá de nuevo." };
  }

  try {
    await prisma.suscriptor.upsert({
      where: { email },
      create: { email },
      update: {},
    });
  } catch (error) {
    console.error("[boletin] no se pudo guardar:", error);
    return {
      ok: false,
      mensaje: "No pudimos guardar tu email ahora. Probá en unos minutos.",
    };
  }

  return {
    ok: true,
    mensaje: "¡Listo! Cada mañana, una historia argentina en tu casilla.",
    upsell: true,
  };
}
