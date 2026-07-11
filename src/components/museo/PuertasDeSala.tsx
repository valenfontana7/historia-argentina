import Link from "next/link";
import { TransicionLink } from "@/components/navigation/TransicionLink";
import { Reveal } from "@/components/ui/Reveal";
import { ORDEN_EPOCAS, conteoPorEpoca } from "@/lib/cronicas/indice";
import { periodos } from "@/data/periodos";
import { nombreTransicionSala } from "@/lib/view-transitions";

const SILUETAS_EPOCA: Record<string, string> = {
  colonia: "1516–1810",
  independencia: "1810–1829",
  organizacion: "1829–1880",
  moderna: "1880–1946",
  contemporanea: "1946–hoy",
};

export function PuertasDeSala() {
  const conteos = conteoPorEpoca();

  return (
    <section className="border-y border-linea-suave bg-fondo-2">
      <div className="mx-auto max-w-6xl px-5 py-20">
        <Reveal>
          <p className="kicker">Plano del museo</p>
          <h2 className="titulo-display mt-4 text-3xl font-medium text-oro sm:text-4xl">
            Las salas permanentes
          </h2>
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-tinta-suave">
            Cada época tiene su sala. Elegí por dónde empezar tu visita.
          </p>
        </Reveal>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {ORDEN_EPOCAS.map((epoca, i) => {
            const periodo = periodos.find((p) => p.slug === epoca);
            if (!periodo) return null;
            const count = conteos[epoca] ?? 0;
            if (count === 0) return null;

            return (
              <Reveal key={epoca} delay={i * 0.06}>
                <TransicionLink
                  href={`/periodos/${epoca}`}
                  className="group relative flex min-h-[220px] flex-col justify-end overflow-hidden rounded-sm border border-linea p-6 transition-colors hover:border-oro/45 sm:min-h-[260px]"
                  style={{ viewTransitionName: nombreTransicionSala(epoca) }}
                >
                  <div
                    aria-hidden
                    className="absolute inset-0 bg-gradient-to-br from-fondo-3 via-fondo-2 to-fondo opacity-90 transition-opacity group-hover:opacity-80"
                  />
                  <div
                    aria-hidden
                    className="absolute right-4 top-4 titulo-display text-5xl font-semibold text-oro/10 transition-colors group-hover:text-oro/20"
                  >
                    {SILUETAS_EPOCA[epoca]?.split("–")[0]}
                  </div>
                  <div className="relative">
                    <p className="text-[0.6rem] uppercase tracking-[0.22em] text-tinta-tenue">
                      {SILUETAS_EPOCA[epoca]}
                    </p>
                    <h3 className="titulo-display mt-2 text-2xl font-semibold transition-colors group-hover:text-oro-claro">
                      {periodo.nombre}
                    </h3>
                    <p className="mt-2 line-clamp-2 text-sm text-tinta-tenue">
                      {periodo.descripcion}
                    </p>
                    <p className="mt-4 text-[0.65rem] uppercase tracking-[0.18em] text-oro">
                      {count} {count === 1 ? "exhibición" : "exhibiciones"} · Entrar →
                    </p>
                  </div>
                </TransicionLink>
              </Reveal>
            );
          })}
        </div>

        <Reveal className="mt-10 text-center">
          <Link
            href="/explorar"
            className="text-sm text-oro-claro underline-offset-4 transition-colors hover:underline"
          >
            Ver el plano completo del museo →
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
