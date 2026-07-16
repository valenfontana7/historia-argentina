import Image from "next/image";
import type { NodoEntidad } from "@/lib/grafo/tipos";
import { rutaDeNodo } from "@/lib/grafo/rutas";
import { Reveal } from "@/components/ui/Reveal";
import { TransicionLink } from "@/components/navigation/TransicionLink";
import { obtenerImagenPersonaje } from "@/data/personajes-imagenes";

type Props = {
  anio: number;
  eventos: NodoEntidad[];
  personajes: NodoEntidad[];
};

/** Pasillo del tiempo: espina + vitrinas de acontecimientos + retratos al margen. */
export function FrisoTemporal({ anio, eventos, personajes }: Props) {
  if (eventos.length === 0 && personajes.length === 0) return null;

  const retratos = personajes.slice(0, 8);

  return (
    <section className="mt-16">
      <Reveal>
        <p className="kicker">Friso de {anio}</p>
        <h2 className="titulo-display mt-3 text-2xl font-medium text-oro">
          Lo que ocurría ese año
        </h2>
      </Reveal>

      <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_220px]">
        <div className="relative">
          {eventos.length > 0 && (
            <>
              <div
                aria-hidden
                className="pointer-events-none absolute bottom-4 left-0 right-0 top-4 hidden sm:block"
              >
                <div className="absolute left-0 right-0 top-1/2 h-px -translate-y-1/2 bg-gradient-to-r from-transparent via-oro/40 to-transparent" />
              </div>
              <div className="-mx-5 overflow-x-auto px-5 pb-6 sm:mx-0 sm:px-0">
                <ul className="relative flex min-w-min gap-0 sm:gap-2">
                  {eventos.map((evento, i) => (
                    <li key={evento.slug} className="relative flex w-[260px] shrink-0 flex-col sm:w-[280px]">
                      <div
                        aria-hidden
                        className="mx-auto mb-4 hidden h-2.5 w-2.5 rounded-full border border-oro bg-fondo sm:block"
                      />
                      <Reveal delay={i * 0.05}>
                        <TransicionLink
                          href={rutaDeNodo(evento)}
                          className="group flex h-full flex-col rounded-sm border border-linea bg-fondo-2 p-5 transition-colors hover:border-oro/40"
                        >
                          <p className="text-[0.6rem] uppercase tracking-[0.2em] text-oro">
                            Acontecimiento {i + 1}
                          </p>
                          <h3 className="titulo-display mt-2 text-lg font-medium leading-snug transition-colors group-hover:text-oro-claro">
                            {evento.titulo}
                          </h3>
                          <p className="mt-2 line-clamp-3 flex-1 text-sm text-tinta-tenue">
                            {evento.resumen}
                          </p>
                          <p className="mt-4 text-[0.65rem] uppercase tracking-[0.16em] text-tinta-tenue group-hover:text-oro">
                            Ver vitrina →
                          </p>
                        </TransicionLink>
                      </Reveal>
                    </li>
                  ))}
                </ul>
              </div>
            </>
          )}
        </div>

        {retratos.length > 0 && (
          <aside className="lg:border-l lg:border-linea-suave lg:pl-8">
            <p className="text-[0.65rem] uppercase tracking-[0.2em] text-tinta-tenue">
              Retratos vivos en {anio}
            </p>
            <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-1">
              {retratos.map((p, i) => {
                const foto = obtenerImagenPersonaje(p.slug)?.url ?? p.imagen;
                return (
                  <Reveal key={p.slug} delay={i * 0.04}>
                    <TransicionLink
                      href={rutaDeNodo(p)}
                      className="group flex items-center gap-3 rounded-sm border border-linea bg-fondo-2 p-2 transition-colors hover:border-oro/40"
                    >
                      <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-sm bg-fondo-3">
                        {foto ? (
                          <Image
                            src={foto}
                            alt=""
                            fill
                            unoptimized
                            sizes="48px"
                            className="object-cover sepia-[0.25] transition-transform duration-500 group-hover:scale-105"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center text-xs text-tinta-tenue">
                            {p.titulo.slice(0, 1)}
                          </div>
                        )}
                      </div>
                      <span className="min-w-0 flex-1 truncate text-sm text-tinta-suave transition-colors group-hover:text-oro-claro">
                        {p.titulo}
                      </span>
                    </TransicionLink>
                  </Reveal>
                );
              })}
            </ul>
          </aside>
        )}
      </div>
    </section>
  );
}
