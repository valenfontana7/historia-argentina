"use client";

import { PanelImagenComparador } from "@/components/scrolly/PanelImagenComparador";

export function LibertadoraPeronismo() {
  return (
    <PanelImagenComparador
      imagenId="octubre-peron"
      pie="Perón en el poder: el peronismo que la Revolución Libertadora derribó"
    />
  );
}

export function LibertadoraGolpe() {
  return (
    <PanelImagenComparador
      imagenId="libertadora-golpe"
      pie="16 de septiembre de 1955: el alzamiento cívico-militar"
    />
  );
}
