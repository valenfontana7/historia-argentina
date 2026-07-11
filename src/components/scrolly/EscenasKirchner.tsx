"use client";

import { PanelImagenComparador } from "@/components/scrolly/PanelImagenComparador";

export function KirchnerPresidente() {
  return (
    <PanelImagenComparador
      imagenId="kirchner-retrato"
      pie="Néstor Kirchner: el peronismo que salió del colapso del 2001"
    />
  );
}

export function KirchnerCrisis() {
  return (
    <PanelImagenComparador
      imagenId="crisis-2001-manifestacion"
      pie="Después del corralito: reconstruir economía y memoria"
    />
  );
}
