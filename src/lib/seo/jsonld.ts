import { sitio } from "@/lib/site.config";

export type Migaja = {
  nombre: string;
  href: string;
};

export function migajasJsonLd(migajas: Migaja[]): object {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: migajas.map((m, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: m.nombre,
      item: m.href.startsWith("http") ? m.href : `${sitio.url}${m.href}`,
    })),
  };
}

export function personaJsonLd(params: {
  nombre: string;
  titulo: string;
  resumen: string;
  slug: string;
  nacimiento: { anio: number; lugar: string };
  muerte?: { anio: number; lugar: string } | null;
  imagen?: string;
}): object {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: params.nombre,
    alternateName: params.titulo,
    description: params.resumen,
    birthDate: String(params.nacimiento.anio),
    birthPlace: params.nacimiento.lugar,
    ...(params.muerte && {
      deathDate: String(params.muerte.anio),
      deathPlace: params.muerte.lugar,
    }),
    url: `${sitio.url}/panteon/${params.slug}`,
    ...(params.imagen && { image: params.imagen }),
  };
}

export function eventoJsonLd(params: {
  titulo: string;
  descripcion: string;
  dia: string;
  fecha: string;
  anio: number;
  categoria: string;
}): object {
  return {
    "@context": "https://schema.org",
    "@type": "Event",
    name: params.titulo,
    description: params.descripcion,
    startDate: `${params.anio}`,
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    eventStatus: "https://schema.org/EventScheduled",
    location: {
      "@type": "Place",
      name: "Argentina",
      address: { "@type": "PostalAddress", addressCountry: "AR" },
    },
    url: `${sitio.url}/hoy/${params.dia}`,
    about: params.categoria,
  };
}

export function articuloJsonLd(params: {
  titulo: string;
  descripcion: string;
  url: string;
}): object {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: params.titulo,
    description: params.descripcion,
    inLanguage: "es",
    author: { "@type": "Organization", name: sitio.nombre },
    publisher: { "@type": "Organization", name: sitio.nombre },
    mainEntityOfPage: params.url,
  };
}

export function lugarJsonLd(params: {
  nombre: string;
  descripcion: string;
  slug: string;
  region: string;
}): object {
  return {
    "@context": "https://schema.org",
    "@type": "Place",
    name: params.nombre,
    description: params.descripcion,
    url: `${sitio.url}/lugares/${params.slug}`,
    containedInPlace: {
      "@type": "Place",
      name: params.region,
    },
  };
}

export function faqJsonLd(
  items: { pregunta: string; respuesta: string }[],
): object {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.pregunta,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.respuesta,
      },
    })),
  };
}

export function jsonLdScript(data: object | object[]): string {
  return JSON.stringify(data);
}

export function nodoOrganizacion(): object {
  return {
    "@type": "Organization",
    name: sitio.nombre,
    alternateName: sitio.lema,
    description: sitio.descripcion,
    url: sitio.url,
    logo: `${sitio.url}/icon`,
    sameAs: Object.values(sitio.redes),
  };
}

export function nodoSitioWeb(): object {
  return {
    "@type": "WebSite",
    name: sitio.nombre,
    alternateName: sitio.lema,
    description: sitio.descripcion,
    url: sitio.url,
    inLanguage: "es-AR",
    publisher: { "@type": "Organization", name: sitio.nombre },
  };
}

export function grafoSitioJsonLd(): object {
  return {
    "@context": "https://schema.org",
    "@graph": [nodoSitioWeb(), nodoOrganizacion()],
  };
}

/** @deprecated Usar `nodoOrganizacion` dentro de `grafoSitioJsonLd`. */
export function organizacionJsonLd(): object {
  return { "@context": "https://schema.org", ...nodoOrganizacion() };
}

/** @deprecated Usar `nodoSitioWeb` dentro de `grafoSitioJsonLd`. */
export function sitioWebJsonLd(): object {
  return { "@context": "https://schema.org", ...nodoSitioWeb() };
}
