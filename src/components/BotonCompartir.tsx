"use client";

import { useState } from "react";

type BotonCompartirProps = {
  titulo: string;
  texto: string;
  ruta: string;
};

export function BotonCompartir({ titulo, texto, ruta }: BotonCompartirProps) {
  const [copiado, setCopiado] = useState(false);

  const compartir = async () => {
    const url = `${window.location.origin}${ruta}`;
    if (navigator.share) {
      try {
        await navigator.share({ title: titulo, text: texto, url });
        return;
      } catch {
        // El usuario canceló: no hacemos nada.
        return;
      }
    }
    await navigator.clipboard.writeText(url);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2500);
  };

  return (
    <button
      type="button"
      onClick={compartir}
      className="rounded-full border border-oro/50 px-6 py-3 text-sm text-oro-claro transition-colors hover:bg-oro/10"
    >
      {copiado ? "Enlace copiado ✓" : "Compartir esta historia"}
    </button>
  );
}
