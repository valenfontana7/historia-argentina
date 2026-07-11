"use client";

import { PanelImagenComparador } from "@/components/scrolly/PanelImagenComparador";

export function ChacabucoRealista() {
  return (
    <PanelImagenComparador
      imagenId="chacabuco-realista"
      pie="Realistas en la cuesta de Chacabuco, antes de la maniobra envolvente"
    />
  );
}

export function ChacabucoVictoria() {
  return (
    <PanelImagenComparador
      imagenId="andes-chacabuco"
      pie="La victoria de Chacabuco, pintura de Pedro Subercaseaux"
    />
  );
}
