"use client";

import { PanelImagenComparador } from "@/components/scrolly/PanelImagenComparador";

export function TransicionDictadura() {
  return (
    <PanelImagenComparador
      imagenId="memoria-golpe"
      pie="La dictadura: terror de Estado y Plaza de Mayo vigilada"
    />
  );
}

export function TransicionDemocracia() {
  return (
    <PanelImagenComparador
      imagenId="transicion-alfonsin"
      pie="10 de diciembre de 1983: Alfonsín devuelve la democracia"
    />
  );
}
