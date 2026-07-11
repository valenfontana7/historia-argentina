"use client";

import { PanelImagenComparador } from "@/components/scrolly/PanelImagenComparador";

export function FabricasRecuperadasCooperativa() {
  return (
    <PanelImagenComparador
      imagenId="fabricas-recuperadas"
      pie="Fábricas recuperadas: los trabajadores se quedaron con la producción"
    />
  );
}

export function FabricasRecuperadasTrabajo() {
  return (
    <PanelImagenComparador
      imagenId="fabricas-cooperativa"
      pie="Después del 2001, la economía social se volvió alternativa real"
    />
  );
}
