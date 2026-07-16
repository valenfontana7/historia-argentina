"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type Props = {
  email: string;
};

const links = [
  { href: "/admin", label: "Inicio", match: "exact" as const },
  { href: "/admin/mecenas", label: "Planes", match: "planes" as const },
  { href: "/admin/mecenas/personas", label: "Personas", match: "prefix" as const },
  { href: "/admin/video", label: "Video", match: "prefix" as const },
] as const;

function linkActivo(pathname: string, href: string, match: (typeof links)[number]["match"]): boolean {
  switch (match) {
    case "exact":
      return pathname === href;
    case "planes":
      return pathname === href || pathname === `${href}/`;
    case "prefix":
      return pathname.startsWith(href);
    default: {
      const _exhaustive: never = match;
      return _exhaustive;
    }
  }
}

export function AdminNav({ email }: Props) {
  const pathname = usePathname();

  async function cerrarSesion() {
    await fetch("/api/admin/logout", { method: "POST" });
    window.location.href = "/admin/acceder";
  }

  return (
    <header className="sticky top-0 z-30 border-b border-linea bg-fondo-2/95 pt-[env(safe-area-inset-top)] backdrop-blur-sm">
      <div className="mx-auto flex max-w-5xl flex-col gap-4 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="kicker text-[0.65rem]">Admin</p>
          <p className="text-sm text-tinta-suave">{email}</p>
        </div>
        <nav className="flex flex-wrap items-center gap-2">
          {links.map(({ href, label, match }) => {
            const activo = linkActivo(pathname, href, match);
            return (
              <Link
                key={href}
                href={href}
                className={`rounded-full px-4 py-2 text-sm transition-colors ${
                  activo
                    ? "bg-oro/15 text-oro-claro"
                    : "text-tinta-suave hover:bg-fondo hover:text-tinta"
                }`}
              >
                {label}
              </Link>
            );
          })}
          <button
            type="button"
            onClick={cerrarSesion}
            className="rounded-full px-4 py-2 text-sm text-tinta-tenue transition-colors hover:text-tinta-suave"
          >
            Salir
          </button>
        </nav>
      </div>
    </header>
  );
}
