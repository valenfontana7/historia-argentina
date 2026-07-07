import Link from "next/link";

type Props = {
  titulo: string;
};

/** Reja suave: hero visible, el cuerpo queda detrás del CTA de membresía. */
export function SoftGate({ titulo }: Props) {
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
      <p className="mx-auto mt-5 max-w-md text-base leading-relaxed text-tinta-suave">
        Esta crónica forma parte del archivo privado de quienes sostienen Argenta.
        El resto del museo —incluidas dos crónicas épicas— sigue abierto y libre.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-4">
        <Link
          href="/membresia"
          className="rounded-full bg-oro px-6 py-3 text-sm font-semibold text-fondo transition-colors hover:bg-oro-claro"
        >
          Hacete mecenas
        </Link>
        <Link
          href="/membresia/acceder"
          className="rounded-full border border-linea px-6 py-3 text-sm text-tinta-suave transition-colors hover:border-oro/40 hover:text-oro-claro"
        >
          Ya soy mecenas — entrar
        </Link>
      </div>
    </div>
  );
}
