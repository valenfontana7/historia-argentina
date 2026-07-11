"use client";

import { PanelImagenComparador } from "@/components/scrolly/PanelImagenComparador";

export function AyacuchoJunin() {
  return (
    <PanelImagenComparador
      imagenId="junin-batalla"
      pie="Junín inclinó la guerra. Ayacucho la terminó."
    />
  );
}

export function AyacuchoVictoria() {
  return (
    <PanelImagenComparador
      imagenId="ayacucho-batalla"
      pie="9 de diciembre de 1824: el fin del imperio español en América"
    />
  );
}
