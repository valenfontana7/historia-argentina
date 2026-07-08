import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AdminNav } from "@/components/admin/AdminNav";
import {
  adminConfigurado,
  destinoAdminSeguro,
  obtenerSesionAdmin,
} from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

type Props = {
  children: React.ReactNode;
};

export default async function AdminPanelLayout({ children }: Props) {
  if (!adminConfigurado()) {
    return (
      <div className="pt-24 pb-20">
        <p className="px-5 text-center text-sm text-carmesi" role="alert">
          Falta configurar{" "}
          <code>MECENAS_CREATOR_EMAILS</code> en las variables de entorno.
        </p>
      </div>
    );
  }

  const sesion = await obtenerSesionAdmin();
  if (!sesion) {
    redirect("/admin/acceder");
  }

  return (
    <div className="min-h-screen pt-16">
      <AdminNav email={sesion.email} />
      <div className="mx-auto max-w-5xl px-5 py-10">{children}</div>
    </div>
  );
}
