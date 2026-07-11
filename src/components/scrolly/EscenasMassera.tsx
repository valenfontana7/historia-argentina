"use client";

import { PanelImagenComparador } from "@/components/scrolly/PanelImagenComparador";

export function MasseraAlmirante() {
  return (
    <PanelImagenComparador
      imagenId="massera-retrato"
      pie="Emilio Massera: la Armada y la ESMA bajo dictadura"
    />
  );
}

export function MasseraJunta() {
  return (
    <PanelImagenComparador
      imagenId="massera-1975"
      pie="Massera en 1975: el almirante que preparó el golpe"
    />
  );
}
