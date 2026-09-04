import { prisma } from "@/lib/db";

export const editorialStoryInclude = {
  sources: true,
  claims: { include: { evidence: { include: { source: true } } } },
  angles: {
    include: {
      variants: {
        include: {
          claims: { include: { claim: true } },
          mediaOutputs: { orderBy: { createdAt: "desc" as const } },
          publications: true,
        },
        orderBy: { updatedAt: "desc" as const },
      },
    },
  },
  assets: true,
  revisions: { orderBy: { createdAt: "desc" as const }, take: 30 },
} as const;

export async function listEditorialStories() {
  return prisma.editorialStory.findMany({
    orderBy: [{ score: "desc" }, { updatedAt: "desc" }],
    include: editorialStoryInclude,
  });
}

export async function getEditorialStory(id: string) {
  const story = await prisma.editorialStory.findUnique({
    where: { id },
    include: editorialStoryInclude,
  });
  if (!story) return null;
  const targetIds = [story.id, ...story.claims.map((claim) => claim.id), ...story.angles.map((angle) => angle.id), ...story.angles.flatMap((angle) => angle.variants.map((variant) => variant.id))];
  const reviews = await prisma.reviewDecision.findMany({
    where: { targetId: { in: targetIds } },
    orderBy: { createdAt: "desc" },
    take: 100,
  });
  return { ...story, reviews };
}

export type EditorialStoryDetail = NonNullable<Awaited<ReturnType<typeof getEditorialStory>>>;

export type EditorialQueueBucket = "suggestions" | "review" | "triage" | "research" | "evidence" | "angles" | "production" | "final_review" | "done";

export function queueBucketForStory(story: Awaited<ReturnType<typeof listEditorialStories>>[number]): EditorialQueueBucket {
  if (story.autopilotStatus === "ready") return "review";
  if (story.status === "discovered" && (story.autopilotStatus === "none" || story.autopilotStatus === "failed")) return "suggestions";
  const variants = story.angles.flatMap((angle) => angle.variants);
  if (variants.some((variant) => variant.status === "rendered" || variant.status === "final_review" || variant.status === "fact_check_pending")) return "final_review";
  if (variants.some((variant) => variant.status === "fact_checked" || variant.status === "production_ready")) return "production";
  if (story.claims.some((claim) => claim.classification === "fact" && (claim.verification !== "verified" || !claim.evidence.some((item) => item.relation === "supports")))) return "evidence";
  if (story.status === "angle_proposed" || story.angles.some((angle) => angle.status === "proposed" || angle.status === "needs_revision")) return "angles";
  if (story.status === "triaged" || story.status === "researching") return "research";
  if (story.status === "discovered") return "triage";
  return "done";
}
