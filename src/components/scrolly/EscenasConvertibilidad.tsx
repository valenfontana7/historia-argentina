"use client";

import { PanelImagenComparador } from "@/components/scrolly/PanelImagenComparador";

export function ConvertibilidadPeron() {
  return (
    <PanelImagenComparador
      imagenId="octubre-plaza"
      pie="El modelo de industrialización y trabajo que Perón legó al país"
    />
  );
}

export function ConvertibilidadColapso() {
  return (
    <PanelImagenComparador
      imagenId="crisis-2001-diagrama"
      pie="De la estabilidad del 1 a 1 al colapso: la espiral que terminó en 2001"
    />
  );
}
