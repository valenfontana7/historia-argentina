import type { Metadata } from "next";
import Link from "next/link";
import { GraciasPostPago } from "@/components/membresia/GraciasPostPago";

export const metadata: Metadata = {
  title: "Gracias, mecenas",
  robots: { index: false },
};

type Props = {
  searchParams: Promise<{ email?: string }>;
};

export default async function MembresiaGraciasPage({ searchParams }: Props) {
  const params = await searchParams;
  const email = params.email?.toLowerCase().trim() ?? "";

  return (
    <div className="mx-auto max-w-xl px-5 pb-28 pt-32 text-center">
      <p className="kicker">Pago recibido</p>
      <h1 className="titulo-display mt-4 text-4xl font-semibold sm:text-5xl">
        Gracias por sostener Argent
      </h1>
      <p className="mt-6 text-base leading-relaxed text-tinta-suave">
        Si tu pago ya se confirmó, te redirigimos automáticamente a tu museo.
        Si no, pedí el enlace de acceso con el mismo correo del checkout.
      </p>
      <GraciasPostPago emailInicial={email || undefined} />
      <Link
        href="/mecenas"
        className="mt-10 inline-block text-sm text-oro-claro underline-offset-4 hover:underline"
      >
        Ir al área de mecenas →
      </Link>
    </div>
  );
}
