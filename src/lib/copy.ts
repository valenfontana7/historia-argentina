/**
 * Frases canónicas de la interfaz. Importar acá para mantener un solo tono.
 */

export const QUE_ES_MECENAS =
  "Mecenas es la membresía que sostiene Argent y te da crónicas exclusivas, mapa completo y recorridos especiales.";

export const GRATIS_VS_MECENAS =
  "Crónicas públicas, el Panteón, lugares, recorridos base y la historia del día siguen gratis. Mecenas suma contenido exclusivo y herramientas extra.";

export const ACCESO_EMAIL =
  "Te mandamos un enlace a tu email para entrar. No hace falta contraseña.";

export function mensajeEfemerideSugerida(
  fechaConsultada: string,
  fechaEfemeride: string,
): string {
  return `Todavía no tenemos una historia fija para el ${fechaConsultada}. Te mostramos esta otra del museo: ${fechaEfemeride}.`;
}

export const KICKER_EFEMERIDE_SUGERIDA = "Otra historia del museo";

export const BENEFICIOS_PLAN_MENSUAL = [
  "2 crónicas que solo ven los mecenas",
  "2 recorridos especiales (Democracia y San Martín continental)",
  "Carta mensual con novedades",
  "Mapa histórico completo con filtros por época",
  "Línea de tiempo para comparar años",
  "Tu nombre en el muro de quienes sostienen Argent",
] as const;

/** Comparación lado a lado para la landing de membresía. */
export const COMPARATIVA_MEMBRESIA = [
  { aspecto: "Crónicas", gratis: "2 públicas", mecenas: "2 públicas + 2 exclusivas" },
  { aspecto: "Recorridos", gratis: "5 recorridos", mecenas: "5 + 2 especiales" },
  { aspecto: "Mapa", gratis: "7 lugares destacados", mecenas: "Mapa completo + filtros" },
  { aspecto: "Línea de tiempo", gratis: "Explorar por año", mecenas: "Comparar años y rangos" },
  { aspecto: "Panteón e historia del día", gratis: "Todo gratis", mecenas: "Todo gratis" },
  { aspecto: "Carta y créditos", gratis: "—", mecenas: "Carta mensual + tu nombre" },
] as const;

export const BENEFICIOS_PLAN_FUNDADOR = [
  "Todo lo del plan Mecenas",
  "Precio de fundador por un año",
  "Votá qué crónica hacemos después",
  "Tu nombre destacado en los créditos",
  "Acceso antes que nadie a crónicas nuevas",
] as const;

export const DESCRIPCION_PLAN_MENSUAL =
  "Crónicas exclusivas, recorridos especiales y mapa completo para explorar la historia argentina.";

export const DESCRIPCION_PLAN_FUNDADOR =
  "Para quienes ayudan a que Argent exista. Incluye voto sobre la próxima crónica.";

export const FAQ_MEMBRESIA = [
  {
    q: "¿El museo sigue siendo gratis?",
    a: "Sí. Podés leer crónicas públicas, el Panteón, lugares, cinco recorridos y la historia del día sin pagar. Mecenas suma crónicas exclusivas, mapa completo y recorridos especiales.",
  },
  {
    q: "¿Qué incluye Mecenas hoy?",
    a: "Dos crónicas exclusivas, dos recorridos especiales, mapa completo con filtros, línea de tiempo avanzada, carta mensual y tu nombre en los créditos.",
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
