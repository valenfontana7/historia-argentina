import Image from "next/image";
import Link from "next/link";
import type { SalidaCurada } from "@/lib/grafo/salidas-curadas";
import { descubrir, todosLosNodos } from "@/lib/grafo/queries";
import { etiquetasTipo, rutaDeNodo } from "@/lib/grafo/rutas";
import type { EntidadRef, NodoEntidad } from "@/lib/grafo/tipos";
import { Reveal } from "@/components/ui/Reveal";
import { EtiquetaCta } from "@/components/ui/FlechaCta";
import { PuertaTilt } from "@/components/exploracion/PuertaTilt";
import { SiguienteAutomatico } from "@/components/exploracion/SiguienteAutomatico";
import { Sorpresa } from "@/components/exploracion/Sorpresa";

type Props = {
  salidas?: SalidaCurada[];
  /** Nodo o ref de origen para fallback anti-dead-end. */
  origen?: NodoEntidad | EntidadRef;
  /** @deprecated Usar tituloOrigen */
  tituloExhibicion?: string;
  tituloOrigen?: string;
  mostrarSiguiente?: boolean;
};

function salidasDesdeDescubrir(
  origen: NodoEntidad | EntidadRef,
  limite: number,
): SalidaCurada[] {
  return descubrir(origen, "sorpresa", limite).map((destino) => ({
    nodo: destino,
    puente: destino.resumen,
    tipoDestino: etiquetasTipo[destino.tipo],
  }));
}

/**
 * Tres puertas visuales al final de cualquier nodo del universo.
 * Nunca deja una página muerta: fallback a descubrir / Sorpresa.
 */
export function PuertasDelUniverso({
  salidas: salidasProp = [],
  origen: origenRef,
  tituloExhibicion,
  tituloOrigen,
  mostrarSiguiente = true,
}: Props) {
  let salidas =
    salidasProp.length > 0
      ? salidasProp
      : origenRef
        ? salidasDesdeDescubrir(origenRef, 3)
        : [];

  if (salidas.length === 0 && origenRef) {
    salidas = salidasDesdeDescubrir(origenRef, 3);
  }

  const titulo = tituloOrigen ?? tituloExhibicion;
  const primera = salidas[0];
  const nodosSorpresa = todosLosNodos().filter(
    (n) =>
      n.tipo === "cronica" || n.tipo === "persona" || n.tipo === "evento",
  );

  if (salidas.length === 0) {
    return (
      <section
        className="relative mx-auto max-w-6xl px-5 py-20 sm:py-28"
        aria-label="Seguí explorando"
      >
        <Reveal>
          <p className="kicker">Seguí el hilo</p>
          <h2 className="titulo-display mt-4 max-w-2xl text-3xl font-medium text-oro sm:text-5xl">
            {titulo ? `Después de «${titulo}»…` : "¿Qué sigue?"}
          </h2>
          <p className="mt-4 max-w-xl text-base text-tinta-suave">
            Todavía hay más. Dejate encontrar por otra historia.
          </p>
        </Reveal>
        <div className="mt-10">
          <Sorpresa
            nodos={nodosSorpresa}
            variante="bloque"
            etiqueta="Mostrame otra"
          />
        </div>
      </section>
    );
  }

  return (
    <section
      className="relative mx-auto max-w-6xl px-5 py-20 sm:py-28"
      aria-label="Seguí explorando"
    >
      <Reveal>
        <p className="kicker">Seguí el hilo</p>
        <h2 className="titulo-display mt-4 max-w-2xl text-3xl font-medium text-oro sm:text-5xl">
          {titulo ? `Después de «${titulo}»…` : "¿Qué sigue?"}
        </h2>
        <p className="mt-4 max-w-xl text-base text-tinta-suave">
          Elegí una puerta. Una sola. El universo sigue.
        </p>
      </Reveal>

      <div
        className="mt-12 grid gap-4 perspective-[1000px] sm:grid-cols-2 lg:grid-cols-3 lg:gap-5"
      >
        {salidas.map((salida, i) => (
          <Reveal key={`${salida.nodo.tipo}-${salida.nodo.slug}`} delay={i * 0.08}>
            <PuertaTilt className="h-full rounded-sm">
              <Link
                href={rutaDeNodo(salida.nodo)}
                prefetch
                className="group relative flex min-h-[280px] flex-col justify-end overflow-hidden rounded-sm border border-linea bg-fondo-3 sm:min-h-[320px]"
              >
                {salida.nodo.imagen ? (
                  <Image
                    src={salida.nodo.imagen}
                    alt=""
                    fill
                    unoptimized
                    sizes="(max-width: 640px) 100vw, 400px"
                    className="object-cover object-top opacity-80 sepia-[0.12] transition-transform duration-700 ease-out group-hover:scale-105 group-active:scale-105"
                    aria-hidden
                  />
                ) : (
                  <div className="absolute inset-0 bg-linear-to-br from-fondo-3 via-fondo-2 to-fondo" />
                )}
                <div className="absolute inset-0 bg-linear-to-t from-fondo via-fondo/50 to-transparent to-55% transition-opacity duration-500 group-hover:opacity-90" />
                <div className="absolute inset-x-0 bottom-0 h-[45%] bg-linear-to-t from-fondo from-30% via-fondo/85 to-transparent" />
                <div className="relative z-10 p-5 sm:p-6">
                  <p className="text-[0.6rem] uppercase tracking-[0.22em] text-oro">
                    {salida.tipoDestino}
                  </p>
                  <h3 className="titulo-display mt-2 text-xl font-semibold leading-snug text-tinta transition-colors group-hover:text-oro-claro sm:text-2xl">
                    {salida.nodo.titulo}
                  </h3>
                  <p className="mt-3 line-clamp-3 text-sm italic leading-relaxed text-[#d8cfbc]">
                    {salida.puente}
                  </p>
                  <p className="mt-5 text-[0.65rem] uppercase tracking-[0.18em] text-oro">
                    <EtiquetaCta>Seguir</EtiquetaCta>
                  </p>
                </div>
              </Link>
            </PuertaTilt>
          </Reveal>
        ))}
      </div>

      {mostrarSiguiente && primera && (
        <Reveal delay={0.2}>
          <div className="mt-12 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <SiguienteAutomatico
              href={rutaDeNodo(primera.nodo)}
              etiqueta={`Seguir con «${primera.nodo.titulo}»`}
            />
          </div>
        </Reveal>
      )}
    </section>
  );
}
