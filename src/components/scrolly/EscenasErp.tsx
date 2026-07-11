"use client";

import { PanelImagenComparador } from "@/components/scrolly/PanelImagenComparador";

export function ErpGuerrilla() {
  return (
    <PanelImagenComparador
      imagenId="erp-bandera"
      pie="El ERP: la guerrilla marxista de los años setenta"
    />
  );
}

export function ErpMontoneros() {
  return (
    <PanelImagenComparador
      imagenId="montoneros-captura"
      pie="Montoneros y ERP: dos frentes armados, una misma década"
    />
  );
}
