"use client";

import { PanelImagenComparador } from "@/components/scrolly/PanelImagenComparador";

export function JuninCaballeria() {
  return (
    <PanelImagenComparador
      imagenId="guayaquil-sanmartin"
      pie="San Martín al mando del Ejército del Perú en la campaña de 1824"
    />
  );
}

export function JuninBatalla() {
  return (
    <PanelImagenComparador
      imagenId="junin-batalla"
      pie="La batalla de Junín: la caballería decide sin un solo disparo de fusil"
    />
  );
}
