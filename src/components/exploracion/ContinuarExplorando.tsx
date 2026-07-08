import type { EntidadRef, EstrategiaDescubrir, NodoEntidad } from "@/lib/grafo/tipos";
import { descubrir } from "@/lib/grafo/queries";
import { tituloExploracionDesde } from "@/lib/grafo/titulos-exploracion";
import { Reveal } from "@/components/ui/Reveal";
import { TarjetaEntidad } from "@/components/exploracion/TarjetaEntidad";

type Props = {
  origen: NodoEntidad | EntidadRef;
  titulo?: string;
  limite?: number;
  estrategia?: EstrategiaDescubrir;
};

export function ContinuarExplorando({
  origen,
  titulo,
  limite = 6,
  estrategia = "relacionados",
}: Props) {
  const nodos = descubrir(origen, estrategia, limite);
  if (nodos.length === 0) return null;

  const tituloSeccion =
    titulo ??
    ("titulo" in origen ? tituloExploracionDesde(origen) : "Seguí explorando");

  return (
    <section className="mt-28">
      <Reveal>
        <div className="flex items-center gap-6">
          <h2 className="titulo-display shrink-0 text-2xl font-medium text-oro">
            {tituloSeccion}
          </h2>
          <div className="filete w-full" />
        </div>
      </Reveal>
      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {nodos.map((nodo, i) => (
          <Reveal key={`${nodo.tipo}-${nodo.slug}`} delay={i * 0.05}>
            <TarjetaEntidad nodo={nodo} />
          </Reveal>
        ))}
      </div>
    </section>
  );
}
