#!/usr/bin/env npx tsx
/**
 * Valida metadata y coherencia del catálogo de crónicas.
 * Uso: npm run cronicas:validar
 */
import { execSync } from "node:child_process";
import { validarCronicas } from "../src/lib/cronicas/validar";

execSync("npx tsx scripts/piezas-indexar.ts", { stdio: "inherit" });
execSync("npx tsx scripts/audioguias-indexar.ts", { stdio: "inherit" });

const resultado = validarCronicas();

console.log(`\nCrónicas Argent — ${resultado.total} ítems\n`);

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
