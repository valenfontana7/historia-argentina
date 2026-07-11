"use client";

import { PanelImagenComparador } from "@/components/scrolly/PanelImagenComparador";

export function CrisisCalle() {
  return (
    <PanelImagenComparador
      imagenId="crisis-2001-manifestacion"
      pie="La calle contra el corralito: la democracia en crisis"
    />
  );
}

export function CrisisDiagrama() {
  return (
    <PanelImagenComparador
      imagenId="crisis-2001-diagrama"
      pie="Diciembre de 2001: cinco presidentes en dos semanas"
    />
  );
}
