"use client";

import { PanelImagenComparador } from "@/components/scrolly/PanelImagenComparador";

export function LanussePresidente() {
  return (
    <PanelImagenComparador
      imagenId="lanusse-retrato"
      pie="Alejandro Lanusse: el general que convocó elecciones para volver a la política"
    />
  );
}

export function LanusseElecciones() {
  return (
    <PanelImagenComparador
      imagenId="peron-1973"
      pie="1973: las urnas abrieron la puerta al retorno de Perón"
    />
  );
}
