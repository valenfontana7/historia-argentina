"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type Props = {
  email: string;
};

const links = [
  { href: "/admin", label: "Inicio", exact: true },
  { href: "/admin/mecenas", label: "Mecenas", exact: false },
] as const;

export function AdminNav({ email }: Props) {
  const pathname = usePathname();

  async function cerrarSesion() {
    await fetch("/api/admin/logout", { method: "POST" });
    window.location.href = "/admin/acceder";
  }

  return (
    <header className="border-b border-linea bg-fondo-2">
      <div className="mx-auto flex max-w-5xl flex-col gap-4 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="kicker text-[0.65rem]">Admin</p>
          <p className="text-sm text-tinta-suave">{email}</p>
        </div>
        <nav className="flex flex-wrap items-center gap-2">
          {links.map(({ href, label, exact }) => {
            const activo = exact ? pathname === href : pathname.startsWith(href);
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
