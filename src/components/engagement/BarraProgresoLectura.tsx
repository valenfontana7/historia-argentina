"use client";

import { useEffect, useCallback } from "react";
import { useStorageSnapshot } from "@/lib/engagement/client-storage-sync";
import { notificarCambioStorage } from "@/lib/engagement/storage-events";
import { obtenerProgreso } from "@/lib/engagement/storage";

type Props = {
  href: string;
};

export function BarraProgresoLectura({ href }: Props) {
  const leerProgreso = useCallback(() => obtenerProgreso(href), [href]);
  const pct = useStorageSnapshot(leerProgreso, 0);

  useEffect(() => {
    const id = setInterval(() => notificarCambioStorage(), 2000);
    return () => clearInterval(id);
  }, [href]);

  if (pct <= 0) return null;

  return (
    <div
      className="fixed inset-x-0 top-16 z-40 h-0.5 bg-fondo-3"
      role="progressbar"
      aria-valuenow={pct}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label="Progreso de lectura"
    >
      <div
        className="h-full bg-oro/70 transition-all duration-300"
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}
