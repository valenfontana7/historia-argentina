#!/usr/bin/env npx tsx
/**
 * Inserta VitrinaContexto tras el primer </Prosa> en MDX sin vitrina.
 * Usa el protagonista del registro como destino.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { cronicas } from "../src/content/cronicas/registro";

const ROOT = join(import.meta.dirname, "..");
const MDX_DIR = join(ROOT, "src/content/cronicas");

const PUENTES: Record<string, string> = {
  "jose-de-san-martin": "Su retrato en el Panteón: el Libertador de América.",
  "manuel-belgrano": "El general que no quiso ser militar: su ficha en el Panteón.",
  "juan-manuel-de-rosas": "El Restaurador: su retrato en el Panteón.",
  "juan-domingo-peron": "Su retrato en el Panteón: el movimiento que cambió el siglo XX.",
  "eva-peron": "Evita en el Panteón: la compañera que transformó la política.",
  "raul-alfonsin": "Quien devolvió la democracia: su retrato en el Panteón.",
  "domingo-faustino-sarmiento": "El maestro de América: su ficha en el Panteón.",
  "juan-bautista-alberdi": "Autor de las Bases: su retrato en el Panteón.",
  "julio-argentino-roca": "Paz y administración: su retrato en el Panteón.",
  "hipolito-yrigoyen": "El primer presidente electo por voto secreto: su ficha.",
  "bartolome-mitre": "Historiador y presidente: su retrato en el Panteón.",
  "justo-jose-de-urquiza": "El vencedor de Caseros: su ficha en el Panteón.",
  "santiago-de-liniers": "Héroe de la Reconquista: su retrato en el Panteón.",
  "mariano-moreno": "La pluma de Mayo: su ficha en el Panteón.",
  "martin-miguel-de-guemes": "El caudillo del norte: su retrato en el Panteón.",
  "juana-azurduy": "La guerrilla del Alto Perú: su ficha en el Panteón.",
  "juan-facundo-quiroga": "El Tigre de los Llanos: su retrato en el Panteón.",
  "manuel-dorrego": "Federal fusilado: su ficha en el Panteón.",
  "juan-jose-castelli": "El orador de la revolución: su retrato en el Panteón.",
  "cornelio-saavedra": "Presidente de la Primera Junta: su ficha.",
  "mariquita-sanchez-de-thompson": "El salón de la revolución: su retrato en el Panteón.",
  "bernardino-rivadavia": "Primer presidente unitario: su ficha en el Panteón.",
};

let insertados = 0;
let omitidos = 0;

for (const cronica of cronicas) {
  const path = join(MDX_DIR, `${cronica.slug}.mdx`);
  let content: string;
  try {
    content = readFileSync(path, "utf8");
  } catch {
    omitidos++;
    continue;
  }
  if (content.includes("VitrinaContexto")) {
    omitidos++;
    continue;
  }

  const protagonSlug = cronica.protagonista.slug;
  const puente =
    PUENTES[protagonSlug] ??
    `El protagonista de esta sala: su retrato en el Panteón.`;

  const bloque = `
<VitrinaContexto
  tipo="persona"
  slug="${protagonSlug}"
  puente="${puente}"
/>
`;

  const idx = content.indexOf("</Prosa>");
  if (idx === -1) {
    console.log(`sin Prosa: ${cronica.slug}`);
    omitidos++;
    continue;
  }

  const insertAt = idx + "</Prosa>".length;
  const nuevo = content.slice(0, insertAt) + "\n" + bloque + content.slice(insertAt);
  writeFileSync(path, nuevo, "utf8");
  insertados++;
  console.log(`✓ ${cronica.slug} → ${protagonSlug}`);
}

console.log(`\nInsertadas: ${insertados} · Omitidas: ${omitidos}`);
