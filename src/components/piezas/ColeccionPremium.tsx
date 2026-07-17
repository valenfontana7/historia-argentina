import Image from "next/image";
import Link from "next/link";
import { TransicionLink } from "@/components/navigation/TransicionLink";
import { EtiquetaCta } from "@/components/ui/FlechaCta";
import { Reveal } from "@/components/ui/Reveal";
import {
  todasLasColeccionesPremium,
  piezasDeColeccion,
} from "@/lib/piezas/premium";
import { ETIQUETAS_TIPO_PIEZA } from "@/lib/piezas/indice";

type Props = {
  /** En dashboard mecenas: mostrar todas las piezas. En catálogo público: teaser. */
  compacto?: boolean;
};

export function ColeccionPremium({ compacto = false }: Props) {
  const colecciones = todasLasColeccionesPremium();

  return (
    <div className="space-y-14">
      {colecciones.map((coleccion) => {
        const piezas = piezasDeColeccion(coleccion.id);
        const visibles = compacto ? piezas.slice(0, 2) : piezas;

        return (
          <section key={coleccion.id}>
            <Reveal>
              <h3 className="titulo-display text-xl font-medium text-oro">
                {coleccion.titulo}
              </h3>
              <p className="mt-2 max-w-xl text-sm text-tinta-suave">
                {coleccion.descripcion}
              </p>
            </Reveal>
            <ul className="mt-6 grid gap-4 sm:grid-cols-2">
              {visibles.map((pieza, i) => (
                <Reveal key={pieza.id} delay={i * 0.05}>
                  <TransicionLink
                    href={`/piezas/${pieza.id}`}
                    className="group flex gap-4 overflow-hidden rounded-sm border border-linea bg-fondo-2 p-3 transition-colors hover:border-oro/40"
                  >
                    <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-sm bg-fondo-3">
                      <Image
                        src={pieza.url}
                        alt=""
                        fill
                        unoptimized
                        sizes="80px"
                        className="object-cover sepia-[0.2] transition-transform duration-500 group-hover:scale-[1.05]"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-[0.55rem] uppercase tracking-[0.18em] text-oro">
                        Comentada · {ETIQUETAS_TIPO_PIEZA[pieza.tipo]}
                      </p>
                      <p className="mt-1 line-clamp-2 text-sm font-medium transition-colors group-hover:text-oro-claro">
                        {pieza.alt}
                      </p>
                    </div>
                  </TransicionLink>
                </Reveal>
              ))}
            </ul>
            {compacto && piezas.length > 2 && (
              <p className="mt-4 text-sm">
                <Link
                  href="/piezas#coleccion-mecenas"
                  className="group text-oro-claro underline-offset-4 hover:underline"
                >
                  <EtiquetaCta>{`Ver las ${piezas.length} piezas de esta colección`}</EtiquetaCta>
                </Link>
              </p>
            )}
          </section>
        );
      })}
    </div>
  );
}
