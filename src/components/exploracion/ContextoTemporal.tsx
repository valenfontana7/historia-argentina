import Link from "next/link";
import { EtiquetaCta } from "@/components/ui/FlechaCta";
import type { NodoEntidad } from "@/lib/grafo/tipos";
import { descubrir } from "@/lib/grafo/queries";
import { Reveal } from "@/components/ui/Reveal";

type Props = {
  nodo: NodoEntidad;
  deltaAnios?: number;
};

export function ContextoTemporal({ nodo, deltaAnios = 20 }: Props) {
  if (!nodo.anio) return null;

  const anioObjetivo = nodo.anio + deltaAnios;
  const contemporaneos = descubrir(
    { tipo: "evento", slug: nodo.slug },
    "anios-cercanos",
    3,
  ).filter((n) => n.anio && Math.abs(n.anio - anioObjetivo) <= 5);

  if (contemporaneos.length === 0) return null;

  return (
    <Reveal className="mt-14">
      <p className="kicker">
        {deltaAnios > 0 ? "Años después" : "Años antes"}
      </p>
      <p className="mt-3 text-sm text-tinta-suave">
        En{" "}
        <Link
          href={`/timelines/${anioObjetivo}`}
          className="text-oro-claro underline decoration-oro/30 underline-offset-2 hover:text-oro"
        >
          {anioObjetivo}
        </Link>
        , Argentina seguía escribiendo su historia:
      </p>
      <ul className="mt-4 space-y-2">
        {contemporaneos.map((e) => (
          <li key={e.slug}>
            <Link
              href={`/hoy/${e.slug}`}
              className="group text-sm text-tinta transition-colors hover:text-oro-claro"
            >
              <EtiquetaCta>{e.titulo}</EtiquetaCta>
            </Link>
          </li>
        ))}
      </ul>
    </Reveal>
  );
}
