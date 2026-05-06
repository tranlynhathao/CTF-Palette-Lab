import { usePaletteStore } from "../../store/paletteStore";
import type { LogoColorMode, Palette } from "../../types";
import { resolveLogoColors } from "../preview/LogoPreview";
import { ExactCompetitionLogo, HCMUS_CTF_BRAND_PINK } from "../preview/ExactCompetitionLogo";

export type CompetitionLogoProps = {
  width?: number | string;
  mode?: LogoColorMode;
  palette?: Palette;
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

export { HCMUS_CTF_BRAND_PINK };
