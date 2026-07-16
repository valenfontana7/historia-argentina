#!/usr/bin/env npx tsx
/** Extrae datos de Escenas*.tsx hacia el registro paramétrico. */
import { readFileSync, readdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { imagenesCronicas } from "../src/data/cronicas-imagenes";

const ROOT = join(import.meta.dirname, "..");
const DIR = join(ROOT, "src/components/scrolly");

const CUSTOM = new Set([
  "EscenasCongresoCaseros.tsx",
  "EscenasCruce.tsx",
  "EscenasInvasiones.tsx",
  "EscenasMayo.tsx",
]);

const entries: Record<string, { imagenId: string; pie: string }> = {};

for (const file of readdirSync(DIR).filter((f) => f.startsWith("Escenas") && f.endsWith(".tsx"))) {
  if (CUSTOM.has(file)) continue;
  const content = readFileSync(join(DIR, file), "utf8");
  const fnBlocks = content.matchAll(
    /export function (\w+)\(\)\s*\{([\s\S]*?)\n\}/g,
  );
  for (const [, name, body] of fnBlocks) {
    const imagenMatch = body.match(/imagenId="([^"]+)"/);
    const pieMatch = body.match(/pie="([^"]*)"/);
    if (imagenMatch && pieMatch) {
      entries[name] = { imagenId: imagenMatch[1], pie: pieMatch[1] };
    }
  }
}

const sorted = Object.fromEntries(
  Object.entries(entries).sort(([a], [b]) => a.localeCompare(b, "es")),
);

const out = join(ROOT, "src/data/escenas-comparador.ts");
const lines = Object.entries(sorted).map(
  ([name, { imagenId, pie }]) =>
    `  ${name}: { imagenId: ${JSON.stringify(imagenId)}, pie: ${JSON.stringify(pie)} },`,
);

const contenido = `/** Registro paramétrico de escenas comparador: generado por scripts/escenas-extraer.ts */

export type EscenaComparadorDef = {
  imagenId: string;
  pie: string;
};

export const ESCENAS_COMPARADOR: Record<string, EscenaComparadorDef> = {
${lines.join("\n")}
};
`;

writeFileSync(out, contenido, "utf8");

const faltantes = Object.entries(sorted).filter(
  ([, { imagenId }]) => !(imagenId in imagenesCronicas),
);
if (faltantes.length > 0) {
  console.error(`✗ ${faltantes.length} imagenId sin catálogo:`);
  for (const [nombre, { imagenId }] of faltantes) {
    console.error(`  · ${nombre}: ${imagenId}`);
  }
  process.exit(1);
}

console.log(`✓ ${Object.keys(sorted).length} escenas → ${out}`);
