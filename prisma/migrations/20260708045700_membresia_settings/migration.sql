-- CreateTable
CREATE TABLE "MembresiaSettings" (
    "id" TEXT NOT NULL DEFAULT 'default',
    "mensualHabilitado" BOOLEAN NOT NULL DEFAULT false,
    "fundadorHabilitado" BOOLEAN NOT NULL DEFAULT false,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MembresiaSettings_pkey" PRIMARY KEY ("id")
);

-- Insert default row (both plans disabled until admin enables them)
INSERT INTO "MembresiaSettings" ("id", "mensualHabilitado", "fundadorHabilitado", "updatedAt")
VALUES ('default', false, false, CURRENT_TIMESTAMP);
