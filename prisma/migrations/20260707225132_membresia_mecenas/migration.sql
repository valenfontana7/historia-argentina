-- CreateEnum
CREATE TYPE "PlanMecenas" AS ENUM ('mensual', 'fundador');

-- CreateEnum
CREATE TYPE "EstadoMecenas" AS ENUM ('pendiente', 'activo', 'cancelado', 'vencido');

-- CreateTable
CREATE TABLE "Suscriptor" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Suscriptor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Mecenas" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "plan" "PlanMecenas" NOT NULL,
    "estado" "EstadoMecenas" NOT NULL DEFAULT 'pendiente',
    "esFundador" BOOLEAN NOT NULL DEFAULT false,
    "nombrePublico" TEXT,
    "mostrarCredito" BOOLEAN NOT NULL DEFAULT true,
    "mpPaymentId" TEXT,
    "mpSubscriptionId" TEXT,
    "mpPreferenceId" TEXT,
    "periodEnd" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Mecenas_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Suscriptor_email_key" ON "Suscriptor"("email");

-- CreateIndex
CREATE INDEX "Suscriptor_email_idx" ON "Suscriptor"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Mecenas_email_key" ON "Mecenas"("email");

-- CreateIndex
CREATE INDEX "Mecenas_email_idx" ON "Mecenas"("email");

-- CreateIndex
CREATE INDEX "Mecenas_estado_idx" ON "Mecenas"("estado");

-- CreateIndex
CREATE INDEX "Mecenas_mpPaymentId_idx" ON "Mecenas"("mpPaymentId");

-- CreateIndex
CREATE INDEX "Mecenas_mpSubscriptionId_idx" ON "Mecenas"("mpSubscriptionId");
