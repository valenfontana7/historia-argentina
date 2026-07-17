import { renderToStaticMarkup } from "react-dom/server";
import type { SlideIr } from "@museoargent/carousel-contracts";
import type { TemplateManifest } from "../application/stages/template-resolver";
import type { ThemeTokens } from "../application/stages/theme-resolver";
import { SlideView } from "./SlideView";
import { BASE_CSS, themeToCssVars, typeScaleToCss } from "./tokens-to-css";

export function renderSlideHtml(
  ir: SlideIr,
  theme: ThemeTokens,
  manifest: TemplateManifest,
): string {
  const body = renderToStaticMarkup(<SlideView ir={ir} theme={theme} />);
  const css = [
    themeToCssVars(theme),
    typeScaleToCss(manifest, ir.typographyStep),
    BASE_CSS,
  ].join("\n");

  return `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=${ir.width}, height=${ir.height}" />
<style>${css}</style>
</head>
<body>${body}</body>
</html>`;
}
