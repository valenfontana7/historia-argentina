"use client";

import { PanelImagenComparador } from "@/components/scrolly/PanelImagenComparador";

export function ProcesoGolpe() {
  return (
    <PanelImagenComparador
      imagenId="junta-1976"
      pie="24 de marzo de 1976: la Junta Militar derroca a Isabel Perón"
    />
  );
}

export function ProcesoTerror() {
  return (
    <PanelImagenComparador
      imagenId="memoria-golpe"
      pie="El Proceso de Reorganización Nacional: terror de Estado"
    />
  );
}
