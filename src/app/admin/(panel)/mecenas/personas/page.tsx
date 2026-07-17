import type { Metadata } from "next";
import { AdminMecenasPersonasPanel } from "@/components/admin/AdminMecenasPersonasPanel";
import { requireAdminSesion } from "@/lib/admin-auth";
import { listarMecenas } from "@/lib/mecenas-admin";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Admin: Personas Mecenas",
  robots: { index: false, follow: false },
};

export default async function AdminMecenasPersonasPage() {
  await requireAdminSesion();
  const listado = await listarMecenas({ pagina: 1 });

  return (
    <div className="space-y-8">
      <div>
        <p className="kicker">Membresía</p>
        <h1 className="titulo-display mt-2 text-3xl font-semibold">Personas</h1>
        <p className="mt-2 max-w-xl text-sm text-tinta-suave">
          Listado de mecenas, alta manual y control de cortesías y vencimientos.
        </p>
      </div>

      <AdminMecenasPersonasPanel
        initialDatos={listado.datos}
        initialTotal={listado.total}
        initialPagina={listado.pagina}
        initialTotalPaginas={listado.totalPaginas}
      />
    </div>
  );
}
