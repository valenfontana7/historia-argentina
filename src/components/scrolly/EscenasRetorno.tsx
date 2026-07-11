"use client";

import { PanelImagenComparador } from "@/components/scrolly/PanelImagenComparador";

export function RetornoPeron() {
  return (
    <PanelImagenComparador
      imagenId="peron-1973"
      pie="Perón vuelve en 1973: el peronismo recupera el poder"
    />
  );
}

export function RetornoMultitud() {
  return (
    <PanelImagenComparador
      imagenId="octubre-plaza"
      pie="La Plaza de Mayo como termómetro del país: del 45 al 73"
    />
  );
}
