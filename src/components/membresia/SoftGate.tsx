import Link from "next/link";
import { ACCESO_EMAIL } from "@/lib/copy";

type Props = {
  titulo: string;
  volverA?: string;
  /** Duración estimada de lectura (ej. "8 minutos"). */
  duracion?: string;
  /** Dato de impacto para teaser. */
  datoTeaser?: string;
  /** Primera línea del subtítulo o hook. */
  teaser?: string;
};

/** Reja suave: hero visible, el cuerpo queda detrás del CTA de membresía. */
export function SoftGate({
  titulo,
  volverA,
  duracion,
  datoTeaser,
  teaser,
}: Props) {
  const accederHref = volverA
    ? `/membresia/acceder?next=${encodeURIComponent(volverA)}`
    : "/membresia/acceder";

  return (
    <div className="relative mx-auto max-w-2xl px-5 py-20 text-center">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 -top-24 h-24 bg-gradient-to-b from-transparent to-fondo"
      />
      <p className="kicker">Solo para mecenas</p>
      <h2 className="titulo-display mt-4 text-3xl font-semibold sm:text-4xl">
        {titulo}
      </h2>
      {teaser && (
        <p className="mx-auto mt-5 max-w-md text-base italic leading-relaxed text-oro-claro">
          {teaser}
        </p>
      )}
      {datoTeaser && (
        <p className="titulo-display mx-auto mt-8 max-w-sm text-4xl font-semibold text-oro">
          {datoTeaser}
        </p>
      )}
      {duracion && (
        <p className="mt-4 text-xs uppercase tracking-[0.2em] text-tinta-tenue">
          {duracion} de lectura
        </p>
      )}

      <div className="mx-auto mt-10 max-w-md space-y-6 text-left">
        <div className="rounded-sm border border-linea bg-fondo-2 p-5">
          <p className="text-sm font-medium text-tinta">¿Ya pagaste?</p>
          <p className="mt-2 text-sm leading-relaxed text-tinta-suave">
            {ACCESO_EMAIL}
          </p>
          <Link
            href={accederHref}
            className="mt-4 inline-block rounded-full bg-oro px-5 py-2.5 text-sm font-semibold text-fondo transition-colors hover:bg-oro-claro"
          >
            Pedir enlace de acceso
          </Link>
        </div>
        <div className="rounded-sm border border-linea bg-fondo-2 p-5">
          <p className="text-sm font-medium text-tinta">¿Todavía no sos mecenas?</p>
          <p className="mt-2 text-sm leading-relaxed text-tinta-suave">
            Mirá los planes y sumate para leer esta historia completa.
          </p>
          <Link
            href="/membresia"
            className="mt-4 inline-block rounded-full border border-oro/50 px-5 py-2.5 text-sm text-oro-claro transition-colors hover:bg-oro/10"
          >
            Ver planes
          </Link>
        </div>
      </div>
    </div>
  );
}
