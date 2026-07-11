"use client";

import { PanelImagenComparador } from "@/components/scrolly/PanelImagenComparador";

export function MadresPlaza() {
  return (
    <PanelImagenComparador
      imagenId="memoria-golpe"
      pie="Las Madres de Plaza de Mayo: el pañuelo blanco contra el terror"
    />
  );
}

export function MadresFundadora() {
  return (
    <PanelImagenComparador
      imagenId="azucena-villaflor"
      pie="Azucena Villaflor: la voz que convocó a las primeras madres"
    />
  );
}
