"use client";

import { PanelImagenComparador } from "@/components/scrolly/PanelImagenComparador";

export function DeLaRuaPresidente() {
  return (
    <PanelImagenComparador
      imagenId="delarua-retrato"
      pie="Fernando de la Rúa: el radical que heredó la convertibilidad"
    />
  );
}

export function DeLaRuaCrisis() {
  return (
    <PanelImagenComparador
      imagenId="crisis-2001-manifestacion"
      pie="Diciembre de 2001: la renuncia que abrió la crisis más profunda"
    />
  );
}
