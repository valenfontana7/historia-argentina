/**
 * Frases canónicas de la interfaz. Importar acá para mantener un solo tono museográfico.
 */

export const QUE_ES_MECENAS =
  "Mecenas es la membresía que sostiene Argent y te da acceso a salas privadas: exhibiciones exclusivas, mapa completo y visitas guiadas especiales.";

export const GRATIS_VS_MECENAS =
  "Exhibiciones públicas, la galería de retratos, mapas, visitas guiadas base y la pieza del día siguen gratis. Mecenas suma salas privadas y herramientas extra.";

export const ACCESO_EMAIL =
  "Te mandamos un enlace a tu email para entrar. No hace falta contraseña.";

export function mensajeEfemerideSugerida(
  fechaConsultada: string,
  fechaEfemeride: string,
): string {
  return `Todavía no tenemos una pieza fija para el ${fechaConsultada}. Te mostramos esta otra del museo: ${fechaEfemeride}.`;
}

export const KICKER_EFEMERIDE_SUGERIDA = "Otra pieza del museo";

export const BENEFICIOS_PLAN_MENSUAL = [
  "43 exhibiciones exclusivas para mecenas (catálogo en expansión)",
  "3 visitas guiadas especiales (Democracia, San Martín continental y Patagonia)",
  "Carta mensual con novedades",
  "Sala de mapas completa con filtros por época",
  "Pasillo del tiempo para comparar años",
  "Tu nombre en el muro de quienes sostienen Argent",
] as const;

/** Comparación lado a lado para la landing de membresía. */
export const COMPARATIVA_MEMBRESIA = [
  { aspecto: "Exhibiciones", gratis: "56 públicas", mecenas: "56 públicas + 43 exclusivas" },
  { aspecto: "Visitas guiadas", gratis: "6 recorridos", mecenas: "6 + 3 especiales" },
  { aspecto: "Mapa", gratis: "7 lugares destacados", mecenas: "Mapa completo + filtros" },
  { aspecto: "Pasillo del tiempo", gratis: "Explorar por año", mecenas: "Comparar años y rangos" },
  { aspecto: "Retratos y pieza del día", gratis: "Todo gratis", mecenas: "Todo gratis" },
  { aspecto: "Carta y créditos", gratis: "—", mecenas: "Carta mensual + tu nombre" },
] as const;

export const BENEFICIOS_PLAN_FUNDADOR = [
  "Todo lo del plan Mecenas",
  "Precio de fundador por un año",
  "Votá qué exhibición hacemos después",
  "Tu nombre destacado en los créditos",
  "Acceso antes que nadie a exhibiciones nuevas",
] as const;

export const DESCRIPCION_PLAN_MENSUAL =
  "Salas privadas, visitas guiadas especiales y mapa completo para recorrer la historia argentina.";

export const DESCRIPCION_PLAN_FUNDADOR =
  "Para quienes ayudan a que Argent exista. Incluye voto sobre la próxima exhibición.";

export const FAQ_MEMBRESIA = [
  {
    q: "¿El museo sigue siendo gratis?",
    a: "Sí. Podés recorrer exhibiciones públicas, la galería de retratos, mapas, seis visitas guiadas y la pieza del día sin pagar. Mecenas suma 43 exhibiciones exclusivas, mapa completo y visitas guiadas especiales.",
  },
  {
    q: "¿Qué incluye Mecenas hoy?",
    a: "43 exhibiciones exclusivas, tres visitas guiadas especiales, mapa completo con filtros, pasillo del tiempo avanzado, carta mensual y tu nombre en los créditos.",
  },
  {
    q: "¿Cómo pago?",
    a: "Con Mercado Pago: tarjeta, débito o dinero en cuenta. El plan mensual se renueva cada mes; el fundador es un pago por un año.",
  },
  {
    q: "¿Cómo entro después de pagar?",
    a: "Te mandamos un enlace a tu email. Si no llega, pedí uno nuevo en «Ya soy mecenas».",
  },
  {
    q: "¿Puedo cancelar?",
    a: "El plan mensual lo cancelás cuando quieras desde Mercado Pago. El fundador dura un año desde el día del pago.",
  },
] as const;
