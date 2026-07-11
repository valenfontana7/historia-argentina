"use client";

import { PanelImagenComparador } from "@/components/scrolly/PanelImagenComparador";

export function MileiPresidente() {
  return (
    <PanelImagenComparador
      imagenId="milei-retrato"
      pie="Javier Milei: la ruptura política de 2023"
    />
  );
}

export function MileiEleccion() {
  return (
    <PanelImagenComparador
      imagenId="milei-eleccion"
      pie="Noviembre de 2023: Milei gana el balotaje y desafía el peronismo"
    />
  );
}
