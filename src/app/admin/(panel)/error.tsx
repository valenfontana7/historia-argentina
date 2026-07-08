"use client";

type Props = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function AdminPanelError({ error, reset }: Props) {
  const esDb =
    error.message.includes("Prisma") ||
    error.message.includes("database") ||
    error.message.includes("MembresiaSettings");

  return (
    <div className="mx-auto max-w-xl px-5 py-20 text-center">
      <p className="kicker text-carmesi">Error en el panel</p>
      <h1 className="titulo-display mt-4 text-2xl font-semibold">
        No pudimos cargar el admin
      </h1>
      <p className="mt-4 text-sm leading-relaxed text-tinta-suave">
        {esDb
          ? "Parece un problema con la base de datos. Si acabás de desplegar, corré las migraciones de Prisma en producción (prisma migrate deploy) y reintentá."
          : "Algo falló al renderizar esta página. Probá de nuevo o volvé al login."}
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <button
          type="button"
          onClick={reset}
          className="rounded-full bg-oro px-5 py-2 text-sm font-semibold text-fondo hover:bg-oro-claro"
        >
          Reintentar
        </button>
        <a
          href="/admin/acceder"
          className="rounded-full border border-linea px-5 py-2 text-sm text-tinta-suave hover:border-oro/40 hover:text-oro-claro"
        >
          Volver al login
        </a>
      </div>
    </div>
  );
}
