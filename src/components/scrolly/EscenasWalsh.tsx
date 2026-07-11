"use client";

import { PanelImagenComparador } from "@/components/scrolly/PanelImagenComparador";

export function WalshEscritor() {
  return (
    <PanelImagenComparador
      imagenId="walsh-retrato"
      pie="Rodolfo Walsh: periodismo, ficción y compromiso político"
    />
  );
}

export function WalshCarta() {
  return (
    <PanelImagenComparador
      imagenId="walsh-carta"
      pie="La Carta abierta a la Junta Militar, 1977"
    />
  );
}
