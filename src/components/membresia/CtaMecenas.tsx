import Link from "next/link";
import { puedeVerContenidoMecenas } from "@/lib/auth";

type Props = {
  compacto?: boolean;
};

/** Bloque de conversión: sostiene el museo sin paywallar el contenido libre. */
export async function CtaMecenas({ compacto = false }: Props) {
  if (await puedeVerContenidoMecenas()) return null;

  return (
    <aside
      className={`mx-auto max-w-2xl rounded-sm border border-oro/30 bg-gradient-to-br from-[#16120c] to-fondo-2 px-6 ${
        compacto ? "py-8" : "px-8 py-12"
      } text-center`}
    >
      <p className="kicker">Mecenazgo</p>
      <h3 className="titulo-display mt-3 text-2xl font-semibold sm:text-3xl">
        Si esto te importa, sostenelo
      </h3>
      <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-tinta-suave">
        El museo es gratuito. Las exclusivas, el anticipo de nuevas crónicas y la
        carta del mecenas sostienen el trabajo de contar la historia con este
        cuidado.
      </p>
      <Link
        href="/membresia"
        className="mt-6 inline-flex rounded-full bg-oro px-6 py-3 text-sm font-semibold text-fondo transition-colors hover:bg-oro-claro"
      >
        Hacete mecenas →
      </Link>
    </aside>
  );
}
