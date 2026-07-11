"use client";

import { PanelImagenComparador } from "@/components/scrolly/PanelImagenComparador";

export function PiqueterosMarcha() {
  return (
    <PanelImagenComparador
      imagenId="piqueteros-marcha"
      pie="Los piqueteros: la calle que nació después del 2001"
    />
  );
}

export function PiqueterosCalle() {
  return (
    <PanelImagenComparador
      imagenId="piqueteros-calle"
      pie="Cortes de ruta, planes sociales y una nueva forma de protesta"
    />
  );
}
