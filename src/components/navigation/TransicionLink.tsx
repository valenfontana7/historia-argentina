"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { startTransition, type ComponentProps } from "react";

type Props = ComponentProps<typeof Link>;

/**
 * Link con View Transition API cuando el navegador la soporta.
 * Cruza la puerta entre salas sin corte seco.
 */
export function TransicionLink({ href, onClick, ...rest }: Props) {
  const router = useRouter();
  const destino = typeof href === "string" ? href : href.pathname ?? "/";

  return (
    <Link
      href={href}
      {...rest}
      onClick={(e) => {
        onClick?.(e);
        if (e.defaultPrevented) return;
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
        if (e.button !== 0) return;

        const soporta =
          typeof document !== "undefined" &&
          "startViewTransition" in document &&
          !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

        if (!soporta) return;

        e.preventDefault();
        document.startViewTransition(() => {
          startTransition(() => {
            router.push(destino);
          });
        });
      }}
    />
  );
}
