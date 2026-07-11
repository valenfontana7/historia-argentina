"use client";

import { PanelImagenComparador } from "@/components/scrolly/PanelImagenComparador";

export function SarmientoMaestro() {
  return (
    <PanelImagenComparador
      imagenId="sarmiento-retrato"
      pie="Domingo Faustino Sarmiento: el maestro de América"
    />
  );
}

export function SarmientoFacundo() {
  return (
    <PanelImagenComparador
      imagenId="facundo-2"
      pie="El Facundo: el libro que inventó la dicotomía civilización o barbarie"
    />
  );
}
