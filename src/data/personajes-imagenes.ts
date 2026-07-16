/**
 * Retratos históricos desde Wikimedia Commons.
 * URLs verificadas vía Wikipedia (es): formato thumb/960px para compatibilidad.
 */

export type ImagenPersonaje = {
  url: string;
  credito: string;
};

export const imagenesPersonajes: Record<string, ImagenPersonaje> = {
  "jose-de-san-martin": {
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/aa/Retrato_m%C3%A1s_can%C3%B3nico_de_Jos%C3%A9_de_San_Mart%C3%ADn.jpg/960px-Retrato_m%C3%A1s_can%C3%B3nico_de_Jos%C3%A9_de_San_Mart%C3%ADn.jpg",
    credito: "Wikimedia Commons",
  },
  "manuel-belgrano": {
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Manuel_Belgrano.JPG/960px-Manuel_Belgrano.JPG",
    credito: "Wikimedia Commons",
  },
  "mariano-moreno": {
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c7/Mariano_Moreno.jpg/960px-Mariano_Moreno.jpg",
    credito: "Wikimedia Commons",
  },
  "cornelio-saavedra": {
    url: "https://upload.wikimedia.org/wikipedia/commons/2/28/Cornelio_Saavedra.jpg",
    credito: "Wikimedia Commons",
  },
  "juan-jose-castelli": {
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/39/Castelli.jpg/960px-Castelli.jpg",
    credito: "Wikimedia Commons",
  },
  "santiago-de-liniers": {
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/70/Santiago_de_Liniers.jpg/960px-Santiago_de_Liniers.jpg",
    credito: "Wikimedia Commons · Museo Naval de Madrid",
  },
  "martin-miguel-de-guemes": {
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c9/Mart%C3%ADn_Miguel_de_G%C3%BCemes_1.jpg/960px-Mart%C3%ADn_Miguel_de_G%C3%BCemes_1.jpg",
    credito: "Wikimedia Commons",
  },
  "juana-azurduy": {
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/Juana_Azurduy.jpg/960px-Juana_Azurduy.jpg",
    credito: "Wikimedia Commons",
  },
  "mariquita-sanchez-de-thompson": {
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1f/Mar%C3%ADa_S%C3%A1nchez_de_Thompson.jpg/960px-Mar%C3%ADa_S%C3%A1nchez_de_Thompson.jpg",
    credito: "Wikimedia Commons · reproducción de Jean-Philippe Goulu",
  },
  "bernardino-rivadavia": {
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f9/Bernardino_Rivadavia_%28cropped%29.jpg/960px-Bernardino_Rivadavia_%28cropped%29.jpg",
    credito: "Wikimedia Commons",
  },
  "manuel-dorrego": {
    url: "https://upload.wikimedia.org/wikipedia/commons/3/3b/Dorrego_a_color.jpg",
    credito: "Wikimedia Commons",
  },
  "juan-manuel-de-rosas": {
    url: "https://upload.wikimedia.org/wikipedia/commons/5/5d/Juan_Manuel_de_Rosas.jpg",
    credito: "Wikimedia Commons",
  },
  "juan-facundo-quiroga": {
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/66/Facundo_Quiroga.jpg/960px-Facundo_Quiroga.jpg",
    credito: "Wikimedia Commons",
  },
  "justo-jose-de-urquiza": {
    url: "https://upload.wikimedia.org/wikipedia/commons/2/2e/Daguerrotipo_de_Justo_Jos%C3%A9_de_Urquiza_%28recorte%29.jpg",
    credito: "Wikimedia Commons",
  },
  "juan-bautista-alberdi": {
    url: "https://upload.wikimedia.org/wikipedia/commons/7/76/Juan_Bautista_Alberdi-restored.jpg",
    credito: "Wikimedia Commons",
  },
  "domingo-faustino-sarmiento": {
    url: "https://upload.wikimedia.org/wikipedia/commons/9/9d/Sarmiento.jpg",
    credito: "Wikimedia Commons",
  },
  "bartolome-mitre": {
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1c/Bartolom%C3%A9_Mitre_01.jpg/960px-Bartolom%C3%A9_Mitre_01.jpg",
    credito: "Wikimedia Commons",
  },
  "julio-argentino-roca": {
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f7/RetratoROcaMuseo.jpg/960px-RetratoROcaMuseo.jpg",
    credito: "Wikimedia Commons",
  },
  "hipolito-yrigoyen": {
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/Hipolito_Yrigoyen_-_NAC.jpg/960px-Hipolito_Yrigoyen_-_NAC.jpg",
    credito: "Wikimedia Commons",
  },
  "juan-domingo-peron": {
    url: "https://upload.wikimedia.org/wikipedia/commons/0/07/Juan_Per%C3%B3n_%28cropped%29.jpg",
    credito: "Wikimedia Commons",
  },
  "eva-peron": {
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/50/Eva_Per%C3%B3n_vestida_lujosamente.jpg/960px-Eva_Per%C3%B3n_vestida_lujosamente.jpg",
    credito: "Wikimedia Commons",
  },
  "raul-alfonsin": {
    url: "https://upload.wikimedia.org/wikipedia/commons/2/22/Argentina.RaulAlfonsin.01.jpg",
    credito: "Wikimedia Commons",
  },
};

export function obtenerImagenPersonaje(slug: string): ImagenPersonaje | undefined {
  return imagenesPersonajes[slug];
}
