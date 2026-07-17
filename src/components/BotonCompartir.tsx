"use client";

import { useEffect, useRef, useState } from "react";

type BotonCompartirProps = {
  titulo: string;
  texto: string;
  ruta: string;
  /** Campaña UTM para tracking de shares */
  utmCampaign?: string;
  /** Link de texto, sin píldoras primarias. */
  discreto?: boolean;
};

export function BotonCompartir({
  titulo,
  texto,
  ruta,
  utmCampaign = "share",
  discreto = false,
}: BotonCompartirProps) {
  const [copiado, setCopiado] = useState(false);
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [abrirArriba, setAbrirArriba] = useState(false);
  const contenedor = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!menuAbierto || !contenedor.current) return;

    const rect = contenedor.current.getBoundingClientRect();
    const espacioAbajo = window.innerHeight - rect.bottom;
    setAbrirArriba(espacioAbajo < 160);
  }, [menuAbierto]);

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

  if (discreto) {
    return (
      <button
        type="button"
        onClick={compartirNativo}
        className="text-tinta-tenue transition-colors hover:text-oro-claro"
      >
        {copiado ? "Enlace copiado ✓" : "Compartir"}
      </button>
    );
  }

  return (
    <div ref={contenedor} className="relative inline-flex w-full flex-wrap justify-center gap-2 sm:w-auto">
      <button
        type="button"
        onClick={compartirNativo}
        className="w-full rounded-full border border-oro/50 px-6 py-3 text-sm text-oro-claro transition-colors hover:bg-oro/10 sm:w-auto"
      >
        {copiado ? "Enlace copiado ✓" : "Compartir esta historia"}
      </button>
      <button
        type="button"
        onClick={() => setMenuAbierto((v) => !v)}
        className="w-full rounded-full border border-linea px-4 py-3 text-sm text-tinta-suave transition-colors hover:border-oro/40 hover:text-oro-claro sm:w-auto"
        aria-expanded={menuAbierto}
        aria-haspopup="true"
      >
        Más ↓
      </button>
      {menuAbierto && (
        <div
          className={`absolute z-10 flex w-full min-w-[180px] flex-col rounded-sm border border-linea bg-fondo-2 py-1 shadow-lg sm:w-auto ${
            abrirArriba ? "bottom-full mb-2" : "top-full mt-2"
          } left-0 sm:left-auto`}
        >
          <button
            type="button"
            onClick={whatsapp}
            className="min-h-11 px-4 py-2.5 text-left text-sm text-tinta-suave transition-colors hover:bg-fondo-3 hover:text-oro-claro"
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
            className="min-h-11 px-4 py-2.5 text-left text-sm text-tinta-suave transition-colors hover:bg-fondo-3 hover:text-oro-claro"
          >
            Copiar enlace
          </button>
        </div>
      )}
    </div>
  );
}
