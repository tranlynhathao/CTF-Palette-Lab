/**
 * ExactCompetitionLogo
 * --------------------
 * Source-faithful preview of the HCMUS CTF 2026 wordmark, extracted directly
 * from the master `logo-ctf26.ai` (PDF-compatible Illustrator save) via
 * `pdf2svg`.
 *
 * - Geometry: every path is the original vector path from the AI/PDF source.
 *   No paths were redrawn or approximated.
 * - Typography: text was already converted to outlines in the source. The
 *   original glyph outlines are used as-is, so the preview is exact even
 *   without any web font.
 * - The brand pink #E42175 is the canonical HCMUS CTF 2026 brand colour and
 *   is hard-coded as the fallback for `--logo-pink`. In Authentic and
 *   Palette-Aware modes it stays exactly that. Experimental mode is the only
 *   path that overrides it, and the UI surfaces a warning when it does.
 *
 * Four CSS custom properties drive the recolorable zones:
 *
 *   --logo-pink     brand pink fills      (locked in non-experimental modes)
 *   --logo-light    white "back face" fills + light glyph fills
 *   --logo-outline  dark stroke outlines around white shapes
 *   --logo-shadow   dark fill of the cube glyph (the only solid dark fill)
 *
 * The fifth role exposed in the props (`accent`) is unused by the current
 * source artwork — the master logo has exactly four colour zones — but the
 * prop exists so future logo revisions or alternate marks can plug in
 * without breaking the API.
 *
 * This file is for palette simulation. Do not edit the geometry or replace
 * the typography. If the master logo changes, re-run pdf2svg on the master,
 * re-apply the colour substitutions documented in README, and update
 * `src/assets/logo/logo-ctf26.svg`.
 */

import logoSvg from "../../assets/logo/logo-ctf26.svg?raw";

export type ExactLogoProps = {
  /** Brand pink. Locked at #E42175 in Authentic + Palette-Aware modes. */
  pink?: string;
  /** Light/white zones — back face of extruded letterforms + light glyphs. */
  light?: string;
  /** Dark outlines/strokes around the back face. */
  outline?: string;
  /** Dark solid fill of the cube glyph. */
  shadow?: string;
  /**
   * Reserved for future accent zones in alternate logo revisions. Currently
   * the master artwork has no dedicated accent paths, so this prop is a
   * no-op visually but is forwarded as `--logo-accent` for forward-compat.
   */
  accent?: string;
  /** Render width in CSS pixels. Aspect ratio is locked at 210:70. */
  width?: number | string;
  /** Optional className passed to the wrapper. */
  className?: string;
  /** Visually hidden label for screen readers. */
  ariaLabel?: string;
};

/** The fixed brand pink. Re-exported so callers reference it without a magic string. */
export const HCMUS_CTF_BRAND_PINK = "#E42175" as const;

export function ExactCompetitionLogo({
  pink = HCMUS_CTF_BRAND_PINK,
  light = "#FFFFFF",
  outline = "#232020",
  shadow = "#232020",
  accent,
  width = "100%",
  className,
  ariaLabel = "HCMUS CTF 2026 logo",
}: ExactLogoProps) {
  return (
    <div
      role="img"
      aria-label={ariaLabel}
      className={className}
      style={
        {
          width,
          aspectRatio: "210 / 70",
          display: "inline-block",
          lineHeight: 0,
          // Bind palette tokens into the SVG via CSS variables. Each path
          // in the SVG references one of these vars, so swapping any one of
          // them only repaints the matching zone.
          ["--logo-pink" as string]: pink,
          ["--logo-light" as string]: light,
          ["--logo-outline" as string]: outline,
          ["--logo-shadow" as string]: shadow,
          ...(accent ? { ["--logo-accent" as string]: accent } : {}),
        } as React.CSSProperties
      }
      dangerouslySetInnerHTML={{ __html: logoSvg }}
    />
  );
}
