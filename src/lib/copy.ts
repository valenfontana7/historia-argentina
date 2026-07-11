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

/** Vocabulario museográfico — salas, exhibiciones, visitas guiadas. */
export const MIGA_SALAS = "Salas";
export const KICKER_SALAS = "Salas permanentes";
export const TITULO_SALAS = "Salas permanentes";
export const DESCRIPCION_SALAS =
  "Argentina no se construyó de un golpe. Recorré las cinco grandes salas que dieron forma al país.";
export const METADATA_SALAS = {
  titulo: "Salas permanentes — historia argentina",
  descripcion: DESCRIPCION_SALAS,
} as const;
export const TITULO_EXHIBICIONES_SALA = "Exhibiciones de esta sala";
export const KICKER_SALA = "Sala";
export const OG_KICKER_SALA = "Sala";

export const MIGA_VISITAS_GUIADAS = "Visitas guiadas";
export const KICKER_VISITAS_GUIADAS = "Visitas guiadas";
export const TITULO_VISITAS_GUIADAS = "Visitas guiadas";
export const DESCRIPCION_VISITAS_GUIADAS =
  "Caminá la historia en orden: cada estación te lleva a la siguiente. Hay visitas gratuitas y tres exclusivas para mecenas.";
export const METADATA_VISITAS_GUIADAS = {
  titulo: "Visitas guiadas — historia argentina",
  descripcion: DESCRIPCION_VISITAS_GUIADAS,
} as const;
export const CTA_INICIAR_VISITA = "Iniciar visita →";
export const CTA_VER_TODAS_VISITAS = "← Ver todas las visitas guiadas";
export function etiquetaExhibicionesVisita(cantidad: number): string {
  return `${cantidad} ${cantidad === 1 ? "exhibición" : "exhibiciones"}`;
}
export function etiquetaEstacionesVisita(cantidad: number): string {
  return `${cantidad} ${cantidad === 1 ? "estación" : "estaciones"}`;
}

export const TITULO_EXHIBICIONES_PROTAGONIZADAS = "Exhibiciones protagonizadas";
export const TITULO_RETRATOS_RELACIONADOS = "Retratos relacionados";
export const KICKER_COLECCION = "Colección";
export const MIGA_COLECCIONES = "Colecciones";
export function tituloExhibicionesColeccion(nombre: string): string {
  return `Exhibiciones de la colección «${nombre}»`;
}
export const CTA_VER_SALA_EPOCA = "Ver la sala de la época →";

/** Puerta de sala privada (SoftGate museográfico). */
export const KICKER_SALA_PRIVADA = "Sala privada";
export const TITULO_SALA_PRIVADA = "Esta exhibición está reservada para mecenas";
export const DESCRIPCION_SALA_PRIVADA =
  "Podés ver el umbral desde acá. Cruzar la puerta requiere la membresía que sostiene el museo.";
export const CTA_PEDIR_ACCESO = "Pedir enlace de acceso";
export const CTA_VER_PLANES = "Ver planes de mecenas";

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
