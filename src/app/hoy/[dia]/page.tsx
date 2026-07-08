import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ContinuarExplorando } from "@/components/exploracion/ContinuarExplorando";
import { ContextoTemporal } from "@/components/exploracion/ContextoTemporal";
import { PosicionEnTimeline } from "@/components/exploracion/PosicionEnTimeline";
import { SabiasQue } from "@/components/exploracion/SabiasQue";
import { BotonFavorito } from "@/components/engagement/BotonFavorito";
import { RegistrarVisita } from "@/components/engagement/RegistrarVisita";
import { RecientementeVisitado } from "@/components/engagement/RecientementeVisitado";
import { MigasDePan } from "@/components/seo/MigasDePan";
import { Reveal } from "@/components/ui/Reveal";
import { BotonCompartir } from "@/components/BotonCompartir";
import { BoletinForm } from "@/components/BoletinForm";
import { slugDeCategoria } from "@/data/categorias";
import { efemerides, obtenerEfemeride, vecinas } from "@/data/efemerides";
import { obtenerVarios } from "@/data/personajes";
import { cronicas } from "@/content/cronicas/registro";
import { obtenerNodo } from "@/lib/grafo/queries";
import { construirMetadata } from "@/lib/seo/metadata";
import { eventoJsonLd, migajasJsonLd } from "@/lib/seo/jsonld";

type Props = {
  params: Promise<{ dia: string }>;
};

