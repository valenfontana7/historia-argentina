-- CreateTable
CREATE TABLE "VotoCronicaFundador" (
    "id" TEXT NOT NULL,
    "mecenasId" TEXT NOT NULL,
    "opcionSlug" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VotoCronicaFundador_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "VotoCronicaFundador_mecenasId_key" ON "VotoCronicaFundador"("mecenasId");

-- CreateIndex
CREATE INDEX "VotoCronicaFundador_opcionSlug_idx" ON "VotoCronicaFundador"("opcionSlug");
