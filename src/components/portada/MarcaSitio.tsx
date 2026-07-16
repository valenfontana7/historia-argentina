import Link from "next/link";
import { BanderasCruzadas } from "@/components/portada/BanderasCruzadas";
import { sitio } from "@/lib/site.config";

type Props = {
  /** Mostrar el lema junto al nombre (solo desktop en header). */
  mostrarLema?: boolean;
  /** Tamaño visual de la marca. */
  tamano?: "sm" | "md" | "lg";
  className?: string;
  onClick?: () => void;
};

const TAMANOS = {
  sm: {
    flags: "h-2 w-auto",
    nombre: "text-lg",
    lema: "text-[0.6rem]",
    gap: "gap-2",
  },
  md: {
    flags: "h-4 w-auto",
    nombre: "text-xl",
    lema: "text-[0.65rem]",
    gap: "gap-2.5",
  },
  lg: {
    flags: "h-5 w-auto",
    nombre: "text-2xl",
    lema: "text-[0.65rem]",
    gap: "gap-2.5",
  },
} as const;

/**
 * Marca del sitio: banderas cruzadas + Argent.
 * Compartida entre header y footer.
 */
export function MarcaSitio({
  mostrarLema = false,
  tamano = "md",
  className = "",
  onClick,
}: Props) {
  const t = TAMANOS[tamano];

  return (
    <Link
      href="/"
      onClick={onClick}
      className={`group inline-flex items-center ${t.gap} ${className}`}
    >
      <BanderasCruzadas
        className={`${t.flags} shrink-0 opacity-90 transition-opacity group-hover:opacity-100`}
      />
      <span className="flex items-baseline gap-3">
        <span
          className={`titulo-display font-semibold tracking-tight text-tinta transition-colors group-hover:text-oro-claro ${t.nombre}`}
        >
          {sitio.nombre}
        </span>
        {mostrarLema && (
          <span
            className={`hidden uppercase tracking-[0.24em] text-tinta-tenue sm:inline ${t.lema}`}
          >
            {sitio.lema}
          </span>
        )}
      </span>
    </Link>
  );
}
