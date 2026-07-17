import Image from "next/image";
import Link from "next/link";
import { EtiquetaCta } from "@/components/ui/FlechaCta";
import { TransicionLink } from "@/components/navigation/TransicionLink";
import { obtenerImagenPersonaje } from "@/data/personajes-imagenes";
import type { Personaje } from "@/data/personajes";

type Props = {
  titulo: string;
  personajes: Personaje[];
  tono?: "oro" | "carmesi";
};

/** Mini-galería de retratos para aliados / enemigos del Panteón. */
export function GaleriaRelaciones({ titulo, personajes, tono = "oro" }: Props) {
  if (personajes.length === 0) return null;

  const acento = tono === "carmesi" ? "var(--carmesi)" : undefined;
  const hover =
    tono === "carmesi"
      ? "group-hover:text-carmesi group-hover:border-carmesi/40"
      : "group-hover:text-oro-claro group-hover:border-oro/40";

  return (
    <section>
      <h2 className="kicker" style={acento ? { color: acento } : undefined}>
        {titulo}
      </h2>
      <ul className="mt-5 space-y-3">
        {personajes.map((p) => {
          const foto = obtenerImagenPersonaje(p.slug)?.url;
          return (
            <li key={p.slug}>
              <TransicionLink
                href={`/panteon/${p.slug}`}
                className={`group flex items-center gap-3 rounded-sm border border-linea bg-fondo-2 p-2.5 transition-colors ${hover}`}
              >
                <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-sm bg-fondo-3">
                  {foto ? (
                    <Image
                      src={foto}
                      alt=""
                      fill
                      unoptimized
                      sizes="56px"
                      className="object-cover sepia-[0.25] transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-sm text-tinta-tenue">
                      {p.nombre.slice(0, 1)}
                    </div>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-tinta transition-colors group-hover:text-inherit">
                    {p.nombre}
                  </p>
                  <p className="truncate text-xs text-tinta-tenue">{p.titulo}</p>
                </div>
              </TransicionLink>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

type EnlaceVitrina = {
  href: string;
  titulo: string;
  meta?: string;
};

type ListaVitrinasProps = {
  titulo: string;
  items: EnlaceVitrina[];
};

/** Lista de salidas tipo vitrina (efemérides / exhibiciones) en el Panteón. */
export function ListaVitrinasPanteon({ titulo, items }: ListaVitrinasProps) {
  if (items.length === 0) return null;

  return (
    <section className="mt-16">
      <h2 className="titulo-display text-2xl font-medium text-oro">{titulo}</h2>
      <ul className="mt-6 grid gap-3 sm:grid-cols-2">
        {items.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              className="group flex h-full flex-col rounded-sm border border-linea bg-fondo-2 p-5 transition-colors hover:border-oro/40"
            >
              <p className="text-sm font-medium text-tinta transition-colors group-hover:text-oro-claro">
                {item.titulo}
              </p>
              {item.meta && (
                <p className="mt-1 text-xs text-tinta-tenue">{item.meta}</p>
              )}
              <p className="mt-auto pt-4 text-[0.65rem] uppercase tracking-[0.16em] text-tinta-tenue group-hover:text-oro">
                <EtiquetaCta>Entrar</EtiquetaCta>
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
