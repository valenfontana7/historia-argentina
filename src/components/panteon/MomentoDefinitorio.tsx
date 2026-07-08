import type { MomentoDefinitorio } from "@/lib/personaje-momento";
import { Reveal } from "@/components/ui/Reveal";

type Props = {
  nombre: string;
  momento: MomentoDefinitorio;
};

/** Beat emocional antes de la biografía: año + línea de impacto + cita opcional. */
export function MomentoDefinitorio({ nombre, momento }: Props) {
  return (
    <Reveal className="mt-16">
      <section className="relative overflow-hidden rounded-sm border border-oro/25 bg-gradient-to-br from-fondo-2 to-fondo px-8 py-12 sm:px-12">
        <p className="kicker">Momento definitorio</p>
        <p className="titulo-display mt-4 text-5xl font-semibold leading-none text-oro sm:text-6xl">
          {momento.anio}
        </p>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-tinta-suave">
          {momento.linea}
        </p>
        {momento.cita && (
          <blockquote className="mt-10 border-t border-linea-suave pt-8">
            <p className="titulo-display text-2xl font-medium italic leading-snug text-oro-claro sm:text-3xl">
              “{momento.cita}”
            </p>
            {momento.contextoCita && (
              <cite className="mt-4 block text-sm not-italic text-tinta-tenue">
                {nombre} · {momento.contextoCita}
              </cite>
            )}
          </blockquote>
        )}
      </section>
    </Reveal>
  );
}
