export type Categoria = {
  slug: string;
  nombre: string;
  descripcion: string;
};

/** Mapeo de nombre editorial (efemérides) → slug URL */
export const slugPorNombre: Record<string, string> = {
  Política: "politica",
  Batallas: "batallas",
  Personajes: "personajes",
  Independencia: "independencia",
  Memoria: "memoria",
  Guerras: "guerras",
  Cultura: "cultura",
  Sociedad: "sociedad",
  Fundaciones: "fundaciones",
  Tragedias: "tragedias",
  Ciencia: "ciencia",
};

export const categorias: Categoria[] = [
  {
    slug: "politica",
    nombre: "Política",
    descripcion:
      "Revoluciones, gobiernos, constituciones y los momentos en que Argentina decidió quién manda.",
  },
  {
    slug: "batallas",
    nombre: "Batallas",
    descripcion:
      "Combates que cambiaron el mapa: desde San Lorenzo hasta las fronteras del siglo XX.",
  },
  {
    slug: "personajes",
    nombre: "Personajes",
    descripcion:
      "Vidas que condensan una época: héroes, villanos y figuras olvidadas del relato nacional.",
  },
  {
    slug: "independencia",
    nombre: "Independencia",
    descripcion:
      "De Mayo de 1810 al Congreso de Tucumán: la gestación de un país soberano.",
  },
  {
    slug: "memoria",
    nombre: "Memoria",
    descripcion:
      "Hechos que el país no olvida: dictaduras, retorno democrático y luchas por la verdad.",
  },
  {
    slug: "guerras",
    nombre: "Guerras",
    descripcion:
      "Conflictos armados internos y externos que marcaron fronteras y conciencias.",
  },
  {
    slug: "cultura",
    nombre: "Cultura",
    descripcion:
      "Arte, literatura, música y símbolos que dieron forma a la identidad argentina.",
  },
  {
    slug: "sociedad",
    nombre: "Sociedad",
    descripcion:
      "Movimientos sociales, derechos conquistados y transformaciones del tejido cotidiano.",
  },
  {
    slug: "fundaciones",
    nombre: "Fundaciones",
    descripcion:
      "Ciudades, instituciones y primeros asentamientos que abrieron camino al país moderno.",
  },
  {
    slug: "tragedias",
    nombre: "Tragedias",
    descripcion:
      "Catástrofes, desastres y pérdidas colectivas que dejaron huella en la memoria.",
  },
  {
    slug: "ciencia",
    nombre: "Ciencia",
    descripcion:
      "Descubrimientos, inventos y mentes argentinas que miraron más allá del presente.",
  },
];

export function obtenerCategoria(slug: string): Categoria | undefined {
  return categorias.find((c) => c.slug === slug);
}

export function slugDeCategoria(nombre: string): string | undefined {
  return slugPorNombre[nombre];
}

export function nombreDeCategoria(slug: string): string | undefined {
  return categorias.find((c) => c.slug === slug)?.nombre;
}
