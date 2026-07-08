import type { Metadata } from "next";
import Link from "next/link";
import { HeroPortada } from "@/components/HeroPortada";
import { AvisoEfemerideSugerida } from "@/components/exploracion/AvisoEfemerideSugerida";
import { PersonajeCard } from "@/components/PersonajeCard";
import { BoletinForm } from "@/components/BoletinForm";
import { RutaRecomendada } from "@/components/portada/RutaRecomendada";
import { CronicaDelMesPortada } from "@/components/portada/CronicaDelMesPortada";
import { PortadaRetorno } from "@/components/portada/PortadaRetorno";
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

      <PortadaRetorno />

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
                  {esExacta ? "Un día como hoy" : "Historia del día"}
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

      <CronicaDelMesPortada cronica={cronicaDestacada} />

      <section className="border-y border-linea-suave bg-fondo-2">
        <div className="mx-auto max-w-6xl px-5 py-16 text-center">
          <Reveal>
            <p className="kicker">Recorridos curados</p>
            <h2 className="titulo-display mt-4 text-3xl font-semibold sm:text-4xl">
              Historias con un hilo conductor
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-sm text-tinta-suave">
              Rutas que conectan personajes, eventos y crónicas en
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
            Avisame cuando salga el boletín
          </h2>
          <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-tinta-suave">
            Estamos armando un email con historias argentinas. Dejá tu correo y
            te avisamos cuando empiece a salir.
          </p>
          <div className="mt-8">
            <BoletinForm esMecenas={esMecenas} />
          </div>
        </Reveal>
      </section>
    </div>
  );
}
