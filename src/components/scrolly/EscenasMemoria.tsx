"use client";

import { PanelImagenComparador } from "@/components/scrolly/PanelImagenComparador";

export function MemoriaDictadura() {
  return (
    <PanelImagenComparador
      imagenId="memoria-golpe"
      pie="Bajo la dictadura, las Madres siguieron caminando"
    />
  );
}

export function MemoriaDemocracia() {
  return (
    <PanelImagenComparador
      imagenId="memoria-alfonsin"
      pie="10 de diciembre de 1983: la democracia vuelve a la Plaza"
    />
  );
}
