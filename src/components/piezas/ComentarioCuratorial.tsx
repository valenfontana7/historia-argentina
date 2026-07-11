import Link from "next/link";
import {
  CTA_VER_PLANES,
  DESCRIPCION_COMENTARIO_PREMIUM,
  KICKER_COMENTARIO_PREMIUM,
} from "@/lib/copy";
import type { PiezaPremiumMeta } from "@/data/piezas-premium";

type Props = {
  meta: PiezaPremiumMeta;
  desbloqueado: boolean;
  volverA: string;
};

/** Comentario curatorial extendido — completo para mecenas, teaser para visitantes. */
export function ComentarioCuratorial({ meta, desbloqueado, volverA }: Props) {
  const accederHref = `/membresia/acceder?next=${encodeURIComponent(volverA)}`;

  return (
    <section className="mt-12 rounded-sm border border-oro/25 bg-fondo-2 p-6 sm:p-8">
      <p className="kicker text-oro">{KICKER_COMENTARIO_PREMIUM}</p>
      {desbloqueado ? (
        <p className="mt-4 text-base leading-relaxed text-tinta">{meta.comentario}</p>
      ) : (
        <>
          <p className="mt-4 text-base leading-relaxed text-tinta-suave">{meta.teaser}</p>
          <div className="relative mt-4 overflow-hidden rounded-sm">
            <p
              aria-hidden
              className="select-none text-base leading-relaxed text-tinta blur-[3px]"
            >
              {meta.comentario.slice(meta.teaser.length)}
            </p>
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-fondo-2/80 to-fondo-2" />
          </div>
          <p className="mt-6 text-sm leading-relaxed text-tinta-suave">
            {DESCRIPCION_COMENTARIO_PREMIUM}
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href={accederHref}
              className="rounded-full bg-oro px-5 py-2.5 text-sm font-semibold text-fondo transition-colors hover:bg-oro-claro"
            >
              Ya soy mecenas
            </Link>
            <Link
              href="/membresia"
              className="rounded-full border border-oro/50 px-5 py-2.5 text-sm text-oro-claro transition-colors hover:bg-oro/10"
            >
              {CTA_VER_PLANES}
            </Link>
          </div>
        </>
      )}
    </section>
  );
}
