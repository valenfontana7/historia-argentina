/**
 * Precios y promesas de la membresía Mecenas.
 * Ajustar acá actualiza la página de precios y el checkout de MercadoPago.
 */

import { sitio } from "@/lib/site.config";

export type PlanId = "mensual" | "fundador";

export type PlanMembresia = {
  id: PlanId;
  nombre: string;
  precio: number;
  moneda: "ARS";
  periodo: string;
  descripcion: string;
  destacado?: boolean;
  beneficios: string[];
};

export const planes: Record<PlanId, PlanMembresia> = {
  mensual: {
    id: "mensual",
    nombre: "Mecenas",
    precio: 4990,
    moneda: "ARS",
    periodo: "por mes",
    descripcion:
      "Convertí Argent en tu museo personal: mapas, colecciones y experiencias exclusivas.",
    beneficios: [
      "Mapa histórico interactivo",
      "Crónicas y apéndices exclusivos",
      "Carta del mecenas cada mes",
      "Colecciones y progreso guardados",
      "Timeline avanzada por año",
      "Sin publicidad",
      "Tu nombre en el muro de créditos",
    ],
  },
  fundador: {
    id: "fundador",
    nombre: "Mecenas Fundador",
    precio: 39990,
    moneda: "ARS",
    periodo: "por año",
    destacado: true,
    descripcion:
      "Los primeros que hacen posible Argent. Tu museo personal, con presencia destacada.",
    beneficios: [
      "Todo lo del plan Mecenas",
      "Tasa de fundador por un año",
      "Nombre destacado en los créditos",
      "Voto anticipado sobre la próxima crónica",
      "Acceso anticipado a nuevas experiencias",
    ],
  },
};

export function formatearPrecio(precio: number, moneda: "ARS" = "ARS") {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: moneda,
    maximumFractionDigits: 0,
  }).format(precio);
}

export function diasDePlan(plan: PlanId): number {
  return plan === "fundador" ? 365 : 30;
}

/** Copy listo para el primer post de lanzamiento (IG / X / WhatsApp). */
export const copyLanzamiento = `Abrimos Mecenas.

Argent es un museo digital de historia argentina: crónicas cinematográficas, un panteón vivo y una efeméride cada día. Todo eso sigue gratis.

Si querés convertirlo en tu museo personal —mapas interactivos, colecciones, carta mensual y exclusivas— este es el momento de los fundadores.

${
  typeof process !== "undefined" && process.env.NEXT_PUBLIC_SITE_URL
    ? process.env.NEXT_PUBLIC_SITE_URL
    : sitio.url
}/membresia`;
