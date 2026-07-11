"use client";

import { PanelImagenComparador } from "@/components/scrolly/PanelImagenComparador";

export function EmbajadaMemoria() {
  return (
    <PanelImagenComparador
      imagenId="embajada-memoria"
      pie="17 de marzo de 1992: el atentado a la Embajada de Israel"
    />
  );
}

export function EmbajadaCeremonia() {
  return (
    <PanelImagenComparador
      imagenId="embajada-ceremonia"
      pie="29 víctimas: la primera bomba terrorista en democracia"
    />
  );
}
