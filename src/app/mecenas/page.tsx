import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { EstadoMecenas } from "@prisma/client";
import { obtenerMecenasActivo, obtenerSesion } from "@/lib/auth";
import { cronicas } from "@/content/cronicas/registro";
import { planes } from "@/lib/membresia.config";
import { prisma } from "@/lib/db";

export const metadata: Metadata = {
  title: "Área de mecenas",
  robots: { index: false },
};

export const dynamic = "force-dynamic";

export default async function MecenasPage() {
  const sesion = await obtenerSesion();
  if (!sesion) redirect("/membresia/acceder?next=/mecenas");

  const mecenas = await obtenerMecenasActivo();
  if (!mecenas) redirect("/membresia/acceder?next=/mecenas");

  const exclusivas = cronicas.filter((c) => c.acceso === "mecenas" || c.acceso === "anticipo");
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
    <div className="mx-auto max-w-3xl px-5 py-28">
      <p className="kicker">Tu membresía</p>
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
        <h2 className="titulo-display text-2xl font-semibold">Exclusivas</h2>
        <div className="mt-6 space-y-4">
          {exclusivas.map((c) => (
            <Link
              key={c.slug}
              href={`/cronicas/${c.slug}`}
              className="block rounded-sm border border-linea bg-fondo-2 p-6 transition-colors hover:border-oro/40"
            >
              <p className="text-[0.65rem] uppercase tracking-[0.2em] text-oro">{c.kicker}</p>
              <h3 className="titulo-display mt-2 text-xl font-semibold">{c.titulo}</h3>
              <p className="mt-2 text-sm text-tinta-suave">{c.subtitulo}</p>
            </Link>
          ))}
          {exclusivas.length === 0 && (
            <p className="text-sm text-tinta-suave">Pronto publicamos la primera exclusiva.</p>
          )}
        </div>
      </section>

      <section className="mt-14">
        <h2 className="titulo-display text-2xl font-semibold">Mecenas que sostienen Argenta</h2>
        <p className="mt-2 text-sm text-tinta-suave">
          Quienes eligieron aparecer en los créditos públicos.
        </p>
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
          {creditos.length === 0 && (
            <li className="text-sm text-tinta-tenue">Todavía no hay créditos públicos.</li>
          )}
        </ul>
      </section>

      <div className="mt-16 flex flex-wrap gap-4">
        <Link
          href="/cronicas"
          className="rounded-full border border-linea px-5 py-2.5 text-sm text-tinta-suave hover:border-oro/40 hover:text-oro-claro"
        >
          Ver todas las crónicas
        </Link>
        <Link
          href="/api/auth/cerrar"
          className="rounded-full border border-linea px-5 py-2.5 text-sm text-tinta-tenue hover:text-tinta-suave"
        >
          Cerrar sesión
        </Link>
      </div>
    </div>
  );
}
