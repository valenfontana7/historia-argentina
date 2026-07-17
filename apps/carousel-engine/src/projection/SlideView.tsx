import type { CSSProperties, ReactElement } from "react";
import type { IrSlot, SlideIr, TypeRole } from "@museoargent/carousel-contracts";
import type { ThemeTokens } from "../application/stages/theme-resolver";

function roleClass(role: TypeRole): string {
  switch (role) {
    case "display":
      return "display";
    case "title":
      return "title";
    case "subtitle":
      return "subtitle";
    case "body":
      return "body";
    case "caption":
      return "caption";
    case "kicker":
      return "kicker";
    case "stat":
      return "stat";
    case "cta":
      return "cta";
    default: {
      const _exhaustive: never = role;
      return _exhaustive;
    }
  }
}

function brandToken(theme: ThemeTokens, key: string, fallback = ""): string {
  return theme.tokens[key] ?? fallback;
}

function SlotView({
  slot,
  theme,
  recipeId,
}: {
  slot: IrSlot;
  theme: ThemeTokens;
  recipeId: string;
}): ReactElement {
  const style = {
    left: slot.box.x,
    top: slot.box.y,
    width: slot.box.w,
    height: slot.box.h,
  };

  if (slot.component === "Footer") {
    const logoSrc = brandToken(theme, "brand.logoSrc");
    const mark = brandToken(theme, "brand.mark", "A");
    const name = brandToken(theme, "brand.displayName", "MuseoArgent");
    const handle = brandToken(theme, "brand.handle", "@museoargent");
    return (
      <div className="slot footer" style={style}>
        <span className="footer-brand">
          {logoSrc ? (
            <img className="footer-logo" src={logoSrc} alt="" />
          ) : (
            <span className="mark-glyph" aria-hidden>
              {mark}
            </span>
          )}
          <span className="mark">{name}</span>
        </span>
        <span className="footer-handle">{handle}</span>
      </div>
    );
  }

  if (slot.node.kind === "divider") {
    return (
      <div className="slot" style={style}>
        <div className="divider" />
      </div>
    );
  }

  if (slot.node.kind === "image") {
    const pos = `${(slot.node.focusX ?? 0.5) * 100}% ${(slot.node.focusY ?? 0.5) * 100}%`;
    const withScrim = recipeId === "cover-hero";
    return (
      <div
        className={`slot slot-image${withScrim ? " slot-image-cover" : ""}`}
        style={style}
      >
        <img
          className="img"
          src={slot.node.src}
          alt={slot.node.alt ?? ""}
          style={{
            objectFit: slot.node.fit,
            objectPosition: pos,
          }}
        />
      </div>
    );
  }

  if (slot.node.kind === "spacer") {
    return <div className="slot" style={style} />;
  }

  if (slot.component === "Badge") {
    const logoSrc = brandToken(theme, "brand.logoSrc");
    const name = brandToken(theme, "brand.displayName", "MuseoArgent");
    return (
      <div className="slot slot-text badge" style={style}>
        {logoSrc ? (
          <img className="badge-logo" src={logoSrc} alt="" />
        ) : null}
        <span className="badge-label">{name.toUpperCase()}</span>
      </div>
    );
  }

  const cls =
    slot.component === "Quote"
      ? "quote"
      : slot.component === "CTA"
        ? "cta"
        : roleClass(slot.node.role);

  const maxLines =
    slot.node.kind === "text" ? slot.node.maxLines : undefined;
  const clampStyle: CSSProperties =
    maxLines && maxLines > 0
      ? {
          ...style,
          ["--clamp-lines" as string]: String(maxLines),
        }
      : style;

  return (
    <div
      className={`slot slot-text ${cls}${maxLines ? " clamp" : ""}`}
      style={clampStyle}
    >
      {slot.node.content}
    </div>
  );
}

export function SlideView({
  ir,
  theme,
}: {
  ir: SlideIr;
  theme: ThemeTokens;
}): ReactElement {
  return (
    <div
      className="slide"
      style={{ width: ir.width, height: ir.height }}
      data-slide-id={ir.slideId}
      data-recipe={ir.recipeId}
    >
      {ir.slots.map((slot) => (
        <SlotView
          key={slot.id}
          slot={slot}
          theme={theme}
          recipeId={ir.recipeId}
        />
      ))}
    </div>
  );
}
