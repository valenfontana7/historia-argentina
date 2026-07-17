import type { ThemeTokens } from "../application/stages/theme-resolver";
import type { TemplateManifest } from "../application/stages/template-resolver";
import type { TypographyStep } from "@museoargent/carousel-contracts";

export function themeToCssVars(theme: ThemeTokens): string {
  const lines = Object.entries(theme.tokens).map(([key, value]) => {
    const cssKey = `--${key.replace(/\./g, "-")}`;
    return `${cssKey}: ${value};`;
  });
  return `:root {\n${lines.map((l) => `  ${l}`).join("\n")}\n}`;
}

export function typeScaleToCss(
  manifest: TemplateManifest,
  step: TypographyStep,
): string {
  const base = manifest.typeScale.default ?? {};
  const overlay = manifest.typeScale[step] ?? {};
  const merged = { ...base, ...overlay };
  const lines: string[] = [];
  for (const [role, entry] of Object.entries(merged)) {
    if (!entry) continue;
    lines.push(`--type-${role}-size: ${entry.sizePx}px;`);
    lines.push(`--type-${role}-lh: ${entry.lineHeight};`);
    lines.push(`--type-${role}-ls: ${entry.letterSpacing};`);
  }
  return `:root {\n${lines.map((l) => `  ${l}`).join("\n")}\n}`;
}

export const BASE_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600;9..144,700&family=Inter:wght@400;500;600&display=block');

* { box-sizing: border-box; margin: 0; padding: 0; }
html, body {
  width: 100%;
  height: 100%;
  background: var(--color-bg);
  color: var(--color-ink);
  font-family: var(--font-sans);
  -webkit-font-smoothing: antialiased;
  text-rendering: optimizeLegibility;
}
.slide {
  position: relative;
  overflow: hidden;
  background:
    radial-gradient(120% 80% at 50% 0%, var(--color-bgElevated), var(--color-bg) 55%);
}
.slot {
  position: absolute;
  overflow: hidden;
  z-index: 2;
}
.slot.slot-image {
  overflow: hidden;
  z-index: 1;
}
.slot.slot-text.clamp {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: var(--clamp-lines, 3);
  line-clamp: var(--clamp-lines, 3);
  overflow: hidden;
  text-overflow: ellipsis;
  word-break: break-word;
}

/* —— Cover —— */
.slot.slot-image-cover::after {
  content: "";
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 68%;
  pointer-events: none;
  background: linear-gradient(
    to top,
    var(--color-bg) 0%,
    color-mix(in srgb, var(--color-bg) 92%, transparent) 22%,
    color-mix(in srgb, var(--color-bg) 55%, transparent) 52%,
    transparent 100%
  );
}
.slide[data-recipe="cover-hero"] .kicker,
.slide[data-recipe="cover-hero"] .display,
.slide[data-recipe="cover-hero"] .subtitle {
  text-shadow:
    0 1px 2px color-mix(in srgb, var(--color-bg) 90%, transparent),
    0 4px 28px color-mix(in srgb, var(--color-bg) 75%, transparent);
}
.slide[data-recipe="cover-hero"] .kicker {
  letter-spacing: 0.28em;
}
.slide[data-recipe="cover-hero"] .footer {
  border-top-color: color-mix(in srgb, var(--color-line) 90%, transparent);
}

/* —— Centered recipes —— */
.slide[data-recipe="quote-centered"] .slot-text,
.slide[data-recipe="statistic-focus"] .slot-text,
.slide[data-recipe="ending-cta"] .slot-text {
  text-align: center;
}
.slide[data-recipe="quote-centered"] .divider,
.slide[data-recipe="ending-cta"] .badge,
.slide[data-recipe="ending-cta"] .cta {
  margin-left: auto;
  margin-right: auto;
}
.slide[data-recipe="quote-centered"] .divider {
  width: 72px;
  height: 3px;
}
.slide[data-recipe="quote-centered"] .label,
.slide[data-recipe="quote-centered"] .caption {
  color: var(--color-inkMuted);
  letter-spacing: 0.06em;
  text-transform: none;
  max-width: 28ch;
  margin-left: auto;
  margin-right: auto;
}

/* —— Statistic —— */
.slide[data-recipe="statistic-focus"] .stat {
  text-align: center;
  width: 100%;
  padding-block: 0.08em;
}
.slide[data-recipe="statistic-focus"] .title {
  max-width: 18ch;
  margin-left: auto;
  margin-right: auto;
}
.slide[data-recipe="statistic-focus"] .body {
  max-width: 30ch;
  margin-left: auto;
  margin-right: auto;
  color: var(--color-inkMuted);
  font-size: calc(var(--type-body-size) * 0.92);
  padding-bottom: 0.15em;
}

/* —— Content —— */
.slide[data-recipe="content-split"] .body {
  max-width: 32ch;
}
.slide[data-recipe="content-split"] .caption {
  font-size: 15px;
  letter-spacing: 0.04em;
  color: var(--color-inkMuted);
  opacity: 0.95;
}

