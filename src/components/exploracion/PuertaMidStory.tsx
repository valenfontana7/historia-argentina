import Link from "next/link";
import { FlechaCta } from "@/components/ui/FlechaCta";
import type { SalidaCurada } from "@/lib/grafo/salidas-curadas";
import { rutaDeNodo } from "@/lib/grafo/rutas";

type Props = {
  salidas: SalidaCurada[];
  /** Cuántas puertas mid-story mostrar (1–2). */
  limite?: number;
};

/**
 * Puertas ligeras mid-story: chips de curiosidad sin romper la lectura.
 * Usar en MDX o entre bloques de crónica.
 */
export function PuertaMidStory({ salidas, limite = 2 }: Props) {
  const items = salidas.slice(0, limite);
  if (items.length === 0) return null;

  return (
    <aside
      className="mx-auto my-16 max-w-2xl px-5"
      aria-label="Conexiones en el camino"
    >
      <p className="text-[0.6rem] uppercase tracking-[0.22em] text-oro">
        Mientras tanto…
      </p>
      <ul className="mt-4 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
        {items.map((s) => (
          <li key={`${s.nodo.tipo}-${s.nodo.slug}`}>
            <Link
              href={rutaDeNodo(s.nodo)}
              prefetch
              className="group inline-flex max-w-full items-center gap-2 rounded-full border border-linea bg-fondo-2/80 px-4 py-2.5 text-sm text-tinta-suave backdrop-blur-sm transition-colors hover:border-oro/45 hover:text-oro-claro"
            >
              <span className="text-[0.55rem] uppercase tracking-[0.16em] text-oro">
                {s.tipoDestino}
              </span>
              <span className="truncate font-medium">{s.nodo.titulo}</span>
              <FlechaCta
                className="shrink-0 text-oro opacity-75 transition-[transform,opacity] duration-300 ease-out group-hover:translate-x-0.5 group-hover:opacity-100"
                aria-hidden
              />
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
}
