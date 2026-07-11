"use client";

import { PanelImagenComparador } from "@/components/scrolly/PanelImagenComparador";

export function MaipuRealista() {
  return (
    <PanelImagenComparador
      imagenId="maipu-batalla"
      pie="El choque en los llanos de Maipú, pintura de Pedro Subercaseaux"
    />
  );
}

export function MaipuAbrazo() {
  return (
    <PanelImagenComparador
      imagenId="maipu-abrazo"
      pie="San Martín y O'Higgins tras sellar la independencia de Chile"
    />
  );
}
