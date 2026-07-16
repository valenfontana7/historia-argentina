import type { Metadata, Viewport } from "next";
import { redirect } from "next/navigation";
import { AdminInstallPrompt } from "@/components/admin/AdminInstallPrompt";
import { AdminNav } from "@/components/admin/AdminNav";
import {
  adminConfigurado,
  obtenerSesionAdmin,
} from "@/lib/admin-auth";
import { sitio } from "@/lib/site.config";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: `${sitio.nombre} Admin`,
  },
  applicationName: `${sitio.nombre} Admin`,
};

export const viewport: Viewport = {
  themeColor: "#c6a15b",
  viewportFit: "cover",
};

type Props = {
  children: React.ReactNode;
};

export default async function AdminPanelLayout({ children }: Props) {
  if (!adminConfigurado()) {
    return (
      <div className="py-20">
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
    <div className="flex min-h-dvh flex-col">
      <AdminNav email={sesion.email} />
      <AdminInstallPrompt />
      <div className="mx-auto w-full max-w-5xl flex-1 px-5 py-10 pb-[max(2.5rem,env(safe-area-inset-bottom))]">
        {children}
      </div>
    </div>
  );
}
