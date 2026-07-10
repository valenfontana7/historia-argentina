"use client";

import { PanelImagenComparador } from "@/components/scrolly/PanelImagenComparador";

export function ObligadoBloqueo() {
  return (
    <PanelImagenComparador
      imagenId="obligado-flota"
      pie="La flota anglofrancesa intenta forzar el Paraná"
    />
  );
}

export function ObligadoDefensa() {
  return (
    <PanelImagenComparador
      imagenId="obligado-batalla"
      pie="Baterías de ribera y cadenas en el recodo de Obligado"
    />
  );
}
