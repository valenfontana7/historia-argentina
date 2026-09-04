import { parallelEditorialFixture } from "../src/lib/editorial/fixture";
import {
  addClaim,
  addSource,
  createAngle,
  createStory,
  createVariant,
  scoreStory,
  transitionAngle,
  transitionStory,
  transitionVariant,
  verifyClaim,
} from "../src/lib/editorial/service";
import { prisma } from "../src/lib/db";

const ACTOR = "valenfontana7@gmail.com";
const SLUG = "fixture-medida-hipotetica";

async function main() {
  const existing = await prisma.editorialStory.findUnique({ where: { slug: SLUG } });
  if (existing) {
    console.log(JSON.stringify({ seeded: false, storyId: existing.id, adminUrl: `/admin/editorial/${existing.id}` }));
    return;
  }

  const fixture = parallelEditorialFixture;
  const { id: storyId } = await createStory({
    title: fixture.title,
    summary: fixture.summary,
    slug: SLUG,
    tags: ["fixture", "economia", "demo"],
    eventDate: new Date("2026-01-15"),
    createdByEmail: ACTOR,
  });

  await transitionStory({ id: storyId, to: "triaged", actorEmail: ACTOR });
  await transitionStory({ id: storyId, to: "researching", actorEmail: ACTOR });

  const sourceA = await addSource(
    {
      storyId,
      type: "official",
      title: "Fuente oficial ficticia 2026-01",
      url: "https://example.com/fuente-oficial",
      publisher: "Ministerio demo",
      accessedAt: new Date(),
      isPrimary: true,
    },
    ACTOR,
  );
  const sourceB = await addSource(
    {
      storyId,
      type: "secondary",
      title: "Serie estadística ficticia",
      url: "https://example.com/serie",
      publisher: "INDEC demo",
      accessedAt: new Date(),
      isPrimary: false,
    },
    ACTOR,
  );

  const claimA = await addClaim(
    {
      storyId,
      text: fixture.claims[0]!.text,
      classification: "fact",
      importance: 5,
      sourceId: sourceA.id,
      relation: "supports",
      quote: fixture.claims[0]!.evidence,
    },
    ACTOR,
  );
  const claimB = await addClaim(
    {
      storyId,
      text: fixture.claims[1]!.text,
      classification: "fact",
      importance: 4,
      sourceId: sourceB.id,
      relation: "supports",
      quote: fixture.claims[1]!.evidence,
    },
    ACTOR,
  );

  await verifyClaim({ claimId: claimA.id, status: "verified", actorEmail: ACTOR, note: "Fixture demo" });
  await verifyClaim({ claimId: claimB.id, status: "verified", actorEmail: ACTOR, note: "Fixture demo" });

  await scoreStory({
    id: storyId,
    actorEmail: ACTOR,
    breakdown: {
      freshness: 4,
      relevance: 5,
      dailyImpact: 4,
      sourceQuality: 4,
      visualPotential: 4,
      ownAngle: 5,
      historicalDepth: 3,
      saturation: 2,
    },
  });

  const labrechaAngle = await createAngle({
    storyId,
    actorEmail: ACTOR,
    brief: {
      brand: "labrechahoy",
      audience: "lectores curiosos",
      thesis: fixture.angles.labrechahoy.thesis,
      tone: fixture.angles.labrechahoy.tone,
      exclusions: ["predicciones electorales"],
      whatHappened: "Se anunció una medida hipotética sobre un precio regulado.",
      whatChanged: "El precio de referencia queda sujeto a un nuevo esquema.",
      affectedGroups: ["hogares de ingresos medios", "comercios minoristas"],
      consequences: ["ajuste en el gasto mensual", "revisión de expectativas"],
      openQuestions: ["cómo se actualiza el dato en los próximos meses"],
      analysisBoundary: "No extrapolar más allá de la medida anunciada.",
    },
  });
  const museoAngle = await createAngle({
    storyId,
    actorEmail: ACTOR,
    brief: {
      brand: "museoargent",
      audience: "curiosos de historia",
      thesis: fixture.angles.museoargent.thesis,
      tone: fixture.angles.museoargent.tone,
      exclusions: ["comparaciones partidarias"],
      historicalAntecedent: "Reajustes de precios regulados en décadas anteriores.",
      periodContext: "Políticas de contención y transición económica.",
      similarities: ["uso de precios de referencia", "debate público inmediato"],
      differences: ["contexto inflacionario distinto", "canales de comunicación actuales"],
      comparisonLimits: ["no equiparar causas ni actores"],
      editorialReason: "Ayuda a leer la novedad sin perder perspectiva histórica.",
    },
  });

  await transitionAngle({ id: labrechaAngle.id, to: "approved", actorEmail: ACTOR });
  await transitionAngle({ id: museoAngle.id, to: "approved", actorEmail: ACTOR });

  const carouselVariant = await createVariant({
    angleId: labrechaAngle.id,
    format: "carousel",
    title: "Cómo leer la medida en el bolsillo",
    body: "LaBrecha resume el cambio con datos, impacto y límites del análisis.",
    cta: "Seguí el dato",
    claimIds: [claimA.id, claimB.id],
    createdByEmail: ACTOR,
  });
  const reelVariant = await createVariant({
    angleId: museoAngle.id,
    format: "reel",
    title: "Memoria de los precios regulados",
    body: "MuseoArgent contextualiza similitudes, diferencias y límites del paralelo histórico.",
    cta: "Explorá la historia",
    claimIds: [claimA.id],
    createdByEmail: ACTOR,
  });

  for (const variantId of [carouselVariant.id, reelVariant.id]) {
    await transitionVariant({ id: variantId, to: "fact_check_pending", actorEmail: ACTOR });
    await transitionVariant({ id: variantId, to: "fact_checked", actorEmail: ACTOR });
    await transitionVariant({ id: variantId, to: "production_ready", actorEmail: ACTOR });
  }

  console.log(
    JSON.stringify(
      {
        seeded: true,
        storyId,
        slug: SLUG,
        adminUrl: `/admin/editorial/${storyId}`,
        apiStory: `/api/internal/editorial/v1/stories/${storyId}`,
        brands: ["labrechahoy", "museoargent"],
      },
      null,
      2,
    ),
  );
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
