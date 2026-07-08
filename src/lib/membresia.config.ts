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
      "La capa narrativa exclusiva de Argent: crónicas inmersivas, recorridos premium y exploración avanzada.",
    beneficios: [
      "Crónicas exclusivas cada mes",
      "2 recorridos premium (Democracia y San Martín continental)",
      "Carta editorial mensual del mecenas",
      "Mapa histórico completo con filtros por época",
      "Timeline con capa avanzada para mecenas",
      "Tu nombre en el muro de créditos",
      "Sin publicidad",
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
      "Los primeros que hacen posible Argent. Narrativa exclusiva + voz en la próxima crónica.",
    beneficios: [
      "Todo lo del plan Mecenas",
      "Tasa de fundador por un año",
      "Voto anticipado sobre la próxima crónica",
      "Nombre destacado en los créditos",
      "Acceso anticipado a nuevas crónicas",
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

Argent es un museo digital de historia argentina: crónicas cinematográficas, un panteón vivo y un archivo de efemérides. Todo eso sigue gratis.

Si querés la capa narrativa exclusiva —crónicas mensuales, recorridos premium, mapa completo y carta editorial— este es el momento de los fundadores.

${
  typeof process !== "undefined" && process.env.NEXT_PUBLIC_SITE_URL
    ? process.env.NEXT_PUBLIC_SITE_URL
    : sitio.url
}/membresia`;
