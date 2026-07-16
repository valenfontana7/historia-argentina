/**
 * Proyección geográfica para mapas esquemáticos del MVP.
 * Coordenadas WGS84 verificadas contra Wikipedia / Memoria Chilena /
 * Museo Histórico Nacional (cruce de los Andes, ene–feb 1817).
 *
 * Convención en pantalla: oeste (Pacífico) = izquierda, este (Atlántico) = derecha.
 */

export type PuntoGeo = {
  lat: number;
  lon: number;
  nombre: string;
};

export type Bounds = {
  latMin: number;
  latMax: number;
  lonMin: number;
  lonMax: number;
};

export type PuntoMapa = { x: number; y: number; nombre: string };

/** Convierte lat/lon a coordenadas SVG dentro de un viewBox. */
export function proyectar(
  lat: number,
  lon: number,
  bounds: Bounds,
  ancho: number,
  alto: number,
): { x: number; y: number } {
  const x = ((lon - bounds.lonMin) / (bounds.lonMax - bounds.lonMin)) * ancho;
  const y = ((bounds.latMax - lat) / (bounds.latMax - bounds.latMin)) * alto;
  return { x, y };
}

export function punto(
  geo: PuntoGeo,
  bounds: Bounds,
  ancho: number,
  alto: number,
): PuntoMapa {
  const { x, y } = proyectar(geo.lat, geo.lon, bounds, ancho, alto);
  return { x, y, nombre: geo.nombre };
}

/** Curva de cruce de cordillera entre dos puntos proyectados. */
export function trazoCruce(a: PuntoMapa, b: PuntoMapa, curvatura = 0.38): string {
  const cx = a.x + (b.x - a.x) * curvatura;
  const cy = Math.min(a.y, b.y) - Math.abs(a.x - b.x) * 0.08;
  return `M ${a.x.toFixed(1)} ${a.y.toFixed(1)} Q ${cx.toFixed(1)} ${cy.toFixed(1)} ${b.x.toFixed(1)} ${b.y.toFixed(1)}`;
}

/** Ruta terrestre por el interior (sin cruzar la cordillera directamente). */
export function trazoInterior(puntos: PuntoMapa[]): string {
  if (puntos.length < 2) return "";
  let d = `M ${puntos[0].x.toFixed(1)} ${puntos[0].y.toFixed(1)}`;
  for (let i = 1; i < puntos.length; i++) {
    const prev = puntos[i - 1];
    const curr = puntos[i];
    const mx = (prev.x + curr.x) / 2;
    const my = (prev.y + curr.y) / 2 - 12;
    d += ` Q ${mx.toFixed(1)} ${my.toFixed(1)} ${curr.x.toFixed(1)} ${curr.y.toFixed(1)}`;
  }
  return d;
}

/** Ruta marítima costera (Chile → Perú). */
export function trazoMaritimo(a: PuntoMapa, b: PuntoMapa): string {
  const cx = a.x + (b.x - a.x) * 0.45;
  const cy = Math.min(a.y, b.y) - 40;
  return `M ${a.x.toFixed(1)} ${a.y.toFixed(1)} C ${cx.toFixed(1)} ${cy.toFixed(1)} ${b.x + 20} ${b.y + 15} ${b.x.toFixed(1)} ${b.y.toFixed(1)}`;
}

// ─── Cono sur (Comparador: camino del norte vs plan San Martín) ─────────────

export const BOUNDS_CONO_SUR: Bounds = {
  latMin: -36.5,
  latMax: -11.5,
  lonMin: -72.5,
  lonMax: -56.0,
};

export const CONO_SUR = {
  buenosAires: { lat: -34.604, lon: -58.382, nombre: "Buenos Aires" },
  salta: { lat: -24.783, lon: -65.411, nombre: "Salta" },
  mendoza: { lat: -32.89, lon: -68.844, nombre: "Mendoza" },
  santiago: { lat: -33.449, lon: -70.669, nombre: "Santiago" },
  lima: { lat: -12.046, lon: -77.043, nombre: "Lima" },
  /** Batalla del 20 jun 1811: Guaqui, La Paz (Bolivia), junto al Titicaca. */
  huaqui: { lat: -16.629, lon: -68.919, nombre: "Huaqui · 1811" },
  /** Batalla del 1 oct 1813: pampa de Vilcapugio, Oruro (Bolivia). */
  vilcapugio: { lat: -19.039, lon: -66.559, nombre: "Vilcapugio · 1813" },
  /** Batalla del 14 nov 1813: llanos de Ayohuma, Potosí (Bolivia). */
  ayohuma: { lat: -18.855, lon: -66.127, nombre: "Ayohuma · 1813" },
} as const satisfies Record<string, PuntoGeo>;

// ─── Cruce de los Andes (MapaCruce: Cuyo → Chile) ───────────────────────────

export const BOUNDS_CRUCE: Bounds = {
  latMin: -36.8,
  latMax: -26.0,
  lonMin: -72.0,
  lonMax: -64.5,
};

