"use client";

import { PanelImagenComparador } from "@/components/scrolly/PanelImagenComparador";

export function VidelaDictador() {
  return (
    <PanelImagenComparador
      imagenId="videla-retrato"
      pie="Jorge Rafael Videla: el rostro del Proceso de Reorganización Nacional"
    />
  );
}

export function VidelaGolpe() {
  return (
    <PanelImagenComparador
      imagenId="videla-golpe"
      pie="24 de marzo de 1976: Videla encabeza la Junta Militar"
    />
  );
}
