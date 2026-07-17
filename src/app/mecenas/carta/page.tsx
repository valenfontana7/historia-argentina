import type { Metadata } from "next";
import Link from "next/link";
import { EtiquetaCta } from "@/components/ui/FlechaCta";
import { redirect } from "next/navigation";
import { Reveal } from "@/components/ui/Reveal";
import { obtenerMecenasActivo, obtenerSesion } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Carta del mecenas: Julio 2026",
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
        Gracias por estar acá
      </h1>
      <Reveal className="mt-10">
        <div className="prosa capitular border border-linea bg-fondo-2 p-8 sm:p-10">
          <p>
            Gracias por sostener Argent. Con tu membresía tenés el mapa histórico
            completo, salas privadas exclusivas, visitas guiadas especiales con
            audioguía y la colección de piezas comentadas.
          </p>
          <p>
            El resto del museo sigue abierto para todos: el Panteón, lugares,
            visitas guiadas gratuitas y la pieza del día. Tu aporte suma salas
            privadas y herramientas extra para explorar.
          </p>
          <p>
            Seguimos abriendo exhibiciones nuevas; cuando haya una lista, la vas
            a ver acá primero.
          </p>
          {mecenas.esFundador && (
            <p>
              Como fundador, podés{" "}
              <Link href="/mecenas/voto" className="text-oro-claro hover:text-oro">
                votar qué exhibición abrimos después
              </Link>
              .
            </p>
          )}
          <p className="text-oro-claro">El equipo de Argent</p>
        </div>
      </Reveal>
      <div className="mt-10 flex flex-wrap gap-4">
        <Link
          href="/lugares"
          className="group rounded-full border border-oro/50 px-6 py-3 text-sm text-oro-claro hover:bg-oro/10"
        >
          <EtiquetaCta>Abrir el mapa completo</EtiquetaCta>
        </Link>
        <Link href="/mecenas" className="group text-sm text-tinta-suave hover:text-oro-claro">
          <EtiquetaCta>← Tu museo</EtiquetaCta>
        </Link>
      </div>
    </article>
  );
}
