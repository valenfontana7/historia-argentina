#!/usr/bin/env npx tsx
/**
 * Valida el grafo de conocimiento: nodos aislados y efemérides sin relacionados.
 * Uso: npm run grafo:validar
 */
import { validarGrafo } from "../src/lib/grafo/validar";

const resultado = validarGrafo();

console.log(`\nGrafo Argent — ${resultado.totalNodos} nodos\n`);

if (resultado.ok) {
  console.log("✓ Sin problemas detectados.\n");
  process.exit(0);
}

const porTipo = {
  aislado: resultado.problemas.filter((p) => p.tipo === "aislado"),
  "pocas-relaciones": resultado.problemas.filter((p) => p.tipo === "pocas-relaciones"),
  "relacionados-vacio": resultado.problemas.filter((p) => p.tipo === "relacionados-vacio"),
};

for (const [tipo, items] of Object.entries(porTipo)) {
  if (items.length === 0) continue;
  console.log(`\n${tipo} (${items.length}):`);
  for (const p of items.slice(0, 20)) {
    console.log(`  · ${p.entidad}: ${p.detalle}`);
  }
  if (items.length > 20) console.log(`  … y ${items.length - 20} más`);
}

console.log(`\n✗ ${resultado.problemas.length} problemas encontrados.\n`);
process.exit(1);
