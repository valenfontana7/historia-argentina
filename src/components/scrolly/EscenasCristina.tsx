"use client";

import { PanelImagenComparador } from "@/components/scrolly/PanelImagenComparador";

export function CristinaPresidenta() {
  return (
    <PanelImagenComparador
      imagenId="cristina-retrato"
      pie="Cristina Fernández: la continuidad del kirchnerismo en la presidencia"
    />
  );
}

export function CristinaLegado() {
  return (
    <PanelImagenComparador
      imagenId="cristina-legado"
      pie="Del retorno democrático al siglo XXI: una misma Plaza, otra Argentina"
    />
  );
}
