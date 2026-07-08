import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AdminMagicLinkForm } from "@/components/admin/AdminMagicLinkForm";
import {
  adminConfigurado,
  destinoAdminSeguro,
  sesionAdminValida,
} from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Acceder al admin",
  robots: { index: false, follow: false },
};

type Props = {
  searchParams: Promise<{ next?: string; error?: string }>;
};

export default async function AdminAccederPage({ searchParams }: Props) {
  const params = await searchParams;

  if (await sesionAdminValida()) {
    redirect(destinoAdminSeguro(params.next));
  }

  const errorMsg =
    params.error === "expirado"
      ? "El enlace expiró o no es válido. Pedí uno nuevo."
      : params.error === "token"
        ? "Falta el token de acceso."
        : null;

  return (
    <div className="py-20">
      <section className="mx-auto max-w-3xl px-5 text-center">
        <p className="kicker">Solo creador</p>
        <h1 className="titulo-display mt-4 text-3xl font-semibold sm:text-4xl">
          Acceder al admin
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-sm text-tinta-suave">
          Acceso solo para el creador de Argent. Te mandamos un magic link al email
          configurado en{" "}
          <code className="text-tinta">MECENAS_CREATOR_EMAILS</code>.
        </p>
      </section>

      <section className="mx-auto mt-10 max-w-3xl px-5">
        {!adminConfigurado() ? (
          <p className="text-center text-sm text-carmesi" role="alert">
            Falta configurar{" "}
            <code>MECENAS_CREATOR_EMAILS</code> en las variables de entorno.
          </p>
        ) : (
          <>
            {errorMsg && (
              <p className="mb-4 text-center text-sm text-carmesi" role="alert">
                {errorMsg}
              </p>
            )}
            <AdminMagicLinkForm />
          </>
        )}
      </section>
    </div>
  );
}
