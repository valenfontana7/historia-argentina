import Link from "next/link";
import { MarcaSitio } from "@/components/portada/MarcaSitio";
import { sitio } from "@/lib/site.config";

type Props = {
  esMecenas: boolean;
};

export function Footer({ esMecenas }: Props) {
  return (
    <footer className="border-t border-linea-suave bg-fondo-2 pb-[calc(4.5rem+env(safe-area-inset-bottom))] lg:pb-0">
      <div className="mx-auto max-w-6xl px-5 py-14">
        <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
          <div className="max-w-sm">
            <MarcaSitio tamano="lg" />
            <p className="mt-3 text-sm leading-relaxed text-tinta-suave">
              {sitio.lema}. Historias argentinas para explorar sin fin: visuales,
              conectadas y gratis para empezar.
            </p>
          </div>
          <div>
            <p className="kicker text-tinta-tenue">Mapa del sitio</p>
            <nav
              className="mt-4 grid grid-cols-2 gap-x-8 gap-y-3 text-sm sm:grid-cols-3 sm:gap-x-12"
              aria-label="Mapa del sitio"
            >
              <Link href="/" className="text-tinta-suave transition-colors hover:text-oro-claro">
                Descubrir
              </Link>
              <Link href="/hoy" className="text-tinta-suave transition-colors hover:text-oro-claro">
                Hoy
              </Link>
              <Link href="/explorar" className="text-tinta-suave transition-colors hover:text-oro-claro">
                Mostrame otra
              </Link>
            <Link href="/recorridos" className="text-tinta-suave transition-colors hover:text-oro-claro">
              Recorridos guiados
            </Link>
              <Link href="/cronicas" className="text-tinta-suave transition-colors hover:text-oro-claro">
                Historias
              </Link>
              <Link href="/panteon" className="text-tinta-suave transition-colors hover:text-oro-claro">
                Personajes
              </Link>
              <Link href="/lugares" className="text-tinta-suave transition-colors hover:text-oro-claro">
                Mapa
              </Link>
              <Link href="/timelines" className="text-tinta-suave transition-colors hover:text-oro-claro">
                Línea de tiempo
              </Link>
              <Link href="/periodos" className="text-tinta-suave transition-colors hover:text-oro-claro">
                Épocas
              </Link>
              <Link href="/categorias" className="text-tinta-suave transition-colors hover:text-oro-claro">
                Temas
              </Link>
              <Link href="/piezas" className="text-tinta-suave transition-colors hover:text-oro-claro">
                Objetos
              </Link>
              {esMecenas ? (
                <Link href="/mecenas" className="text-oro-claro transition-colors hover:text-oro">
                  Tu espacio
                </Link>
              ) : (
                <>
                  <Link href="/membresia" className="text-oro-claro transition-colors hover:text-oro">
                    Hacete mecenas
                  </Link>
                  <Link
                    href="/membresia/acceder"
                    className="text-tinta-suave transition-colors hover:text-oro-claro"
                  >
                    Ya soy mecenas
                  </Link>
                </>
              )}
            </nav>
          </div>
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
