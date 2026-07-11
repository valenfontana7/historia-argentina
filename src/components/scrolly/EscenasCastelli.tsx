"use client";

import { PanelImagenComparador } from "@/components/scrolly/PanelImagenComparador";

export function CastelliRetrato() {
  return (
    <PanelImagenComparador
      imagenId="castelli-retrato"
      pie="Juan José Castelli: el orador de la revolución del norte"
    />
  );
}

export function CastelliRevolution() {
  return (
    <PanelImagenComparador
      imagenId="mayo-milicias"
      pie="Las milicias patriotas que Castelli llevó al Alto Perú"
    />
  );
}
