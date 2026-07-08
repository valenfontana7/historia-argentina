import Link from "next/link";
import { sitio } from "@/lib/site.config";

const enlaces = [
  { href: "/explorar", etiqueta: "Explorar" },
  { href: "/timelines", etiqueta: "Timeline" },
  { href: "/jugar", etiqueta: "Jugar" },
  { href: "/cronicas", etiqueta: "Crónicas" },
  { href: "/panteon", etiqueta: "El Panteón" },
  { href: "/hoy", etiqueta: "Hoy" },
  { href: "/membresia", etiqueta: "Mecenas" },
] as const;

export function Header() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-linea-suave bg-fondo/70 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
        <Link href="/" className="group flex items-baseline gap-3">
          <span className="titulo-display text-xl font-semibold tracking-tight text-tinta transition-colors group-hover:text-oro-claro">
            {sitio.nombre}
          </span>
          <span className="hidden text-[0.65rem] uppercase tracking-[0.24em] text-tinta-tenue sm:inline">
            {sitio.lema}
          </span>
        </Link>
        <nav className="flex items-center gap-6 text-sm">
          {enlaces.map((enlace) => (
            <Link
              key={enlace.href}
              href={enlace.href}
              className="text-tinta-suave transition-colors hover:text-oro-claro"
            >
              {enlace.etiqueta}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
