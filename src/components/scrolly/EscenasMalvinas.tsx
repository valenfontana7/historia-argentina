"use client";

import { PanelImagenComparador } from "@/components/scrolly/PanelImagenComparador";

export function MalvinasCivil() {
  return (
    <PanelImagenComparador
      imagenId="malvinas-multitud"
      pie="La causa nacional movilizó al país entero"
    />
  );
}

export function MalvinasMilitar() {
  return (
    <PanelImagenComparador
      imagenId="malvinas-desembarco"
      pie="2 de abril: tropas argentinas en Puerto Argentino"
    />
  );
}
