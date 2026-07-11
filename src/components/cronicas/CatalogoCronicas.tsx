"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { FichaExhibicion } from "@/components/cronicas/FichaExhibicion";
import { FiltrosCronicas } from "@/components/cronicas/FiltrosCronicas";
import { SeccionCronicasEpoca } from "@/components/cronicas/SeccionCronicasEpoca";
import { RecientementeVisitado } from "@/components/engagement/RecientementeVisitado";
import { Reveal } from "@/components/ui/Reveal";
import type { CronicaMeta } from "@/content/cronicas/registro";
import type { Epoca } from "@/components/ui/Retrato";
import {
  agrupadasPorEpocaVisibles,
  conteoPorEpoca,
  datasetBusqueda,
  filtrarCatalogo,
  type FiltrosCatalogo,
} from "@/lib/cronicas/indice";
import { recorridos } from "@/data/recorridos";

type Props = {
  destacadas: CronicaMeta[];
  esMecenas: boolean;
  filtrosIniciales: FiltrosCatalogo;
  modoFiltrado: boolean;
  resultadosFiltrados: CronicaMeta[];
};

function normalizar(texto: string): string {
  return texto
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{M}/gu, "");
}

export function CatalogoCronicas({
  destacadas,
  esMecenas,
  filtrosIniciales,
  modoFiltrado,
  resultadosFiltrados,
}: Props) {
  const [busqueda, setBusqueda] = useState("");
  const dataset = useMemo(() => datasetBusqueda(), []);
  const conteos = useMemo(() => conteoPorEpoca(), []);
  const grupos = useMemo(() => agrupadasPorEpocaVisibles(esMecenas), [esMecenas]);

  const resultadosBusqueda = useMemo(() => {
    const q = normalizar(busqueda.trim());
    if (!q) return null;
    const slugs = new Set(
      dataset
        .filter((d) => {
          const blob = normalizar(
            [d.titulo, d.subtitulo, d.descripcion, d.protagonista].join(" "),
          );
          return blob.includes(q);
        })
        .map((d) => d.slug),
    );
    const fuente = modoFiltrado ? resultadosFiltrados : grupos.flatMap((g) => g.cronicas);
    return fuente.filter((c) => slugs.has(c.slug));
  }, [busqueda, dataset, modoFiltrado, resultadosFiltrados, grupos]);

  const anclasEpoca = grupos.map((g) => ({
    epoca: g.epoca,
    nombre: g.nombre,
    href: `#epoca-${g.epoca}`,
  }));

  return (
    <>
      <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-3">
        <label htmlFor="buscar-cronicas" className="sr-only">
          Buscar exhibiciones
        </label>
        <input
          id="buscar-cronicas"
          type="search"
          placeholder="Buscar exhibición, retrato o tema…"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="w-full min-w-0 max-w-xl flex-1 rounded-sm border border-linea bg-fondo-2 px-4 py-3 text-sm text-tinta placeholder:text-tinta-tenue focus:border-oro/50 focus:outline-none"
        />
        <FiltrosCronicas conteoPorEpoca={conteos} />
      </div>

      {!modoFiltrado && !resultadosBusqueda && anclasEpoca.length > 1 && (
        <nav aria-label="Saltar a sala" className="mt-8 flex flex-wrap gap-2">
          {anclasEpoca.map((a) => (
            <a
              key={a.epoca}
              href={a.href}
              className="rounded-full border border-linea px-4 py-2 text-sm text-tinta-suave transition-colors hover:border-oro/40 hover:text-oro-claro"
            >
              {a.nombre}
            </a>
          ))}
        </nav>
      )}

      <RecientementeVisitado limite={5} />

      {resultadosBusqueda && (
        <section className="mt-16">
          <Reveal>
            <h2 className="titulo-display text-2xl font-medium text-oro">
              {resultadosBusqueda.length === 0
                ? "Sin resultados"
                : `${resultadosBusqueda.length} resultado${resultadosBusqueda.length === 1 ? "" : "s"}`}
            </h2>
          </Reveal>
          {resultadosBusqueda.length > 0 && (
            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {resultadosBusqueda.map((cronica, i) => (
                <Reveal key={cronica.slug} delay={i * 0.03}>
                  <FichaExhibicion cronica={cronica} esMecenas={esMecenas} />
                </Reveal>
              ))}
            </div>
          )}
        </section>
      )}

      {modoFiltrado && !resultadosBusqueda && (
        <section className="mt-16">
          <Reveal>
            <h2 className="titulo-display text-2xl font-medium text-oro">
              {resultadosFiltrados.length}{" "}
              {resultadosFiltrados.length === 1 ? "exhibición" : "exhibiciones"}
            </h2>
          </Reveal>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {resultadosFiltrados.map((cronica, i) => (
              <Reveal key={cronica.slug} delay={i * 0.03}>
                <FichaExhibicion cronica={cronica} esMecenas={esMecenas} />
              </Reveal>
            ))}
          </div>
        </section>
      )}

      {!modoFiltrado && !resultadosBusqueda && destacadas.length > 0 && (
        <section className="mt-16 space-y-6">
          <Reveal>
            <p className="kicker">Exhibiciones destacadas</p>
            <h2 className="titulo-display mt-2 text-3xl font-semibold">Empezá por aquí</h2>
          </Reveal>
          {destacadas.map((cronica, i) => (
            <Reveal key={cronica.slug} delay={i * 0.06}>
              <FichaExhibicion cronica={cronica} esMecenas={esMecenas} variante="destacada" />
            </Reveal>
          ))}
        </section>
      )}

      {!modoFiltrado &&
        !resultadosBusqueda &&
        grupos.map((grupo, idx) => (
          <div key={grupo.epoca} className={idx === 0 ? "mt-16" : "mt-20"}>
            <SeccionCronicasEpoca
              epoca={grupo.epoca as Epoca}
              nombreEpoca={grupo.nombre}
              cronicas={grupo.cronicas}
              esMecenas={esMecenas}
            />
          </div>
        ))}

      {!modoFiltrado && !resultadosBusqueda && (
        <section className="mt-20 rounded-sm border border-linea bg-fondo-2 p-8">
          <Reveal>
            <p className="kicker">Visitas guiadas</p>
            <h2 className="titulo-display mt-2 text-2xl font-semibold">
              Recorridos con hilo narrativo
            </h2>
            <p className="mt-3 max-w-xl text-sm text-tinta-suave">
              Si preferís un camino ordenado, las visitas guiadas te llevan estación por
              estación por personajes, acontecimientos y exhibiciones.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              {recorridos.slice(0, 4).map((r) => (
                <Link
                  key={r.slug}
                  href={`/recorridos/${r.slug}`}
                  className="rounded-full border border-linea px-5 py-2.5 text-sm text-tinta-suave transition-colors hover:border-oro/50 hover:text-oro-claro"
                >
                  {r.titulo} →
                </Link>
              ))}
            </div>
            <p className="mt-6">
              <Link href="/recorridos" className="text-sm text-oro-claro hover:text-oro">
                Ver todas las visitas guiadas →
              </Link>
            </p>
          </Reveal>
        </section>
      )}
    </>
  );
}
