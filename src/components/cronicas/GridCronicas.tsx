import { FichaExhibicion } from "@/components/cronicas/FichaExhibicion";
import { Reveal } from "@/components/ui/Reveal";
import type { CronicaMeta } from "@/content/cronicas/registro";

type Props = {
  cronicas: CronicaMeta[];
  titulo?: string;
  esMecenas?: boolean;
  id?: string;
};

export function GridCronicas({
  cronicas,
  titulo = "Historias",
  esMecenas = false,
  id = "cronicas",
}: Props) {
  if (cronicas.length === 0) return null;

  return (
    <section id={id} className="scroll-mt-32">
      <Reveal>
        <h2 className="titulo-display text-2xl font-medium text-oro">{titulo}</h2>
        <p className="mt-2 text-sm text-tinta-tenue">
          {cronicas.length}{" "}
          {cronicas.length === 1 ? "exhibición inmersiva" : "exhibiciones inmersivas"}
        </p>
      </Reveal>
      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {cronicas.map((cronica, i) => (
          <Reveal key={cronica.slug} delay={i * 0.04}>
            <FichaExhibicion cronica={cronica} esMecenas={esMecenas} />
          </Reveal>
        ))}
      </div>
    </section>
  );
}
