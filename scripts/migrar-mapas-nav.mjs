#!/usr/bin/env node
/**
 * Migra mapas scrolly: unifica data-ficha-mapa y agrega MapaCompactoNav.
 */
import { readFileSync, writeFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

const DIR = join(import.meta.dirname, "../src/components/scrolly");
const SKIP = /Ilustrado|CompactoNav|ScrollyShell|ConoSur|RioPlata/;

const files = readdirSync(DIR).filter(
  (f) => f.startsWith("Mapa") && f.endsWith(".tsx") && !SKIP.test(f),
);

for (const file of files) {
  const path = join(DIR, file);
  let src = readFileSync(path, "utf8");
  let changed = false;

  // Unificar atributos de ficha
  const next = src
    .replace(/\[data-ficha-[a-z]+\]/g, "[data-ficha-mapa]")
    .replace(/data-ficha-[a-z]+=/g, "data-ficha-mapa=")
    .replace(/data-ficha=\{/g, "data-ficha-mapa={");

  if (next !== src) {
    src = next;
    changed = true;
  }

  if (src.includes("MapaCompactoNav")) {
    // Actualizar API antigua si quedó selectorFicha
    src = src.replace(
      /<MapaCompactoNav[\s\S]*?\/>/,
      (block) =>
        block
          .replace(/\s*selectorFicha=\{[^}]+\}\n?/g, "")
          .replace(/\s*selectorFicha="[^"]+"\n?/g, ""),
    );
    if (src !== readFileSync(path, "utf8")) changed = true;
  } else if (src.includes("data-ficha-mapa")) {
    // Agregar import
    if (!src.includes("MapaCompactoNav")) {
      src = src.replace(
        /(import \{ useGSAP \} from "@gsap\/react";)/,
        '$1\nimport { MapaCompactoNav } from "@/components/scrolly/MapaCompactoNav";',
      );
    }

    // Detectar variable etapas
    const etapasMatch = src.match(/const etapas = (ETAPAS_\w+|RUTAS_\w+)/);
    const rutasMatch = src.match(/const rutas = (RUTAS_\w+)/);
    const etapasVar = etapasMatch?.[1] ?? rutasMatch?.[1];
    const localVar = etapasMatch ? "etapas" : rutasMatch ? "rutas" : null;

    if (localVar && etapasVar && src.includes("return (")) {
      // Wrap return in fragment + nav if not already
      if (!src.includes("<MapaCompactoNav")) {
        src = src.replace(
          /return \(\n(\s*)<div ref=\{envoltorio\}/,
          "return (\n$1<>\n$1<div ref={envoltorio}",
        );
        src = src.replace(
          /(\s*)<\/div>\n(\s*)\);\n\}/,
          `$1</div>\n$1<MapaCompactoNav\n$1  etapas={${localVar}}\n$1  vhPorEtapa={120}\n$1  contenedorRef={envoltorio}\n$1/>\n$1</>\n$2);\n}`,
        );
        changed = true;
      }
    }
  }

  if (changed) {
    writeFileSync(path, src, "utf8");
    console.log(`✓ ${file}`);
  } else {
    console.log(`· ${file} (sin cambios)`);
  }
}

console.log(`\nMigrados ${files.length} archivos.`);
