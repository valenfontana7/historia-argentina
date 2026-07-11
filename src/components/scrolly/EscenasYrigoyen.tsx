"use client";

import { PanelImagenComparador } from "@/components/scrolly/PanelImagenComparador";

export function YrigoyenPueblo() {
  return (
    <PanelImagenComparador
      imagenId="yrigoyen-nac"
      pie="Hipólito Yrigoyen: el primer presidente elegido por voto popular"
    />
  );
}

export function YrigoyenRadical() {
  return (
    <PanelImagenComparador
      imagenId="saenz-pena-elecciones"
      pie="1916: el radicalismo llega al poder con urnas limpias"
    />
  );
}
