"use client";

import { PanelImagenComparador } from "@/components/scrolly/PanelImagenComparador";

export function RosasRetrato() {
  return (
    <PanelImagenComparador
      imagenId="rosas-descalzi"
      pie="Juan Manuel de Rosas: veinte años de poder absoluto en Buenos Aires"
    />
  );
}

export function RosasPoder() {
  return (
    <PanelImagenComparador
      imagenId="rosas-arenga"
      pie="El rosismo: machete rojo, mazorca y un país dividido"
    />
  );
}
