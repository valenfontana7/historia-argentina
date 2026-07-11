"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
  { href: "/admin/mecenas", label: "Planes", exact: true },
  { href: "/admin/mecenas/personas", label: "Personas", exact: false },
] as const;

export function AdminMecenasSubNav() {
  const pathname = usePathname();

  return (
    <nav className="flex gap-2 border-b border-linea pb-4">
      {tabs.map(({ href, label, exact }) => {
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
    </nav>
  );
}
