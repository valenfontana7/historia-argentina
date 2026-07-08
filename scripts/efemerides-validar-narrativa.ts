#!/usr/bin/env npx tsx
/**
 * QA narrativa: slugs en efemerides-narrativa.ts deben existir en efemerides.ts
 * y mencionar el año histórico de la entrada (señal mínima de alineación).
 * Uso: npm run efemerides:validar
 */
import { efemerides } from "../src/data/efemerides";
import { narrativaEfemerides } from "../src/data/efemerides-narrativa";

type Problema = { slug: string; detalle: string; nivel: "error" | "aviso" };

const porSlug = new Map(efemerides.map((e) => [e.dia, e]));
const errores: Problema[] = [];
const avisos: Problema[] = [];

for (const slug of Object.keys(narrativaEfemerides)) {
  const efemeride = porSlug.get(slug);
  const narrativa = narrativaEfemerides[slug];

  if (!efemeride) {
    errores.push({
      slug,
      detalle: "Narrativa sin efeméride correspondiente en efemerides.ts",
      nivel: "error",
    });
    continue;
  }

  if (!narrativa.hook?.trim() || !narrativa.giro?.trim()) {
    errores.push({ slug, detalle: "Hook o giro vacío", nivel: "error" });
  }

  const anioStr = String(efemeride.anio);
  const texto = `${narrativa.hook} ${narrativa.giro} ${narrativa.cita?.texto ?? ""}`;
  if (!texto.includes(anioStr)) {
    avisos.push({
      slug,
      detalle: `Narrativa no cita el año ${anioStr} de «${efemeride.titulo}» (revisión manual recomendada)`,
      nivel: "aviso",
    });
  }
}

console.log(`\nEfemérides — ${efemerides.length} en archivo, ${Object.keys(narrativaEfemerides).length} con narrativa\n`);

if (avisos.length > 0) {
  console.log(`Avisos (${avisos.length}) — no bloquean el build:\n`);
  for (const p of avisos.slice(0, 10)) {
    console.log(`  · ${p.slug}: ${p.detalle}`);
  }
  if (avisos.length > 10) console.log(`  … y ${avisos.length - 10} más\n`);
}

if (errores.length === 0) {
  console.log("✓ Narrativa sin errores estructurales.\n");
  process.exit(0);
}

console.log(`Errores (${errores.length}):\n`);
for (const p of errores) {
  console.log(`  · ${p.slug}: ${p.detalle}`);
}
console.log("");
process.exit(1);
