import Link from "next/link";
import type { NodoEntidad } from "@/lib/grafo/tipos";
import { etiquetasTipo, rutaDeNodo } from "@/lib/grafo/rutas";

type Props = {
  nodo: NodoEntidad;
  className?: string;
};

export function TarjetaEntidad({ nodo, className = "" }: Props) {
  return (
    <Link
      href={rutaDeNodo(nodo)}
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
