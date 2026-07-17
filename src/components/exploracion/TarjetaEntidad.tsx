import Image from "next/image";
import Link from "next/link";
import type { NodoEntidad } from "@/lib/grafo/tipos";
import { etiquetasTipo, rutaDeNodo } from "@/lib/grafo/rutas";

type Props = {
  nodo: NodoEntidad;
  className?: string;
};

export function TarjetaEntidad({ nodo, className = "" }: Props) {
  if (nodo.imagen) {
    return (
      <Link
        href={rutaDeNodo(nodo)}
        prefetch
        className={`group relative block min-h-[220px] overflow-hidden rounded-sm border border-linea bg-fondo-3 ${className}`}
      >
        <Image
          src={nodo.imagen}
          alt=""
          fill
          unoptimized
          sizes="400px"
          className="object-cover object-top opacity-80 sepia-[0.12] transition-transform duration-500 group-hover:scale-105"
          aria-hidden
        />
        <div className="absolute inset-0 bg-linear-to-t from-fondo via-fondo/50 to-transparent to-55%" />
        <div className="absolute inset-x-0 bottom-0 h-[45%] bg-linear-to-t from-fondo from-30% via-fondo/85 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 z-10 p-5">
          <p className="kicker text-[0.65rem]">{etiquetasTipo[nodo.tipo]}</p>
          <h3 className="titulo-display mt-2 text-lg font-medium leading-snug text-tinta transition-colors group-hover:text-oro-claro">
            {nodo.titulo}
          </h3>
          <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-[#d8cfbc]">
            {nodo.resumen}
          </p>
          {nodo.anio && (
            <p className="mt-3 text-xs text-oro">{nodo.anio}</p>
          )}
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={rutaDeNodo(nodo)}
      prefetch
      className={`group block rounded-sm border border-linea bg-fondo-2 p-5 transition-colors hover:border-oro/40 ${className}`}
    >
      <p className="kicker text-[0.65rem]">{etiquetasTipo[nodo.tipo]}</p>
      <h3 className="titulo-display mt-2 text-lg font-medium leading-snug text-tinta transition-colors group-hover:text-oro-claro">
        {nodo.titulo}
      </h3>
      <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-tinta-tenue">
        {nodo.resumen}
      </p>
      {nodo.anio && (
        <p className="mt-3 text-xs text-oro">{nodo.anio}</p>
      )}
    </Link>
  );
}
