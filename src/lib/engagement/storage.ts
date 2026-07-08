const CLAVE_RECIENTES = "argent:recientes";
const CLAVE_PROGRESO = "argent:progreso";
const CLAVE_FAVORITOS = "argent:favoritos";
const CLAVE_QUIZ_STREAK = "argent:quiz-streak";

export type QuizStreak = {
  racha: number;
  ultimoDia: string;
  totalCorrectas: number;
};
const MAX_RECIENTES = 12;

export type PaginaReciente = {
  href: string;
  titulo: string;
  tipo: "persona" | "evento" | "cronica" | "lugar" | "periodo" | "categoria" | "otro";
  vistoEn: number;
};

export type Favorito = {
  href: string;
  titulo: string;
  tipo: PaginaReciente["tipo"];
};

function leer<T>(clave: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(clave);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function escribir(clave: string, valor: unknown): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(clave, JSON.stringify(valor));
  } catch {
    // Quota exceeded u otro error: ignorar silenciosamente.
  }
}

export function agregarReciente(pagina: Omit<PaginaReciente, "vistoEn">): void {
  const actuales = leer<PaginaReciente[]>(CLAVE_RECIENTES, []);
  const filtradas = actuales.filter((p) => p.href !== pagina.href);
  const nueva: PaginaReciente = { ...pagina, vistoEn: Date.now() };
  escribir(CLAVE_RECIENTES, [nueva, ...filtradas].slice(0, MAX_RECIENTES));
}

export function obtenerRecientes(): PaginaReciente[] {
  return leer<PaginaReciente[]>(CLAVE_RECIENTES, []);
}

export function guardarProgreso(href: string, porcentaje: number): void {
  const mapa = leer<Record<string, number>>(CLAVE_PROGRESO, {});
  mapa[href] = Math.max(mapa[href] ?? 0, porcentaje);
  escribir(CLAVE_PROGRESO, mapa);
}

export function obtenerProgreso(href: string): number {
  const mapa = leer<Record<string, number>>(CLAVE_PROGRESO, {});
  return mapa[href] ?? 0;
}

export function alternarFavorito(fav: Omit<Favorito, never>): boolean {
  const actuales = leer<Favorito[]>(CLAVE_FAVORITOS, []);
  const existe = actuales.some((f) => f.href === fav.href);
  if (existe) {
    escribir(
      CLAVE_FAVORITOS,
      actuales.filter((f) => f.href !== fav.href),
    );
    return false;
  }
  escribir(CLAVE_FAVORITOS, [fav, ...actuales].slice(0, 50));
  return true;
}

export function esFavorito(href: string): boolean {
  return leer<Favorito[]>(CLAVE_FAVORITOS, []).some((f) => f.href === href);
}

export function obtenerFavoritos(): Favorito[] {
  return leer<Favorito[]>(CLAVE_FAVORITOS, []);
}

function diaIso(fecha: Date): string {
  return fecha.toISOString().slice(0, 10);
}

export function obtenerQuizStreak(): QuizStreak {
  return leer<QuizStreak>(CLAVE_QUIZ_STREAK, {
    racha: 0,
    ultimoDia: "",
    totalCorrectas: 0,
  });
}

export function registrarQuizCorrecto(fecha: Date): QuizStreak {
  const hoy = diaIso(fecha);
  const actual = obtenerQuizStreak();
  const ayer = new Date(fecha);
  ayer.setDate(ayer.getDate() - 1);
  const ayerIso = diaIso(ayer);

  const racha =
    actual.ultimoDia === hoy
      ? actual.racha
      : actual.ultimoDia === ayerIso
        ? actual.racha + 1
        : 1;

  const nuevo: QuizStreak = {
    racha,
    ultimoDia: hoy,
    totalCorrectas: actual.totalCorrectas + 1,
  };
  escribir(CLAVE_QUIZ_STREAK, nuevo);
  return nuevo;
}
