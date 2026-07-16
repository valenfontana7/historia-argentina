export type CronicaMetaLite = {
  slug: string;
  titulo: string;
  descripcion: string;
  periodo?: string;
  anioInicio?: number;
  anioFin?: number;
  protagonista?: { slug: string; etiqueta: string };
  visual?: { imagenHero?: string };
};

export type ExhibitionInput = {
  cronica: CronicaMetaLite;
  audioguiaSegmentos?: Array<{ titulo: string; texto: string }>;
  imageIds?: string[];
  places?: Array<{ id: string; name: string }>;
};
