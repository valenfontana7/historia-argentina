import type { EditorialBrand } from "./contracts";

export const parallelEditorialFixture = {
  synthetic: true,
  title: "Fixture sintético: dos lecturas de una medida hipotética",
  summary: "Caso de demo sin afirmaciones políticas reales para probar la separación de marcas.",
  claims: [
    { id: "claim-1", text: "La medida hipotética modifica un precio regulado.", evidence: "Fuente oficial ficticia 2026-01" },
    { id: "claim-2", text: "El impacto depende del ingreso del hogar.", evidence: "Serie estadística ficticia" },
  ],
  angles: {
    museoargent: { brand: "museoargent" as EditorialBrand, thesis: "Qué revela este cambio sobre la memoria de las políticas públicas.", tone: "histórico y contextual" },
    labrechahoy: { brand: "labrechahoy" as EditorialBrand, thesis: "Cómo leer el efecto en el bolsillo y qué dato mirar mañana.", tone: "claro, directo y basado en datos" },
  },
};
