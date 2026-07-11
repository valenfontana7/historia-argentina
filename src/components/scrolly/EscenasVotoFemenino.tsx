"use client";

import { PanelImagenComparador } from "@/components/scrolly/PanelImagenComparador";

export function VotoMujeres() {
  return (
    <PanelImagenComparador
      imagenId="evita-voto"
      pie="1947: millones de mujeres entran a la política argentina"
    />
  );
}

export function VotoEvita() {
  return (
    <PanelImagenComparador
      imagenId="evita-multitud"
      pie="Evita: la militancia que empujó la ley de sufragio femenino"
    />
  );
}
