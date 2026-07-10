import { Reveal } from "@/components/ui/Reveal";

type CitaHistoricaProps = {
  texto: string;
  autor: string;
  contexto?: string;
};

/** Cita a pantalla ancha con tipografía display, para momentos clave. */
export function CitaHistorica({ texto, autor, contexto }: CitaHistoricaProps) {
  return (
    <section className="textura-pergamino relative py-28">
      <div className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-transparent via-oro/30 to-transparent" aria-hidden />
      <Reveal className="relative mx-auto max-w-4xl px-5 text-center">
        <span className="titulo-display block text-5xl leading-none text-oro/40 sm:text-7xl">
          “
        </span>
        <blockquote className="titulo-display -mt-6 text-3xl font-medium italic leading-snug text-oro-claro sm:text-[2.6rem] sm:leading-tight">
          {texto}
        </blockquote>
        <p className="mt-8 text-sm uppercase tracking-[0.24em] text-tinta-suave">
          {autor}
        </p>
        {contexto && (
          <p className="mt-2 text-sm text-tinta-tenue">{contexto}</p>
        )}
      </Reveal>
    </section>
  );
}
