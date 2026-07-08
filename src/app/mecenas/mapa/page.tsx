import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { MapaExploratorio } from "@/components/exploracion/MapaExploratorio";
import { obtenerMecenasActivo, obtenerSesion } from "@/lib/auth";
import { lugares } from "@/data/lugares";

export const metadata: Metadata = {
  title: "Mapa histórico — Mecenas",
  robots: { index: false },
};

export const dynamic = "force-dynamic";

export default async function MecenasMapaPage() {
  const sesion = await obtenerSesion();
  if (!sesion) redirect("/membresia/acceder?next=/mecenas/mapa");

  const mecenas = await obtenerMecenasActivo();
  if (!mecenas) redirect("/membresia/acceder?next=/mecenas/mapa");

  return (
    <div className="mx-auto max-w-4xl px-5 pb-28 pt-32">
      <p className="kicker">Experiencia Mecenas</p>
      <h1 className="titulo-display mt-3 text-4xl font-semibold">Mapa histórico</h1>
      <p className="mt-4 max-w-xl text-tinta-suave">
        Mapa completo con filtros por época. Cada punto conecta con fichas de
        personajes, eventos y relaciones del grafo.
      </p>
      <div className="mt-10">
        <MapaExploratorio lugares={lugares} completo />
      </div>
      <p className="mt-8">
        <Link href="/mecenas" className="text-sm text-oro-claro hover:text-oro">
          ← Volver al área de mecenas
        </Link>
      </p>
    </div>
  );
}
