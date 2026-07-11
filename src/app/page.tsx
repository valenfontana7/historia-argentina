import type { Metadata } from "next";
import Link from "next/link";
import { HeroPortada } from "@/components/HeroPortada";
import { AvisoEfemerideSugerida } from "@/components/exploracion/AvisoEfemerideSugerida";
import { PersonajeCard } from "@/components/PersonajeCard";
import { RutaRecomendada } from "@/components/portada/RutaRecomendada";
import { CronicaDelMesPortada } from "@/components/portada/CronicaDelMesPortada";
import { PortadaRetorno } from "@/components/portada/PortadaRetorno";
import { PuertasDeSala } from "@/components/museo/PuertasDeSala";
import { TuVisita } from "@/components/museo/TuVisita";
import { ExposicionesTemporales } from "@/components/museo/ExposicionesTemporales";
import { TransicionLink } from "@/components/navigation/TransicionLink";
import { Reveal } from "@/components/ui/Reveal";
import { puedeVerContenidoMecenas } from "@/lib/auth";
import { exposicionesAnticipoActivas } from "@/lib/cronicas/indice";
import {
  formatearFechaCalendario,
  resolverEfemerideParaFecha,
} from "@/data/efemerides";
import { personajes } from "@/data/personajes";
import { cronicas } from "@/content/cronicas/registro";
import { hoyEnArgentina } from "@/lib/fechas";
import { construirMetadata } from "@/lib/seo/metadata";
import { sitio } from "@/lib/site.config";

export const revalidate = 3600;

export const metadata: Metadata = construirMetadata({
  titulo: `${sitio.nombre} — ${sitio.lema}`,
  descripcion: sitio.descripcion,
  ruta: "/",
});

const destacados = [
  "jose-de-san-martin",
  "eva-peron",
  "juan-manuel-de-rosas",
  "domingo-faustino-sarmiento",
  "manuel-belgrano",
  "juana-azurduy",
  "juan-domingo-peron",
  "raul-alfonsin",
];

function cronicaDelMes() {
  const mes = new Date().getMonth();
  return cronicas[mes % cronicas.length] ?? cronicas[0];
}

export default async function HomePage() {
  const esMecenas = await puedeVerContenidoMecenas();
  const anticipo = exposicionesAnticipoActivas();
  const { mes, dia } = hoyEnArgentina();
  const { efemeride, esExacta } = resolverEfemerideParaFecha(mes, dia);
  const fechaHoy = formatearFechaCalendario(mes, dia);
  const cronicaDestacada = cronicaDelMes();
  const grilla = personajes.filter((p) => destacados.includes(p.slug));
  const hrefHoy = esExacta
    ? `/hoy/${efemeride.dia}`
    : `/hoy/${efemeride.dia}?sugerida=1`;

  return (
    <div>
      <HeroPortada
        cronicaSlug={cronicaDestacada.slug}
        hoyHref={hrefHoy}
        hoyTitulo={efemeride.titulo}
      />

      <RutaRecomendada cronicaDestacadaSlug={cronicaDestacada.slug} />

      <PortadaRetorno />

      <TuVisita />

      {anticipo.length > 0 && (
        <section className="border-b border-linea-suave bg-fondo-2">
          <div className="mx-auto max-w-6xl px-5 py-12">
            <ExposicionesTemporales exposiciones={anticipo} esMecenas={esMecenas} />
          </div>
        </section>
      )}

      {/* Pieza del día */}
      <section className="border-y border-linea-suave bg-fondo">
        <div className="mx-auto max-w-6xl px-5 py-16">
          {!esExacta && (
            <div className="mb-8">
              <AvisoEfemerideSugerida
                fechaConsultada={fechaHoy}
                fechaEfemeride={efemeride.fecha}
              />
            </div>
          )}
          <TransicionLink href={hrefHoy} className="group block">
            <div className="flex flex-col gap-8 sm:flex-row sm:items-center">
              <Reveal className="shrink-0">
                <p className="kicker">
                  {esExacta ? "La pieza del día" : "Pieza del día sugerida"}
                </p>
                <p className="titulo-display mt-2 text-5xl font-semibold leading-none text-oro sm:text-7xl">
                  {efemeride.anio}
                </p>
                <p className="mt-2 text-xs uppercase tracking-[0.3em] text-tinta-tenue">
                  {efemeride.fecha}
                </p>
              </Reveal>
              <Reveal delay={0.1} className="sm:border-l sm:border-linea sm:pl-10">
                <h2 className="titulo-display max-w-xl text-3xl font-semibold leading-tight transition-colors group-hover:text-oro-claro">
                  {efemeride.titulo}
                </h2>
                <p className="mt-3 max-w-xl text-sm leading-relaxed text-tinta-suave">
                  {efemeride.historia[0].slice(0, 180)}…
                </p>
                <p className="mt-4 text-xs uppercase tracking-[0.2em] text-oro transition-transform duration-300 group-hover:translate-x-1.5">
                  Ver en la vitrina →
                </p>
              </Reveal>
            </div>
          </TransicionLink>
        </div>
      </section>

      <PuertasDeSala />

      <CronicaDelMesPortada cronica={cronicaDestacada} />

      <section className="border-y border-linea-suave bg-fondo-2">
        <div className="mx-auto max-w-6xl px-5 py-14 text-center">
          <Reveal>
            <div className="flex flex-col items-center gap-6 sm:flex-row sm:justify-center sm:gap-10">
              <Link
                href="/recorridos"
                className="text-sm text-oro-claro underline-offset-4 transition-colors hover:underline"
              >
                Visitas guiadas →
              </Link>
              <Link
                href="/panteon"
                className="text-sm text-oro-claro underline-offset-4 transition-colors hover:underline"
              >
                Galería de retratos →
              </Link>
              <Link
                href="/explorar"
                className="text-sm text-oro-claro underline-offset-4 transition-colors hover:underline"
              >
                Plano del museo →
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 pb-24 pt-10">
        <Reveal>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-6">
            <h2 className="titulo-display shrink-0 text-2xl font-medium text-oro">
              Rostros del museo
            </h2>
            <div className="filete w-full" />
            <Link
              href="/panteon"
              className="shrink-0 text-xs uppercase tracking-[0.2em] text-tinta-suave transition-colors hover:text-oro-claro sm:ml-0"
            >
              Ver galería →
            </Link>
          </div>
        </Reveal>
        <div className="mt-10 grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-4">
          {grilla.slice(0, 4).map((personaje, i) => (
            <Reveal key={personaje.slug} delay={(i % 4) * 0.07}>
              <PersonajeCard personaje={personaje} />
            </Reveal>
          ))}
        </div>
      </section>
    </div>
  );
}
