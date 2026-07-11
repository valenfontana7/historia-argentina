import Link from "next/link";
import { redirect } from "next/navigation";
import { ColeccionesGuardadas } from "@/components/mecenas/ColeccionesGuardadas";
import { OnboardingMecenas } from "@/components/mecenas/OnboardingMecenas";
import {
  MuralMecenas,
  obtenerCreditosMecenas,
} from "@/components/membresia/MuralMecenas";
import { ExposicionesTemporales } from "@/components/museo/ExposicionesTemporales";
import { SellosVisita } from "@/components/museo/SellosVisita";
import { TransicionLink } from "@/components/navigation/TransicionLink";
import { obtenerMecenasActivo, obtenerSesion } from "@/lib/auth";
import { cronicas } from "@/content/cronicas/registro";
import { recorridos, esRecorridoMecenas } from "@/data/recorridos";
import { recorridosConAudioguia } from "@/data/audioguias";
import { exhibicionesConAudioguia } from "@/data/audioguias-salas";
import { exposicionesAnticipoActivas } from "@/lib/cronicas/indice";
import { ColeccionPremium } from "@/components/piezas/ColeccionPremium";
import {
  DESCRIPCION_COLECCION_PREMIUM,
  KICKER_COLECCION_PREMIUM,
  TITULO_COLECCION_PREMIUM,
} from "@/lib/copy";
import { planes } from "@/lib/membresia.config";

export const metadata = {
  title: "Tu visita — Mecenas",
  robots: { index: false },
};

export const dynamic = "force-dynamic";

