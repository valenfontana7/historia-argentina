import type { NarrativaEfemeride } from "@/data/efemerides-narrativa";
import { Reveal } from "@/components/ui/Reveal";

type Props = {
  narrativa: NarrativaEfemeride;
};

/** Plantilla narrativa: hook → prosa → giro → cita opcional. */
export function EfemerideNarrativa({ narrativa }: Props) {
  return (
    <div className="space-y-8">
      <Reveal>
        <p className="titulo-display text-2xl font-medium leading-snug text-oro-claro sm:text-3xl">
          {narrativa.hook}
        </p>
      </Reveal>
      {narrativa.giro && (
        <Reveal>
          <p className="border-l-2 border-oro/40 pl-5 text-base leading-relaxed text-tinta-suave">
            {narrativa.giro}
          </p>
        </Reveal>
      )}
      {narrativa.cita && (
        <Reveal>
          <blockquote className="mx-auto max-w-xl text-center">
            <p className="titulo-display text-xl font-medium italic leading-snug text-tinta sm:text-2xl">
              “{narrativa.cita.texto}”
            </p>
            {narrativa.cita.atribucion && (
              <cite className="mt-4 block text-xs not-italic text-tinta-tenue">
                {narrativa.cita.atribucion}
              </cite>
            )}
          </blockquote>
        </Reveal>
      )}
    </div>
  );
}
