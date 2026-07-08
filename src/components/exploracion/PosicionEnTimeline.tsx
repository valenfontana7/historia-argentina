import Link from "next/link";
import { periodos } from "@/data/periodos";
import { Reveal } from "@/components/ui/Reveal";

type Props = {
  anio: number;
};

export function PosicionEnTimeline({ anio }: Props) {
  const minAnio = 1516;
  const maxAnio = new Date().getFullYear();
  const pct = Math.min(100, Math.max(0, ((anio - minAnio) / (maxAnio - minAnio)) * 100));
  const periodo = periodos.find((p) => {
    const fin = p.anioFin ?? maxAnio;
    return anio >= p.anioInicio && anio <= fin;
  });

  return (
    <Reveal className="mt-14">
      <p className="kicker">En la línea del tiempo</p>
      <div className="mt-4 relative h-2 rounded-full bg-fondo-3">
        <div
          className="absolute top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-oro bg-oro/30"
          style={{ left: `${pct}%` }}
          aria-hidden
        />
      </div>
      <div className="mt-3 flex items-center justify-between text-xs text-tinta-tenue">
        <span>{minAnio}</span>
        <span className="text-oro">{anio}</span>
        <span>{maxAnio}</span>
      </div>
      {periodo && (
        <p className="mt-3 text-sm text-tinta-suave">
          Este momento pertenece a{" "}
          <Link
            href={`/periodos/${periodo.slug}`}
            className="text-oro-claro underline decoration-oro/30 underline-offset-2 hover:text-oro"
          >
            {periodo.nombre}
          </Link>
          .
        </p>
      )}
    </Reveal>
  );
}
