import Link from "next/link";
import { sitio } from "@/lib/site.config";

export function Footer() {
  return (
    <footer className="border-t border-linea-suave bg-fondo-2">
      <div className="mx-auto max-w-6xl px-5 py-14">
        <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
          <div className="max-w-sm">
            <p className="titulo-display text-2xl font-semibold text-tinta">
              {sitio.nombre}
            </p>
            <p className="mt-3 text-sm leading-relaxed text-tinta-suave">
              {sitio.lema}. La historia argentina contada con el cuidado que se
              merece: visual, rigurosa y libre.
            </p>
          </div>
          <nav className="grid grid-cols-2 gap-x-8 gap-y-3 text-sm sm:gap-x-16">
            <Link href="/explorar" className="text-tinta-suave transition-colors hover:text-oro-claro">
              Explorar
            </Link>
            <Link href="/lugares" className="text-tinta-suave transition-colors hover:text-oro-claro">
              Lugares
            </Link>
            <Link href="/periodos" className="text-tinta-suave transition-colors hover:text-oro-claro">
              Períodos
            </Link>
            <Link href="/cronicas" className="text-tinta-suave transition-colors hover:text-oro-claro">
              Crónicas
            </Link>
            <Link href="/panteon" className="text-tinta-suave transition-colors hover:text-oro-claro">
              El Panteón
            </Link>
            <Link href="/hoy" className="text-tinta-suave transition-colors hover:text-oro-claro">
              Un día como hoy
            </Link>
            <Link href="/membresia" className="text-oro-claro transition-colors hover:text-oro">
              Hacete mecenas
            </Link>
            <Link href="/membresia/acceder" className="text-tinta-suave transition-colors hover:text-oro-claro">
              Ya soy mecenas
            </Link>
            <Link href="/" className="text-tinta-suave transition-colors hover:text-oro-claro">
              Inicio
            </Link>
          </nav>
        </div>
        <div className="filete my-10" />
        <p className="text-center text-xs text-tinta-tenue">
          © {new Date().getFullYear()} {sitio.nombre} · Hecho con memoria en la
          República Argentina
        </p>
      </div>
    </footer>
  );
}
