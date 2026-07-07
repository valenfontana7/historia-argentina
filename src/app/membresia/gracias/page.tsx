import type { Metadata } from "next";
import Link from "next/link";
import { MagicLinkForm } from "@/components/membresia/MagicLinkForm";

export const metadata: Metadata = {
  title: "Gracias, mecenas",
  robots: { index: false },
};

export default function MembresiaGraciasPage() {
  return (
    <div className="mx-auto max-w-xl px-5 py-28 text-center">
      <p className="kicker">Pago recibido</p>
      <h1 className="titulo-display mt-4 text-4xl font-semibold sm:text-5xl">
        Gracias por sostener Argenta
      </h1>
      <p className="mt-6 text-base leading-relaxed text-tinta-suave">
        En cuanto MercadoPago confirma el pago te mandamos un enlace mágico a tu
        email. Si tarda unos minutos, podés pedirlo acá con el mismo correo del pago.
      </p>
      <div className="mt-10">
        <MagicLinkForm />
      </div>
      <Link
        href="/mecenas"
        className="mt-10 inline-block text-sm text-oro-claro underline-offset-4 hover:underline"
      >
        Ir al área de mecenas →
      </Link>
    </div>
  );
}
