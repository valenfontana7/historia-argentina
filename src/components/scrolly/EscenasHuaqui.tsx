"use client";

import { PanelImagenComparador } from "@/components/scrolly/PanelImagenComparador";

export function HuaquiAltiplano() {
  return (
    <PanelImagenComparador
      imagenId="jujuy-quebrada"
      pie="El Alto Perú: el cementerio de los ejércitos patriotas"
    />
  );
}

export function HuaquiDerrota() {
  return (
    <PanelImagenComparador
      imagenId="belgrano-retrato"
      pie="Belgrano y Castelli: la derrota que cambió la estrategia de la revolución"
    />
  );
}
