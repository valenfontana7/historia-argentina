"use client";

import { PanelImagenComparador } from "@/components/scrolly/PanelImagenComparador";

export function FrondiziPresidente() {
  return (
    <PanelImagenComparador
      imagenId="frondizi-retrato"
      pie="Arturo Frondizi: el desarrollismo que apostó al petróleo y a la industria"
    />
  );
}

export function FrondiziEconomia() {
  return (
    <PanelImagenComparador
      imagenId="frondizi-grafico"
      pie="1958 — 1962: crecimiento industrial y tensión social"
    />
  );
}
