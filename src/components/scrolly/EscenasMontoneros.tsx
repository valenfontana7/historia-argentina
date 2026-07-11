"use client";

import { PanelImagenComparador } from "@/components/scrolly/PanelImagenComparador";

export function MontonerosGuerrilla() {
  return (
    <PanelImagenComparador
      imagenId="montoneros-captura"
      pie="Montoneros: la guerrilla que eligió las armas en los setenta"
    />
  );
}

export function MontonerosViolencia() {
  return (
    <PanelImagenComparador
      imagenId="aramburu-ataud"
      pie="La violencia política escaló: secuestros, atentados, represalias"
    />
  );
}
