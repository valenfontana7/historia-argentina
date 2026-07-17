import type { Metadata } from "next";
import { AdminMecenasPanel } from "@/components/admin/AdminMecenasPanel";
import { requireAdminSesion } from "@/lib/admin-auth";
import {
  emailsCreador,
  getMembresiaSettings,
  precioCreador,
} from "@/lib/membresia-settings";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Admin: Mecenas",
  robots: { index: false, follow: false },
};

export default async function AdminMecenasPage() {
  await requireAdminSesion();
  const settings = await getMembresiaSettings();

  return (
    <div className="space-y-8">
      <div>
        <p className="kicker">Membresía</p>
        <h1 className="titulo-display mt-2 text-3xl font-semibold">Planes Mecenas</h1>
        <p className="mt-2 max-w-xl text-sm text-tinta-suave">
          Activá o desactivá los planes, editá precios y probá el checkout real en
          MercadoPago a precio de creador.
        </p>
      </div>

      <AdminMecenasPanel
        initialSettings={settings}
        creatorEmails={emailsCreador()}
        creatorPrecio={precioCreador()}
      />
    </div>
  );
}
