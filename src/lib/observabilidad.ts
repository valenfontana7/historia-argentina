import { randomUUID } from "node:crypto";

type ContextoEvento = Record<string, boolean | number | string | undefined>;

function mensajeError(error: unknown) {
  if (error instanceof Error) return error.message;
  // MercadoPago SDK hace `throw await response.json()` (objeto plano, no Error).
  if (error && typeof error === "object") {
    const e = error as {
      message?: unknown;
      error?: unknown;
      status?: unknown;
      cause?: unknown;
    };
    const partes: string[] = [];
    if (typeof e.status === "number" || typeof e.status === "string") {
      partes.push(`status=${String(e.status)}`);
    }
    if (typeof e.error === "string" && e.error.trim()) {
      partes.push(e.error.trim());
    }
    if (typeof e.message === "string" && e.message.trim()) {
      partes.push(e.message.trim());
    }
    if (Array.isArray(e.cause) && e.cause.length > 0) {
      const causas = e.cause
        .slice(0, 3)
        .map((c) => {
          if (!c || typeof c !== "object") return String(c);
          const cause = c as { code?: unknown; description?: unknown; message?: unknown };
          return [cause.code, cause.description ?? cause.message]
            .filter((x) => typeof x === "string" || typeof x === "number")
            .join(":");
        })
        .filter(Boolean);
      if (causas.length) partes.push(`cause=${causas.join("|")}`);
    }
    if (partes.length > 0) return partes.join(" · ").slice(0, 400);
  }
  if (typeof error === "string" && error.trim()) return error.trim().slice(0, 400);
  return "Error desconocido";
}

/** Identificador seguro para correlacionar logs sin exponer datos personales. */
export function idSolicitud(request: Request) {
  return request.headers.get("x-request-id") ?? randomUUID();
}

/**
 * Log estructurado mínimo para rutas críticas. No incluir emails, tokens ni datos de pago.
 * La plataforma de despliegue puede indexar cada campo del JSON para alertas y búsquedas.
 */
export function registrarEvento(
  nivel: "error" | "info" | "warn",
  evento: string,
  contexto: ContextoEvento = {},
) {
  const registro = JSON.stringify({ evento, ...contexto });
  if (nivel === "error") {
    console.error(registro);
  } else if (nivel === "warn") {
    console.warn(registro);
  } else {
    console.info(registro);
  }
}

export function registrarError(
  evento: string,
  error: unknown,
  contexto: ContextoEvento = {},
) {
  registrarEvento("error", evento, { ...contexto, error: mensajeError(error) });
}