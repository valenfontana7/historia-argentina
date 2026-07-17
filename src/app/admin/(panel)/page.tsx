import Link from "next/link";
import { EstadoMecenas } from "@prisma/client";
import { prisma } from "@/lib/db";
import { requireAdminSesion } from "@/lib/admin-auth";
import { contarCortesiasActivas } from "@/lib/mecenas-admin";
import { formatearPrecio, planes } from "@/lib/membresia.config";
import { getMembresiaSettings } from "@/lib/membresia-settings";
import { sitio } from "@/lib/site.config";

export default async function AdminDashboardPage() {
  await requireAdminSesion();

  const [settings, mecenasActivos, mecenasPendientes, mecenasInactivos, suscriptores, cortesiasActivas] =
    await Promise.all([
      getMembresiaSettings(),
      prisma.mecenas.count({ where: { estado: EstadoMecenas.activo } }),
      prisma.mecenas.count({ where: { estado: EstadoMecenas.pendiente } }),
      prisma.mecenas.count({
        where: {
          estado: { in: [EstadoMecenas.cancelado, EstadoMecenas.vencido] },
        },
      }),
      prisma.suscriptor.count(),
      contarCortesiasActivas(),
    ]);

  return (
    <div className="space-y-10">
      <div>
        <h1 className="titulo-display text-3xl font-semibold">Panel de admin</h1>
        <p className="mt-2 text-sm text-tinta-suave">
          Resumen de Argent: membresía, boletín y estado de planes.
        </p>
      </div>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <StatCard titulo="Mecenas activos" valor={mecenasActivos} />
        <StatCard titulo="Cortesías activas" valor={cortesiasActivas} />
        <StatCard titulo="Pagos pendientes" valor={mecenasPendientes} />
        <StatCard titulo="Cancelados / vencidos" valor={mecenasInactivos} />
        <StatCard titulo="Suscriptores boletín" valor={suscriptores} />
      </section>

      <section className="rounded-sm border border-linea bg-fondo-2 p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="titulo-display text-xl font-semibold">Personas Mecenas</h2>
            <p className="mt-2 text-sm text-tinta-suave">
              Alta manual, cortesías y control de vencimientos.
            </p>
          </div>
          <Link
            href="/admin/mecenas/personas"
            className="inline-flex min-h-11 w-full items-center justify-center rounded-full border border-oro/50 px-5 text-sm font-semibold text-oro-claro transition-colors hover:bg-oro/10 sm:w-auto"
          >
            Ver personas
          </Link>
        </div>
      </section>

      <section className="rounded-sm border border-linea bg-fondo-2 p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="titulo-display text-xl font-semibold">Video / Reels</h2>
            <p className="mt-2 text-sm text-tinta-suave">
              Generá MP4 verticales desde exhibiciones (FFmpeg).
            </p>
          </div>
          <Link
            href="/admin/video"
            className="inline-flex min-h-11 w-full items-center justify-center rounded-full border border-oro/50 px-5 text-sm font-semibold text-oro-claro transition-colors hover:bg-oro/10 sm:w-auto"
          >
            Abrir generador
          </Link>
        </div>
      </section>

      <section className="rounded-sm border border-linea bg-fondo-2 p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="titulo-display text-xl font-semibold">Carousel</h2>
            <p className="mt-2 text-sm text-tinta-suave">
              Carruseles PNG editoriales (Playwright + Museum Classic).
            </p>
          </div>
          <Link
            href="/admin/carousel"
            className="inline-flex min-h-11 w-full items-center justify-center rounded-full border border-oro/50 px-5 text-sm font-semibold text-oro-claro transition-colors hover:bg-oro/10 sm:w-auto"
          >
            Abrir carousel
          </Link>
        </div>
      </section>

      <section className="rounded-sm border border-linea bg-fondo-2 p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="titulo-display text-xl font-semibold">Planes Mecenas</h2>
            <p className="mt-2 text-sm text-tinta-suave">
              Lo que ven los visitantes en{" "}
              <Link href="/membresia" className="text-oro-claro hover:underline">
                /membresia
              </Link>
            </p>
          </div>
          <Link
            href="/admin/mecenas"
            className="inline-flex min-h-11 w-full items-center justify-center rounded-full border border-oro/50 px-5 text-sm font-semibold text-oro-claro transition-colors hover:bg-oro/10 sm:w-auto"
          >
            Gestionar planes
          </Link>
        </div>
        <ul className="mt-6 space-y-3 text-sm">
          <PlanEstado
            nombre={planes.mensual.nombre}
            habilitado={settings.mensualHabilitado}
            precio={formatearPrecio(settings.precioMensual)}
            periodo={planes.mensual.periodo}
          />
          <PlanEstado
            nombre={planes.fundador.nombre}
            habilitado={settings.fundadorHabilitado}
            precio={formatearPrecio(settings.precioFundador)}
            periodo={planes.fundador.periodo}
          />
        </ul>
      </section>

      <section className="rounded-sm border border-linea bg-fondo-2 p-6">
        <h2 className="titulo-display text-xl font-semibold">Accesos rápidos</h2>
        <ul className="mt-4 flex flex-wrap gap-3 text-sm">
          <QuickLink href="/membresia" label="Página de membresía" />
          <QuickLink href="/mecenas" label="Área de mecenas" />
          <QuickLink href={sitio.url} label="Sitio público" externo />
        </ul>
      </section>
    </div>
  );
}

function StatCard({ titulo, valor }: { titulo: string; valor: number }) {
  return (
    <div className="rounded-sm border border-linea bg-fondo-2 p-5">
      <p className="text-xs uppercase tracking-[0.18em] text-tinta-tenue">{titulo}</p>
      <p className="titulo-display mt-2 text-3xl font-semibold text-oro">{valor}</p>
    </div>
  );
}

function PlanEstado({
  nombre,
  habilitado,
  precio,
  periodo,
}: {
  nombre: string;
  habilitado: boolean;
  precio: string;
  periodo: string;
}) {
  return (
    <li className="flex items-center justify-between gap-4 border-b border-linea-suave pb-3 last:border-0 last:pb-0">
      <div>
        <span className="text-tinta">{nombre}</span>
        <span className="ml-2 text-tinta-tenue">
          {precio} {periodo}
        </span>
      </div>
      <span
        className={`shrink-0 text-xs uppercase tracking-[0.16em] ${
          habilitado ? "text-oro-claro" : "text-tinta-tenue"
        }`}
      >
        {habilitado ? "Activo para el público" : "Apagado"}
      </span>
    </li>
  );
}

function QuickLink({
  href,
  label,
  externo = false,
}: {
  href: string;
  label: string;
  externo?: boolean;
}) {
  return (
    <li>
      <Link
        href={href}
        target={externo ? "_blank" : undefined}
        rel={externo ? "noopener noreferrer" : undefined}
        className="inline-flex min-h-11 items-center rounded-full border border-linea px-4 text-tinta-suave transition-colors hover:border-oro/40 hover:text-oro-claro"
      >
        {label}
      </Link>
    </li>
  );
}
