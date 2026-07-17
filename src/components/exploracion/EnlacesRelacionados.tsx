import Link from "next/link";
import { EtiquetaCta } from "@/components/ui/FlechaCta";
import type { EntidadRef, EntidadTipo, NodoEntidad } from "@/lib/grafo/tipos";
import { relacionados } from "@/lib/grafo/queries";
import { etiquetasTipo, rutaDeNodo } from "@/lib/grafo/rutas";
import { Reveal } from "@/components/ui/Reveal";

type Props = {
  origen: NodoEntidad | EntidadRef;
  tipos?: EntidadTipo[];
  limitePorTipo?: number;
};

const tiposDefault: EntidadTipo[] = ["persona", "evento", "lugar", "periodo"];

export function EnlacesRelacionados({
  origen,
  tipos = tiposDefault,
  limitePorTipo = 5,
}: Props) {
  const secciones = tipos
    .map((tipo) => ({
      tipo,
      nodos: relacionados(origen, { tipo, limite: limitePorTipo }),
    }))
    .filter((s) => s.nodos.length > 0);

  if (secciones.length === 0) return null;

  return (
    <section className="mt-20 space-y-10">
      {secciones.map((seccion) => (
        <Reveal key={seccion.tipo}>
          <p className="kicker">{etiquetasTipo[seccion.tipo]}s relacionados</p>
          <ul className="mt-4 flex flex-wrap gap-3">
            {seccion.nodos.map((nodo) => (
              <li key={`${nodo.tipo}-${nodo.slug}`}>
                <Link
                  href={rutaDeNodo(nodo)}
                  className="group rounded-full border border-linea px-5 py-2.5 text-sm text-tinta-suave transition-colors hover:border-oro/50 hover:text-oro-claro"
                >
                  <EtiquetaCta>{nodo.titulo}</EtiquetaCta>
                </Link>
              </li>
            ))}
          </ul>
        </Reveal>
      ))}
    </section>
  );
}
