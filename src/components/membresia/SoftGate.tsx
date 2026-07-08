import Link from "next/link";

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
      <p className="kicker">Exclusiva para mecenas</p>
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
          {duracion} de historia que no está en ningún manual
        </p>
      )}
      <p className="mx-auto mt-6 max-w-md text-base leading-relaxed text-tinta-suave">
        Si ya sos mecenas, entrá con el magic link de tu email. Pagá la membresía
        solo si todavía no la tenés activa.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-4">
        <Link
          href={accederHref}
          className="rounded-full bg-oro px-6 py-3 text-sm font-semibold text-fondo transition-colors hover:bg-oro-claro"
        >
          Entrar como mecenas
        </Link>
        <Link
          href="/membresia"
          className="rounded-full border border-linea px-6 py-3 text-sm text-tinta-suave transition-colors hover:border-oro/40 hover:text-oro-claro"
        >
          Ver planes
        </Link>
      </div>
    </div>
  );
}
