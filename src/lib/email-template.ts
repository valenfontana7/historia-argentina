import { sitio } from "@/lib/site.config";

export type EmailPlantillaOpts = {
  /** Texto breve que algunos clientes muestran en la bandeja de entrada. */
  preheader?: string;
  titulo: string;
  /** Párrafos HTML del cuerpo principal. */
  cuerpo: string;
  cta?: { url: string; texto: string };
  /** Párrafo opcional debajo del CTA (p. ej. enlace de respaldo). */
  pie?: string;
};

const colores = {
  fondo: "#0c0a08",
  fondoTarjeta: "#141109",
  fondoElevado: "#1d1810",
  tinta: "#ece4d4",
  tintaSuave: "#a59a86",
  tintaTenue: "#8d8271",
  oro: "#c6a15b",
  oroClaro: "#e3c98f",
  linea: "rgba(236, 228, 212, 0.14)",
} as const;

function escaparHtml(texto: string): string {
  return texto
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/**
 * Plantilla HTML transaccional con estética museo nocturno / oro antiguo.
 * Layout table-based para compatibilidad con clientes de email.
 */
export function renderEmailPlantilla(opts: EmailPlantillaOpts): string {
  const urlSitio = process.env.NEXT_PUBLIC_SITE_URL ?? sitio.url;
  const preheader = opts.preheader ?? opts.titulo;

  const ctaHtml = opts.cta
    ? `
      <tr>
        <td align="center" style="padding: 8px 0 32px;">
          <table role="presentation" cellpadding="0" cellspacing="0" border="0">
            <tr>
              <td align="center" style="border-radius: 999px; background: linear-gradient(180deg, ${colores.oroClaro} 0%, ${colores.oro} 100%);">
                <a href="${opts.cta.url}" target="_blank" style="display: inline-block; padding: 14px 32px; font-family: Georgia, 'Times New Roman', serif; font-size: 15px; font-weight: 600; color: ${colores.fondo}; text-decoration: none; letter-spacing: 0.02em;">
                  ${opts.cta.texto}
                </a>
              </td>
            </tr>
          </table>
        </td>
      </tr>`
    : "";

  const pieHtml = opts.pie
    ? `
      <tr>
        <td style="padding-top: 8px; font-family: Georgia, 'Times New Roman', serif; font-size: 12px; line-height: 1.6; color: ${colores.tintaTenue}; word-break: break-all;">
          ${opts.pie}
        </td>
      </tr>`
    : "";

  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="color-scheme" content="dark" />
  <meta name="supported-color-schemes" content="dark" />
  <title>${escaparHtml(opts.titulo)}</title>
  <!--[if mso]>
  <style type="text/css">
    body, table, td { font-family: Georgia, serif !important; }
  </style>
  <![endif]-->
</head>
<body style="margin: 0; padding: 0; background-color: ${colores.fondo}; -webkit-text-size-adjust: 100%;">
  <div style="display: none; max-height: 0; overflow: hidden; mso-hide: all;">
    ${escaparHtml(preheader)}&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;
  </div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: ${colores.fondo};">
    <tr>
      <td align="center" style="padding: 48px 16px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width: 520px;">
          <!-- Marca -->
          <tr>
            <td align="center" style="padding-bottom: 32px;">
              <p style="margin: 0; font-family: Georgia, 'Times New Roman', serif; font-size: 11px; letter-spacing: 0.28em; text-transform: uppercase; color: ${colores.oro};">
                ${sitio.nombre}
              </p>
              <p style="margin: 6px 0 0; font-family: Georgia, 'Times New Roman', serif; font-size: 12px; color: ${colores.tintaTenue};">
                ${sitio.lema}
              </p>
            </td>
          </tr>
          <!-- Tarjeta principal -->
          <tr>
            <td style="background-color: ${colores.fondoTarjeta}; border: 1px solid ${colores.linea}; border-radius: 4px; overflow: hidden;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                <!-- Acento oro -->
                <tr>
                  <td style="height: 3px; background: linear-gradient(90deg, transparent 0%, ${colores.oro} 30%, ${colores.oroClaro} 50%, ${colores.oro} 70%, transparent 100%); font-size: 0; line-height: 0;">&nbsp;</td>
                </tr>
                <tr>
                  <td style="padding: 40px 36px 36px;">
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td style="font-family: Georgia, 'Times New Roman', serif; font-size: 26px; font-weight: 500; line-height: 1.25; color: ${colores.tinta}; letter-spacing: -0.02em;">
                          ${opts.titulo}
                        </td>
                      </tr>
                      <tr>
                        <td style="padding-top: 20px; font-family: Georgia, 'Times New Roman', serif; font-size: 15px; line-height: 1.7; color: ${colores.tintaSuave};">
                          ${opts.cuerpo}
                        </td>
                      </tr>
                      ${ctaHtml}
                      ${pieHtml}
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td align="center" style="padding-top: 32px;">
              <p style="margin: 0 0 8px; font-family: Georgia, 'Times New Roman', serif; font-size: 12px; color: ${colores.tintaTenue};">
                <a href="${urlSitio}" style="color: ${colores.oro}; text-decoration: none;">${urlSitio.replace(/^https?:\/\//, "")}</a>
              </p>
              <p style="margin: 0; font-family: Georgia, 'Times New Roman', serif; font-size: 11px; line-height: 1.5; color: ${colores.tintaTenue}; opacity: 0.7;">
                Recibiste este email porque tenés una cuenta o suscripción en ${sitio.nombre}.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}
