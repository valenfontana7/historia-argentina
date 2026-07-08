"use server";

import { prisma } from "@/lib/db";

export type EstadoSuscripcion = {
  ok: boolean;
  mensaje: string;
  upsell?: boolean;
};

/**
 * Captura de email para el boletín.
 * Persiste en Postgres; el envío automatizado está en lista de espera.
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
    mensaje: "¡Listo! Te avisamos cuando salga el boletín.",
    upsell: true,
  };
}
