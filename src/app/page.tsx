import type { Metadata } from "next";
import Link from "next/link";
import { HeroPortada } from "@/components/HeroPortada";
import { DescubrirAleatorio } from "@/components/exploracion/DescubrirAleatorio";
import { PersonajeCard } from "@/components/PersonajeCard";
import { BoletinForm } from "@/components/BoletinForm";
import { Reveal } from "@/components/ui/Reveal";
import { efemerideParaFecha } from "@/data/efemerides";
import { personajes } from "@/data/personajes";
import { cronicas } from "@/content/cronicas/registro";
import { todosLosNodos } from "@/lib/grafo/queries";
import { hoyEnArgentina } from "@/lib/fechas";
import { construirMetadata } from "@/lib/seo/metadata";
import { sitio } from "@/lib/site.config";

// La portada se regenera cada hora para mantener fresca la efeméride del día.
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

export default function HomePage() {
  const { mes, dia } = hoyEnArgentina();
  const efemeride = efemerideParaFecha(mes, dia);
  const cronicaDestacada = cronicas[0];
  const grilla = personajes.filter((p) => destacados.includes(p.slug));
  const nodosExploracion = todosLosNodos();

  return (
    <div>
      <HeroPortada />

      {/* Un día como hoy */}
      <section className="border-y border-linea-suave bg-fondo-2">
        <Link href={`/hoy/${efemeride.dia}`} className="group block">
          <div className="mx-auto flex max-w-6xl flex-col gap-8 px-5 py-16 sm:flex-row sm:items-center">
            <Reveal className="shrink-0">
              <p className="kicker">Un día como hoy</p>
              <p className="titulo-display mt-2 text-7xl font-semibold leading-none text-oro">
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
                Leer la historia del día →
              </p>
            </Reveal>
          </div>
        </Link>
      </section>

      {/* Crónica destacada */}
      <section className="mx-auto max-w-6xl px-5 py-24">
        <Reveal>
          <div className="flex items-center gap-6">
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
            {/* Escena de montañas del hero, en miniatura */}
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

      {/* Descubrí algo */}
      <section className="border-y border-linea-suave bg-fondo-2">
        <div className="mx-auto max-w-6xl px-5 py-20 text-center">
          <Reveal>
            <p className="kicker">Sin dead ends</p>
            <h2 className="titulo-display mt-4 text-3xl font-semibold sm:text-4xl">
              Descubrí algo inesperado
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-sm text-tinta-suave">
              Personajes, lugares, eventos y crónicas conectados en un grafo de
              exploración. Dejate sorprender.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <DescubrirAleatorio nodos={nodosExploracion} />
              <Link
                href="/explorar"
                className="rounded-full border border-linea px-6 py-3 text-sm text-tinta-suave transition-colors hover:border-oro/40 hover:text-oro-claro"
              >
                Explorar todo →
              </Link>
              <Link
                href="/jugar"
                className="rounded-full border border-oro/40 px-6 py-3 text-sm text-oro-claro transition-colors hover:bg-oro/10"
              >
                Quiz del día →
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* El Panteón */}
      <section className="mx-auto max-w-6xl px-5 pb-24">
        <Reveal>
          <div className="flex items-center gap-6">
            <h2 className="titulo-display shrink-0 text-2xl font-medium text-oro">
              El Panteón
            </h2>
            <div className="filete w-full" />
            <Link
              href="/panteon"
              className="shrink-0 text-xs uppercase tracking-[0.2em] text-tinta-suave transition-colors hover:text-oro-claro"
            >
              Ver todos →
            </Link>
          </div>
          <p className="mt-4 max-w-2xl text-tinta-suave">
            Héroes, tiranos, visionarios y derrotados: las vidas que hicieron
            la Argentina, en fichas para perderse durante horas.
          </p>
        </Reveal>
        <div className="mt-10 grid grid-cols-2 gap-x-6 gap-y-12 sm:grid-cols-4">
          {grilla.map((personaje, i) => (
            <Reveal key={personaje.slug} delay={(i % 4) * 0.07}>
              <PersonajeCard personaje={personaje} />
            </Reveal>
          ))}
        </div>
      </section>

      {/* Boletín */}
      <section className="border-t border-linea-suave bg-fondo-2">
        <Reveal className="mx-auto max-w-3xl px-5 py-24 text-center">
          <p className="kicker">El boletín</p>
          <h2 className="titulo-display mt-4 text-4xl font-semibold leading-tight">
            Una historia argentina cada mañana.
          </h2>
          <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-tinta-suave">
            La efeméride del día contada en 90 segundos, directo en tu casilla.
            Gratis, sin spam, para siempre.
          </p>
          <div className="mt-8">
            <BoletinForm />
          </div>
        </Reveal>
      </section>
    </div>
  );
}
