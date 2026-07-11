"use client";

import { PanelImagenComparador } from "@/components/scrolly/PanelImagenComparador";

export function PavonUrquiza() {
  return (
    <PanelImagenComparador
      imagenId="caseros-urquiza"
      pie="Urquiza: caudillo federal y gobernante de la Confederación"
    />
  );
}

export function PavonMitre() {
  return (
    <PanelImagenComparador
      imagenId="mitre-retrato"
      pie="Mitre: el proyecto unitario que triunfó en Pavón"
    />
  );
}
