"use client";

import { PanelImagenComparador } from "@/components/scrolly/PanelImagenComparador";

export function HiperinflacionGrafico() {
  return (
    <PanelImagenComparador
      imagenId="hiperinflacion-grafico"
      pie="1989 — 1990: la inflación que devoró salarios y ahorros"
    />
  );
}

export function HiperinflacionAlfonsin() {
  return (
    <PanelImagenComparador
      imagenId="transicion-1985"
      pie="Alfonsín deja la presidencia con la democracia intacta"
    />
  );
}
