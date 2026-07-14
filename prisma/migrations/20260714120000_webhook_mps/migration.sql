-- Conserva la identidad de las notificaciones ya procesadas para que los reintentos
-- de MercadoPago no reactiven una membresía ni reenvíen correos.
CREATE TABLE "WebhookMercadoPago" (
    "id" TEXT NOT NULL,
    "requestId" TEXT NOT NULL,
    "tipo" TEXT,
    "recursoId" TEXT,
    "recibidoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "procesadoEn" TIMESTAMP(3),

    CONSTRAINT "WebhookMercadoPago_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "WebhookMercadoPago_requestId_key" ON "WebhookMercadoPago"("requestId");
CREATE INDEX "WebhookMercadoPago_recibidoEn_idx" ON "WebhookMercadoPago"("recibidoEn");