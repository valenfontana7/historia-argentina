import Link from "next/link";
import type { Migaja } from "@/lib/seo/jsonld";

type Props = {
  migajas: Migaja[];
};

export function MigasDePan({ migajas }: Props) {
  if (migajas.length <= 1) return null;

  return (
    <nav aria-label="Miga de pan" className="mb-8">
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs uppercase tracking-[0.15em] text-tinta-tenue">
        {migajas.map((m, i) => (
          <li key={m.href} className="flex items-center gap-2">
            {i > 0 && <span aria-hidden className="text-linea">/</span>}
            {i === migajas.length - 1 ? (
              <span className="text-tinta-suave">{m.nombre}</span>
            ) : (
              <Link href={m.href} className="transition-colors hover:text-oro-claro">
                {m.nombre}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
