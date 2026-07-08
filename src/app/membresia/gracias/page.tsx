import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { EstadoMecenas } from "@prisma/client";
import { GraciasPostPago } from "@/components/membresia/GraciasPostPago";
import { establecerSesion } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { sincronizarMecenasPorEmail } from "@/lib/mp";

export const metadata: Metadata = {
  title: "Gracias, mecenas",
  robots: { index: false },
};

export const dynamic = "force-dynamic";

type Props = {
  searchParams: Promise<{ email?: string }>;
};

/**
 * Intenta activar la membresía y la sesión en el servidor al volver de Mercado Pago.
 * Si hay sesión, redirige a /mecenas sin pasar por el formulario de enlace.
 */
async function intentarActivacionServidor(email: string): Promise<boolean> {
  try {
    const resultado = await sincronizarMecenasPorEmail(email, {
      reenviarEmail: false,
    });
    const activo =
      resultado.estado === "activado" || resultado.estado === "activo";
    if (!activo) return false;

    const mecenas = await prisma.mecenas.findUnique({ where: { email } });
    if (!mecenas || mecenas.estado !== EstadoMecenas.activo) return false;

    await establecerSesion({
      email: mecenas.email,
      mecenasId: mecenas.id,
      plan: mecenas.plan,
      esFundador: mecenas.esFundador,
    });
    return true;
  } catch (error) {
    console.error("[membresia/gracias] activación servidor:", error);
    return false;
  }
}

export default async function MembresiaGraciasPage({ searchParams }: Props) {
  const params = await searchParams;
  const email = params.email?.toLowerCase().trim() ?? "";

  if (email) {
    const listo = await intentarActivacionServidor(email);
    if (listo) redirect("/mecenas");
  }

  return (
    <div className="mx-auto max-w-xl px-5 pb-28 pt-32 text-center">
      <p className="kicker">Pago recibido</p>
      <h1 className="titulo-display mt-4 text-4xl font-semibold sm:text-5xl">
        Gracias por sostener Argent
      </h1>
      <p className="mt-6 text-base leading-relaxed text-tinta-suave">
        Estamos activando tu acceso. Si el pago aún no aparece, pedí un enlace
        al mismo email del pago en unos minutos.
      </p>
      <GraciasPostPago emailInicial={email || undefined} />
    </div>
  );
}
