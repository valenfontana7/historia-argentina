#!/usr/bin/env npx tsx
/**
 * Valida metadata y coherencia del catálogo de crónicas.
 * Uso: npm run cronicas:validar
 */
import { execSync } from "node:child_process";
import { validarCronicas } from "../src/lib/cronicas/validar";
import { validarEscenasComparador } from "../src/lib/cronicas/validar-escenas";
import { validarPuentesEditoriales } from "../src/lib/grafo/validar-puentes";

execSync("npx tsx scripts/piezas-indexar.ts", { stdio: "inherit" });
execSync("npx tsx scripts/audioguias-indexar.ts", { stdio: "inherit" });

const resultado = validarCronicas();
const escenas = validarEscenasComparador();
const puentes = validarPuentesEditoriales();

console.log(`\nCrónicas Argent — ${resultado.total} ítems\n`);

if (!puentes.ok) {
  console.log(`✗ ${puentes.problemas.length} puentes editoriales:\n`);
  for (const p of puentes.problemas) {
    console.log(`  · ${p}`);
  }
  console.log();
  process.exit(1);
}

if (!escenas.ok) {
  console.log(`✗ ${escenas.problemas.length} escenas comparador:\n`);
  for (const p of escenas.problemas) {
    console.log(`  · ${p}`);
  }
  console.log();
  process.exit(1);
}

if (resultado.ok) {
  console.log("✓ Catálogo consistente.\n");
  process.exit(0);
}

console.log(`✗ ${resultado.problemas.length} problemas:\n`);
for (const p of resultado.problemas) {
  console.log(`  · ${p.slug}: ${p.detalle}`);
}
console.log();
process.exit(1);
