/**
 * Precios y promesas de la membresía Mecenas.
 * Ajustar acá actualiza la página de precios y el checkout de MercadoPago.
 */

import {
  BENEFICIOS_PLAN_FUNDADOR,
  BENEFICIOS_PLAN_MENSUAL,
  DESCRIPCION_PLAN_FUNDADOR,
  DESCRIPCION_PLAN_MENSUAL,
} from "@/lib/copy";
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
    descripcion: DESCRIPCION_PLAN_MENSUAL,
    beneficios: [...BENEFICIOS_PLAN_MENSUAL],
  },
  fundador: {
    id: "fundador",
    nombre: "Mecenas Fundador",
    precio: 39990,
    moneda: "ARS",
    periodo: "por año",
    destacado: true,
    descripcion: DESCRIPCION_PLAN_FUNDADOR,
    beneficios: [...BENEFICIOS_PLAN_FUNDADOR],
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

Argent es un museo digital de historia argentina: crónicas para leer, un panteón de personajes y una historia cada día. Todo eso sigue gratis.

Si querés crónicas exclusivas, recorridos especiales, mapa completo y la carta mensual, este es el momento de los fundadores.

${
  typeof process !== "undefined" && process.env.NEXT_PUBLIC_SITE_URL
    ? process.env.NEXT_PUBLIC_SITE_URL
    : sitio.url
}/membresia`;
