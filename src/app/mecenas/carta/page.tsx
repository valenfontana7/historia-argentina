import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Reveal } from "@/components/ui/Reveal";
import { obtenerMecenasActivo, obtenerSesion } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Carta del mecenas — Julio 2026",
  robots: { index: false },
};

export const dynamic = "force-dynamic";

export default async function CartaMecenasPage() {
  const sesion = await obtenerSesion();
  if (!sesion) redirect("/membresia/acceder?next=/mecenas/carta");

  const mecenas = await obtenerMecenasActivo();
  if (!mecenas) redirect("/membresia/acceder?next=/mecenas/carta");

  return (
    <article className="mx-auto max-w-2xl px-5 pb-28 pt-32">
      <p className="kicker">Carta del mecenas · Julio 2026</p>
      <h1 className="titulo-display mt-4 text-4xl font-semibold">
        Tu museo personal
      </h1>
      <Reveal className="mt-10">
        <div className="prosa capitular border border-linea bg-fondo-2 p-8 sm:p-10">
          <p>
            Gracias por sostener Argent. Este mes estrenamos la capa de exploración:
            lugares, períodos, categorías y un grafo que conecta personajes con
            eventos y crónicas.
          </p>
          <p>
            Tu membresía no desbloquea más contenido: desbloquea una forma distinta
            de recorrerlo. El mapa histórico, las colecciones guardadas y esta carta
            mensual son parte de esa experiencia.
          </p>
          <p>
            Próximamente: timeline avanzada con filtros, narraciones de audio en
            crónicas selectas y comparadores de siglos. Si sos fundador, tu voto
            sobre la próxima crónica llegará antes que a nadie.
          </p>
          <p className="text-oro-claro">— El equipo de Argent</p>
        </div>
      </Reveal>
      <div className="mt-10 flex flex-wrap gap-4">
        <Link
          href="/explorar"
          className="rounded-full border border-oro/50 px-6 py-3 text-sm text-oro-claro hover:bg-oro/10"
        >
          Explorar el museo →
        </Link>
        <Link href="/mecenas" className="text-sm text-tinta-suave hover:text-oro-claro">
          ← Área de mecenas
        </Link>
      </div>
    </article>
  );
}
