import Link from "next/link";
import { EstadoMecenas } from "@prisma/client";
import { esErrorDbDegradado, prisma } from "@/lib/db";

type Credito = {
  email: string;
  nombrePublico: string | null;
  esFundador: boolean;
};

export async function obtenerCreditosMecenas(take = 48): Promise<Credito[]> {
  try {
    return await prisma.mecenas.findMany({
      where: { estado: EstadoMecenas.activo, mostrarCredito: true },
      orderBy: [{ esFundador: "desc" }, { createdAt: "asc" }],
      take,
      select: { email: true, nombrePublico: true, esFundador: true },
    });
  } catch (error) {
    if (esErrorDbDegradado(error)) {
      console.error("[mural-mecenas] No se pudieron cargar créditos:", error);
      return [];
    }
    throw error;
  }
}

function etiqueta(c: Credito): string {
  return (
    c.nombrePublico?.trim() ||
    c.email.split("@")[0]?.replace(/[._]/g, " ") ||
    "Mecenas"
  );
}

type Props = {
  creditos: Credito[];
  titulo?: string;
  limite?: number;
  conCta?: boolean;
};

/** Mural público de mecenas (landing y área privada). */
export function MuralMecenas({
  creditos,
  titulo = "Quienes sostienen Argent",
  limite = 24,
  conCta = false,
}: Props) {
  if (creditos.length === 0) return null;

  const visibles = creditos.slice(0, limite);

  return (
    <section className="mx-auto max-w-3xl px-5">
      <p className="kicker text-center">Mural de mecenas</p>
      <h2 className="titulo-display mt-4 text-center text-2xl font-semibold">
        {titulo}
      </h2>
      <ul className="mt-10 flex flex-wrap justify-center gap-2">
        {visibles.map((c) => (
          <li
            key={c.email}
            className={`rounded-full border px-3 py-1 text-xs capitalize ${
              c.esFundador
                ? "border-oro/40 text-oro-claro"
                : "border-linea text-tinta-suave"
            }`}
          >
            {etiqueta(c)}
            {c.esFundador ? " · fundador" : ""}
          </li>
        ))}
      </ul>
      {conCta && (
        <p className="mt-8 text-center text-sm">
          <Link
            href="/membresia"
            className="text-oro-claro underline-offset-4 hover:underline"
          >
            Sumate vos también →
          </Link>
        </p>
      )}
    </section>
  );
}
