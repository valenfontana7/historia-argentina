-- Additive editorial core. This migration is intentionally not applied to production by this change.
CREATE TYPE "EditorialStoryStatus" AS ENUM ('discovered', 'triaged', 'researching', 'angle_proposed', 'rejected', 'archived');
CREATE TYPE "EditorialSourceType" AS ENUM ('official', 'primary', 'secondary', 'internal', 'manual');
CREATE TYPE "ClaimClassification" AS ENUM ('fact', 'context', 'interpretation', 'opinion');
CREATE TYPE "ClaimVerificationStatus" AS ENUM ('pending', 'verified', 'disputed', 'rejected');
CREATE TYPE "EvidenceRelation" AS ENUM ('supports', 'contradicts', 'contextualizes');
CREATE TYPE "EditorialBrand" AS ENUM ('museoargent', 'labrechahoy');
CREATE TYPE "BrandAngleStatus" AS ENUM ('proposed', 'approved', 'needs_revision', 'rejected');
CREATE TYPE "ContentVariantFormat" AS ENUM ('article', 'reel', 'carousel', 'story', 'x_post', 'audiovisual_script', 'description_cta');
CREATE TYPE "ContentVariantStatus" AS ENUM ('drafted', 'fact_check_pending', 'fact_checked', 'production_ready', 'rendered', 'final_review', 'approved', 'published', 'needs_revision', 'rejected');
CREATE TYPE "EditorialAssetKind" AS ENUM ('image', 'video', 'audio', 'document', 'chart');
CREATE TYPE "EditorialAssetOrigin" AS ENUM ('uploaded', 'generated', 'linked');
CREATE TYPE "MediaOutputStatus" AS ENUM ('requested', 'queued', 'rendering', 'succeeded', 'failed');
CREATE TYPE "ReviewTargetType" AS ENUM ('story', 'claim', 'angle', 'variant', 'media');
CREATE TYPE "ReviewDecisionKind" AS ENUM ('submit', 'approve', 'reject', 'request_changes', 'verify', 'publish');
CREATE TYPE "PublicationStatus" AS ENUM ('planned', 'published', 'corrected', 'retracted');

