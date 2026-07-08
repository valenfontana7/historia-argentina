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
            Gracias por sostener Argent. Este mes consolidamos lo que Mecenas
            desbloquea hoy: mapa histórico completo con filtros por época, dos
            recorridos premium y la carta que estás leyendo.
          </p>
          <p>
            El museo público sigue abierto — panteón, lugares, cinco recorridos
            base y el archivo de efemérides. Tu membresía agrega profundidad
            narrativa: crónicas exclusivas, rutas curatoriales reservadas y
            herramientas de exploración sin distracciones.
          </p>
          <p>
            Hoy el archivo tiene 2 crónicas públicas y 2 exclusivas para
            mecenas. El pipeline editorial apunta a una pieza nueva cada 6–8
            semanas — sin prometer un volumen que todavía no existe.
          </p>
          <p>
            En el roadmap de fundadores: audio en piezas selectas, ampliación del
            calendario de efemérides y tu voto sobre la próxima crónica en{" "}
            <Link href="/mecenas/voto" className="text-oro-claro hover:text-oro">
              /mecenas/voto
            </Link>
            .
          </p>
          <p className="text-oro-claro">— El equipo de Argent</p>
        </div>
      </Reveal>
      <div className="mt-10 flex flex-wrap gap-4">
        <Link
          href="/mecenas/mapa"
          className="rounded-full border border-oro/50 px-6 py-3 text-sm text-oro-claro hover:bg-oro/10"
        >
          Abrir el mapa completo →
        </Link>
        <Link href="/mecenas" className="text-sm text-tinta-suave hover:text-oro-claro">
          ← Área de mecenas
        </Link>
      </div>
    </article>
  );
}
