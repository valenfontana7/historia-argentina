import Link from "next/link";
import { EtiquetaCta } from "@/components/ui/FlechaCta";

type Props = {
  href: string;
  etiqueta?: string;
  className?: string;
};

/** CTA único de continuidad: un tap para no pensar. */
export function SiguienteAutomatico({
  href,
  etiqueta = "Seguir explorando",
  className = "",
}: Props) {
  return (
    <Link
      href={href}
      prefetch
      className={`group inline-flex min-h-12 items-center justify-center rounded-full bg-oro px-8 py-3.5 text-sm font-semibold text-fondo transition-colors hover:bg-oro-claro ${className}`}
    >
      <EtiquetaCta>{etiqueta}</EtiquetaCta>
    </Link>
  );
}
