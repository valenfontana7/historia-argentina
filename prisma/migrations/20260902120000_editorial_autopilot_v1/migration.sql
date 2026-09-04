-- Editorial autopilot: discovery metadata and autopilot status on stories.
CREATE TYPE "EditorialDiscoverySource" AS ENUM ('macro', 'rss', 'web', 'efemeride', 'grafo', 'manual');
CREATE TYPE "EditorialAutopilotStatus" AS ENUM ('none', 'queued', 'generating', 'ready', 'failed');

ALTER TABLE "EditorialStory"
  ADD COLUMN "discoverySource" "EditorialDiscoverySource" NOT NULL DEFAULT 'manual',
  ADD COLUMN "discoveryMeta" JSONB,
  ADD COLUMN "dedupeKey" TEXT,
  ADD COLUMN "autopilotStatus" "EditorialAutopilotStatus" NOT NULL DEFAULT 'none',
  ADD COLUMN "autopilotError" TEXT,
  ADD COLUMN "suggestedBrands" "EditorialBrand"[] DEFAULT ARRAY[]::"EditorialBrand"[];

CREATE UNIQUE INDEX "EditorialStory_dedupeKey_key" ON "EditorialStory"("dedupeKey");
CREATE INDEX "EditorialStory_autopilotStatus_score_idx" ON "EditorialStory"("autopilotStatus", "score");
