import { Reveal } from "@/components/ui/Reveal";

export type Hito = {
  anio: number;
  texto: string;
};

type LineaDeVidaProps = {
  hitos: Hito[];
};

/** Línea de tiempo vertical con hitos, usada en fichas del Panteón. */
export function LineaDeVida({ hitos }: LineaDeVidaProps) {
  return (
    <ol className="relative ml-3 border-l border-linea pl-8">
      {hitos.map((hito, i) => (
        <li key={`${hito.anio}-${i}`} className="relative pb-9 last:pb-0">
          <span className="absolute -left-[2.42rem] top-1 h-2.5 w-2.5 rounded-full border border-oro bg-fondo" />
          <Reveal delay={i * 0.05}>
            <p className="titulo-display text-2xl font-medium text-oro">
              {hito.anio}
            </p>
            <p className="mt-1 max-w-xl leading-relaxed text-tinta-suave">
              {hito.texto}
            </p>
          </Reveal>
        </li>
      ))}
    </ol>
  );
}
