import { Suspense } from "react";
import { CatalogoCronicas } from "@/components/cronicas/CatalogoCronicas";
import { Reveal } from "@/components/ui/Reveal";
import { puedeVerContenidoMecenas } from "@/lib/auth";
import {
  destacadas,
  filtrarCatalogo,
  type FiltrosCatalogo,
} from "@/lib/cronicas/indice";
import { construirMetadata } from "@/lib/seo/metadata";
import type { Epoca } from "@/components/ui/Retrato";
import type { AccesoCronica } from "@/content/cronicas/registro";

export const metadata = construirMetadata({
  titulo: "Crónicas — Historias visuales de la historia argentina",
  descripcion:
    "Historias de la historia argentina contadas como experiencias visuales interactivas: mapas animados, datos y relatos que se navegan con el scroll.",
  ruta: "/cronicas",
});

type SearchParams = Promise<{
  epoca?: string;
  categoria?: string;
  acceso?: string;
}>;

type Props = {
  searchParams: SearchParams;
};

function parseFiltros(params: {
  epoca?: string;
  categoria?: string;
  acceso?: string;
}): FiltrosCatalogo {
  const filtros: FiltrosCatalogo = {};
  if (params.epoca) filtros.epoca = params.epoca as Epoca;
  if (params.categoria) filtros.categoria = params.categoria;
  if (params.acceso === "publico" || params.acceso === "mecenas") {
    filtros.acceso = params.acceso as AccesoCronica;
  }
  return filtros;
}

export default async function CronicasPage({ searchParams }: Props) {
  const params = await searchParams;
  const esMecenas = await puedeVerContenidoMecenas();
  const filtros = parseFiltros(params);
  const modoFiltrado = Boolean(filtros.epoca || filtros.categoria || filtros.acceso);
  const resultadosFiltrados = modoFiltrado ? filtrarCatalogo(filtros) : [];

  return (
    <div className="mx-auto max-w-6xl px-5 pb-28 pt-32">
      <Reveal>
        <p className="kicker">Crónicas</p>
        <h1 className="titulo-display mt-4 max-w-3xl text-5xl font-semibold leading-[1.05] sm:text-6xl">
          Historias que se viven con el scroll.
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-tinta-suave">
          Explorá por época, tema o recorrido. Cada crónica es una experiencia:
          mapas que se dibujan, cifras que cobran vida y relatos que avanzan al
          ritmo de tu dedo.
        </p>
      </Reveal>

      <Suspense fallback={<div className="mt-10 h-24 animate-pulse rounded-sm bg-fondo-2" />}>
        <CatalogoCronicas
          destacadas={destacadas()}
          esMecenas={esMecenas}
          filtrosIniciales={filtros}
          modoFiltrado={modoFiltrado}
          resultadosFiltrados={resultadosFiltrados}
        />
      </Suspense>
    </div>
  );
}
