"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { categorias } from "@/data/categorias";
import {
  ANIO_MAX,
  ANIO_MIN,
  eventosEnRango,
  previewAnio,
} from "@/lib/timeline/indice";

type Props = {
  esMecenas: boolean;
};

export function TimelinePremium({ esMecenas }: Props) {
  const [anioA, setAnioA] = useState(1810);
  const [anioB, setAnioB] = useState(1910);
  const [categoria, setCategoria] = useState("");
  const [desde, setDesde] = useState(1800);
  const [hasta, setHasta] = useState(1900);

  const comparacion = useMemo(
    () => ({
      a: previewAnio(anioA),
      b: previewAnio(anioB),
    }),
    [anioA, anioB],
  );

  const rangoEventos = useMemo(
    () => eventosEnRango(desde, hasta, categoria || undefined),
    [desde, hasta, categoria],
  );

  if (!esMecenas) {
    return (
      <aside className="mt-10 rounded-sm border border-oro/20 bg-fondo-2 p-6 text-center">
        <p className="kicker text-oro">Timeline avanzada</p>
        <p className="mt-3 text-sm text-tinta-suave">
          Compará dos años, filtrá por tema y explorá rangos de fechas. Solo para
          mecenas.
        </p>
        <Link
          href="/membresia"
          className="mt-5 inline-block rounded-full border border-oro/50 px-6 py-3 text-sm text-oro-claro transition-colors hover:bg-oro/10"
        >
          Ver con Mecenas →
        </Link>
      </aside>
    );
  }

  return (
    <section className="mt-10 space-y-10 rounded-sm border border-oro/30 bg-fondo-2 p-6 sm:p-8">
      <div>
        <p className="kicker text-oro">Mecenas · Comparar años</p>
        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <div>
            <label className="text-xs uppercase tracking-wider text-tinta-tenue">
              Año A
              <input
                type="number"
                min={ANIO_MIN}
                max={ANIO_MAX}
                value={anioA}
                onChange={(e) => setAnioA(Number(e.target.value))}
                className="mt-2 block w-full rounded-sm border border-linea bg-fondo px-3 py-2 text-tinta"
              />
            </label>
            <ul className="mt-4 space-y-1 text-sm text-tinta-suave">
              <li>{comparacion.a.eventos.length} eventos</li>
              <li>{comparacion.a.personajes.length} personajes activos</li>
            </ul>
          </div>
          <div>
            <label className="text-xs uppercase tracking-wider text-tinta-tenue">
              Año B
              <input
                type="number"
                min={ANIO_MIN}
                max={ANIO_MAX}
                value={anioB}
                onChange={(e) => setAnioB(Number(e.target.value))}
                className="mt-2 block w-full rounded-sm border border-linea bg-fondo px-3 py-2 text-tinta"
              />
            </label>
            <ul className="mt-4 space-y-1 text-sm text-tinta-suave">
              <li>{comparacion.b.eventos.length} eventos</li>
              <li>{comparacion.b.personajes.length} personajes activos</li>
            </ul>
          </div>
        </div>
      </div>

      <div>
        <p className="kicker text-oro">Filtrar por categoría y rango</p>
        <div className="mt-4 flex flex-wrap gap-3">
          <select
            value={categoria}
            onChange={(e) => setCategoria(e.target.value)}
            className="rounded-sm border border-linea bg-fondo px-3 py-2 text-sm text-tinta"
          >
            <option value="">Todas las categorías</option>
            {categorias.map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.nombre}
              </option>
            ))}
          </select>
          <input
            type="number"
            value={desde}
            onChange={(e) => setDesde(Number(e.target.value))}
            className="w-24 rounded-sm border border-linea bg-fondo px-3 py-2 text-sm"
            aria-label="Desde año"
          />
          <span className="self-center text-tinta-tenue">, </span>
          <input
            type="number"
            value={hasta}
            onChange={(e) => setHasta(Number(e.target.value))}
            className="w-24 rounded-sm border border-linea bg-fondo px-3 py-2 text-sm"
            aria-label="Hasta año"
          />
        </div>
        <ul className="mt-4 max-h-48 space-y-2 overflow-y-auto text-sm">
          {rangoEventos.map((e) => (
            <li key={`${e.slug}-${e.anio}`}>
              <Link href={`/hoy/${e.slug}`} className="text-tinta-suave hover:text-oro-claro">
                {e.anio} · {e.titulo}
              </Link>
            </li>
          ))}
          {rangoEventos.length === 0 && (
            <li className="text-tinta-tenue">Sin eventos en este rango.</li>
          )}
        </ul>
      </div>
    </section>
  );
}
