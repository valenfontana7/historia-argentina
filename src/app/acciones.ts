"use server";

export type EstadoSuscripcion = {
  ok: boolean;
  mensaje: string;
};

/**
 * Captura de email para el boletín diario. En el MVP solo se valida
 * y registra; la integración con el proveedor de envío es fase 2.
 */
export async function suscribir(
  _estadoAnterior: EstadoSuscripcion | null,
  formData: FormData,
): Promise<EstadoSuscripcion> {
  const email = String(formData.get("email") ?? "").trim();
  const esValido = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);

  if (!esValido) {
    return { ok: false, mensaje: "Ese email no parece válido. Probá de nuevo." };
  }

  console.log(`[boletin] nueva suscripción: ${email}`);
  return {
    ok: true,
    mensaje: "¡Listo! Cada mañana, una historia argentina en tu casilla.",
  };
}
