export type OpcionProximaCronica = {
  slug: string;
  titulo: string;
  bajada: string;
};

export const opcionesProximaCronica: OpcionProximaCronica[] = [
  {
    slug: "cordobazo",
    titulo: "El Cordobazo",
    bajada: "Mayo de 1969: cuando el trabajo industrial le ganó la calle al poder.",
  },
  {
    slug: "malvinas-ciudad",
    titulo: "Malvinas vista desde la ciudad",
    bajada: "La guerra que llegó a cada barrio argentino en 1982.",
  },
  {
    slug: "exodo-jujeno",
    titulo: "El Éxodo Jujeño",
    bajada: "Belgrano quema la tierra y arrastra un pueblo entero hacia el sur.",
  },
];

export function opcionPorSlug(slug: string): OpcionProximaCronica | undefined {
  return opcionesProximaCronica.find((o) => o.slug === slug);
}
