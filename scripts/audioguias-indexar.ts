#!/usr/bin/env npx tsx
/**
 * Genera audioguías automáticas para exhibiciones sin guía manual.
 * - Tier C → audioguias-salas-generadas.ts
 * - Tier B → audioguias-salas-curadas-tierb.ts (texto enriquecido desde MDX)
 */
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { cronicas } from "../src/content/cronicas/registro";
import { tierDeCronica } from "../src/content/cronicas/tiers";
import { MANUAL_INDICE } from "../src/data/audioguias-salas-manual";
import { MANUAL_TIERB_INDICE } from "../src/data/audioguias-salas-manual-tierb";
import { MANUAL_TIERC_INDICE } from "../src/data/audioguias-salas-manual-tierc";

const ROOT = join(import.meta.dirname, "..");
const MDX_DIR = join(ROOT, "src/content/cronicas");
const OUTPUT_C = join(ROOT, "src/data/audioguias-salas-generadas.ts");
const OUTPUT_B = join(ROOT, "src/data/audioguias-salas-curadas-tierb.ts");

type CapituloParseado = {
  titulo: string;
  bajada?: string;
  prosa?: string;
  tieneComparador: boolean;
};

const CAPITULO_BLOCK_RE = /<Capitulo[\s\S]*?\/>/g;
const EXCLUIDOS = new Set([
  ...Object.keys(MANUAL_INDICE),
  ...Object.keys(MANUAL_TIERB_INDICE),
  ...Object.keys(MANUAL_TIERC_INDICE),
]);

function limpiarProsa(raw: string): string {
  return raw
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/\*([^*]+)\*/g, "$1")
    .replace(/<[^>]+>/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function oraciones(texto: string, max = 2): string {
  const partes = texto.split(/(?<=[.!?])\s+/).filter(Boolean);
  return partes.slice(0, max).join(" ");
}

function asegurarPunto(texto: string): string {
  const t = texto.trim();
  if (!t) return t;
  return t.endsWith(".") ? t : `${t}.`;
}

function parseCapitulos(mdx: string): CapituloParseado[] {
  const bloques = mdx.match(CAPITULO_BLOCK_RE) ?? [];
  const partes = mdx.split(/<Capitulo/);
  const capitulos: CapituloParseado[] = [];

  for (let i = 0; i < bloques.length; i++) {
    const bloque = bloques[i];
    const titulo = bloque.match(/titulo="([^"]+)"/)?.[1];
    if (!titulo) continue;
    const bajada = bloque.match(/bajada="([^"]+)"/)?.[1];
    const despues = partes[i + 1] ?? "";
    const prosaRaw = despues.match(/<Prosa[^>]*>([\s\S]*?)<\/Prosa>/)?.[1];
    capitulos.push({
      titulo,
      bajada,
      prosa: prosaRaw ? limpiarProsa(prosaRaw) : undefined,
      tieneComparador: despues.includes("<Comparador"),
    });
  }

  return capitulos;
}

function generarTextoBase(
  cronica: (typeof cronicas)[number],
  cap: CapituloParseado,
  indice: number,
): string {
  if (cap.bajada?.trim()) {
    let texto = cap.bajada.trim();
    if (indice === 0 && cronica.periodo && !texto.includes(cronica.periodo.slice(0, 4))) {
      texto = `${cronica.periodo}. ${texto}`;
    }
    return asegurarPunto(texto);
  }
  if (cap.prosa) {
    return oraciones(cap.prosa, indice === 0 ? 2 : 1);
  }
  if (indice === 0) {
    return asegurarPunto(cronica.subtitulo);
  }
  return `«${cap.titulo}»: ${oraciones(cronica.descripcion, 1)}`;
}

function generarTextoTierB(
  cronica: (typeof cronicas)[number],
  cap: CapituloParseado,
  indice: number,
): string {
  const partes: string[] = [];

  if (indice === 0) {
    partes.push(asegurarPunto(cronica.subtitulo));
  }

  if (cap.bajada?.trim()) {
    partes.push(asegurarPunto(cap.bajada.trim()));
  }

  if (cap.prosa) {
    partes.push(oraciones(cap.prosa, indice === 0 ? 2 : 2));
  }

  if (partes.length === 0) {
    return generarTextoBase(cronica, cap, indice);
  }

  let texto = partes.join(" ").replace(/\s+/g, " ").trim();

  return texto;
}

function duracionEstimada(cronica: (typeof cronicas)[number], segmentos: number): string {
  const min = Number.parseInt(cronica.duracion, 10);
  if (!Number.isNaN(min)) return `${min} minutos`;
  return `${Math.max(4, segmentos * 2)} minutos`;
}

