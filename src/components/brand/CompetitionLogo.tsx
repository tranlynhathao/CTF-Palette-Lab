/**
 * CompetitionLogo — the single source of truth for the HCMUS CTF 2026
 * wordmark across the entire app.
 *
 * Every preview surface (Logo, Poster, Social, Landing, Terminal, Cubic
 * Motifs, Typography, Palette Comparison) and every export pipeline routes
 * through this component. There is no other place in the codebase that may
 * typeset "HCMUS", "CTF", or "2026" as a brand mark — those are reserved
 * for body copy, UI labels, and CTF-flag content only.
 *
 * Behaviour:
 *
 * - By default the component pulls the active palette and the current
 *   `logoMode` from the Zustand store, resolves the four colour zones, and
 *   renders the recolorable extracted SVG.
 * - Callers can override the palette (`palette` prop) when they need a
 *   different palette than the global one — e.g. PaletteComparison renders
 *   the same wordmark four times with four distinct palettes.
 * - Callers can override the colour mode (`mode` prop) when a surface needs
 *   to ignore the global mode — e.g. comparison cards always force
 *   `paletteAware` so two compared palettes look distinctly different.
 * - Per-zone overrides (`pink` / `light` / `outline` / `shadow`) take
 *   precedence over mode resolution, used by LogoPreview to fine-tune the
 *   `light` zone per preview card.
 *
 * The geometry and typography are the master Illustrator artwork — never
 * approximations. Brand pink #E42175 is locked except in Experimental mode.
 */

import { usePaletteStore } from "../../store/paletteStore";
import type { LogoColorMode, Palette } from "../../types";
import { resolveLogoColors } from "../preview/LogoPreview";
import { ExactCompetitionLogo, HCMUS_CTF_BRAND_PINK } from "../preview/ExactCompetitionLogo";

export type CompetitionLogoProps = {
  /** Width in CSS px or %. Aspect ratio is locked to the source artboard (210:70). */
  width?: number | string;
  /** Override the global logoMode. Most callers should leave this undefined. */
  mode?: LogoColorMode;
  /** Override the palette driving the colours. Defaults to the store's `current`. */
  palette?: Palette;
  /** Per-zone manual overrides — take priority over mode resolution. */
  pink?: string;
  light?: string;
  outline?: string;
  shadow?: string;
  className?: string;
  ariaLabel?: string;
};

export function CompetitionLogo({
  width = "100%",
  mode,
  palette,
  pink,
  light,
  outline,
  shadow,
  className,
  ariaLabel,
}: CompetitionLogoProps) {
  const storePalette = usePaletteStore((s) => s.current);
  const storeMode = usePaletteStore((s) => s.logoMode);

  const effectivePalette = palette ?? storePalette;
  const effectiveMode = mode ?? storeMode;
  const resolved = resolveLogoColors(effectivePalette, effectiveMode);

  return (
    <ExactCompetitionLogo
      pink={pink ?? resolved.pink}
      light={light ?? resolved.light}
      outline={outline ?? resolved.outline}
      shadow={shadow ?? resolved.shadow}
      accent={resolved.accent}
      width={width}
      className={className}
      ariaLabel={ariaLabel ?? `Brand wordmark — ${effectivePalette.name}`}
    />
  );
}

// Re-export the locked brand pink so brand-adjacent UI (e.g. badges, dots)
// can reference the canonical constant without importing the deeper module.
export { HCMUS_CTF_BRAND_PINK };
