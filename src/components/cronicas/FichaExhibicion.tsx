import Image from "next/image";
import { MiniSiluetaHero, gradientesHero } from "@/components/scrolly/HeroSiluetas";
import { TransicionLink } from "@/components/navigation/TransicionLink";
import type { CronicaMeta } from "@/content/cronicas/registro";
import { esExposicionAnticipo, exhibicionAbiertaAlPublico } from "@/lib/cronicas/acceso";
import { obtenerImagenCronica } from "@/data/cronicas-imagenes";
import { tierDeCronica, etiquetaTier } from "@/content/cronicas/tiers";
import { tieneAudioguia } from "@/data/audioguias-salas";
import { nombreTransicionExhibicion } from "@/lib/view-transitions";

type Props = {
  cronica: CronicaMeta;
  esMecenas?: boolean;
  /** Cartel vertical (catálogo) o horizontal (destacada). */
  variante?: "vertical" | "destacada";
};

function duracionVisita(duracion: string): string {
  const min = parseInt(duracion, 10);
  if (Number.isNaN(min)) return duracion;
  if (min <= 8) return "Visita breve";
  if (min <= 15) return "Visita media";
  return "Visita completa";
}

export function FichaExhibicion({
  cronica,
  esMecenas = false,
  variante = "vertical",
}: Props) {
  const exclusiva = cronica.acceso !== "publico";
  const anticipo = esExposicionAnticipo(cronica) && !exhibicionAbiertaAlPublico(cronica);
  const imagen = cronica.visual.imagenHero
    ? obtenerImagenCronica(cronica.visual.imagenHero)
    : undefined;
  const varianteHero = cronica.visual.varianteHero;
  const tier = tierDeCronica(cronica.slug);
  const conAudioguia = tieneAudioguia(cronica.slug);
  const vtName = nombreTransicionExhibicion(cronica.slug);

  if (variante === "destacada") {
    return (
      <TransicionLink
        href={`/cronicas/${cronica.slug}`}
        className={`group relative block overflow-hidden rounded-sm border transition-colors ${
          exclusiva ? "border-oro/35 hover:border-oro/55" : "border-linea hover:border-oro/40"
        }`}
      >
        <div
          className="relative px-8 py-20 sm:px-14 sm:py-28"
          style={{ background: gradientesHero[varianteHero], viewTransitionName: vtName }}
        >
          {imagen && (
            <div className="absolute inset-0 opacity-30">
              <Image
                src={imagen.url}
                alt=""
                fill
                unoptimized
                sizes="(max-width: 768px) 100vw, 1200px"
                className="object-cover sepia-[0.35]"
                aria-hidden
              />
              <div className="absolute inset-0 bg-gradient-to-t from-fondo via-fondo/50 to-fondo/30" />
            </div>
          )}
          {!imagen && <MiniSiluetaHero variante={varianteHero} />}
          <div className="relative">
            <p className="kicker">
              {cronica.numero != null && (
                <span className="mr-2 text-oro">Exhibición {cronica.numero}</span>
              )}
              {cronica.kicker}
            </p>
            <h3 className="titulo-display mt-4 max-w-2xl text-4xl font-semibold leading-tight transition-colors group-hover:text-oro-claro sm:text-6xl">
              {cronica.titulo}
            </h3>
            <p className="mt-5 max-w-xl leading-relaxed text-tinta-suave">{cronica.subtitulo}</p>
            <p className="mt-8 inline-block rounded-full bg-oro px-7 py-3.5 text-sm font-semibold text-fondo transition-colors group-hover:bg-oro-claro">
              Entrar a la sala →
            </p>
          </div>
        </div>
      </TransicionLink>
    );
  }

  return (
    <TransicionLink
      href={`/cronicas/${cronica.slug}`}
      className={`group flex h-full flex-col overflow-hidden rounded-sm border transition-colors ${
        exclusiva ? "border-oro/30 hover:border-oro/55" : "border-linea hover:border-oro/40"
      }`}
    >
      <div
        className="relative aspect-[3/4] overflow-hidden sm:aspect-[4/5]"
        style={{ background: gradientesHero[varianteHero], viewTransitionName: vtName }}
      >
        {imagen ? (
          <Image
            src={imagen.url}
            alt={imagen.alt}
            fill
            unoptimized
            sizes="(max-width: 768px) 50vw, 320px"
            className="object-cover opacity-60 sepia-[0.35] transition-transform duration-700 group-hover:scale-[1.04]"
          />
        ) : (
          <MiniSiluetaHero variante={varianteHero} />
        )}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-fondo via-fondo/20 to-transparent"
        />
        {cronica.numero != null && (
          <span className="absolute left-3 top-3 text-[0.6rem] uppercase tracking-[0.22em] text-oro-claro">
            {cronica.numero}
          </span>
        )}
        {(anticipo || exclusiva) && (
          <span className="absolute right-3 top-3 rounded-full border border-oro/40 bg-fondo/80 px-2.5 py-0.5 text-[0.6rem] uppercase tracking-[0.18em] text-oro backdrop-blur-sm">
            {anticipo ? "Anticipo" : "Mecenas"}
          </span>
        )}
        {conAudioguia && !anticipo && !exclusiva && (
          <span className="absolute right-3 top-3 rounded-full border border-oro/40 bg-fondo/80 px-2.5 py-0.5 text-[0.6rem] uppercase tracking-[0.18em] text-oro backdrop-blur-sm">
            Audioguía
          </span>
        )}
        {conAudioguia && (anticipo || exclusiva) && (
          <span className="absolute right-3 top-10 rounded-full border border-oro/30 bg-fondo/80 px-2.5 py-0.5 text-[0.6rem] uppercase tracking-[0.18em] text-oro-claro backdrop-blur-sm">
            Audioguía
          </span>
        )}
        <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5">
          <p className="text-[0.6rem] uppercase tracking-[0.2em] text-tinta-tenue">
            {cronica.kicker}
          </p>
          <h3 className="titulo-display mt-1.5 text-xl font-semibold leading-snug transition-colors group-hover:text-oro-claro sm:text-2xl">
            {cronica.titulo}
          </h3>
        </div>
      </div>
      <div className="flex flex-1 flex-col bg-fondo-2 px-4 py-4 sm:px-5 sm:py-5">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[0.6rem] uppercase tracking-[0.16em] text-tinta-tenue">
          <span>{cronica.periodo}</span>
          <span aria-hidden>·</span>
          <span>{duracionVisita(cronica.duracion)}</span>
          <span aria-hidden>·</span>
          <span>{etiquetaTier(tier)}</span>
        </div>
        <p className="mt-4 text-[0.65rem] uppercase tracking-[0.18em] text-oro transition-transform duration-300 group-hover:translate-x-1">
          {exclusiva
            ? esMecenas
              ? anticipo
                ? "Anticipo →"
                : "Entrar →"
              : anticipo
                ? "Próximamente · Mecenas ya →"
                : "Sala privada →"
            : "Entrar a la sala →"}
        </p>
      </div>
    </TransicionLink>
  );
}
