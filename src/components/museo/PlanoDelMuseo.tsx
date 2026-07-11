import Link from "next/link";
import { TransicionLink } from "@/components/navigation/TransicionLink";
import { Reveal } from "@/components/ui/Reveal";
import { ORDEN_EPOCAS, conteoPorEpoca } from "@/lib/cronicas/indice";
import { periodos } from "@/data/periodos";
import { categorias } from "@/data/categorias";
import { nombreTransicionSala } from "@/lib/view-transitions";

const ESPACIOS_TRANSVERSALES = [
  {
    href: "/panteon",
    titulo: "Galería de retratos",
    desc: "El Panteón de personajes",
    kicker: "Retratos",
  },
  {
    href: "/lugares",
    titulo: "Sala de mapas",
    desc: "Geografía histórica de Argentina",
    kicker: "Territorio",
  },
  {
    href: "/timelines",
    titulo: "Pasillo del tiempo",
    desc: "Camina la historia año por año",
    kicker: "Cronología",
  },
  {
    href: "/piezas",
    titulo: "La colección",
    desc: "Grabados, pinturas y documentos",
    kicker: "Patrimonio",
  },
  {
    href: "/recorridos",
    titulo: "Visitas guiadas",
    desc: "Recorridos con hilo narrativo",
    kicker: "Itinerarios",
  },
  {
    href: "/cronicas",
    titulo: "Todas las exhibiciones",
    desc: "Catálogo completo del museo",
    kicker: "Índice",
  },
] as const;

export function PlanoDelMuseo() {
  const conteos = conteoPorEpoca();

  return (
    <>
      <section>
        <Reveal>
          <p className="kicker">Salas permanentes</p>
          <h2 className="titulo-display mt-4 text-3xl font-medium text-oro">
            El museo por épocas
          </h2>
        </Reveal>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {ORDEN_EPOCAS.map((epoca, i) => {
            const periodo = periodos.find((p) => p.slug === epoca);
            if (!periodo) return null;
            const count = conteos[epoca] ?? 0;
            if (count === 0) return null;

            return (
              <Reveal key={epoca} delay={i * 0.05}>
                <TransicionLink
                  href={`/periodos/${epoca}`}
                  className="group block rounded-sm border border-linea bg-fondo-2 p-6 transition-colors hover:border-oro/45"
                  style={{ viewTransitionName: nombreTransicionSala(epoca) }}
                >
                  <p className="text-[0.6rem] uppercase tracking-[0.2em] text-tinta-tenue">
                    {periodo.anioInicio}–{periodo.anioFin ?? "hoy"}
                  </p>
                  <h3 className="titulo-display mt-2 text-xl font-semibold transition-colors group-hover:text-oro-claro">
                    {periodo.nombre}
                  </h3>
                  <p className="mt-2 line-clamp-2 text-sm text-tinta-tenue">
                    {periodo.descripcion}
                  </p>
                  <p className="mt-4 text-[0.65rem] uppercase tracking-[0.16em] text-oro">
                    {count} exhibiciones · Entrar →
                  </p>
                </TransicionLink>
              </Reveal>
            );
          })}
        </div>
      </section>

      <section className="mt-20">
        <Reveal>
          <p className="kicker">Espacios transversales</p>
          <h2 className="titulo-display mt-4 text-2xl font-medium text-oro">
            Más allá de las salas
          </h2>
        </Reveal>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {ESPACIOS_TRANSVERSALES.map((espacio, i) => (
            <Reveal key={espacio.href} delay={i * 0.04}>
              <Link
                href={espacio.href}
                className="group block rounded-sm border border-linea bg-fondo-2 p-6 transition-colors hover:border-oro/40"
              >
                <p className="text-[0.6rem] uppercase tracking-[0.2em] text-oro">
                  {espacio.kicker}
                </p>
                <h3 className="titulo-display mt-2 text-lg font-medium group-hover:text-oro-claro">
                  {espacio.titulo}
                </h3>
                <p className="mt-2 text-sm text-tinta-tenue">{espacio.desc}</p>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="mt-20">
        <Reveal>
          <p className="kicker">Colecciones temáticas</p>
          <h2 className="titulo-display mt-4 text-2xl font-medium text-oro">
            Por tema
          </h2>
        </Reveal>
        <div className="mt-6 flex flex-wrap gap-3">
          {categorias.map((c) => (
            <Link
              key={c.slug}
              href={`/categorias/${c.slug}`}
              className="rounded-full border border-linea px-5 py-2.5 text-sm text-tinta-suave transition-colors hover:border-oro/50 hover:text-oro-claro"
            >
              {c.nombre}
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
