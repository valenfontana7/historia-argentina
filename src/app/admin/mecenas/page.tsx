import type { Metadata } from "next";
import { AdminLoginForm } from "@/components/admin/AdminLoginForm";
import { AdminMecenasPanel } from "@/components/admin/AdminMecenasPanel";
import { adminConfigurado, sesionAdminValida } from "@/lib/admin-auth";
import {
  emailsCreador,
  getMembresiaSettings,
  precioCreador,
} from "@/lib/membresia-settings";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Admin Mecenas",
  robots: { index: false, follow: false },
};

export default async function AdminMecenasPage() {
  const adminOk = adminConfigurado();
  const autenticado = adminOk && (await sesionAdminValida());
  const settings = autenticado ? await getMembresiaSettings() : null;

  return (
    <div className="pt-24 pb-20">
      <section className="mx-auto max-w-3xl px-5 text-center">
        <p className="kicker">Solo creador</p>
        <h1 className="titulo-display mt-4 text-3xl font-semibold sm:text-4xl">
          Admin de Mecenas
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-sm text-tinta-suave">
          Activá o desactivá los planes para el público y probá el checkout real
          en MercadoPago a precio de creador.
        </p>
      </section>

      <section className="mx-auto mt-10 max-w-3xl px-5">
        {!adminOk ? (
          <p className="text-center text-sm text-carmesi" role="alert">
            Falta configurar <code>ADMIN_SECRET</code> en las variables de entorno.
          </p>
        ) : autenticado && settings ? (
          <AdminMecenasPanel
            initialSettings={settings}
            creatorEmails={emailsCreador()}
            creatorPrecio={precioCreador()}
          />
        ) : (
          <AdminLoginForm />
        )}
      </section>
    </div>
  );
}
