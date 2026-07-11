"use client";

import { PanelImagenComparador } from "@/components/scrolly/PanelImagenComparador";

export function MalvinasCiudad() {
  return (
    <PanelImagenComparador
      imagenId="malvinas-plaza"
      pie="10 de abril de 1982: la guerra llegó a la Plaza de Mayo"
    />
  );
}

export function MalvinasFrente() {
  return (
    <PanelImagenComparador
      imagenId="malvinas-desembarco"
      pie="El frente: tropas argentinas en Puerto Argentino"
    />
  );
}
