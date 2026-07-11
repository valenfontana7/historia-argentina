"use client";

import { PanelImagenComparador } from "@/components/scrolly/PanelImagenComparador";

export function RocaRetrato() {
  return (
    <PanelImagenComparador
      imagenId="roca-retrato"
      pie="Julio Argentino Roca: el político más hábil del siglo XIX"
    />
  );
}

export function RocaEstado() {
  return (
    <PanelImagenComparador
      imagenId="desierto-ejercito"
      pie="Paz y administración: el Estado que Roca consolidó"
    />
  );
}
