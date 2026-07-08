"use client";

import { useEffect, useState } from "react";
import { obtenerProgreso } from "@/lib/engagement/storage";

type Props = {
  href: string;
};

export function BarraProgresoLectura({ href }: Props) {
  const [pct, setPct] = useState(0);

  useEffect(() => {
    setPct(obtenerProgreso(href));
    const id = setInterval(() => setPct(obtenerProgreso(href)), 2000);
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
