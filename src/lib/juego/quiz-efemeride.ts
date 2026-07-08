import { efemerideParaFecha, efemerides, type Efemeride } from "@/data/efemerides";
import { slugDeCategoria } from "@/data/categorias";

export type OpcionQuiz = {
  id: string;
  texto: string;
  correcta: boolean;
};

export type QuizRound = {
  fecha: string;
  diaSlug: string;
  pregunta: string;
  opciones: OpcionQuiz[];
  explicacion: string;
  anio: number;
};

function hashFecha(fecha: Date): number {
  const y = fecha.getFullYear();
  const m = fecha.getMonth() + 1;
  const d = fecha.getDate();
  let h = y * 10000 + m * 100 + d;
  h = ((h ^ (h >>> 16)) * 0x45d9f3b) | 0;
  h = ((h ^ (h >>> 16)) * 0x45d9f3b) | 0;
  return Math.abs(h ^ (h >>> 16));
}

function mulberry32(seed: number) {
  return function next() {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function elegibles(): Efemeride[] {
  return efemerides.filter((e) => e.relacionados.length > 0);
}

function distractores(
  correcta: Efemeride,
  cantidad: number,
  rng: () => number,
): Efemeride[] {
  const pool = elegibles().filter((e) => e.dia !== correcta.dia);
  const mismaCat = pool.filter((e) => e.categoria === correcta.categoria);
  const cercanos = pool.filter(
    (e) => Math.abs(e.anio - correcta.anio) <= 30 && e.categoria !== correcta.categoria,
  );
  const resto = pool.filter(
    (e) => !mismaCat.includes(e) && !cercanos.includes(e),
  );

  const mezclar = <T>(arr: T[]) =>
    [...arr].sort(() => rng() - 0.5);

  const candidatos = [
    ...mezclar(mismaCat),
    ...mezclar(cercanos),
    ...mezclar(resto),
  ];

  const vistos = new Set<string>();
  const out: Efemeride[] = [];
  for (const c of candidatos) {
    if (out.length >= cantidad) break;
    if (vistos.has(c.dia)) continue;
    vistos.add(c.dia);
    out.push(c);
  }
  return out;
}

export function generarQuiz(fecha: Date): QuizRound {
  const mes = fecha.getMonth() + 1;
  const dia = fecha.getDate();
  const correcta = efemerideParaFecha(mes, dia);
  const rng = mulberry32(hashFecha(fecha));
  const dist = distractores(correcta, 3, rng);

  const opcionesRaw = [correcta, ...dist].sort(() => rng() - 0.5);
  const opciones: OpcionQuiz[] = opcionesRaw.map((e) => ({
    id: e.dia,
    texto: `${e.anio}: ${e.titulo}`,
    correcta: e.dia === correcta.dia,
  }));

  return {
    fecha: correcta.fecha,
    diaSlug: correcta.dia,
    pregunta: `¿Qué pasó un ${correcta.fecha} en la historia argentina?`,
    opciones,
    explicacion: correcta.historia[0] ?? correcta.titulo,
    anio: correcta.anio,
  };
}

export function categoriaSlugQuiz(diaSlug: string): string | undefined {
  const e = efemerides.find((x) => x.dia === diaSlug);
  return e ? slugDeCategoria(e.categoria) : undefined;
}
