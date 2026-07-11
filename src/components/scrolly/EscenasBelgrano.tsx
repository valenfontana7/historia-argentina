"use client";

import { PanelImagenComparador } from "@/components/scrolly/PanelImagenComparador";

export function BelgranoRetrato() {
  return (
    <PanelImagenComparador
      imagenId="belgrano-retrato"
      pie="Manuel Belgrano: economista, abogado y general por necesidad"
    />
  );
}

export function BelgranoLegado() {
  return (
    <PanelImagenComparador
      imagenId="bandera-belgrano"
      pie="Bandera, norte y desobediencia: el legado de Belgrano"
    />
  );
}