export function generateStaticParams() {
  return efemerides.map((e) => ({ dia: e.dia }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { dia } = await params;
  const efemeride = obtenerEfemeride(dia);
  if (!efemeride) return {};
  return construirMetadata({
    titulo: `¿Qué pasó un ${efemeride.fecha} en Argentina? ${efemeride.titulo}`,
    descripcion: `${efemeride.fecha} de ${efemeride.anio}: ${efemeride.titulo}. La historia del día, contada en 90 segundos.`,
    ruta: `/hoy/${dia}`,
    tipo: "article",
  });
}

export default async function EfemeridePage({ params }: Props) {
  const { dia } = await params;
  const efemeride = obtenerEfemeride(dia);
  if (!efemeride) notFound();

  const navegacion = vecinas(dia);
  const personajesRelacionados = obtenerVarios(efemeride.relacionados);
  const nodo = obtenerNodo("evento", dia);
  const catSlug = slugDeCategoria(efemeride.categoria);

  const cronicasRel = cronicas.filter((c) =>
    efemeride.relacionados.includes(c.protagonista.slug),
  );

  const migajas = [
    { nombre: "Inicio", href: "/" },
    { nombre: "Hoy", href: "/hoy" },
    ...(catSlug
      ? [{ nombre: efemeride.categoria, href: `/categorias/${catSlug}` }]
      : []),
    { nombre: efemeride.titulo, href: `/hoy/${dia}` },
  ];

  const jsonLd = [
    eventoJsonLd({
      titulo: efemeride.titulo,
      descripcion: efemeride.historia[0] ?? "",
      dia: efemeride.dia,
      fecha: efemeride.fecha,
      anio: efemeride.anio,
      categoria: efemeride.categoria,
    }),
    migajasJsonLd(migajas),
  ];

  return (
    <article className="mx-auto max-w-3xl px-5 pb-28 pt-32">
      <RegistrarVisita titulo={efemeride.titulo} tipo="evento" />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <MigasDePan migajas={migajas} />

      <Reveal>
        <p className="kicker text-center">
          Un día como hoy ·{" "}
          {catSlug ? (
            <Link href={`/categorias/${catSlug}`} className="hover:text-oro-claro">
              {efemeride.categoria}
            </Link>
          ) : (
            efemeride.categoria
          )}
        </p>
        <p className="titulo-display mt-8 text-center text-[5.5rem] font-semibold leading-none text-oro sm:text-[7rem]">
          {efemeride.anio}
        </p>
        <p className="mt-3 text-center text-sm uppercase tracking-[0.3em] text-tinta-suave">
          {efemeride.fecha}
        </p>
        <div className="filete mx-auto my-10 w-32" />
        <h1 className="titulo-display text-center text-4xl font-semibold leading-tight sm:text-5xl">
          {efemeride.titulo}
        </h1>
      </Reveal>

      <Reveal className="mt-8 flex justify-center">
        <BotonFavorito href={`/hoy/${dia}`} titulo={efemeride.titulo} tipo="evento" />
      </Reveal>

      <Reveal className="mt-14">
        <div className="prosa capitular">
          {efemeride.historia.map((parrafo, i) => (
            <p key={i}>{parrafo}</p>
          ))}
        </div>
      </Reveal>

      {nodo && <PosicionEnTimeline anio={efemeride.anio} />}
      {nodo && <SabiasQue origen={nodo} />}
      {nodo && <ContextoTemporal nodo={nodo} deltaAnios={20} />}

      {personajesRelacionados.length > 0 && (
        <Reveal className="mt-14">
          <p className="kicker">Protagonistas</p>
          <div className="mt-5 flex flex-wrap gap-3">
            {personajesRelacionados.map((p) => (
              <Link
                key={p.slug}
                href={`/panteon/${p.slug}`}
                className="rounded-full border border-linea px-5 py-2.5 text-sm text-tinta-suave transition-colors hover:border-oro/50 hover:text-oro-claro"
              >
                {p.nombre} →
              </Link>
            ))}
          </div>
        </Reveal>
      )}

      {cronicasRel.length > 0 && (
        <Reveal className="mt-14">
          <p className="kicker">Crónicas relacionadas</p>
          <div className="mt-5 flex flex-wrap gap-3">
            {cronicasRel.map((c) => (
              <Link
                key={c.slug}
                href={`/cronicas/${c.slug}`}
                className="rounded-full border border-linea px-5 py-2.5 text-sm text-tinta-suave transition-colors hover:border-oro/50 hover:text-oro-claro"
              >
                {c.titulo} →
              </Link>
            ))}
          </div>
        </Reveal>
      )}

      <Reveal className="mt-14 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
        <BotonCompartir
          titulo={`${efemeride.fecha} de ${efemeride.anio}: ${efemeride.titulo}`}
          texto={`Un día como hoy en la historia argentina: ${efemeride.titulo} (${efemeride.anio}).`}
          ruta={`/hoy/${efemeride.dia}`}
          utmCampaign="efemeride"
        />
        <Link
          href="/jugar"
          className="rounded-full border border-linea px-6 py-3 text-sm text-tinta-suave transition-colors hover:border-oro/40 hover:text-oro-claro"
        >
          Probá el quiz de hoy →
        </Link>
      </Reveal>

      {navegacion && (
        <Reveal className="mt-16">
          <div className="grid grid-cols-2 gap-4 border-t border-linea-suave pt-8">
            <Link href={`/hoy/${navegacion.anterior.dia}`} className="group">
              <p className="text-xs uppercase tracking-[0.2em] text-tinta-tenue">
                ← {navegacion.anterior.fecha}
              </p>
              <p className="mt-2 text-sm leading-snug text-tinta-suave transition-colors group-hover:text-oro-claro">
                {navegacion.anterior.titulo}
              </p>
            </Link>
            <Link href={`/hoy/${navegacion.siguiente.dia}`} className="group text-right">
              <p className="text-xs uppercase tracking-[0.2em] text-tinta-tenue">
                {navegacion.siguiente.fecha} →
              </p>
              <p className="mt-2 text-sm leading-snug text-tinta-suave transition-colors group-hover:text-oro-claro">
                {navegacion.siguiente.titulo}
              </p>
            </Link>
          </div>
        </Reveal>
      )}

      {nodo && (
        <div className="mx-auto max-w-6xl">
          <ContinuarExplorando origen={nodo} />
        </div>
      )}

      <RecientementeVisitado excluirHref={`/hoy/${dia}`} />

      <Reveal className="mt-20 rounded-sm border border-linea bg-fondo-2 p-8 text-center sm:p-10">
        <p className="titulo-display text-2xl font-semibold">
          Una historia argentina cada mañana
        </p>
        <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-tinta-suave">
          La efeméride del día, contada en 90 segundos, directo en tu casilla.
          Gratis, sin spam, para siempre.
        </p>
        <div className="mt-6">
          <BoletinForm />
        </div>
      </Reveal>
    </article>
  );
}
