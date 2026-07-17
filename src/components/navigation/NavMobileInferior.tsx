"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useStorageSnapshot } from "@/lib/engagement/client-storage-sync";
import { obtenerRecientes } from "@/lib/engagement/storage";

export function NavMobileInferior() {
  const pathname = usePathname();
  const recientes = useStorageSnapshot(obtenerRecientes, []);
  const enCurso = recientes.find((r) => r.tipo === "cronica") ?? recientes[0];

  if (pathname.startsWith("/admin")) return null;

  const items = enCurso
    ? ([
        {
          href: "/",
          etiqueta: "Descubrir",
          icono: "✧",
          activo: pathname === "/",
        },
        {
          href: enCurso.href,
          etiqueta: "Continuar",
          icono: "◎",
          activo:
            (pathname === enCurso.href ||
              pathname.startsWith("/cronicas") ||
              pathname.startsWith("/recorridos")) &&
            !pathname.startsWith("/hoy"),
        },
        {
          href: "/hoy",
          etiqueta: "Hoy",
          icono: "☀",
          activo: pathname.startsWith("/hoy"),
        },
      ] as const)
    : ([
        {
          href: "/",
          etiqueta: "Descubrir",
          icono: "✧",
          activo: pathname === "/",
        },
        {
          href: "/explorar",
          etiqueta: "Mostrame otra",
          icono: "✦",
          activo: false,
        },
        {
          href: "/hoy",
          etiqueta: "Hoy",
          icono: "☀",
          activo: pathname.startsWith("/hoy"),
        },
      ] as const);

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-50 border-t border-linea-suave bg-fondo/95 backdrop-blur-md lg:hidden"
      aria-label="Navegación principal"
    >
      <ul className="mx-auto flex max-w-lg items-stretch justify-around px-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2">
        {items.map(({ href, etiqueta, icono, activo }) => (
          <li key={etiqueta} className="flex-1">
            <Link
              href={href}
              prefetch
              className={`flex min-h-11 flex-col items-center justify-center gap-0.5 rounded-sm px-2 text-[0.65rem] uppercase tracking-[0.14em] transition-colors ${
                activo ? "text-oro" : "text-tinta-tenue hover:text-oro-claro"
              }`}
              aria-current={activo ? "page" : undefined}
            >
              <span className="text-base leading-none" aria-hidden>
                {icono}
              </span>
              {etiqueta}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
