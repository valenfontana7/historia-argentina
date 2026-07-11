"use client";

import { PanelImagenComparador } from "@/components/scrolly/PanelImagenComparador";

export function DefaultCalle() {
  return (
    <PanelImagenComparador
      imagenId="crisis-2001-manifestacion"
      pie="Diciembre de 2001: la calle y el corralito"
    />
  );
}

export function DefaultDeuda() {
  return (
    <PanelImagenComparador
      imagenId="crisis-2001-diagrama"
      pie="23 de diciembre de 2001: la mayor cesación de pagos de la historia"
    />
  );
}
