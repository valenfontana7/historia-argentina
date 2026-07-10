"use client";

import { PanelImagenComparador } from "@/components/scrolly/PanelImagenComparador";

export function FacundoVivo() {
  return (
    <PanelImagenComparador
      imagenId="facundo-retrato"
      pie="Facundo Quiroga: caudillo del interior, aliado y amenaza"
    />
  );
}

export function FacundoCaida() {
  return (
    <PanelImagenComparador
      imagenId="facundo-2"
      pie="El Tigre de los Llanos: poder personal que terminó en un camino"
    />
  );
}
