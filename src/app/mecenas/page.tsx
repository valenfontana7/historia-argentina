import Link from "next/link";
import { redirect } from "next/navigation";
import { EstadoMecenas } from "@prisma/client";
import { ColeccionesGuardadas } from "@/components/mecenas/ColeccionesGuardadas";
import { MapaHistorico } from "@/components/mecenas/MapaHistorico";
import { obtenerMecenasActivo, obtenerSesion } from "@/lib/auth";
import { cronicas } from "@/content/cronicas/registro";
import { planes } from "@/lib/membresia.config";
import { prisma } from "@/lib/db";

export const metadata = {
  title: "Área de mecenas",
  robots: { index: false },
};

export const dynamic = "force-dynamic";

export default async function MecenasPage() {
  const sesion = await obtenerSesion();
  if (!sesion) redirect("/membresia/acceder?next=/mecenas");

  const mecenas = await obtenerMecenasActivo();
  if (!mecenas) redirect("/membresia/acceder?next=/mecenas");

  const exclusivas = cronicas.filter(
    (c) => c.acceso === "mecenas" || c.acceso === "anticipo",
  );
  const creditos = await prisma.mecenas.findMany({
    where: { estado: EstadoMecenas.activo, mostrarCredito: true },
    orderBy: [{ esFundador: "desc" }, { createdAt: "asc" }],
    take: 48,
    select: { email: true, nombrePublico: true, esFundador: true },
  });

  const plan = planes[mecenas.plan];
  const vigenteHasta = mecenas.periodEnd
    ? mecenas.periodEnd.toLocaleDateString("es-AR", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : null;

  return (
    <div className="mx-auto max-w-3xl px-5 pb-28 pt-32">
      <p className="kicker">Tu museo personal</p>
      <h1 className="titulo-display mt-3 text-4xl font-semibold sm:text-5xl">
        Hola, mecenas
      </h1>
      <p className="mt-4 text-tinta-suave">
        Plan <span className="text-oro-claro">{plan.nombre}</span>
        {vigenteHasta ? ` · activo hasta el ${vigenteHasta}` : ""}
        {mecenas.esFundador ? " · fundador" : ""}
      </p>
      <p className="mt-2 text-sm text-tinta-tenue">{mecenas.email}</p>

      <section className="mt-14">
        <h2 className="titulo-display text-2xl font-semibold">Tu experiencia</h2>
        <p className="mt-2 text-sm text-tinta-suave">
          Mecenas desbloquea cómo explorás, no qué leés.
        </p>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <Link
            href="/mecenas/mapa"
            className="rounded-sm border border-oro/30 bg-fondo-2 p-5 transition-colors hover:border-oro/50"
          >
            <p className="kicker text-oro">Mapa histórico</p>
            <p className="mt-2 text-sm text-tinta-suave">
              Lugares clave del relato, navegables e interactivos.
            </p>
          </Link>
          <Link
            href="/mecenas/carta"
            className="rounded-sm border border-linea bg-fondo-2 p-5 transition-colors hover:border-oro/40"
          >
            <p className="kicker">Carta del mecenas</p>
            <p className="mt-2 text-sm text-tinta-suave">
              Novedades, roadmap y contexto editorial del mes.
            </p>
          </Link>
          <Link
            href="/explorar"
            className="rounded-sm border border-linea bg-fondo-2 p-5 transition-colors hover:border-oro/40"
          >
            <p className="kicker">Explorar</p>
            <p className="mt-2 text-sm text-tinta-suave">
              Hub de descubrimiento con timeline y categorías.
            </p>
          </Link>
          <Link
            href="/timelines"
            className="rounded-sm border border-linea bg-fondo-2 p-5 transition-colors hover:border-oro/40"
          >
            <p className="kicker text-oro">Timeline avanzada</p>
            <p className="mt-2 text-sm text-tinta-suave">
              Compará años, filtrá por categoría y explorá rangos completos.
            </p>
          </Link>
        </div>
      </section>

      <section className="mt-14">
        <h2 className="titulo-display text-2xl font-semibold">Tu colección</h2>
        <ColeccionesGuardadas />
      </section>

      <section className="mt-14">
        <h2 className="titulo-display text-2xl font-semibold">Exclusivas</h2>
        <div className="mt-6 space-y-4">
          {exclusivas.map((c) => (
            <Link
              key={c.slug}
              href={`/cronicas/${c.slug}`}
              className="block rounded-sm border border-linea bg-fondo-2 p-6 transition-colors hover:border-oro/40"
            >
              <p className="text-[0.65rem] uppercase tracking-[0.2em] text-oro">
                {c.kicker}
              </p>
              <h3 className="titulo-display mt-2 text-xl font-semibold">
                {c.titulo}
              </h3>
              <p className="mt-2 text-sm text-tinta-suave">{c.subtitulo}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-14">
        <h2 className="titulo-display text-2xl font-semibold">
          Mecenas que sostienen Argent
        </h2>
        <ul className="mt-6 flex flex-wrap gap-2">
          {creditos.map((c) => {
            const label =
              c.nombrePublico?.trim() ||
              c.email.split("@")[0]?.replace(/[._]/g, " ") ||
              "Mecenas";
            return (
              <li
                key={c.email}
                className={`rounded-full border px-3 py-1 text-xs capitalize ${
                  c.esFundador
                    ? "border-oro/40 text-oro-claro"
                    : "border-linea text-tinta-suave"
                }`}
              >
                {label}
                {c.esFundador ? " · fundador" : ""}
              </li>
            );
          })}
        </ul>
      </section>

      <div className="mt-16 flex flex-wrap gap-4">
        <Link
          href="/cronicas"
          className="rounded-full border border-linea px-5 py-2.5 text-sm text-tinta-suave hover:border-oro/40 hover:text-oro-claro"
        >
          Ver todas las crónicas
        </Link>
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
  );
}
