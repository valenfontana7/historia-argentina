import Link from "next/link";
import { EtiquetaCta } from "@/components/ui/FlechaCta";
import { FichaExhibicion } from "@/components/cronicas/FichaExhibicion";
import { Reveal } from "@/components/ui/Reveal";
import type { CronicaMeta } from "@/content/cronicas/registro";
import type { Epoca } from "@/components/ui/Retrato";

const MAX_VISIBLE = 6;

type Props = {
  epoca: Epoca;
  nombreEpoca: string;
  cronicas: CronicaMeta[];
  esMecenas?: boolean;
  id?: string;
};

export function SeccionCronicasEpoca({
  epoca,
  nombreEpoca,
  cronicas,
  esMecenas = false,
  id,
}: Props) {
  if (cronicas.length === 0) return null;

  const visibles = cronicas.slice(0, MAX_VISIBLE);
  const hayMas = cronicas.length > MAX_VISIBLE;

  return (
    <section id={id ?? `epoca-${epoca}`} className="scroll-mt-32">
      <Reveal>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="kicker">{nombreEpoca}</p>
            <h2 className="titulo-display mt-2 text-3xl font-semibold sm:text-4xl">
              {cronicas.length}{" "}
              {cronicas.length === 1 ? "exhibición" : "exhibiciones"}
            </h2>
          </div>
          <Link
            href={`/periodos/${epoca}#cronicas`}
            className="group text-sm text-oro-claro transition-colors hover:text-oro"
          >
            <EtiquetaCta>Ver en la sala</EtiquetaCta>
          </Link>
        </div>
      </Reveal>

      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {visibles.map((cronica, i) => (
          <Reveal key={cronica.slug} delay={i * 0.04}>
            <FichaExhibicion cronica={cronica} esMecenas={esMecenas} />
          </Reveal>
        ))}
      </div>

      {hayMas && (
        <p className="mt-6 text-center">
          <Link
            href={`/cronicas?epoca=${epoca}`}
            className="group text-sm text-oro-claro transition-colors hover:text-oro"
          >
            <EtiquetaCta>{`Ver las ${cronicas.length} exhibiciones de ${nombreEpoca}`}</EtiquetaCta>
          </Link>
        </p>
      )}
    </section>
  );
}
