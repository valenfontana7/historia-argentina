import type { Metadata } from "next";
import Link from "next/link";
import { HeroPortada } from "@/components/HeroPortada";
import { AvisoEfemerideSugerida } from "@/components/exploracion/AvisoEfemerideSugerida";
import { PersonajeCard } from "@/components/PersonajeCard";
import { BoletinForm } from "@/components/BoletinForm";
import { RutaRecomendada } from "@/components/portada/RutaRecomendada";
import { Reveal } from "@/components/ui/Reveal";
import {
  formatearFechaCalendario,
  resolverEfemerideParaFecha,
} from "@/data/efemerides";
import { personajes } from "@/data/personajes";
import { cronicas } from "@/content/cronicas/registro";
import { hoyEnArgentina } from "@/lib/fechas";
import { puedeVerContenidoMecenas } from "@/lib/auth";
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
      <HeroPortada />

      <RutaRecomendada
        esMecenas={esMecenas}
        cronicaDestacadaSlug={cronicaDestacada.slug}
      />

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
          <Link href={hrefHoy} className="group block">
            <div className="flex flex-col gap-8 sm:flex-row sm:items-center">
              <Reveal className="shrink-0">
                <p className="kicker">
                  {esExacta ? "Un día como hoy" : "Del archivo · rotación editorial"}
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
                  Leer la historia →
                </p>
              </Reveal>
            </div>
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-24">
        <Reveal>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-6">
            <h2 className="titulo-display shrink-0 text-2xl font-medium text-oro">
              La crónica del mes
            </h2>
            <div className="filete w-full" />
          </div>
        </Reveal>
        <Reveal className="mt-10">
          <Link
            href={`/cronicas/${cronicaDestacada.slug}`}
            className="group relative block overflow-hidden rounded-sm border border-linea"
          >
            <div
              className="relative px-8 py-20 sm:px-14 sm:py-28"
              style={{
                background:
                  "linear-gradient(180deg, #05070d 0%, #0a1020 50%, #16202f 100%)",
              }}
            >
              <svg
                aria-hidden
                className="absolute bottom-0 left-0 w-full opacity-80 transition-transform duration-700 group-hover:scale-[1.03]"
                viewBox="0 0 1200 240"
                preserveAspectRatio="none"
              >
                <path
                  d="M0 240 L0 170 L140 90 L280 160 L420 60 L580 165 L720 75 L880 170 L1030 100 L1200 175 L1200 240 Z"
                  fill="#121826"
                />
                <path
                  d="M0 240 L0 205 L180 140 L360 205 L540 120 L740 210 L920 140 L1100 215 L1200 180 L1200 240 Z"
                  fill="#080a10"
                />
              </svg>
              <div className="relative">
                <p className="kicker">{cronicaDestacada.kicker}</p>
                <h3 className="titulo-display mt-4 max-w-2xl text-4xl font-semibold leading-tight transition-colors group-hover:text-oro-claro sm:text-6xl">
                  {cronicaDestacada.titulo}
                </h3>
                <p className="mt-5 max-w-xl leading-relaxed text-tinta-suave">
                  {cronicaDestacada.subtitulo}
                </p>
                <p className="mt-8 inline-block rounded-full bg-oro px-7 py-3.5 text-sm font-semibold text-fondo transition-colors group-hover:bg-oro-claro">
                  Vivir la historia →
                </p>
              </div>
            </div>
          </Link>
        </Reveal>
      </section>

      <section className="border-y border-linea-suave bg-fondo-2">
        <div className="mx-auto max-w-6xl px-5 py-16 text-center">
          <Reveal>
            <p className="kicker">Recorridos curados</p>
            <h2 className="titulo-display mt-4 text-3xl font-semibold sm:text-4xl">
              Historias con un hilo conductor
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-sm text-tinta-suave">
              Rutas editoriales que conectan personajes, eventos y crónicas en
              secuencia — sin ruleta, sin perderte.
            </p>
            <Link
              href="/recorridos"
              className="mt-8 inline-block rounded-full border border-oro/40 px-6 py-3 text-sm text-oro-claro transition-colors hover:bg-oro/10"
            >
              Ver recorridos →
            </Link>
          </Reveal>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 pb-24 pt-16">
        <Reveal>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-6">
            <h2 className="titulo-display shrink-0 text-2xl font-medium text-oro">
              El Panteón
            </h2>
            <div className="filete w-full" />
            <Link
              href="/panteon"
              className="shrink-0 text-xs uppercase tracking-[0.2em] text-tinta-suave transition-colors hover:text-oro-claro sm:ml-0"
            >
              Ver todos →
            </Link>
          </div>
          <p className="mt-4 max-w-2xl text-tinta-suave">
            Héroes, tiranos, visionarios y derrotados: las vidas que hicieron
            la Argentina.
          </p>
        </Reveal>
        <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-12 min-[400px]:grid-cols-2 sm:grid-cols-4">
          {grilla.map((personaje, i) => (
            <Reveal key={personaje.slug} delay={(i % 4) * 0.07}>
              <PersonajeCard personaje={personaje} />
            </Reveal>
          ))}
        </div>
      </section>

      <section className="border-t border-linea-suave bg-fondo-2">
        <Reveal className="mx-auto max-w-3xl px-5 py-24 text-center">
          <p className="kicker">El boletín</p>
          <h2 className="titulo-display mt-4 text-4xl font-semibold leading-tight">
            Lista de espera del boletín
          </h2>
          <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-tinta-suave">
            Estamos preparando el envío diario de historias del archivo argentino.
            Dejá tu email y te avisamos cuando arranque — con rotación honesta
            mientras el calendario no cubre los 365 días.
          </p>
          <div className="mt-8">
            <BoletinForm esMecenas={esMecenas} />
          </div>
        </Reveal>
      </section>
    </div>
  );
}
