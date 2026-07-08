# Membresía Mecenas, pagos y operaciones

Guía operativa de **Argent**: marca, dominio, MercadoPago, auth, emails y deploy.

---

## Marca y URLs

| Concepto | Valor |
| -------- | ----- |
| Nombre | **Argent** |
| Dominio objetivo | **https://museoargent.com.ar** |
| Preview (Vercel) | **https://historia-argentina-woad.vercel.app** |
| Config central | [`src/lib/site.config.ts`](../src/lib/site.config.ts) |

### Dos URLs, dos roles

1. **`sitio.url` en `site.config.ts`** — URL **canónica** para SEO, Open Graph, sitemap y JSON-LD. Apunta a `museoargent.com.ar`.
2. **`NEXT_PUBLIC_SITE_URL` (env)** — URL **operativa** para links que tienen que funcionar *hoy*: magic links, webhooks y retornos de MercadoPago.

Hasta que `museoargent.com.ar` esté comprado y conectado en Vercel, dejá `NEXT_PUBLIC_SITE_URL` en el subdominio `*.vercel.app`. Cuando el dominio propio responda, cambiá la variable en Vercel a `https://museoargent.com.ar`.

---

## Planes Mecenas

Precios y copy en [`src/lib/membresia.config.ts`](../src/lib/membresia.config.ts).

| Plan | Precio | Cobro | Producto MercadoPago |
| ---- | ------ | ----- | -------------------- |
| **Mecenas** (mensual) | $4.990 ARS / mes | Suscripción recurrente | **PreApproval** (Suscripciones) |
| **Mecenas Fundador** (anual) | $39.990 ARS / año | Pago único | **Checkout Pro** (Preferencias) |

### Qué desbloquea

- Crónicas y apéndices **exclusivos** (`acceso: "mecenas"` en `registro.ts`)
- Acceso anticipado a nuevas crónicas (futuro: `acceso: "anticipo"`)
- Área privada en `/mecenas`
- Carta del mecenas (contenido futuro; infra lista)
- Nombre en el muro de créditos

### Qué sigue gratis (embudo de distribución)

- Crónicas públicas
- El Panteón
- Efeméride diaria `/hoy`
- Boletín (captura de email sin pago)

### Disponibilidad pública (admin)

Por defecto **ambos planes arrancan apagados** en la base de datos. Solo se muestran en `/membresia` cuando los activás desde el panel de admin.

