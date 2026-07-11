"use client";

import { PanelImagenComparador } from "@/components/scrolly/PanelImagenComparador";

export function RivadaviaProyecto() {
  return (
    <PanelImagenComparador
      imagenId="rivadavia-constitucion"
      pie="La Constitución de 1826: modernizar la República desde Buenos Aires"
    />
  );
}

export function RivadaviaRetrato() {
  return (
    <PanelImagenComparador
      imagenId="rivadavia-retrato"
      pie="Bernardino Rivadavia: el primer presidente unitario"
    />
  );
}
