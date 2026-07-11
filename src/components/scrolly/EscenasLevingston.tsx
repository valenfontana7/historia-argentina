"use client";

import { PanelImagenComparador } from "@/components/scrolly/PanelImagenComparador";

export function LevingstonPresidente() {
  return (
    <PanelImagenComparador
      imagenId="levingston-retrato"
      pie="Roberto Levingston: el general que reemplazó a Onganía en 1970"
    />
  );
}

export function LevingstonRevolucion() {
  return (
    <PanelImagenComparador
      imagenId="revolucion-argentina-generales"
      pie="Tres generales, una sola Revolución Argentina"
    />
  );
}
