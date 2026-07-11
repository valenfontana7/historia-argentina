"use client";

import { PanelImagenComparador } from "@/components/scrolly/PanelImagenComparador";

export function PeronPreso() {
  return (
    <PanelImagenComparador
      imagenId="octubre-peron"
      pie="Perón en la cárcel de la Isla Martín García, octubre de 1945"
    />
  );
}

export function PeronPlaza() {
  return (
    <PanelImagenComparador
      imagenId="octubre-plaza"
      pie="17 de octubre de 1945: el pueblo lo saca de la cárcel"
    />
  );
}
