"use client";

import { PanelImagenComparador } from "@/components/scrolly/PanelImagenComparador";

export function CordobazoCalle() {
  return (
    <PanelImagenComparador
      imagenId="cordobazo-calle"
      pie="Córdoba industrial en huelga: la calle contra el régimen"
    />
  );
}

export function CordobazoRepresion() {
  return (
    <PanelImagenComparador
      imagenId="cordobazo-represion"
      pie="El Cordobazo: represión y muerte en las calles de Córdoba"
    />
  );
}
