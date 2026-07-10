"use client";

import { PanelImagenComparador } from "@/components/scrolly/PanelImagenComparador";

export function EvitaAntes() {
  return (
    <PanelImagenComparador
      imagenId="octubre-plaza"
      pie="Argentina de masas antes de Evita: la Plaza ya era escenario político"
    />
  );
}

export function EvitaPoder() {
  return (
    <PanelImagenComparador
      imagenId="evita-cabildo"
      pie="Evita en el Cabildo Abierto de 1951: el pueblo como interlocutor"
    />
  );
}
