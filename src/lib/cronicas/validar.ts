import { categorias } from "@/data/categorias";
import { personajes } from "@/data/personajes";
import { cargadores, cronicas } from "@/content/cronicas/registro";
import { taxonomiaPorSlug } from "@/content/cronicas/taxonomia";
import { exhibicionesConAudioguia } from "@/data/audioguias-salas";

export type ProblemaCronica = {
  slug: string;
  detalle: string;
};

export type ResultadoValidacionCronicas = {
  ok: boolean;
  total: number;
  problemas: ProblemaCronica[];
};

const slugsCategoria = new Set(categorias.map((c) => c.slug));
const slugsPersonaje = new Set(personajes.map((p) => p.slug));

export function validarCronicas(): ResultadoValidacionCronicas {
  const problemas: ProblemaCronica[] = [];
  const slugsVistos = new Set<string>();

  const slugsAudioguia = new Set(exhibicionesConAudioguia());

  for (const cronica of cronicas) {
    if (slugsVistos.has(cronica.slug)) {
      problemas.push({ slug: cronica.slug, detalle: "slug duplicado" });
    }
    slugsVistos.add(cronica.slug);

    if (!cargadores[cronica.slug]) {
      problemas.push({ slug: cronica.slug, detalle: "falta cargador MDX" });
    }

    if (!taxonomiaPorSlug[cronica.slug]) {
      problemas.push({ slug: cronica.slug, detalle: "falta entrada en taxonomia.ts" });
    }

    if (!slugsPersonaje.has(cronica.protagonista.slug)) {
      problemas.push({
        slug: cronica.slug,
        detalle: `protagonista inexistente: ${cronica.protagonista.slug}`,
      });
    }

    if (cronica.categorias.length === 0) {
      problemas.push({ slug: cronica.slug, detalle: "sin categorías" });
    }

    for (const cat of cronica.categorias) {
      if (!slugsCategoria.has(cat)) {
        problemas.push({
          slug: cronica.slug,
          detalle: `categoría inexistente: ${cat}`,
        });
      }
    }

    if (!slugsAudioguia.has(cronica.slug)) {
      problemas.push({ slug: cronica.slug, detalle: "sin audioguía (ejecutá npm run audioguias:indexar)" });
    }

    if (cronica.anioFin < cronica.anioInicio) {
      problemas.push({
        slug: cronica.slug,
        detalle: `anioFin (${cronica.anioFin}) < anioInicio (${cronica.anioInicio})`,
      });
    }
  }

  for (const slug of Object.keys(taxonomiaPorSlug)) {
    if (!slugsVistos.has(slug)) {
      problemas.push({
        slug,
        detalle: "taxonomía huérfana (sin crónica en registro)",
      });
    }
  }

  return {
    ok: problemas.length === 0,
    total: cronicas.length,
    problemas,
  };
}
