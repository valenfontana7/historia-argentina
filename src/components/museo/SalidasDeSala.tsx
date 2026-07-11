import Image from "next/image";
import { TransicionLink } from "@/components/navigation/TransicionLink";
import type { SalidaCurada } from "@/lib/grafo/salidas-curadas";
import { rutaDeNodo } from "@/lib/grafo/rutas";
import { Reveal } from "@/components/ui/Reveal";

type Props = {
  salidas: SalidaCurada[];
  tituloExhibicion?: string;
};

export function SalidasDeSala({ salidas, tituloExhibicion }: Props) {
  if (salidas.length === 0) return null;

  return (
    <section
      className="relative mx-auto max-w-6xl px-5 py-24"
      aria-label="Salidas de sala"
    >
      <div className="filete mb-12" />
      <Reveal>
        <p className="kicker">Salidas de sala</p>
        <h2 className="titulo-display mt-4 max-w-2xl text-3xl font-medium text-oro sm:text-4xl">
          {tituloExhibicion
            ? `Desde «${tituloExhibicion}», podés seguir por…`
            : "¿Qué sala querés recorrer ahora?"}
        </h2>
      </Reveal>

      <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {salidas.map((salida, i) => (
          <Reveal key={`${salida.nodo.tipo}-${salida.nodo.slug}`} delay={i * 0.08}>
            <TransicionLink
              href={rutaDeNodo(salida.nodo)}
              className="group flex h-full flex-col overflow-hidden rounded-sm border border-linea bg-fondo-2 transition-colors hover:border-oro/45"
            >
              {salida.nodo.imagen && (
                <div className="relative aspect-[16/9] overflow-hidden bg-fondo-3">
                  <Image
                    src={salida.nodo.imagen}
                    alt=""
                    fill
                    unoptimized
                    sizes="400px"
                    className="object-cover opacity-50 sepia-[0.3] transition-transform duration-500 group-hover:scale-[1.03]"
                    aria-hidden
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-fondo-2 via-fondo/30 to-transparent" />
                </div>
              )}
              <div className="flex flex-1 flex-col p-5 sm:p-6">
                <p className="text-[0.6rem] uppercase tracking-[0.22em] text-oro">
                  {salida.tipoDestino}
                </p>
                <h3 className="titulo-display mt-2 text-xl font-semibold leading-snug transition-colors group-hover:text-oro-claro">
                  {salida.nodo.titulo}
                </h3>
                <p className="mt-3 flex-1 text-sm italic leading-relaxed text-tinta-tenue">
                  {salida.puente}
                </p>
                <p className="mt-5 text-[0.65rem] uppercase tracking-[0.18em] text-oro transition-transform duration-300 group-hover:translate-x-1">
                  Cruzar la puerta →
                </p>
              </div>
            </TransicionLink>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
