"use client";

import { PanelImagenComparador } from "@/components/scrolly/PanelImagenComparador";

export function AlfonsinDemocracia() {
  return (
    <PanelImagenComparador
      imagenId="transicion-alfonsin"
      pie="Raúl Alfonsín: el presidente que devolvió la democracia"
    />
  );
}

export function AlfonsinMemoria() {
  return (
    <PanelImagenComparador
      imagenId="transicion-1985"
      pie="Juicio a las juntas: memoria, verdad y justicia civil"
    />
  );
}
