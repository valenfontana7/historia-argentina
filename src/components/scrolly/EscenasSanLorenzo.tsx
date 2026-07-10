"use client";

import { PanelImagenComparador } from "@/components/scrolly/PanelImagenComparador";

export function SanLorenzoRealista() {
  return (
    <PanelImagenComparador
      imagenId="invasiones-desembarco"
      pie="Tropas coloniales desembarcando: el enemigo que San Martín esperaba"
    />
  );
}

export function SanLorenzoGranaderos() {
  return (
    <PanelImagenComparador
      imagenId="san-lorenzo-batalla"
      pie="La carga de los Granaderos a Caballo en San Lorenzo"
    />
  );
}
