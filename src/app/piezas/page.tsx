import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { MigasDePan } from "@/components/seo/MigasDePan";
import { Reveal } from "@/components/ui/Reveal";
import { TransicionLink } from "@/components/navigation/TransicionLink";
import {
  ETIQUETAS_TIPO_PIEZA,
  piezasPorTipo,
  todasLasPiezas,
} from "@/lib/piezas/indice";
import { ColeccionPremium } from "@/components/piezas/ColeccionPremium";
import {
  DESCRIPCION_COLECCION_PREMIUM,
  KICKER_COLECCION_PREMIUM,
  TITULO_COLECCION_PREMIUM,
} from "@/lib/copy";
import { construirMetadata } from "@/lib/seo/metadata";
import { migajasJsonLd } from "@/lib/seo/jsonld";

export const metadata: Metadata = construirMetadata({
  titulo: "La colección: piezas del patrimonio",
  descripcion:
    "Grabados, pinturas, mapas y fotografías históricas del museo digital Argent.",
  ruta: "/piezas",
});

export default function PiezasPage() {
  const piezas = todasLasPiezas();
  const migajas = [
    { nombre: "Inicio", href: "/" },
    { nombre: "Explorar", href: "/explorar" },
    { nombre: "La colección", href: "/piezas" },
  ];

  const porTipo = (["pintura", "grabado", "mapa", "foto"] as const).map((tipo) => ({
    tipo,
    piezas: piezasPorTipo(tipo).slice(0, 6),
  }));

  return (
    <div className="pb-28 pt-32">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(migajasJsonLd(migajas)) }}
      />
      <div className="mx-auto max-w-6xl px-5">
        <MigasDePan migajas={migajas} />
        <Reveal>
          <p className="kicker">Patrimonio visual</p>
          <h1 className="titulo-display mt-4 text-5xl font-semibold sm:text-6xl">
            La colección
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-tinta-suave">
            {piezas.length} piezas del acervo: grabados, pinturas, mapas y fotografías
            que iluminan la historia argentina.
          </p>
        </Reveal>

        {porTipo.map(({ tipo, piezas: lista }) =>
          lista.length === 0 ? null : (
            <section key={tipo} className="mt-20">
              <Reveal>
                <h2 className="titulo-display text-2xl font-medium text-oro">
                  {ETIQUETAS_TIPO_PIEZA[tipo]}s
                </h2>
              </Reveal>
              <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {lista.map((pieza, i) => (
                  <Reveal key={pieza.id} delay={i * 0.04}>
                    <TransicionLink
                      href={`/piezas/${pieza.id}`}
                      className="group block overflow-hidden rounded-sm border border-linea bg-fondo-2 transition-colors hover:border-oro/40"
                    >
                      <div className="relative aspect-[4/3] bg-fondo-3">
                        <Image
                          src={pieza.url}
                          alt={pieza.alt}
                          fill
                          unoptimized
                          sizes="400px"
                          className="object-cover sepia-[0.2] transition-transform duration-500 group-hover:scale-[1.03]"
                        />
                      </div>
                      <div className="p-4">
                        <p className="line-clamp-2 text-sm font-medium transition-colors group-hover:text-oro-claro">
                          {pieza.alt}
                        </p>
                        <p className="mt-1 text-xs text-tinta-tenue">{pieza.credito}</p>
                      </div>
                    </TransicionLink>
                  </Reveal>
                ))}
              </div>
            </section>
          ),
        )}

        <section id="coleccion-mecenas" className="mt-24 border-t border-linea-suave pt-20">
          <Reveal>
            <p className="kicker text-oro">{KICKER_COLECCION_PREMIUM}</p>
            <h2 className="titulo-display mt-4 text-3xl font-medium">
              {TITULO_COLECCION_PREMIUM}
            </h2>
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-tinta-suave">
              {DESCRIPCION_COLECCION_PREMIUM}
            </p>
          </Reveal>
          <div className="mt-12">
            <ColeccionPremium />
          </div>
        </section>

        <Reveal className="mt-16 text-center">
          <Link
            href="/explorar"
            className="text-sm text-oro-claro underline-offset-4 hover:underline"
          >
            Volver al plano del museo →
          </Link>
        </Reveal>
      </div>
    </div>
  );
}
