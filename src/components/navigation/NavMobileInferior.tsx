"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useStorageSnapshot } from "@/lib/engagement/client-storage-sync";
import { obtenerRecientes } from "@/lib/engagement/storage";

const ENLACES = [
  { href: "/explorar", etiqueta: "Plano", match: (p: string) => p === "/explorar" || p.startsWith("/periodos") || p.startsWith("/categorias") },
  { href: "/cronicas", etiqueta: "Visita", match: (p: string) => p.startsWith("/cronicas") || p.startsWith("/recorridos") },
  { href: "/hoy", etiqueta: "Hoy", match: (p: string) => p.startsWith("/hoy") },
] as const;

export function NavMobileInferior() {
  const pathname = usePathname();
  const recientes = useStorageSnapshot(obtenerRecientes, []);
  const enCurso = recientes.find((r) => r.tipo === "cronica");

  if (pathname.startsWith("/admin")) return null;

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-50 border-t border-linea-suave bg-fondo/95 backdrop-blur-md lg:hidden"
      aria-label="Navegación principal"
    >
      <ul className="mx-auto flex max-w-lg items-stretch justify-around px-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2">
        {ENLACES.map(({ href, etiqueta, match }) => {
          const activo = match(pathname);
          const destino =
            etiqueta === "Visita" && enCurso ? enCurso.href : href;

          return (
            <li key={href} className="flex-1">
              <Link
                href={destino}
                className={`flex min-h-11 flex-col items-center justify-center gap-0.5 rounded-sm px-2 text-[0.65rem] uppercase tracking-[0.14em] transition-colors ${
                  activo
                    ? "text-oro"
                    : "text-tinta-tenue hover:text-oro-claro"
                }`}
                aria-current={activo ? "page" : undefined}
              >
                <span className="text-base leading-none" aria-hidden>
                  {etiqueta === "Plano" && "◫"}
                  {etiqueta === "Visita" && "◎"}
                  {etiqueta === "Hoy" && "☀"}
                </span>
                {etiqueta}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
