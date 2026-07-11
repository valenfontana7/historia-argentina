"use client";

import { PanelImagenComparador } from "@/components/scrolly/PanelImagenComparador";

export function PatagoniaHuelga() {
  return (
    <PanelImagenComparador
      imagenId="patagonia-huelga"
      pie="Obreros de la Patagonia: huelga en Santa Cruz, 1920"
    />
  );
}

export function PatagoniaRepresion() {
  return (
    <PanelImagenComparador
      imagenId="patagonia-monumento"
      pie="La represión: el monumento que recuerda a los huelguistas fusilados"
    />
  );
}
