import type { Metadata } from "next";
import { Suspense } from "react";
import { PortalVivo } from "@/components/exploracion/PortalVivo";
import { SeguirRetomar } from "@/components/exploracion/SeguirRetomar";
import { RielDescubrimiento } from "@/components/exploracion/RielDescubrimiento";
import { Sorpresa } from "@/components/exploracion/Sorpresa";
import { PortalSkeleton } from "@/components/exploracion/PortalSkeleton";
import { Reveal } from "@/components/ui/Reveal";
import { TransicionLink } from "@/components/navigation/TransicionLink";
import {
  formatearFechaCalendario,
  resolverEfemerideParaFecha,
} from "@/data/efemerides";
import { cronicas } from "@/content/cronicas/registro";
import { destacadas } from "@/lib/cronicas/indice";
import { hoyEnArgentina } from "@/lib/fechas";
import { construirMetadata } from "@/lib/seo/metadata";
import { sitio } from "@/lib/site.config";
import { todosLosNodos } from "@/lib/grafo/queries";
import {
  resolverGanchoPortal,
  rielBatallas,
  rielDestacadas,
  rielHoy,
  rielPareceFiccion,
  rielPersonajes,
  rielRecientesCronicas,
  rielRecorridos,
} from "@/lib/exploracion/rieles-home";

export const revalidate = 3600;

export const metadata: Metadata = construirMetadata({
  titulo: `${sitio.nombre} | ${sitio.lema}`,
  descripcion: sitio.descripcion,
  ruta: "/",
});

function cronicaDelMes() {
  const destacadasLista = destacadas().filter((c) => c.acceso !== "mecenas");
  if (destacadasLista.length > 0) {
    const mes = new Date().getMonth();
    return destacadasLista[mes % destacadasLista.length]!;
  }
  const mes = new Date().getMonth();
  return cronicas[mes % cronicas.length] ?? cronicas[0]!;
}

async function HomeContenido() {
  const { mes, dia } = hoyEnArgentina();
  const { efemeride, esExacta } = resolverEfemerideParaFecha(mes, dia);
  const fechaHoy = formatearFechaCalendario(mes, dia);
  const cronicaDestacada = cronicaDelMes();
  const hrefHoy = esExacta
    ? `/hoy/${efemeride.dia}`
    : `/hoy/${efemeride.dia}?sugerida=1`;

  const gancho = resolverGanchoPortal({
    efemerideTitulo: efemeride.titulo,
    efemerideHref: hrefHoy,
    efemerideTeaser:
      efemeride.hook ??
      efemeride.historia[0]?.slice(0, 160) ??
      efemeride.fecha,
    esExacta,
    cronicaDestacada: {
      slug: cronicaDestacada.slug,
      titulo: cronicaDestacada.titulo,
      subtitulo: cronicaDestacada.subtitulo,
      imagenHero: cronicaDestacada.visual.imagenHero,
    },
  });

  const nodosSorpresa = todosLosNodos().filter(
    (n) => n.tipo === "cronica" || n.tipo === "persona" || n.tipo === "evento",
  );

  return (
    <div>
      <PortalVivo gancho={gancho} />

      <SeguirRetomar />

      <RielDescubrimiento
        titulo="Hoy en la historia"
        subtitulo={esExacta ? fechaHoy : `Cerca de hoy · ${fechaHoy}`}
        items={rielHoy()}
        verMasHref={hrefHoy}
        verMasEtiqueta="Ver el día →"
      />

      <RielDescubrimiento
        titulo="Historias que parecen ficción"
        subtitulo="Momentos tan improbables que cuestan creer."
        items={rielPareceFiccion()}
        verMasHref="/categorias/tragedias"
      />

      <RielDescubrimiento
        titulo="Personajes"
        subtitulo="Rostros que abren épocas enteras."
        items={rielPersonajes()}
        verMasHref="/panteon"
        verMasEtiqueta="Ver todos →"
      />

      <RielDescubrimiento
        titulo="Momentos épicos"
        subtitulo="Batallas y giros que cambiaron el mapa."
        items={rielBatallas()}
        verMasHref="/categorias/batallas"
      />

      <RielDescubrimiento
        titulo="Recorridos cortos"
        subtitulo="Dejá que te guíen. Tres a siete pasos."
        items={rielRecorridos()}
        verMasHref="/recorridos"
      />

      <RielDescubrimiento
        titulo="Para no perderse"
        items={rielDestacadas()}
        verMasHref="/cronicas"
        verMasEtiqueta="Todas las historias →"
      />

      <section className="mx-auto max-w-6xl px-5 py-10 sm:py-14">
        <Reveal>
          <Sorpresa
            nodos={nodosSorpresa}
            variante="bloque"
            etiqueta="Mostrame otra"
          />
        </Reveal>
      </section>

      <RielDescubrimiento
        titulo="Lo último"
        items={rielRecientesCronicas()}
        verMasHref="/cronicas"
      />

      <section className="border-t border-linea-suave bg-fondo-2">
        <div className="mx-auto max-w-6xl px-5 py-16">
          <Reveal>
            <p className="kicker">Seguí el hilo</p>
            <h2 className="titulo-display mt-3 text-3xl font-medium text-oro sm:text-4xl">
              El universo no termina acá
            </h2>
          </Reveal>
          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            <TransicionLink
              href={`/timelines/${efemeride.anio}`}
              className="group rounded-sm border border-linea bg-fondo px-5 py-6 transition-colors hover:border-oro/45"
            >
              <p className="text-[0.6rem] uppercase tracking-[0.2em] text-oro">
                Línea de tiempo
              </p>
              <p className="titulo-display mt-2 text-xl transition-colors group-hover:text-oro-claro">
                Argentina en {efemeride.anio}
              </p>
            </TransicionLink>
            <TransicionLink
              href="/lugares"
              className="group rounded-sm border border-linea bg-fondo px-5 py-6 transition-colors hover:border-oro/45"
            >
              <p className="text-[0.6rem] uppercase tracking-[0.2em] text-oro">
                Mapa
              </p>
              <p className="titulo-display mt-2 text-xl transition-colors group-hover:text-oro-claro">
                Lugares de la historia
              </p>
            </TransicionLink>
            <TransicionLink
              href="/explorar"
              className="group rounded-sm border border-linea bg-fondo px-5 py-6 transition-colors hover:border-oro/45"
            >
              <p className="text-[0.6rem] uppercase tracking-[0.2em] text-oro">
                Mostrame otra
              </p>
              <p className="titulo-display mt-2 text-xl transition-colors group-hover:text-oro-claro">
                Una historia al azar
              </p>
            </TransicionLink>
          </div>
        </div>
      </section>
    </div>
  );
}

export default function HomePage() {
  return (
    <Suspense fallback={<PortalSkeleton />}>
      <HomeContenido />
    </Suspense>
  );
}