/* —— Gallery —— */
.slide[data-recipe="gallery-grid"] .caption {
  font-size: 14px;
  letter-spacing: 0.05em;
  max-width: 40ch;
  color: var(--color-inkMuted);
  opacity: 0.92;
}
.slide[data-recipe="gallery-grid"] .slot-image {
  border: 1px solid color-mix(in srgb, var(--color-line) 80%, transparent);
}

/* —— Ending CTA —— */
.slide[data-recipe="ending-cta"] .display {
  max-width: 14ch;
  margin-left: auto;
  margin-right: auto;
}
.slide[data-recipe="ending-cta"] .body {
  max-width: 28ch;
  margin-left: auto;
  margin-right: auto;
  opacity: 0.9;
  color: var(--color-inkMuted);
}
.slide[data-recipe="ending-cta"] .badge {
  padding-bottom: 0.55em;
  margin-bottom: 0.15em;
}
.slide[data-recipe="ending-cta"] .cta {
  margin-top: 0.25em;
  min-width: 11em;
  box-shadow: 0 8px 28px color-mix(in srgb, var(--color-accent) 28%, transparent);
}

/* —— Type roles (alineados a MuseoArgent / globals.css) —— */
.kicker {
  font-family: var(--font-sans);
  font-size: var(--type-kicker-size);
  line-height: var(--type-kicker-lh);
  letter-spacing: 0.28em;
  color: var(--color-accent);
  font-weight: 600;
  text-transform: uppercase;
}
.title, .display {
  font-family: var(--font-display);
  font-weight: 600;
  color: var(--color-ink);
  text-wrap: balance;
  font-variation-settings: "opsz" 144;
  letter-spacing: -0.02em;
}
.display {
  font-size: var(--type-display-size);
  line-height: var(--type-display-lh);
}
.title {
  font-size: var(--type-title-size);
  line-height: var(--type-title-lh);
}
.subtitle {
  font-family: var(--font-display);
  font-size: var(--type-subtitle-size);
  line-height: var(--type-subtitle-lh);
  color: var(--color-accentSoft);
  font-variation-settings: "opsz" 72;
  font-weight: 500;
}
.body {
  font-size: var(--type-body-size);
  line-height: var(--type-body-lh);
  color: var(--color-ink);
  max-width: 34ch;
}
.caption, .label {
  font-size: var(--type-caption-size);
  line-height: var(--type-caption-lh);
  letter-spacing: var(--type-caption-ls);
  color: var(--color-inkMuted);
}
.caption {
  color: var(--color-accentSoft);
  opacity: 1;
}
.stat {
  font-family: var(--font-display);
  font-size: var(--type-stat-size);
  line-height: var(--type-stat-lh);
  letter-spacing: -0.03em;
  color: var(--color-accent);
  font-weight: 600;
  font-variation-settings: "opsz" 144;
}
.quote {
  font-family: var(--font-display);
  font-size: calc(var(--type-title-size) * 1.12);
  line-height: 1.22;
  color: var(--color-ink);
  text-wrap: balance;
  max-width: 20ch;
  margin-left: auto;
  margin-right: auto;
  font-style: italic;
  font-weight: 500;
  font-variation-settings: "opsz" 96;
}
.cta {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-family: var(--font-sans);
  font-size: var(--type-cta-size);
  line-height: var(--type-cta-lh);
  letter-spacing: 0.08em;
  color: var(--color-bg);
  background: var(--color-accent);
  padding: 0.85em 1.6em;
  font-weight: 600;
  min-width: 12em;
}
.badge {
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  font-size: var(--type-kicker-size);
  letter-spacing: 0.28em;
  color: var(--color-accent);
  border-bottom: 1px solid var(--color-line);
  padding-bottom: 0.55em;
  font-weight: 600;
  font-family: var(--font-sans);
  text-transform: uppercase;
}
.badge-logo {
  width: 56px;
  height: 56px;
  object-fit: contain;
  border-radius: 12px;
  display: block;
}
.badge-label {
  letter-spacing: 0.28em;
}
.divider {
  width: 56px;
  height: 2px;
  background: var(--color-accent);
}
.img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

/* —— Brand footer —— */
.footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  font-size: 13px;
  letter-spacing: 0.1em;
  color: var(--color-inkMuted);
  border-top: 1px solid var(--color-line);
  padding-top: 12px;
  z-index: 3;
  overflow: visible;
}
.footer-brand {
  display: inline-flex;
  align-items: center;
  gap: 0.55em;
  min-width: 0;
}
.footer-logo {
  width: 28px;
  height: 28px;
  object-fit: contain;
  border-radius: 6px;
  flex-shrink: 0;
  display: block;
}
.footer .mark-glyph {
  color: var(--color-accent);
  font-family: var(--font-display);
  font-weight: 600;
  font-size: 1.15em;
  letter-spacing: 0;
  line-height: 1;
  font-variation-settings: "opsz" 144;
}
.footer .mark {
  color: var(--color-ink);
  font-family: var(--font-display);
  font-weight: 600;
  letter-spacing: -0.02em;
  text-transform: none;
  font-size: 1.05em;
  font-variation-settings: "opsz" 144;
}
.footer-handle {
  letter-spacing: 0.12em;
  color: var(--color-inkMuted);
  white-space: nowrap;
  font-family: var(--font-sans);
  font-size: 0.92em;
}
`;

