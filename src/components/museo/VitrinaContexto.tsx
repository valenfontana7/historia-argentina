"use client";

import Image from "next/image";
import Link from "next/link";
import { EtiquetaCta } from "@/components/ui/FlechaCta";
import { obtenerImagenPersonaje } from "@/data/personajes-imagenes";
import { obtenerPieza } from "@/lib/piezas/indice";
import { obtenerNodo } from "@/lib/grafo/queries";
import { rutaDeNodo } from "@/lib/grafo/rutas";
import type { EntidadTipo } from "@/lib/grafo/tipos";

type Props = {
  /** Slug de personaje, lugar, pieza, etc. */
  tipo: EntidadTipo | "pieza";
  slug: string;
  puente?: string;
};

export function VitrinaContexto({ tipo, slug, puente }: Props) {
  if (tipo === "pieza") {
    const pieza = obtenerPieza(slug);
    if (!pieza) return null;
    return (
      <aside className="my-10 rounded-sm border border-linea bg-fondo-2 p-5 sm:p-6">
        <p className="text-[0.6rem] uppercase tracking-[0.22em] text-oro">Vitrina</p>
        <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center">
          <Link
            href={`/piezas/${pieza.id}`}
            className="group relative block aspect-[4/3] w-full shrink-0 overflow-hidden rounded-sm bg-fondo-3 sm:w-36"
          >
            <Image
              src={pieza.url}
              alt={pieza.alt}
              fill
              unoptimized
              sizes="144px"
              className="object-cover sepia-[0.2] transition-transform duration-500 group-hover:scale-105"
            />
          </Link>
          <div>
            <Link
              href={`/piezas/${pieza.id}`}
              className="titulo-display text-lg font-medium transition-colors hover:text-oro-claro"
            >
              {pieza.alt}
            </Link>
            {puente && (
              <p className="mt-2 text-sm italic text-tinta-tenue">{puente}</p>
            )}
            <p className="mt-3 text-[0.65rem] uppercase tracking-[0.16em] text-oro">
              <EtiquetaCta>Ver la pieza</EtiquetaCta>
            </p>
          </div>
        </div>
      </aside>
    );
  }

  const nodo = obtenerNodo(tipo, slug);
  if (!nodo) return null;

  const imagenPersonaje =
    tipo === "persona" ? obtenerImagenPersonaje(slug)?.url : undefined;
  const imagen = nodo.imagen ?? imagenPersonaje;

  return (
    <aside className="my-10 rounded-sm border border-linea bg-fondo-2 p-5 sm:p-6">
      <p className="text-[0.6rem] uppercase tracking-[0.22em] text-oro">Vitrina contextual</p>
      <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center">
        {imagen && (
          <Link
            href={rutaDeNodo(nodo)}
            className="group relative block aspect-square w-full shrink-0 overflow-hidden rounded-sm bg-fondo-3 sm:w-24"
          >
            <Image
              src={imagen}
              alt=""
              fill
              unoptimized
              sizes="96px"
              className="object-cover sepia-[0.2] transition-transform duration-500 group-hover:scale-105"
            />
          </Link>
        )}
        <div>
          <Link
            href={rutaDeNodo(nodo)}
            className="titulo-display text-lg font-medium transition-colors hover:text-oro-claro"
          >
            {nodo.titulo}
          </Link>
          <p className="mt-1 line-clamp-2 text-sm text-tinta-tenue">{nodo.resumen}</p>
          {puente && (
            <p className="mt-2 text-sm italic text-tinta-tenue">{puente}</p>
          )}
          <p className="mt-3 text-[0.65rem] uppercase tracking-[0.16em] text-oro">
            <EtiquetaCta>Descubrir</EtiquetaCta>
          </p>
        </div>
      </div>
    </aside>
  );
}
