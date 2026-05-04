/**
 * ExactCompetitionLogo
 * --------------------
 * Source-faithful preview of the HCMUS CTF 2026 wordmark, extracted directly
 * from `logo-ctf26.ai` (PDF-compatible Illustrator save) via `pdf2svg`.
 *
 * - Geometry: every path is the original vector path from the AI/PDF source.
 *   No paths were redrawn or approximated.
 * - Typography: text was already converted to outlines in the source. The
 *   original glyph outlines are used as-is, so the preview is exact even
 *   without any web font.
 * - The brand pink #E42175 is hard-coded into the SVG and intentionally NOT
 *   recolored under any circumstance — this is the fixed competition color.
 * - Two zones respond to the active palette via CSS custom properties:
 *     --logo-ink   → dark stroke / cube front / outline detail
 *     --logo-back  → white "back face" of the 3D-extruded letterforms
 *
 * This file is for palette simulation. Do not edit the geometry or replace
 * the typography. If the master logo changes, re-run pdf2svg and update
 * `src/assets/logo/logo-ctf26.svg`.
 */

import logoSvg from "../../assets/logo/logo-ctf26.svg?raw";

export type ExactLogoProps = {
  /** Color used for the dark "ink" outline + cube front. Defaults to a near-black. */
  ink?: string;
  /** Color used for the back face of the extruded letterforms. */
  back?: string;
  /** Render width in CSS pixels. The aspect ratio is locked at 210:70. */
  width?: number | string;
  /** Optional className passed to the wrapper. */
  className?: string;
  /** Visually hidden label for screen readers. */
  ariaLabel?: string;
};

/** The fixed brand pink. Re-exported so callers can reference it without a magic string. */
export const HCMUS_CTF_BRAND_PINK = "#E42175" as const;

export function ExactCompetitionLogo({
  ink = "#232020",
  back = "#FFFFFF",
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
          // Lock aspect to the original artboard (210pt × 70pt)
          aspectRatio: "210 / 70",
          display: "inline-block",
          lineHeight: 0,
          // Bind palette tokens into the SVG via CSS variables
          ["--logo-ink" as string]: ink,
          ["--logo-back" as string]: back,
        } as React.CSSProperties
      }
      dangerouslySetInnerHTML={{ __html: logoSvg }}
    />
  );
}
