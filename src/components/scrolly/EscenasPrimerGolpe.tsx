"use client";

import { PanelImagenComparador } from "@/components/scrolly/PanelImagenComparador";

export function GolpeDemocracia() {
  return (
    <PanelImagenComparador
      imagenId="yrigoyen-nac"
      pie="Yrigoyen: elegido con el 62 % de los votos en 1928"
    />
  );
}

export function GolpeMilitar() {
  return (
    <PanelImagenComparador
      imagenId="golpe-1930-plaza"
      pie="6 de septiembre de 1930: tanques en la Plaza del Congreso"
    />
  );
}
