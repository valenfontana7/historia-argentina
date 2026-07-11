import {
  COLECCIONES_PREMIUM,
  IDS_PIEZAS_PREMIUM,
  PIEZAS_PREMIUM,
  type ColeccionPremium,
  type PiezaPremiumMeta,
} from "@/data/piezas-premium";
import { obtenerPieza, type Pieza } from "@/lib/piezas/indice";

export function esPiezaPremium(id: string): boolean {
  return id in PIEZAS_PREMIUM;
}

export function obtenerMetaPremium(id: string): PiezaPremiumMeta | undefined {
  return PIEZAS_PREMIUM[id];
}

export function todasLasColeccionesPremium(): ColeccionPremium[] {
  return COLECCIONES_PREMIUM;
}

export function piezasDeColeccion(coleccionId: string): Pieza[] {
  const coleccion = COLECCIONES_PREMIUM.find((c) => c.id === coleccionId);
  if (!coleccion) return [];
  return coleccion.piezas
    .map((id) => obtenerPieza(id))
    .filter((p): p is Pieza => p !== undefined);
}

export function todasLasPiezasPremium(): Pieza[] {
  return IDS_PIEZAS_PREMIUM.map((id) => obtenerPieza(id)).filter(
    (p): p is Pieza => p !== undefined,
  );
}

export function coleccionDePieza(id: string): ColeccionPremium | undefined {
  const meta = PIEZAS_PREMIUM[id];
  if (!meta) return undefined;
  return COLECCIONES_PREMIUM.find((c) => c.id === meta.coleccionId);
}
