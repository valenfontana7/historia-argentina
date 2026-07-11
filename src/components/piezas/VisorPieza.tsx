"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useState } from "react";
import type { Pieza } from "@/lib/piezas/indice";
import { ETIQUETAS_TIPO_PIEZA } from "@/lib/piezas/indice";

type Props = {
  pieza: Pieza;
};

export function VisorPieza({ pieza }: Props) {
  const [zoom, setZoom] = useState(false);

  const toggleZoom = useCallback(() => setZoom((v) => !v), []);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={toggleZoom}
        className={`group relative block w-full overflow-hidden bg-fondo-3 transition-all ${
          zoom ? "fixed inset-0 z-[60] flex items-center justify-center" : "aspect-[4/3] rounded-sm"
        }`}
        aria-label={zoom ? "Cerrar visor ampliado" : "Ampliar pieza"}
      >
        {zoom && (
          <span className="absolute right-4 top-4 z-10 rounded-full border border-linea bg-fondo/80 px-4 py-2 text-xs uppercase tracking-[0.16em] text-tinta-suave">
            Cerrar ✕
          </span>
        )}
        <Image
          src={pieza.url}
          alt={pieza.alt}
          fill={!zoom}
          width={zoom ? 1280 : undefined}
          height={zoom ? 960 : undefined}
          unoptimized
          sizes="(max-width: 768px) 100vw, 1200px"
          className={`transition-transform duration-500 ${
            zoom
              ? "max-h-[90vh] max-w-[95vw] object-contain"
              : "object-contain sepia-[0.15] group-hover:scale-[1.02]"
          }`}
        />
      </button>

      <dl className="mt-8 grid gap-4 border-t border-linea-suave pt-8 sm:grid-cols-2">
        <div>
          <dt className="text-[0.6rem] uppercase tracking-[0.2em] text-tinta-tenue">Tipo</dt>
          <dd className="mt-1 text-sm text-tinta">{ETIQUETAS_TIPO_PIEZA[pieza.tipo]}</dd>
        </div>
        <div>
          <dt className="text-[0.6rem] uppercase tracking-[0.2em] text-tinta-tenue">Crédito</dt>
          <dd className="mt-1 text-sm text-tinta-suave">{pieza.credito}</dd>
        </div>
      </dl>

      {pieza.exhibiciones.length > 0 && (
        <div className="mt-8">
          <p className="text-[0.6rem] uppercase tracking-[0.2em] text-tinta-tenue">
            Exhibiciones donde aparece
          </p>
          <ul className="mt-3 flex flex-wrap gap-2">
            {pieza.exhibiciones.map((slug) => (
              <li key={slug}>
                <Link
                  href={`/cronicas/${slug}`}
                  className="rounded-full border border-linea px-4 py-2 text-sm text-tinta-suave transition-colors hover:border-oro/50 hover:text-oro-claro"
                >
                  {slug.replace(/-/g, " ")} →
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