function escapar(texto: string): string {
  return texto.replace(/\\/g, "\\\\").replace(/"/g, '\\"').replace(/\n/g, " ");
}

function generarAudioguia(slug: string, tier: "B" | "C"): string {
  const cronica = cronicas.find((c) => c.slug === slug);
  if (!cronica) throw new Error(`Crónica no encontrada: ${slug}`);

  const mdx = readFileSync(join(MDX_DIR, `${slug}.mdx`), "utf8");
  let capitulos = parseCapitulos(mdx);

  if (capitulos.length === 0) {
    capitulos = [
      {
        titulo: cronica.titulo,
        bajada: cronica.subtitulo,
        prosa: limpiarProsa(cronica.descripcion),
        tieneComparador: mdx.includes("<Comparador"),
      },
    ];
  }

  const varName = slug.replace(/[^a-zA-Z0-9]/g, "_").toUpperCase();
  const segmentos = capitulos
    .map((cap, i) => {
      const texto =
        tier === "B"
          ? generarTextoTierB(cronica, cap, i)
          : generarTextoBase(cronica, cap, i);
      return `    {
      estacion: ${i},
      titulo: "${escapar(cap.titulo)}",
      texto: "${escapar(texto)}",
    }`;
    })
    .join(",\n");

  return `const ${varName}: AudioguiaExhibicion = {
  cronicaSlug: "${slug}",
  titulo: "Audioguía · ${escapar(cronica.titulo)}",
  duracionEstimada: "${duracionEstimada(cronica, capitulos.length)}",
  segmentos: [
${segmentos}
  ],
};`;
}

function escribirArchivo(
  ruta: string,
  exportName: string,
  comentario: string,
  slugs: string[],
  tier: "B" | "C",
) {
  const bloques = slugs.map((slug) => generarAudioguia(slug, tier));
  const entradas = slugs
    .map((slug) => {
      const varName = slug.replace(/[^a-zA-Z0-9]/g, "_").toUpperCase();
      const key = slug.includes("-") ? `"${slug}"` : slug;
      return `  ${key}: ${varName},`;
    })
    .join("\n");

  const contenido = `/** ${comentario} */
import type { AudioguiaExhibicion } from "@/data/audioguias-salas-manual";

${bloques.join("\n\n")}

export const ${exportName}: Record<string, AudioguiaExhibicion> = {
${entradas}
};
`;

  writeFileSync(ruta, contenido, "utf8");
}

function main() {
  const pendientes = cronicas
    .map((c) => c.slug)
    .filter((slug) => !EXCLUIDOS.has(slug));

  const tierA = pendientes
    .filter((slug) => tierDeCronica(slug) === "A")
    .sort((a, b) => a.localeCompare(b, "es"));
  const tierB = pendientes
    .filter((slug) => tierDeCronica(slug) === "B")
    .sort((a, b) => a.localeCompare(b, "es"));
  const tierC = pendientes
    .filter((slug) => tierDeCronica(slug) === "C")
    .sort((a, b) => a.localeCompare(b, "es"));

  if (tierA.length > 0) {
    escribirArchivo(
      join(ROOT, "src/data/audioguias-salas-curadas-tiera.ts"),
      "CURADAS_TIERA_INDICE",
      "Generado por scripts/audioguias-indexar.ts: tier A restante",
      tierA,
      "B",
    );
  }

  escribirArchivo(
    OUTPUT_B,
    "CURADAS_TIERB_INDICE",
    "Generado por scripts/audioguias-indexar.ts: tier B enriquecido",
    tierB,
    "B",
  );

  if (tierC.length > 0) {
    escribirArchivo(
      OUTPUT_C,
      "GENERADO_INDICE",
      "Generado por scripts/audioguias-indexar.ts: tier C narrativo",
      tierC,
      "C",
    );
  } else {
    writeFileSync(
      OUTPUT_C,
      `/** Generado por scripts/audioguias-indexar.ts: tier C cubierto por manual. */
import type { AudioguiaExhibicion } from "@/data/audioguias-salas-manual";

export const GENERADO_INDICE: Record<string, AudioguiaExhibicion> = {};
`,
      "utf8",
    );
  }

  console.log(`✓ Audioguías tier B curadas: ${tierB.length} → ${OUTPUT_B}`);
  console.log(
    tierC.length > 0
      ? `✓ Audioguías tier C generadas: ${tierC.length} → ${OUTPUT_C}`
      : `✓ Tier C cubierto por manual (${Object.keys(MANUAL_TIERC_INDICE).length} salas)`,
  );
  if (tierA.length > 0) {
    console.log(`✓ Audioguías tier A curadas: ${tierA.length}`);
  }
}

main();
