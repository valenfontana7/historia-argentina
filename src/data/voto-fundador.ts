export type OpcionProximaCronica = {
  slug: string;
  titulo: string;
  bajada: string;
};

export const opcionesProximaCronica: OpcionProximaCronica[] = [
  {
    slug: "levingston",
    titulo: "Levingston",
    bajada: "1970: el general interino de la Revolución Argentina.",
  },
  {
    slug: "campora",
    titulo: "Cámpora",
    bajada: "Marzo de 1973: el peronismo vuelve a las urnas.",
  },
  {
    slug: "celman",
    titulo: "Celman",
    bajada: "1886: la Generación del Ochenta y el estallido de 1890.",
  },
  {
    slug: "videla",
    titulo: "Videla",
    bajada: "1976: el rostro del Proceso de Reorganización Nacional.",
  },
  {
    slug: "massera",
    titulo: "Massera",
    bajada: "El almirante de la ESMA y los vuelos de la muerte.",
  },
];

export function opcionPorSlug(slug: string): OpcionProximaCronica | undefined {
  return opcionesProximaCronica.find((o) => o.slug === slug);
}
