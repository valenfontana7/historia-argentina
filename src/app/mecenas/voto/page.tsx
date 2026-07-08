import Link from "next/link";
import { redirect } from "next/navigation";
import { FormularioVotoFundador } from "@/components/mecenas/FormularioVotoFundador";
import { obtenerMecenasActivo, obtenerSesion } from "@/lib/auth";
import { opcionPorSlug } from "@/data/voto-fundador";
import { prisma } from "@/lib/db";

export const metadata = {
  title: "Voto fundador — próxima crónica",
  robots: { index: false },
};

export const dynamic = "force-dynamic";

export default async function VotoFundadorPage() {
  const sesion = await obtenerSesion();
  if (!sesion) redirect("/membresia/acceder?next=/mecenas/voto");

  const mecenas = await obtenerMecenasActivo();
  if (!mecenas) redirect("/membresia/acceder?next=/mecenas/voto");
  if (!mecenas.esFundador) redirect("/mecenas");

  const voto = await prisma.votoCronicaFundador.findUnique({
    where: { mecenasId: mecenas.id },
  });
  const opcionActual = voto ? opcionPorSlug(voto.opcionSlug)?.slug : undefined;

  return (
    <div className="mx-auto max-w-xl px-5 pb-28 pt-32">
      <p className="kicker text-oro">Mecenas fundador</p>
      <h1 className="titulo-display mt-4 text-4xl font-semibold">
        Votá la próxima crónica
      </h1>
      <p className="mt-6 text-sm leading-relaxed text-tinta-suave">
        Elegí qué historia producimos en las próximas semanas. Tu voto orienta el
        pipeline editorial de Argent — no es una encuesta decorativa.
      </p>
      <FormularioVotoFundador opcionActual={opcionActual} />
      <p className="mt-12">
        <Link href="/mecenas" className="text-sm text-oro-claro hover:text-oro">
          ← Volver a tu museo
        </Link>
      </p>
    </div>
  );
}
