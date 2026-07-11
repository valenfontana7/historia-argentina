import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SalidasDeSala } from "@/components/museo/SalidasDeSala";
import { VisorPieza } from "@/components/piezas/VisorPieza";
import { MigasDePan } from "@/components/seo/MigasDePan";
import { Reveal } from "@/components/ui/Reveal";
import { ETIQUETAS_TIPO_PIEZA, obtenerPieza, todasLasPiezas } from "@/lib/piezas/indice";
import { salidasCuradas } from "@/lib/grafo/salidas-curadas";
import { obtenerNodo } from "@/lib/grafo/queries";
import { construirMetadata } from "@/lib/seo/metadata";
import { migajasJsonLd, piezaJsonLd } from "@/lib/seo/jsonld";

type Props = { params: Promise<{ id: string }> };

export function generateStaticParams() {
  return todasLasPiezas().map((p) => ({ id: p.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const pieza = obtenerPieza(id);
  if (!pieza) return {};
  return construirMetadata({
    titulo: pieza.alt,
    descripcion: `${ETIQUETAS_TIPO_PIEZA[pieza.tipo]} — ${pieza.credito}`,
    ruta: `/piezas/${id}`,
    tipo: "article",
    imagen: pieza.url,
  });
}

export default async function PiezaPage({ params }: Props) {
  const { id } = await params;
  const pieza = obtenerPieza(id);
  if (!pieza) notFound();

  const nodo = obtenerNodo("pieza", id);
  const salidas = nodo ? salidasCuradas(nodo, 3) : [];

  const migajas = [
    { nombre: "Inicio", href: "/" },
    { nombre: "La colección", href: "/piezas" },
    { nombre: pieza.alt.slice(0, 40), href: `/piezas/${id}` },
  ];

  const jsonLd = [
    piezaJsonLd({
      titulo: pieza.alt,
      descripcion: pieza.credito,
      url: `/piezas/${id}`,
      imagen: pieza.url,
      tipo: ETIQUETAS_TIPO_PIEZA[pieza.tipo],
    }),
    migajasJsonLd(migajas),
  ];

  return (
    <article className="pb-28 pt-32">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="mx-auto max-w-4xl px-5">
        <MigasDePan migajas={migajas} />
        <Reveal>
          <p className="kicker">{ETIQUETAS_TIPO_PIEZA[pieza.tipo]}</p>
          <h1 className="titulo-display mt-4 text-3xl font-semibold leading-tight sm:text-4xl">
            {pieza.alt}
          </h1>
        </Reveal>
        <div className="mt-10">
          <VisorPieza pieza={pieza} />
        </div>
      </div>
      {salidas.length > 0 && <SalidasDeSala salidas={salidas} tituloExhibicion={pieza.alt} />}
    </article>
  );
}