CREATE TABLE "EditorialStory" (
  "id" TEXT NOT NULL, "title" TEXT NOT NULL, "summary" TEXT NOT NULL, "slug" TEXT NOT NULL,
  "status" "EditorialStoryStatus" NOT NULL DEFAULT 'discovered', "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
  "detectedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, "eventDate" TIMESTAMP(3), "score" INTEGER,
  "scoreBreakdown" JSONB, "scoreOverride" INTEGER, "scoreOverrideReason" TEXT, "createdByEmail" TEXT NOT NULL,
  "updatedByEmail" TEXT, "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "EditorialStory_pkey" PRIMARY KEY ("id")
);
CREATE TABLE "EditorialSource" (
  "id" TEXT NOT NULL, "storyId" TEXT NOT NULL, "type" "EditorialSourceType" NOT NULL, "title" TEXT NOT NULL,
  "url" TEXT, "publisher" TEXT, "publishedAt" TIMESTAMP(3), "accessedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "isPrimary" BOOLEAN NOT NULL DEFAULT false, "notes" TEXT, CONSTRAINT "EditorialSource_pkey" PRIMARY KEY ("id")
);
CREATE TABLE "EditorialClaim" (
  "id" TEXT NOT NULL, "storyId" TEXT NOT NULL, "text" TEXT NOT NULL, "classification" "ClaimClassification" NOT NULL,
  "verification" "ClaimVerificationStatus" NOT NULL DEFAULT 'pending', "importance" INTEGER NOT NULL DEFAULT 3,
  "notes" TEXT, CONSTRAINT "EditorialClaim_pkey" PRIMARY KEY ("id")
);
CREATE TABLE "ClaimEvidence" (
  "id" TEXT NOT NULL, "claimId" TEXT NOT NULL, "sourceId" TEXT NOT NULL, "relation" "EvidenceRelation" NOT NULL DEFAULT 'supports',
  "quote" TEXT, CONSTRAINT "ClaimEvidence_pkey" PRIMARY KEY ("id")
);
CREATE TABLE "BrandAngle" (
  "id" TEXT NOT NULL, "storyId" TEXT NOT NULL, "brand" "EditorialBrand" NOT NULL, "status" "BrandAngleStatus" NOT NULL DEFAULT 'proposed',
  "thesis" TEXT NOT NULL, "audience" TEXT NOT NULL, "tone" TEXT NOT NULL, "exclusions" TEXT[] DEFAULT ARRAY[]::TEXT[],
  "briefJson" JSONB NOT NULL, "decisionReason" TEXT, "version" INTEGER NOT NULL DEFAULT 1, "score" INTEGER,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "BrandAngle_pkey" PRIMARY KEY ("id")
);
CREATE TABLE "ContentVariant" (
  "id" TEXT NOT NULL, "angleId" TEXT NOT NULL, "format" "ContentVariantFormat" NOT NULL, "status" "ContentVariantStatus" NOT NULL DEFAULT 'drafted',
  "version" INTEGER NOT NULL DEFAULT 1, "title" TEXT NOT NULL, "body" TEXT NOT NULL, "cta" TEXT, "contentJson" JSONB,
  "sourceNotes" TEXT, "createdByEmail" TEXT NOT NULL, "updatedByEmail" TEXT, "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL, CONSTRAINT "ContentVariant_pkey" PRIMARY KEY ("id")
);
CREATE TABLE "VariantClaim" ("variantId" TEXT NOT NULL, "claimId" TEXT NOT NULL, CONSTRAINT "VariantClaim_pkey" PRIMARY KEY ("variantId", "claimId"));
CREATE TABLE "EditorialAsset" (
  "id" TEXT NOT NULL, "storyId" TEXT NOT NULL, "kind" "EditorialAssetKind" NOT NULL, "origin" "EditorialAssetOrigin" NOT NULL,
  "uri" TEXT NOT NULL, "title" TEXT, "altText" TEXT, "metadata" JSONB, "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "EditorialAsset_pkey" PRIMARY KEY ("id")
);
CREATE TABLE "MediaOutput" (
  "id" TEXT NOT NULL, "variantId" TEXT NOT NULL, "engine" TEXT NOT NULL, "jobId" TEXT, "status" "MediaOutputStatus" NOT NULL DEFAULT 'requested',
  "uri" TEXT, "manifestUri" TEXT, "error" TEXT, "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "MediaOutput_pkey" PRIMARY KEY ("id")
);
CREATE TABLE "EditorialRevision" (
  "id" TEXT NOT NULL, "storyId" TEXT, "variantId" TEXT, "targetType" "ReviewTargetType" NOT NULL, "targetId" TEXT NOT NULL,
  "version" INTEGER NOT NULL, "snapshotJson" JSONB NOT NULL, "actorEmail" TEXT NOT NULL, "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "EditorialRevision_pkey" PRIMARY KEY ("id")
);
CREATE TABLE "ReviewDecision" (
  "id" TEXT NOT NULL, "targetType" "ReviewTargetType" NOT NULL, "targetId" TEXT NOT NULL, "decision" "ReviewDecisionKind" NOT NULL,
  "previousStatus" TEXT, "newStatus" TEXT NOT NULL, "targetVersion" INTEGER NOT NULL, "note" TEXT, "actorEmail" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, "variantId" TEXT, CONSTRAINT "ReviewDecision_pkey" PRIMARY KEY ("id")
);
CREATE TABLE "Publication" (
  "id" TEXT NOT NULL, "variantId" TEXT NOT NULL, "channel" TEXT NOT NULL, "externalId" TEXT, "url" TEXT NOT NULL,
  "publishedAt" TIMESTAMP(3), "status" "PublicationStatus" NOT NULL DEFAULT 'planned', CONSTRAINT "Publication_pkey" PRIMARY KEY ("id")
);
CREATE TABLE "PublicationMetric" (
  "id" TEXT NOT NULL, "publicationId" TEXT NOT NULL, "metric" TEXT NOT NULL, "value" DOUBLE PRECISION NOT NULL,
  "observedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, CONSTRAINT "PublicationMetric_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "EditorialStory_slug_key" ON "EditorialStory"("slug");
CREATE INDEX "EditorialStory_status_updatedAt_idx" ON "EditorialStory"("status", "updatedAt");
CREATE INDEX "EditorialSource_storyId_accessedAt_idx" ON "EditorialSource"("storyId", "accessedAt");
CREATE INDEX "EditorialClaim_storyId_verification_idx" ON "EditorialClaim"("storyId", "verification");
CREATE UNIQUE INDEX "ClaimEvidence_claimId_sourceId_key" ON "ClaimEvidence"("claimId", "sourceId");
CREATE UNIQUE INDEX "BrandAngle_storyId_brand_key" ON "BrandAngle"("storyId", "brand");
CREATE INDEX "BrandAngle_brand_status_idx" ON "BrandAngle"("brand", "status");
CREATE UNIQUE INDEX "ContentVariant_angleId_format_version_key" ON "ContentVariant"("angleId", "format", "version");
CREATE INDEX "ContentVariant_status_updatedAt_idx" ON "ContentVariant"("status", "updatedAt");
CREATE INDEX "EditorialAsset_storyId_kind_idx" ON "EditorialAsset"("storyId", "kind");
CREATE INDEX "MediaOutput_variantId_status_idx" ON "MediaOutput"("variantId", "status");
CREATE UNIQUE INDEX "EditorialRevision_targetType_targetId_version_key" ON "EditorialRevision"("targetType", "targetId", "version");
CREATE INDEX "EditorialRevision_targetId_createdAt_idx" ON "EditorialRevision"("targetId", "createdAt");
CREATE INDEX "ReviewDecision_targetType_targetId_createdAt_idx" ON "ReviewDecision"("targetType", "targetId", "createdAt");
CREATE UNIQUE INDEX "Publication_variantId_channel_key" ON "Publication"("variantId", "channel");
CREATE INDEX "PublicationMetric_publicationId_observedAt_idx" ON "PublicationMetric"("publicationId", "observedAt");

ALTER TABLE "EditorialSource" ADD CONSTRAINT "EditorialSource_storyId_fkey" FOREIGN KEY ("storyId") REFERENCES "EditorialStory"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "EditorialClaim" ADD CONSTRAINT "EditorialClaim_storyId_fkey" FOREIGN KEY ("storyId") REFERENCES "EditorialStory"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ClaimEvidence" ADD CONSTRAINT "ClaimEvidence_claimId_fkey" FOREIGN KEY ("claimId") REFERENCES "EditorialClaim"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ClaimEvidence" ADD CONSTRAINT "ClaimEvidence_sourceId_fkey" FOREIGN KEY ("sourceId") REFERENCES "EditorialSource"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "BrandAngle" ADD CONSTRAINT "BrandAngle_storyId_fkey" FOREIGN KEY ("storyId") REFERENCES "EditorialStory"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ContentVariant" ADD CONSTRAINT "ContentVariant_angleId_fkey" FOREIGN KEY ("angleId") REFERENCES "BrandAngle"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "VariantClaim" ADD CONSTRAINT "VariantClaim_variantId_fkey" FOREIGN KEY ("variantId") REFERENCES "ContentVariant"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "VariantClaim" ADD CONSTRAINT "VariantClaim_claimId_fkey" FOREIGN KEY ("claimId") REFERENCES "EditorialClaim"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "EditorialAsset" ADD CONSTRAINT "EditorialAsset_storyId_fkey" FOREIGN KEY ("storyId") REFERENCES "EditorialStory"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "MediaOutput" ADD CONSTRAINT "MediaOutput_variantId_fkey" FOREIGN KEY ("variantId") REFERENCES "ContentVariant"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "EditorialRevision" ADD CONSTRAINT "EditorialRevision_storyId_fkey" FOREIGN KEY ("storyId") REFERENCES "EditorialStory"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "EditorialRevision" ADD CONSTRAINT "EditorialRevision_variantId_fkey" FOREIGN KEY ("variantId") REFERENCES "ContentVariant"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ReviewDecision" ADD CONSTRAINT "ReviewDecision_variantId_fkey" FOREIGN KEY ("variantId") REFERENCES "ContentVariant"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Publication" ADD CONSTRAINT "Publication_variantId_fkey" FOREIGN KEY ("variantId") REFERENCES "ContentVariant"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "PublicationMetric" ADD CONSTRAINT "PublicationMetric_publicationId_fkey" FOREIGN KEY ("publicationId") REFERENCES "Publication"("id") ON DELETE CASCADE ON UPDATE CASCADE;
