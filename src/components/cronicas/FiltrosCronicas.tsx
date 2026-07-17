"use client";

import Link from "next/link";
import { EtiquetaCta } from "@/components/ui/FlechaCta";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import type { Epoca } from "@/components/ui/Retrato";
import { ORDEN_EPOCAS } from "@/lib/cronicas/indice";
import { periodos } from "@/data/periodos";
import { categorias } from "@/data/categorias";

type Props = {
  conteoPorEpoca: Record<Epoca, number>;
};

function contarFiltrosActivos(
  epoca: Epoca | null,
  categoria: string | null,
  acceso: string | null,
): number {
  return [epoca, categoria, acceso].filter(Boolean).length;
}

export function FiltrosCronicas({ conteoPorEpoca }: Props) {
  const router = useRouter();
  const params = useSearchParams();
  const epocaActiva = params.get("epoca") as Epoca | null;
  const categoriaActiva = params.get("categoria");
  const accesoActivo = params.get("acceso");
  const filtrosActivos = contarFiltrosActivos(epocaActiva, categoriaActiva, accesoActivo);

  const [abierto, setAbierto] = useState(filtrosActivos > 0);

  function actualizar(clave: string, valor: string | null) {
    const next = new URLSearchParams(params.toString());
    if (valor) next.set(clave, valor);
    else next.delete(clave);
    const q = next.toString();
    router.push(q ? `/cronicas?${q}` : "/cronicas", { scroll: false });
  }

  function pill(clase: string, activo: boolean) {
    return `rounded-full border px-4 py-2 text-sm transition-colors ${
      activo
        ? "border-oro/60 bg-oro/10 text-oro-claro"
        : "border-linea text-tinta-suave hover:border-oro/40 hover:text-oro-claro"
    } ${clase}`;
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setAbierto((v) => !v)}
        aria-expanded={abierto}
        aria-controls="panel-filtros-cronicas"
        className={`inline-flex shrink-0 items-center gap-2 rounded-full border px-4 py-2 text-sm transition-colors ${
          abierto || filtrosActivos > 0
            ? "border-oro/50 bg-oro/10 text-oro-claro"
            : "border-linea text-tinta-suave hover:border-oro/40 hover:text-oro-claro"
        }`}
      >
        <span>Filtrar salas</span>
        {filtrosActivos > 0 && (
          <span className="rounded-full bg-oro/20 px-2 py-0.5 text-[0.65rem] font-medium tabular-nums">
            {filtrosActivos}
          </span>
        )}
        <span aria-hidden className="text-tinta-tenue">
          {abierto ? "▴" : "▾"}
        </span>
      </button>

      {filtrosActivos > 0 && !abierto && (
        <Link
          href="/cronicas"
          className="text-sm text-oro-claro hover:text-oro sm:ml-auto"
        >
          Limpiar filtros
        </Link>
      )}

      {abierto && (
        <div
          id="panel-filtros-cronicas"
          className="w-full basis-full space-y-6 border-t border-linea-suave pt-6"
        >
          <div>
            <p className="mb-3 text-[0.65rem] uppercase tracking-[0.2em] text-tinta-tenue">
              Sala
            </p>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => actualizar("epoca", null)}
                className={pill("", !epocaActiva)}
              >
                Todas
              </button>
              {ORDEN_EPOCAS.map((epoca) => {
                const count = conteoPorEpoca[epoca];
                if (count === 0) return null;
                const nombre = periodos.find((p) => p.slug === epoca)?.nombre ?? epoca;
                return (
                  <button
                    key={epoca}
                    type="button"
                    onClick={() => actualizar("epoca", epoca)}
                    className={pill("", epocaActiva === epoca)}
                  >
                    {nombre} ({count})
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <p className="mb-3 text-[0.65rem] uppercase tracking-[0.2em] text-tinta-tenue">
              Acceso
            </p>
            <div className="flex flex-wrap gap-2">
              {[
                { valor: null, etiqueta: "Todas" },
                { valor: "publico", etiqueta: "Públicas" },
                { valor: "mecenas", etiqueta: "Mecenas" },
              ].map(({ valor, etiqueta }) => (
                <button
                  key={etiqueta}
                  type="button"
                  onClick={() => actualizar("acceso", valor)}
                  className={pill(
                    "",
                    valor ? accesoActivo === valor : !accesoActivo,
                  )}
                >
                  {etiqueta}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="mb-3 text-[0.65rem] uppercase tracking-[0.2em] text-tinta-tenue">
              Colección
            </p>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => actualizar("categoria", null)}
                className={pill("", !categoriaActiva)}
              >
                Todos
              </button>
              {categorias.slice(0, 8).map((cat) => (
                <button
                  key={cat.slug}
                  type="button"
                  onClick={() => actualizar("categoria", cat.slug)}
                  className={pill("", categoriaActiva === cat.slug)}
                >
                  {cat.nombre}
                </button>
              ))}
            </div>
          </div>

          {filtrosActivos > 0 && (
            <p>
              <Link href="/cronicas" className="group text-sm text-oro-claro hover:text-oro">
                <EtiquetaCta>Limpiar filtros</EtiquetaCta>
              </Link>
            </p>
          )}
        </div>
      )}
    </>
  );
}
