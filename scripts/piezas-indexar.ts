#!/usr/bin/env npx tsx
/**
 * Escanea MDX y componentes scrolly referenciados para mapear piezas → exhibiciones.
 * Genera src/lib/piezas/exhibiciones-por-pieza-mdx.ts (committeado).
 */
import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { basename, join } from "node:path";
import { imagenesCronicas } from "../src/data/cronicas-imagenes";

const ROOT = join(import.meta.dirname, "..");
const MDX_DIR = join(ROOT, "src/content/cronicas");
const SCROLLY_DIR = join(ROOT, "src/components/scrolly");
const OUTPUT = join(ROOT, "src/lib/piezas/exhibiciones-por-pieza-mdx.ts");

const IMAGEN_ID_RE =
  /imagenId=(?:"([^"]+)"|'([^']+)'|\{`([^`]+)`\}|\{"([^"]+)"\})/g;

function extractImagenIds(text: string): string[] {
  const ids = new Set<string>();
  for (const match of text.matchAll(IMAGEN_ID_RE)) {
    const id = match[1] ?? match[2] ?? match[3] ?? match[4];
    if (id) ids.add(id);
  }
  return [...ids];
}

function buildScrollyIndex(): Map<string, string> {
  const map = new Map<string, string>();
  for (const entry of readdirSync(SCROLLY_DIR, { withFileTypes: true })) {
    if (!entry.isFile() || !entry.name.endsWith(".tsx")) continue;
    const name = basename(entry.name, ".tsx");
    map.set(name, join(SCROLLY_DIR, entry.name));
  }
  return map;
}

function componentesUsadosEnMdx(text: string, scrolly: Map<string, string>): string[] {
  const usados: string[] = [];
  for (const match of text.matchAll(/<([A-Z][A-Za-z0-9]*)/g)) {
    const name = match[1];
    if (scrolly.has(name)) usados.push(name);
  }
  return usados;
}

function indexarExhibicionesPorPieza(): Record<string, string[]> {
  const scrolly = buildScrollyIndex();
  const porPieza = new Map<string, Set<string>>();

  for (const file of readdirSync(MDX_DIR)) {
    if (!file.endsWith(".mdx")) continue;
    const slug = basename(file, ".mdx");
    const text = readFileSync(join(MDX_DIR, file), "utf8");
    const ids = new Set(extractImagenIds(text));

    for (const componente of componentesUsadosEnMdx(text, scrolly)) {
      const ruta = scrolly.get(componente)!;
      for (const id of extractImagenIds(readFileSync(ruta, "utf8"))) {
        ids.add(id);
      }
    }

    for (const id of ids) {
      const set = porPieza.get(id) ?? new Set<string>();
      set.add(slug);
      porPieza.set(id, set);
    }
  }

  const resultado: Record<string, string[]> = {};
  for (const [id, slugs] of porPieza) {
    resultado[id] = [...slugs].sort();
  }
  return resultado;
}

function validarIds(mapa: Record<string, string[]>): string[] {
  const problemas: string[] = [];
  for (const id of Object.keys(mapa)) {
    if (!imagenesCronicas[id]) {
      problemas.push(`imagenId desconocido: "${id}"`);
    }
  }
  return problemas;
}

export function generarIndicePiezasMdx(): Record<string, string[]> {
  return indexarExhibicionesPorPieza();
}

function main() {
  const mapa = indexarExhibicionesPorPieza();
  const problemas = validarIds(mapa);
  const lineas = Object.entries(mapa)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([id, slugs]) => `  "${id}": ${JSON.stringify(slugs)},`)
    .join("\n");

  const contenido = `/** Generado por scripts/piezas-indexar.ts: no editar a mano. */
export const exhibicionesPorPiezaMdx: Record<string, readonly string[]> = {
${lineas}
};
`;

  writeFileSync(OUTPUT, contenido, "utf8");
  const totalPiezas = Object.keys(mapa).length;
  const totalVinculos = Object.values(mapa).reduce((n, s) => n + s.length, 0);
  console.log(
    `✓ Índice piezas MDX: ${totalPiezas} piezas, ${totalVinculos} vínculos → ${OUTPUT}`,
  );

  if (problemas.length > 0) {
    console.error(`✗ ${problemas.length} imagenId inválidos:\n`);
    for (const p of problemas) console.error(`  · ${p}`);
    process.exit(1);
  }
}

main();
