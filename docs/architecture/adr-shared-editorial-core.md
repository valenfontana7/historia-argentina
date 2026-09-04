# ADR: core editorial compartido y API de lectura

## Estado

Aceptado — 2026-09-01.

## Decisión

`historia-argentina` mantiene la propiedad del core editorial, sus máquinas de estado y los engines de video/carousel. `macroeconomic-arg` permanece independiente y, en una etapa posterior, consumirá únicamente los endpoints read-only de `/api/internal/editorial/v1`.

La API devuelve DTOs Zod estables, valida `brand` y `status` mediante allowlists y requiere `EDITORIAL_INTERNAL_API_KEY`. No expone modelos Prisma ni correos internos. Las Server Components leen; las Server Actions mutan mediante el servicio editorial; los Route Handlers son la frontera HTTP.

La generación de media es una acción humana explícita. Renderizar y aprobar no publica: la publicación sólo se registra con plataforma, URL y fecha mediante una acción manual.

## Autopilot v1 (2026-09-02)

Se agrega descubrimiento multi-fuente y generación asistida del paquete editorial, manteniendo gates humanos:

- **Descubrimiento**: ingestores propios (macro vía La Brecha, efemérides, grafo, RSS oficial, búsqueda Context.dev). Sin crawler agresivo ni auto-publicación.
- **Autopilot**: LLM estructurado genera fuentes, claims (`pending`), ángulos y variantes hasta `fact_check_pending` / revisión.
- **Humano**: verifica claims factuales, edita variantes, aprueba paquete. Publicación sigue manual por canal.
- **Cron**: `POST /api/admin/editorial/discover` diario (Vercel Cron + `CRON_SECRET`).

No se agrega red social, deploy automático ni motor paralelo de publicación.

## Consecuencias

- Una investigación y sus claims son reutilizables por ambas marcas, con briefs y decisiones independientes.
- Las revisiones y transiciones quedan auditables y versionadas transaccionalmente.
- `macroeconomic-arg` no necesita conocer Prisma ni compartir migraciones.
- La publicación automática queda deliberadamente fuera del MVP.
