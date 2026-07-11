"use client";

import { PanelImagenComparador } from "@/components/scrolly/PanelImagenComparador";

export function AlberdiExilio() {
  return (
    <PanelImagenComparador
      imagenId="alberdi-retrato"
      pie="Alberdi en el exilio: pensando la nación antes de que existiera"
    />
  );
}

export function AlberdiBases() {
  return (
    <PanelImagenComparador
      imagenId="alberdi-bases"
      pie="Bases y puntos de partida: el manual de la organización nacional"
    />
  );
}
