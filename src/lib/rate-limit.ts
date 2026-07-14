type Registro = { cantidad: number; venceEn: number };

const registros = new Map<string, Registro>();

function limpiarRegistrosExpirados(ahora: number) {
  for (const [clave, registro] of registros) {
    if (registro.venceEn <= ahora) registros.delete(clave);
  }
}

/**
 * Límite en memoria como defensa de primera capa. En despliegues con múltiples
 * instancias debe complementarse con un límite perimetral o compartido.
 */
export function limitarSolicitud(opciones: {
  clave: string;
  limite: number;
  ventanaMs: number;
  ahora?: number;
}) {
  const ahora = opciones.ahora ?? Date.now();
  limpiarRegistrosExpirados(ahora);

  const actual = registros.get(opciones.clave);
  if (!actual) {
    registros.set(opciones.clave, {
      cantidad: 1,
      venceEn: ahora + opciones.ventanaMs,
    });
    return { permitido: true, reintentarEnSegundos: 0 };
  }

  if (actual.cantidad >= opciones.limite) {
    return {
      permitido: false,
      reintentarEnSegundos: Math.max(1, Math.ceil((actual.venceEn - ahora) / 1_000)),
    };
  }

  actual.cantidad += 1;
  return { permitido: true, reintentarEnSegundos: 0 };
}

export function claveCliente(request: Request) {
  return request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "desconocido";
}