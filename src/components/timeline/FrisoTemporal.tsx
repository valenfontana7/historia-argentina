import Link from "next/link";
import type { NodoEntidad } from "@/lib/grafo/tipos";
import { rutaDeNodo } from "@/lib/grafo/rutas";
import { Reveal } from "@/components/ui/Reveal";
import { TransicionLink } from "@/components/navigation/TransicionLink";

type Props = {
  anio: number;
  eventos: NodoEntidad[];
  personajes: NodoEntidad[];
};

export function FrisoTemporal({ anio, eventos, personajes }: Props) {
  if (eventos.length === 0 && personajes.length === 0) return null;

  return (
    <section className="mt-16 overflow-hidden">
      <Reveal>
        <p className="kicker">Friso de {anio}</p>
        <h2 className="titulo-display mt-3 text-2xl font-medium text-oro">
          Lo que ocurría ese año
        </h2>
      </Reveal>

      {eventos.length > 0 && (
        <div className="mt-8 -mx-5 overflow-x-auto px-5 pb-4 sm:mx-0 sm:px-0">
          <div className="flex min-w-min gap-4">
            {eventos.map((evento, i) => (
              <Reveal key={evento.slug} delay={i * 0.05}>
                <TransicionLink
                  href={rutaDeNodo(evento)}
                  className="group flex w-[280px] shrink-0 flex-col rounded-sm border border-linea bg-fondo-2 p-5 transition-colors hover:border-oro/40 sm:w-[320px]"
                >
                  <p className="text-[0.6rem] uppercase tracking-[0.2em] text-oro">
                    Acontecimiento
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
            ))}
          </div>
        </div>
      )}

      {personajes.length > 0 && (
        <div className="mt-10">
          <p className="text-[0.65rem] uppercase tracking-[0.2em] text-tinta-tenue">
            Retratos activos en {anio}
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            {personajes.slice(0, 12).map((p) => (
              <Link
                key={p.slug}
                href={rutaDeNodo(p)}
                className="rounded-full border border-linea px-5 py-2.5 text-sm text-tinta-suave transition-colors hover:border-oro/50 hover:text-oro-claro"
              >
                {p.titulo}
              </Link>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
