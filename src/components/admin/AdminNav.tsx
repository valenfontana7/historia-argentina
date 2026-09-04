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
  { href: "/admin/carousel", label: "Carousel", match: "prefix" as const },
  { href: "/admin/editorial", label: "Editorial", match: "prefix" as const },
] as const;

function linkActivo(
  pathname: string,
  href: string,
  match: (typeof links)[number]["match"],
): boolean {
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

const navItemClass =
  "inline-flex min-h-11 shrink-0 items-center rounded-full px-4 text-sm transition-colors";

export function AdminNav({ email }: Props) {
  const pathname = usePathname();

  async function cerrarSesion() {
    await fetch("/api/admin/logout", { method: "POST" });
    window.location.href = "/admin/acceder";
  }

  return (
    <header className="sticky top-0 z-30 border-b border-linea bg-fondo-2/95 pt-[env(safe-area-inset-top)] backdrop-blur-sm">
      <div className="mx-auto flex max-w-5xl items-center gap-3 px-4 py-2.5 sm:gap-4 sm:px-5 sm:py-3">
        <div className="min-w-0 shrink-0 sm:max-w-[40%]">
          <p className="kicker text-[0.65rem]">Admin</p>
          <p className="hidden truncate text-sm text-tinta-suave sm:block">
            {email}
          </p>
        </div>
        <nav className="-mx-1 flex min-w-0 flex-1 items-center gap-1.5 overflow-x-auto px-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {links.map(({ href, label, match }) => {
            const activo = linkActivo(pathname, href, match);
            return (
              <Link
                key={href}
                href={href}
                className={`${navItemClass} ${
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
            className={`${navItemClass} text-tinta-tenue hover:text-tinta-suave`}
          >
            Salir
          </button>
        </nav>
      </div>
    </header>
  );
}
