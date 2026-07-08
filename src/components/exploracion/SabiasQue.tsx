import Link from "next/link";
import type { EntidadRef, NodoEntidad } from "@/lib/grafo/tipos";
import { descubrir } from "@/lib/grafo/queries";
import { rutaDeNodo } from "@/lib/grafo/rutas";
import { Reveal } from "@/components/ui/Reveal";

type Props = {
  origen: NodoEntidad | EntidadRef;
};

export function SabiasQue({ origen }: Props) {
  const [sorpresa] = descubrir(origen, "anios-cercanos", 1);
  if (!sorpresa) return null;

  return (
    <Reveal className="mt-14">
      <aside className="rounded-sm border border-oro/20 bg-fondo-2 px-6 py-5 sm:px-8">
        <p className="kicker text-oro">¿Sabías que…?</p>
        <p className="mt-3 text-sm leading-relaxed text-tinta-suave">
          Mientras explorás esta historia, también podés descubrir{" "}
          <Link
            href={rutaDeNodo(sorpresa)}
            className="text-oro-claro underline decoration-oro/30 underline-offset-2 transition-colors hover:text-oro"
          >
            {sorpresa.titulo}
          </Link>
          {sorpresa.anio ? ` (${sorpresa.anio})` : ""}.
        </p>
      </aside>
    </Reveal>
  );
}
