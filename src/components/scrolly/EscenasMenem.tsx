"use client";

import { PanelImagenComparador } from "@/components/scrolly/PanelImagenComparador";

export function MenemAsume() {
  return (
    <PanelImagenComparador
      imagenId="menem-1989"
      pie="Menem asume en 1989: el peronismo vuelve con otro rostro"
    />
  );
}

export function MenemDecada() {
  return (
    <PanelImagenComparador
      imagenId="menem-banda"
      pie="La década de 1990: privatizaciones, dólar y consumo"
    />
  );
}
