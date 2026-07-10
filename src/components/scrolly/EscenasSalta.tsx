"use client";

import { PanelImagenComparador } from "@/components/scrolly/PanelImagenComparador";

export function SaltaTucuman() {
  return (
    <PanelImagenComparador
      imagenId="jujuy-tucuman"
      pie="Tucumán abrió la ventana: la victoria aún no era definitiva"
    />
  );
}

export function SaltaVictoria() {
  return (
    <PanelImagenComparador
      imagenId="salta-batalla"
      pie="En Salta, Belgrano obtiene la primera capitulación total española"
    />
  );
}
