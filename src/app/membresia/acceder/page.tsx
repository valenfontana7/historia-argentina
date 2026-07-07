import type { Metadata } from "next";
import Link from "next/link";
import { MagicLinkForm } from "@/components/membresia/MagicLinkForm";

export const metadata: Metadata = {
  title: "Acceder como mecenas",
  robots: { index: false },
};

type Props = {
  searchParams: Promise<{ error?: string }>;
};

export default async function AccederPage({ searchParams }: Props) {
  const { error } = await searchParams;
  const aviso =
    error === "expirado"
      ? "Ese enlace expiró. Pedí uno nuevo."
      : error === "token"
        ? "Falta el enlace de acceso."
        : null;

  return (
    <div className="mx-auto max-w-xl px-5 py-28 text-center">
      <p className="kicker">Área de mecenas</p>
      <h1 className="titulo-display mt-4 text-4xl font-semibold">Entrar sin contraseña</h1>
      <p className="mt-5 text-base leading-relaxed text-tinta-suave">
        Te mandamos un magic link al email con el que pagaste la membresía.
      </p>
      {aviso && <p className="mt-4 text-sm text-carmesi">{aviso}</p>}
      <div className="mt-10">
        <MagicLinkForm />
      </div>
      <p className="mt-10 text-sm text-tinta-tenue">
        ¿Todavía no sos mecenas?{" "}
        <Link href="/membresia" className="text-oro-claro underline-offset-4 hover:underline">
          Conocé los planes
        </Link>
      </p>
    </div>
  );
}
