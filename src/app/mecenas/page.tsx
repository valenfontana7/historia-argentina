import Link from "next/link";
import { redirect } from "next/navigation";
import { EstadoMecenas } from "@prisma/client";
import { ColeccionesGuardadas } from "@/components/mecenas/ColeccionesGuardadas";
import { obtenerMecenasActivo, obtenerSesion } from "@/lib/auth";
import { cronicas } from "@/content/cronicas/registro";
import { planes } from "@/lib/membresia.config";
import { prisma } from "@/lib/db";

export const metadata = {
  title: "Tu museo — Mecenas",
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
  const exposicion = exclusivas[0] ?? cronicas[0];
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
    <div className="pb-28 pt-32">
      <header className="border-b border-linea-suave bg-fondo-2">
        <div className="mx-auto max-w-3xl px-5 py-20 text-center">
          <p className="kicker text-oro">Sala del mecenas</p>
          <h1 className="titulo-display mt-4 text-4xl font-semibold sm:text-5xl">
            Tu museo personal
          </h1>
          <p className="mx-auto mt-6 max-w-lg text-sm leading-relaxed text-tinta-suave">
            Gracias por sostener Argent. Esta sala reúne lo que solo vos podés
            abrir: crónicas exclusivas, el mapa completo y las rutas reservadas
            del archivo.
          </p>
          <p className="mt-4 text-xs uppercase tracking-[0.25em] text-tinta-tenue">
            {plan.nombre}
            {vigenteHasta ? ` · vigente hasta el ${vigenteHasta}` : ""}
            {mecenas.esFundador ? " · fundador" : ""}
          </p>
        </div>
      </header>

      <div className="mx-auto max-w-3xl px-5">
        <section className="mt-16">
          <p className="kicker">Exposición del mes</p>
          <Link
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
          </Link>
        </section>

        {exclusivas.length > 1 && (
          <section className="mt-14">
            <p className="kicker">Más exclusivas</p>
            <ul className="mt-6 space-y-3">
              {exclusivas.slice(1).map((c) => (
                <li key={c.slug}>
                  <Link
                    href={`/cronicas/${c.slug}`}
                    className="block rounded-sm border border-linea bg-fondo-2 px-5 py-4 transition-colors hover:border-oro/40"
                  >
                    <span className="text-sm text-tinta-suave">{c.titulo}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        <section className="mt-16 grid gap-4 sm:grid-cols-2">
          <Link
            href="/mecenas/mapa"
            className="rounded-sm border border-oro/40 bg-fondo-2 p-6 transition-colors hover:border-oro/60"
          >
            <p className="kicker text-oro">Mapa histórico</p>
            <p className="mt-2 text-sm text-tinta-suave">
              Todos los lugares del archivo, filtros por época y navegación
              interactiva.
            </p>
          </Link>
          <Link
            href="/recorridos"
            className="rounded-sm border border-linea bg-fondo-2 p-6 transition-colors hover:border-oro/40"
          >
            <p className="kicker">Recorridos premium</p>
            <p className="mt-2 text-sm text-tinta-suave">
              Rutas curatoriales reservadas para mecenas.
            </p>
          </Link>
          <Link
            href="/mecenas/carta"
            className="rounded-sm border border-linea bg-fondo-2 p-6 transition-colors hover:border-oro/40"
          >
            <p className="kicker">Carta editorial</p>
            <p className="mt-2 text-sm text-tinta-suave">
              Novedades del mes y pipeline de crónicas.
            </p>
          </Link>
          {mecenas.esFundador && (
            <Link
              href="/mecenas/voto"
              className="rounded-sm border border-oro/30 bg-fondo-2 p-6 transition-colors hover:border-oro/50"
            >
              <p className="kicker text-oro">Voto fundador</p>
              <p className="mt-2 text-sm text-tinta-suave">
                Elegí qué crónica producimos después.
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
          <p className="kicker text-center">Mural de mecenas</p>
          <h2 className="titulo-display mt-4 text-center text-2xl font-semibold">
            Quienes sostienen Argent
          </h2>
          <ul className="mt-10 flex flex-wrap justify-center gap-2">
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
