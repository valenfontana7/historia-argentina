import { Reveal } from "@/components/ui/Reveal";

export type Hito = {
  anio: number;
  texto: string;
};

type LineaDeVidaProps = {
  hitos: Hito[];
};

/** Friso vertical de hitos biográficos: estética de catálogo de museo. */
export function LineaDeVida({ hitos }: LineaDeVidaProps) {
  return (
    <ol className="relative">
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-2 left-[1.15rem] top-2 w-px bg-gradient-to-b from-oro/50 via-linea to-transparent sm:left-[1.4rem]"
      />
      {hitos.map((hito, i) => (
        <li
          key={`${hito.anio}-${i}`}
          className="relative grid grid-cols-[auto_1fr] gap-x-5 gap-y-1 pb-10 last:pb-0 sm:gap-x-8"
        >
          <div className="relative flex flex-col items-center pt-1">
            <span className="z-[1] h-3 w-3 rounded-full border border-oro bg-fondo shadow-[0_0_0_4px_rgba(12,10,8,1)]" />
          </div>
          <Reveal delay={i * 0.05}>
            <p className="titulo-display text-2xl font-medium text-oro sm:text-3xl">
              {hito.anio}
            </p>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-tinta-suave sm:text-base">
              {hito.texto}
            </p>
          </Reveal>
        </li>
      ))}
    </ol>
  );
}