/** Puntos de partida en el Cuyo (este) y destinos en Chile (oeste). */
export const CRUCE = {
  laRioja: { lat: -29.413, lon: -66.856, nombre: "La Rioja" },
  sanJuan: { lat: -31.538, lon: -68.524, nombre: "San Juan" },
  mendoza: { lat: -32.89, lon: -68.844, nombre: "Mendoza" },
  sanCarlos: { lat: -34.797, lon: -65.515, nombre: "San Carlos" },
  copiapo: { lat: -27.366, lon: -70.332, nombre: "Copiapó" },
  laSerena: { lat: -29.903, lon: -71.252, nombre: "La Serena" },
  sanFelipe: { lat: -32.751, lon: -70.725, nombre: "San Felipe" },
  losAndes: { lat: -32.834, lon: -70.598, nombre: "Los Andes" },
  sanGabriel: { lat: -33.077, lon: -70.611, nombre: "San Gabriel" },
  talca: { lat: -35.427, lon: -71.667, nombre: "Talca" },
  curico: { lat: -34.983, lon: -71.239, nombre: "Curicó" },
} as const satisfies Record<string, PuntoGeo>;

export type RutaCruce = {
  nombre: string;
  jefe: string;
  destino: string;
  detalle: string;
  principal: boolean;
  origen: keyof typeof CRUCE;
  destinoGeo: keyof typeof CRUCE;
};

/**
 * Seis columnas del Ejército de los Andes (ene–feb 1817).
 * Fuentes: Wikipedia «Rutas sanmartinianas», Memoria Chilena, MHN.
 */
export const RUTAS_CRUCE: RutaCruce[] = [
  {
    nombre: "Ruta de Comecaballos",
    jefe: "Zelada y Dávila",
    destino: "Copiapó",
    detalle:
      "La columna más al norte: desde Guandacol (La Rioja) cruza el paso de Come-Caballos y ocupa Copiapó el 13 de febrero, sembrando la idea de un ataque por el desierto de Atacama.",
    principal: false,
    origen: "laRioja",
    destinoGeo: "copiapo",
  },
  {
    nombre: "Ruta de Guana",
    jefe: "Juan Manuel Cabot",
    destino: "Coquimbo y La Serena",
    detalle:
      "Desde San Juan, 140 milicianos cruzan el paso de Guana hacia el norte chileno y ocupan Coquimbo el 12 de febrero.",
    principal: false,
    origen: "sanJuan",
    destinoGeo: "laSerena",
  },
  {
    nombre: "Paso del Portillo",
    jefe: "José León Lemos",
    destino: "San Gabriel",
    detalle:
      "Partida de distracción desde Mendoza por el Portillo de Piuquenes. Amaga sobre San Gabriel para confundir al enemigo sobre el eje de San Felipe.",
    principal: false,
    origen: "mendoza",
    destinoGeo: "sanGabriel",
  },
  {
    nombre: "Paso del Planchón",
    jefe: "Ramón Freire",
    destino: "Curicó y Talca",
    detalle:
      "Por el extremo sur, desde San Carlos (Mendoza) cruza el Planchón para agitar el sur chileno y obligar a dispersar tropas realistas.",
    principal: false,
    origen: "sanCarlos",
    destinoGeo: "curico",
  },
  {
    nombre: "Paso de Uspallata",
    jefe: "Juan Gregorio de Las Heras",
    destino: "Valle de Los Andes",
    detalle:
      "Columna con toda la artillería: cañones desarmados a lomo de mula por Uspallata. Se reúne con la columna de Los Patos en el pie de Chacabuco el 9 de febrero.",
    principal: false,
    origen: "mendoza",
    destinoGeo: "losAndes",
  },
  {
    nombre: "Paso de Los Patos",
    jefe: "San Martín · O'Higgins · Soler",
    destino: "San Felipe",
    detalle:
      "La columna principal: más de 3.000 hombres por el paso más alto (4.776 m en el Espinacito). San Felipe, 8 de febrero; Chacabuco, cuatro días después.",
    principal: true,
    origen: "mendoza",
    destinoGeo: "sanFelipe",
  },
];

/** Proyecta todos los puntos del cruce dentro del viewBox del mapa. */
export function puntosCruce(ancho: number, alto: number): Record<keyof typeof CRUCE, PuntoMapa> {
  const out = {} as Record<keyof typeof CRUCE, PuntoMapa>;
  for (const [clave, geo] of Object.entries(CRUCE) as [keyof typeof CRUCE, PuntoGeo][]) {
    out[clave] = punto(geo, BOUNDS_CRUCE, ancho, alto);
  }
  return out;
}

/** Proyecta puntos del cono sur para el comparador. */
export function puntosConoSur(ancho: number, alto: number): Record<keyof typeof CONO_SUR, PuntoMapa> {
  const out = {} as Record<keyof typeof CONO_SUR, PuntoMapa>;
  for (const [clave, geo] of Object.entries(CONO_SUR) as [keyof typeof CONO_SUR, PuntoGeo][]) {
    out[clave] = punto(geo, BOUNDS_CONO_SUR, ancho, alto);
  }
  return out;
}
