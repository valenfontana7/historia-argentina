"use client";

import { useState } from "react";

type BotonCompartirProps = {
  titulo: string;
  texto: string;
  ruta: string;
  /** Campaña UTM para tracking de shares */
  utmCampaign?: string;
};

export function BotonCompartir({
  titulo,
  texto,
  ruta,
  utmCampaign = "share",
}: BotonCompartirProps) {
  const [copiado, setCopiado] = useState(false);
  const [menuAbierto, setMenuAbierto] = useState(false);

  const urlConUtm = () => {
    const base = `${window.location.origin}${ruta}`;
    const sep = ruta.includes("?") ? "&" : "?";
    return `${base}${sep}utm_source=share&utm_medium=social&utm_campaign=${utmCampaign}`;
  };

  const compartirNativo = async () => {
    const url = urlConUtm();
    if (navigator.share) {
      try {
        await navigator.share({ title: titulo, text: texto, url });
        return;
      } catch {
        return;
      }
    }
    await navigator.clipboard.writeText(url);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2500);
  };

  const whatsapp = () => {
    const url = urlConUtm();
    const msg = encodeURIComponent(`${titulo}\n\n${texto}\n\n${url}`);
    window.open(`https://wa.me/?text=${msg}`, "_blank", "noopener,noreferrer");
    setMenuAbierto(false);
  };

  return (
    <div className="relative inline-flex flex-wrap justify-center gap-2">
      <button
        type="button"
        onClick={compartirNativo}
        className="rounded-full border border-oro/50 px-6 py-3 text-sm text-oro-claro transition-colors hover:bg-oro/10"
      >
        {copiado ? "Enlace copiado ✓" : "Compartir esta historia"}
      </button>
      <button
        type="button"
        onClick={() => setMenuAbierto((v) => !v)}
        className="rounded-full border border-linea px-4 py-3 text-sm text-tinta-suave transition-colors hover:border-oro/40 hover:text-oro-claro"
        aria-expanded={menuAbierto}
        aria-haspopup="true"
      >
        Más ↓
      </button>
      {menuAbierto && (
        <div className="absolute top-full z-10 mt-2 flex min-w-[180px] flex-col rounded-sm border border-linea bg-fondo-2 py-1 shadow-lg">
          <button
            type="button"
            onClick={whatsapp}
            className="px-4 py-2.5 text-left text-sm text-tinta-suave transition-colors hover:bg-fondo-3 hover:text-oro-claro"
          >
            WhatsApp
          </button>
          <button
            type="button"
            onClick={async () => {
              await navigator.clipboard.writeText(urlConUtm());
              setCopiado(true);
              setMenuAbierto(false);
              setTimeout(() => setCopiado(false), 2500);
            }}
            className="px-4 py-2.5 text-left text-sm text-tinta-suave transition-colors hover:bg-fondo-3 hover:text-oro-claro"
          >
            Copiar enlace
          </button>
        </div>
      )}
    </div>
  );
}
