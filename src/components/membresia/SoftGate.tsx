import Link from "next/link";
import {
  ACCESO_EMAIL,
  CTA_PEDIR_ACCESO,
  CTA_VER_PLANES,
  DESCRIPCION_SALA_PRIVADA,
  KICKER_SALA_PRIVADA,
  TITULO_SALA_PRIVADA,
} from "@/lib/copy";

type Props = {
  titulo: string;
  volverA?: string;
  /** Duración estimada de la visita (ej. "8 minutos"). */
  duracion?: string;
  /** Dato de impacto para teaser. */
  datoTeaser?: string;
  /** Primera línea del subtítulo o hook. */
  teaser?: string;
  /** La sala incluye audioguía narrada. */
  incluyeAudioguia?: boolean;
};

/** Puerta de sala privada: umbral visible, cuerpo detrás del acceso mecenas. */
export function SoftGate({
  titulo,
  volverA,
  duracion,
  datoTeaser,
  teaser,
  incluyeAudioguia = false,
}: Props) {
  const accederHref = volverA
    ? `/membresia/acceder?next=${encodeURIComponent(volverA)}`
    : "/membresia/acceder";

  return (
    <div className="relative mx-auto max-w-2xl px-5 py-20 text-center">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 -top-32 h-32 bg-gradient-to-b from-transparent to-fondo"
      />
      <div className="relative overflow-hidden rounded-sm border border-oro/40 bg-fondo-2 px-6 py-12 sm:px-10 sm:py-14">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-oro/60 to-transparent"
        />
        <p className="kicker">{KICKER_SALA_PRIVADA}</p>
        <h2 className="titulo-display mt-4 text-3xl font-semibold sm:text-4xl">{titulo}</h2>
        <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-tinta-suave">
          {DESCRIPCION_SALA_PRIVADA}
        </p>
        {teaser && (
          <p className="mx-auto mt-6 max-w-md text-base italic leading-relaxed text-oro-claro">
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
            Visita de {duracion}
            {incluyeAudioguia ? " · Con audioguía" : ""}
          </p>
        )}

        <div className="mx-auto mt-10 max-w-md space-y-4 text-left">
          <div className="rounded-sm border border-linea bg-fondo/80 p-5">
            <p className="text-sm font-medium text-tinta">{TITULO_SALA_PRIVADA}</p>
            <p className="mt-2 text-sm leading-relaxed text-tinta-suave">{ACCESO_EMAIL}</p>
            <Link
              href={accederHref}
              className="mt-4 inline-block rounded-full bg-oro px-5 py-2.5 text-sm font-semibold text-fondo transition-colors hover:bg-oro-claro"
            >
              {CTA_PEDIR_ACCESO}
            </Link>
          </div>
          <div className="rounded-sm border border-linea bg-fondo/80 p-5">
            <p className="text-sm font-medium text-tinta">¿Todavía no sos mecenas?</p>
            <p className="mt-2 text-sm leading-relaxed text-tinta-suave">
              Sumate para cruzar esta puerta y acceder a salas privadas, audioguías y anticipos.
            </p>
            <Link
              href="/membresia"
              className="mt-4 inline-block rounded-full border border-oro/50 px-5 py-2.5 text-sm text-oro-claro transition-colors hover:bg-oro/10"
            >
              {CTA_VER_PLANES}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
