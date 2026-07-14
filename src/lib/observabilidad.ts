import { randomUUID } from "node:crypto";

type ContextoEvento = Record<string, boolean | number | string | undefined>;

function mensajeError(error: unknown) {
  if (error instanceof Error) return error.message;
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