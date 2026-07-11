"use client";

import { PanelImagenComparador } from "@/components/scrolly/PanelImagenComparador";

export function IsabelPresidenta() {
  return (
    <PanelImagenComparador
      imagenId="isabel-retrato"
      pie="María Estela Martínez de Perón: la primera mujer presidenta de América"
    />
  );
}

export function IsabelAsuncion() {
  return (
    <PanelImagenComparador
      imagenId="isabel-asuncion"
      pie="1973: Perón e Isabel asumen juntos; 1974, ella queda sola en el poder"
    />
  );
}
