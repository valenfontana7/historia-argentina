"use client";

import { PanelImagenComparador } from "@/components/scrolly/PanelImagenComparador";

export function EsmaMemorial() {
  return (
    <PanelImagenComparador
      imagenId="esma-memoria"
      pie="La ESMA hoy: espacio de memoria y derechos humanos"
    />
  );
}

export function EsmaClandestino() {
  return (
    <PanelImagenComparador
      imagenId="esma-edificio"
      pie="El edificio donde el Estado torturó y desapareció personas"
    />
  );
}