export default async function MecenasPage() {
  const sesion = await obtenerSesion();
  if (!sesion) redirect("/membresia/acceder?next=/mecenas");

  const mecenas = await obtenerMecenasActivo();
  if (!mecenas) redirect("/membresia/acceder?next=/mecenas");

  const anticipo = exposicionesAnticipoActivas();
  const exclusivas = cronicas.filter(
    (c) => c.acceso === "mecenas" || c.acceso === "anticipo",
  );
  const exposicion = anticipo[0] ?? exclusivas[0] ?? cronicas[0];
  const creditos = await obtenerCreditosMecenas(48);
  const slugsAudioguia = new Set(recorridosConAudioguia());
  const slugsAudioguiaSalas = exhibicionesConAudioguia();
  const salasConAudioguia = slugsAudioguiaSalas
    .map((slug) => cronicas.find((c) => c.slug === slug))
    .filter((c): c is NonNullable<typeof c> => c !== undefined);
  const visitasPremium = recorridos.filter((r) => esRecorridoMecenas(r));

  const plan = planes[mecenas.plan];
  const vigenteHasta = mecenas.periodEnd
    ? mecenas.periodEnd.toLocaleDateString("es-AR", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : null;

  return (
    <div className="pb-28 pt-32">
      <header className="border-b border-linea-suave bg-fondo-2">
        <div className="mx-auto max-w-3xl px-5 py-20 text-center">
          <p className="kicker text-oro">Pasaporte de mecenas</p>
          <h1 className="titulo-display mt-4 text-4xl font-semibold sm:text-5xl">
            Tu visita al museo
          </h1>
          <p className="mx-auto mt-6 max-w-lg text-sm leading-relaxed text-tinta-suave">
            Gracias por sostener Argent. Tenés acceso anticipado a exposiciones
            temporales, salas privadas, visitas guiadas con audioguía y tu
            pasaporte de sellos.
          </p>
          <p className="mt-4 text-xs uppercase tracking-[0.25em] text-tinta-tenue">
            {plan.nombre}
            {vigenteHasta ? ` · vigente hasta el ${vigenteHasta}` : ""}
            {mecenas.esFundador ? " · fundador" : ""}
          </p>
        </div>
      </header>

      <div className="mx-auto max-w-3xl px-5">
        <OnboardingMecenas cronicaHref={`/cronicas/${exposicion.slug}`} />

        {anticipo.length > 0 && (
          <ExposicionesTemporales exposiciones={anticipo} esMecenas />
        )}

        <section className="mt-16">
          <p className="kicker">Exhibición sugerida</p>
          <TransicionLink
            href={`/cronicas/${exposicion.slug}`}
            className="group mt-6 block overflow-hidden rounded-sm border border-oro/30 bg-fondo-2"
          >
            <div
              className="relative px-8 py-14 sm:px-12 sm:py-20"
              style={{
                background:
                  "linear-gradient(165deg, #0a0e18 0%, #121826 45%, #1a2235 100%)",
              }}
            >
              <div className="filete mb-8 w-24 opacity-60" />
              <p className="text-[0.65rem] uppercase tracking-[0.25em] text-oro">
                {exposicion.acceso === "anticipo" ? "Anticipo · " : ""}
                {exposicion.kicker}
              </p>
              <h2 className="titulo-display mt-4 text-3xl font-semibold leading-tight transition-colors group-hover:text-oro-claro sm:text-4xl">
                {exposicion.titulo}
              </h2>
              <p className="mt-4 max-w-xl text-sm leading-relaxed text-tinta-suave">
                {exposicion.subtitulo}
              </p>
              <p className="mt-8 text-sm font-medium text-oro-claro transition-transform group-hover:translate-x-1">
                Entrar a la sala →
              </p>
            </div>
          </TransicionLink>
        </section>

        {salasConAudioguia.length > 0 && (
          <section className="mt-16">
            <p className="kicker">Audioguías en salas</p>
            <p className="mt-3 text-sm text-tinta-suave">
              Activá la guía al entrar a cada exhibición. El segmento cambia
              mientras recorrés los capítulos.
            </p>
            <ul className="mt-6 space-y-3">
              {salasConAudioguia.map((c) => (
                <li key={c.slug}>
                  <TransicionLink
                    href={`/cronicas/${c.slug}`}
                    className="flex items-center justify-between rounded-sm border border-linea bg-fondo-2 px-5 py-4 transition-colors hover:border-oro/40"
                  >
                    <span className="text-sm text-tinta-suave">{c.titulo}</span>
                    <span className="text-[0.6rem] uppercase tracking-[0.16em] text-oro">
                      Audioguía
                    </span>
                  </TransicionLink>
                </li>
              ))}
            </ul>
          </section>
        )}

        {visitasPremium.length > 0 && (
          <section className="mt-16">
            <p className="kicker">Visitas guiadas exclusivas</p>
            <p className="mt-3 text-sm text-tinta-suave">
              Tres recorridos con audioguía narrada. Activá la guía al iniciar
              cada visita.
            </p>
            <ul className="mt-6 space-y-3">
              {visitasPremium.map((r) => (
                <li key={r.slug}>
                  <TransicionLink
                    href={`/recorridos/${r.slug}`}
                    className="flex items-center justify-between rounded-sm border border-linea bg-fondo-2 px-5 py-4 transition-colors hover:border-oro/40"
                  >
                    <span className="text-sm text-tinta-suave">{r.titulo}</span>
                    {slugsAudioguia.has(r.slug) && (
                      <span className="text-[0.6rem] uppercase tracking-[0.16em] text-oro">
                        Audioguía
                      </span>
                    )}
                  </TransicionLink>
                </li>
              ))}
            </ul>
          </section>
        )}

        <section className="mt-16">
          <p className="kicker text-oro">{KICKER_COLECCION_PREMIUM}</p>
          <h2 className="titulo-display mt-3 text-2xl font-medium">
            {TITULO_COLECCION_PREMIUM}
          </h2>
          <p className="mt-3 text-sm text-tinta-suave">{DESCRIPCION_COLECCION_PREMIUM}</p>
          <div className="mt-8">
            <ColeccionPremium compacto />
          </div>
          <p className="mt-6 text-center">
            <Link
              href="/piezas#coleccion-mecenas"
              className="text-sm text-oro-claro underline-offset-4 hover:underline"
            >
              Ver la colección completa →
            </Link>
          </p>
        </section>

        {exclusivas.length > 1 && (
          <section className="mt-14">
            <p className="kicker">Más salas privadas</p>
            <ul className="mt-6 space-y-3">
              {exclusivas
                .filter((c) => c.slug !== exposicion.slug)
                .slice(0, 8)
                .map((c) => (
                  <li key={c.slug}>
                    <TransicionLink
                      href={`/cronicas/${c.slug}`}
                      className="block rounded-sm border border-linea bg-fondo-2 px-5 py-4 transition-colors hover:border-oro/40"
                    >
                      <span className="text-sm text-tinta-suave">{c.titulo}</span>
                      {c.acceso === "anticipo" && (
                        <span className="ml-2 text-[0.6rem] uppercase tracking-[0.14em] text-oro">
                          Anticipo
                        </span>
                      )}
                    </TransicionLink>
                  </li>
                ))}
            </ul>
          </section>
        )}

        <section className="mt-16">
          <SellosVisita titulo="Sellos que fuiste coleccionando" />
        </section>

        <section className="mt-16 grid gap-4 sm:grid-cols-2">
          <Link
            href="/lugares"
            className="rounded-sm border border-oro/40 bg-fondo-2 p-6 transition-colors hover:border-oro/60"
          >
            <p className="kicker text-oro">Mapa del museo</p>
            <p className="mt-2 text-sm text-tinta-suave">
              Todos los lugares históricos, con filtros por sala y época.
            </p>
          </Link>
          <Link
            href="/recorridos"
            className="rounded-sm border border-linea bg-fondo-2 p-6 transition-colors hover:border-oro/40"
          >
            <p className="kicker">Todas las visitas guiadas</p>
            <p className="mt-2 text-sm text-tinta-suave">
              Recorridos públicos y exclusivos para mecenas.
            </p>
          </Link>
          <Link
            href="/mecenas/carta"
            className="rounded-sm border border-linea bg-fondo-2 p-6 transition-colors hover:border-oro/40"
          >
            <p className="kicker">Carta del mes</p>
            <p className="mt-2 text-sm text-tinta-suave">
              Novedades del museo y mensaje del equipo de Argent.
            </p>
          </Link>
          {mecenas.esFundador && (
            <Link
              href="/mecenas/voto"
              className="rounded-sm border border-oro/30 bg-fondo-2 p-6 transition-colors hover:border-oro/50"
            >
              <p className="kicker text-oro">Votá la próxima exhibición</p>
              <p className="mt-2 text-sm text-tinta-suave">
                Elegí qué sala queremos abrir después.
              </p>
            </Link>
          )}
        </section>

        <section className="mt-16">
          <p className="kicker">Tu colección</p>
          <div className="mt-6">
            <ColeccionesGuardadas />
          </div>
        </section>

        <section className="mt-20 border-t border-linea-suave pt-16">
          <MuralMecenas creditos={creditos} />
        </section>

        <div className="mt-16 flex flex-wrap justify-center gap-4 border-t border-linea-suave pt-12">
          <form action="/api/auth/cerrar" method="POST">
            <button
              type="submit"
              className="rounded-full border border-linea px-5 py-2.5 text-sm text-tinta-tenue hover:text-tinta-suave"
            >
              Cerrar sesión
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
