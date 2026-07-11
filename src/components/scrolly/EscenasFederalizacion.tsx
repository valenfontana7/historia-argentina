"use client";

import { PanelImagenComparador } from "@/components/scrolly/PanelImagenComparador";

export function FederalProvincia() {
  return (
    <PanelImagenComparador
      imagenId="federal-plano"
      pie="Buenos Aires provincia: la ciudad y su campaña en un solo territorio"
    />
  );
}

export function FederalCapital() {
  return (
    <PanelImagenComparador
      imagenId="federal-escudo"
      pie="La federalización de 1880: nace la Capital Federal"
    />
  );
}