Ver sección [Admin de planes](#admin-de-planes) más abajo.

---

## MercadoPago

### Formato de integración

**No usamos** Checkout Bricks ni Checkout API embebido. El flujo es siempre **redirect**:

```
Usuario en /membresia
  → POST /api/mp/crear-checkout { plan, email }
  → Backend crea Preferencia o PreApproval
  → Redirect a init_point (página de MercadoPago)
  → Usuario paga / autoriza suscripción
  → MP notifica webhook + redirect a /membresia/gracias
  → Activación en DB + email magic link
```

Implementación: [`src/lib/mp.ts`](../src/lib/mp.ts)

### Plan Fundador → Checkout Pro

- API: **`Preference.create`**
- El usuario paga una vez en la checkout hospedada de MP
- Webhook: topic **`payment`**
- `external_reference`: `fundador:email@ejemplo.com`
- `notification_url`: `{NEXT_PUBLIC_SITE_URL}/api/mp/webhook`
- Retorno: `/membresia/gracias` (success / pending) o `/membresia?error=pago` (failure)

### Plan Mensual → Suscripciones (PreApproval)

- API: **`PreApproval.create`**
- Cobro automático mensual tras autorización
- Webhook: topic **`subscription_preapproval`**, **`preapproval`** o **`subscription`**
- `external_reference`: `mensual:email@ejemplo.com`
- Retorno: `back_url` → `/membresia/gracias`

### Configuración en el panel de MercadoPago

1. Crear aplicación en [Mercado Pago Developers](https://www.mercadopago.com.ar/developers).
2. Copiar **Access Token** (producción o prueba) → `MP_ACCESS_TOKEN`.
3. En **Webhooks / Notificaciones IPN**, configurar:
   ```
   https://historia-argentina-woad.vercel.app/api/mp/webhook
   ```
   (Cuando el dominio esté vivo, usar `https://museoargent.com.ar/api/mp/webhook`.)
4. Eventos relevantes:
   - Pagos (`payment`) — plan fundador
   - Suscripciones / preapproval — plan mensual

### Credenciales de prueba

- Usá el Access Token de **cuenta de prueba** en `MP_ACCESS_TOKEN`.
- Tarjetas de test: [documentación MP](https://www.mercadopago.com.ar/developers/es/docs/checkout-pro/additional-content/test-cards).

---

## Autenticación (magic link)

Sin contraseñas. El email del mecenas es su identidad.

| Paso | Ruta | Qué hace |
| ---- | ---- | -------- |
| 1 | `POST /api/auth/magic` | Valida email de mecenas activo, envía link |
| 2 | `GET /api/auth/verificar?token=` | Valida JWT, setea cookie, redirige a `/mecenas` |
| 3 | `GET/POST /api/auth/cerrar` | Cierra sesión |

- Cookie: `argent_sesion` (httpOnly, JWT firmado con `AUTH_SECRET`)
- TTL magic link: 15 minutos
- TTL sesión: 30 días
- Código: [`src/lib/auth.ts`](../src/lib/auth.ts), [`src/proxy.ts`](../src/proxy.ts)

`/mecenas` está protegido por proxy: sin cookie válida → redirect a `/membresia/acceder`.

Las crónicas exclusivas usan **soft-gate** en la página (hero visible, cuerpo bloqueado con CTA), no redirect duro.

---

## Admin de planes

Panel secreto para el creador: **`/admin/mecenas`**

| Función | Descripción |
| ------- | ----------- |
| Activar / desactivar Mecenas | Controla si el plan mensual aparece en `/membresia` |
| Activar / desactivar Fundador | Controla si el plan anual aparece en `/membresia` |
| Probar checkout | Flujo real de MercadoPago a **$1 ARS** (o `MECENAS_CREATOR_PRECIO`) |
| Checkout con plan apagado | Solo emails en `MECENAS_CREATOR_EMAILS` |

### Flujo recomendado

1. Configurar en Vercel: `ADMIN_SECRET`, `MECENAS_CREATOR_EMAILS`, `MECENAS_CREATOR_PRECIO=1`.
2. Entrar a `/admin/mecenas` con el secreto.
3. Dejar planes **apagados** mientras probás con «Probar checkout».
4. Verificar webhook → mecenas activo → magic link.
5. **Activar** el/los plan(es) para el público cuando estés listo.

### Seguridad

- Protegido por `ADMIN_SECRET` + cookie httpOnly `argent_admin` (JWT 7 días).
- Precio reducido **solo** si el email del checkout coincide con `MECENAS_CREATOR_EMAILS` (validación server-side).
- `/admin/` excluido de robots.

Código: [`src/lib/membresia-settings.ts`](../src/lib/membresia-settings.ts), [`src/lib/admin-auth.ts`](../src/lib/admin-auth.ts), [`src/app/admin/mecenas/page.tsx`](../src/app/admin/mecenas/page.tsx)

---

## Emails (Resend)

| Evento | Función | Asunto |
| ------ | ------- | ------ |
| Magic link | `enviarMagicLink` | Tu acceso de mecenas — Argent |
| Post-pago | `enviarBienvenidaMecenas` | Bienvenido a Mecenas — Argent |

Código: [`src/lib/email.ts`](../src/lib/email.ts)

- Sin `RESEND_API_KEY`, los links se imprimen en consola (modo dev).
- Remitente por defecto: `Argent <onboarding@resend.dev>` (solo dev).
- **Producción:** verificar dominio `museoargent.com.ar` en Resend y setear `RESEND_FROM=Argent <hola@museoargent.com.ar>`.

---

## Base de datos (Prisma + Postgres)

Modelos en [`prisma/schema.prisma`](../prisma/schema.prisma):

| Modelo | Uso |
| ------ | --- |
| `Suscriptor` | Emails del boletín gratuito |
| `Mecenas` | Membresías pagas, estado, IDs de MP, `periodEnd` |
| `MembresiaSettings` | Flags `mensualHabilitado` / `fundadorHabilitado` (fila única) |

Migraciones:

```bash
npx prisma migrate dev    # local
npm run db:migrate        # producción (corre en build de Vercel)
```

El build ejecuta `prisma generate && prisma migrate deploy && next build`.

---

## Variables de entorno

Copiá [`.env.example`](../.env.example) a `.env` local.

| Variable | Requerida | Uso |
| -------- | --------- | --- |
| `DATABASE_URL` | Sí | Postgres (Neon, Prisma Postgres, etc.) |
| `AUTH_SECRET` | Sí | Firma JWT de sesión, magic links y admin |
| `NEXT_PUBLIC_SITE_URL` | Sí | Links operativos (MP, emails). Sin barra final |
| `MP_ACCESS_TOKEN` | Para cobrar | Access Token de MercadoPago |
| `ADMIN_SECRET` | Para admin | Contraseña de `/admin/mecenas` |
| `MECENAS_CREATOR_EMAILS` | Para pruebas | Emails que pagan precio reducido en MP |
| `MECENAS_CREATOR_PRECIO` | Opcional | Monto ARS para creador (default `1`) |
| `RESEND_API_KEY` | Para emails reales | API key de Resend |
| `RESEND_FROM` | Opcional | Remitente verificado |

Generar `AUTH_SECRET`:

```bash
openssl rand -base64 32
```

### Vercel (producción)

Configurar en **Project → Settings → Environment Variables**:

- `DATABASE_URL`
- `AUTH_SECRET`
- `NEXT_PUBLIC_SITE_URL` → por ahora el `*.vercel.app`; luego `https://museoargent.com.ar`
- `MP_ACCESS_TOKEN`
- `ADMIN_SECRET`, `MECENAS_CREATOR_EMAILS`, `MECENAS_CREATOR_PRECIO`
- `RESEND_API_KEY` y `RESEND_FROM` cuando estén listos

---

## Dominio `museoargent.com.ar`

Checklist cuando compres el dominio:

1. Registrar en NIC Argentina, DonWeb u otro registrador `.com.ar`.
2. Vercel → **Domains** → agregar `museoargent.com.ar` y `www.museoargent.com.ar`.
3. DNS (según indique Vercel):
   - `@` → A `76.76.21.21`
   - `www` → CNAME `cname.vercel-dns.com`
   - (Alternativa: nameservers de Vercel)
4. Actualizar `NEXT_PUBLIC_SITE_URL` en Vercel.
5. Actualizar webhook en MercadoPago.
6. Verificar dominio en Resend para emails transaccionales.

**No confundir** con `historiaargentina.com` (dominio ajeno en parking de GoDaddy). Ese no es nuestro sitio.

---

## Rutas del producto

| Ruta | Acceso | Descripción |
| ---- | ------ | ----------- |
| `/membresia` | Público | Planes habilitados, precios, FAQ, checkout |
| `/admin/mecenas` | Admin (`ADMIN_SECRET`) | Activar/desactivar planes, probar checkout $1 |
| `/membresia/gracias` | Público | Post-pago; pedir magic link |
| `/membresia/acceder` | Público | Login por magic link |
| `/mecenas` | Mecenas activo | Exclusivas, créditos, estado del plan |
| `/cronicas/[slug]` | Según `acceso` | Público o soft-gate |
| `/api/mp/crear-checkout` | API | Crea checkout MP |
| `/api/mp/webhook` | API | Notificaciones IPN |

---

## Crónicas: flag de acceso

En [`src/content/cronicas/registro.ts`](../src/content/cronicas/registro.ts):

```ts
acceso: "publico" | "mecenas" | "anticipo"
```

- **`publico`** — visible para todos; entra al sitemap.
- **`mecenas`** — soft-gate si no hay sesión de mecenas.
- **`anticipo`** — reservado para acceso anticipado (misma lógica que mecenas por ahora).

Exclusiva actual: `las-48-horas-de-mayo`.

---

## Boletín gratuito

[`src/app/acciones.ts`](../src/app/acciones.ts) persiste emails en `Suscriptor`. El envío diario automatizado es fase 2; hoy solo captura + upsell a `/membresia`.

---

## Deploy

- Repo: GitHub `valenfontana7/historia-argentina`
- Vercel conectado a `master` → deploy automático en cada push
- Preview: `https://historia-argentina-woad.vercel.app`

```bash
git push origin master   # dispara build + migrate en Vercel
```

---

## Archivos clave

| Archivo | Rol |
| ------- | --- |
| `src/lib/site.config.ts` | Marca y URL canónica |
| `src/lib/membresia.config.ts` | Precios, planes, copy de lanzamiento |
| `src/lib/membresia-settings.ts` | Flags de planes, precio creador, guards |
| `src/lib/admin-auth.ts` | Sesión admin |
| `src/lib/mp.ts` | Checkout Pro + PreApproval + webhook |
| `src/lib/auth.ts` | Sesión JWT y magic links |
| `src/lib/email.ts` | Resend |
| `src/lib/db.ts` | Cliente Prisma |
| `src/components/membresia/CheckoutForm.tsx` | UI de pago |
| `src/components/membresia/SoftGate.tsx` | Muro suave en exclusivas |
| `src/proxy.ts` | Protege `/mecenas` |

---

## Checklist de lanzamiento de Mecenas

- [ ] `DATABASE_URL` y `AUTH_SECRET` en Vercel
- [ ] `MP_ACCESS_TOKEN` (producción o prueba)
- [ ] Webhook MP apuntando a `/api/mp/webhook`
- [ ] Pago de prueba fundador → mecenas activo en DB
- [ ] Pago de prueba mensual → suscripción autorizada
- [ ] Magic link llega al email (Resend configurado)
- [ ] Exclusiva visible en `/mecenas` tras login
- [ ] `ADMIN_SECRET` y `MECENAS_CREATOR_EMAILS` en Vercel
- [ ] Checkout de prueba a $1 desde `/admin/mecenas`
- [ ] Activar plan(es) en admin antes del lanzamiento público
- [ ] Dominio propio conectado (cuando esté listo)
- [ ] `NEXT_PUBLIC_SITE_URL` actualizado al dominio final
