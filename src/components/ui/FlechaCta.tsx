import type { SVGProps } from "react";

type Direccion = "derecha" | "izquierda";

type FlechaProps = SVGProps<SVGSVGElement> & {
  direccion?: Direccion;
};

/**
 * Flecha de CTA: trazo fino, hereda color.
 * Usar dentro de un `group` para el micro-desplazamiento en hover.
 */
export function FlechaCta({
  direccion = "derecha",
  className = "",
  ...rest
}: FlechaProps) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 20 10"
      fill="none"
      className={`inline-block h-[0.55em] w-[1.05em] shrink-0 overflow-visible ${
        direccion === "izquierda" ? "-scale-x-100" : ""
      } ${className}`}
      {...rest}
    >
      <path
        d="M1.5 5h14M12.25 1.75 16.5 5l-4.25 3.25"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

type EtiquetaProps = {
  children: string;
  className?: string;
};

/**
 * Texto de enlace/CTA: reemplaza → / ← unicode por la flecha SVG.
 */
export function EtiquetaCta({ children, className = "" }: EtiquetaProps) {
  const izquierda = /^\s*[←⟵‹]/.test(children);
  const texto = children
    .replace(/^\s*[←⟵‹]\s*/u, "")
    .replace(/\s*[→⟶›]\s*$/u, "")
    .trim();

  const flechaCls =
    "opacity-75 transition-[transform,opacity] duration-300 ease-out group-hover:opacity-100";

  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      {izquierda ? (
        <FlechaCta
          direccion="izquierda"
          className={`${flechaCls} group-hover:-translate-x-0.5`}
        />
      ) : null}
      <span>{texto}</span>
      {!izquierda ? (
        <FlechaCta className={`${flechaCls} group-hover:translate-x-0.5`} />
      ) : null}
    </span>
  );
}
