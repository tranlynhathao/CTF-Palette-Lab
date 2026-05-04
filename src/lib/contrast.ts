import { getRelativeLuminance } from "./color";
import type { ColorRole, Palette } from "../types";

export function contrastRatio(hexA: string, hexB: string): number {
  const la = getRelativeLuminance(hexA);
  const lb = getRelativeLuminance(hexB);
  const light = Math.max(la, lb);
  const dark = Math.min(la, lb);
  return (light + 0.05) / (dark + 0.05);
}

export type ContrastVerdict = "Excellent" | "Good" | "Risky" | "Fail";

export function verdict(ratio: number): ContrastVerdict {
  if (ratio >= 7) return "Excellent";
  if (ratio >= 4.5) return "Good";
  if (ratio >= 3) return "Risky";
  return "Fail";
}

export function passes(ratio: number) {
  return {
    aaNormal: ratio >= 4.5,
    aaLarge: ratio >= 3,
    aaaNormal: ratio >= 7,
    aaaLarge: ratio >= 4.5,
  };
}

export type ContrastPair = {
  fg: ColorRole | "white" | "black";
  bg: ColorRole | "primary" | "accent";
  label: string;
};

export const CONTRAST_PAIRS: ContrastPair[] = [
  { fg: "textMain", bg: "bgPrimary", label: "Text Main on Background Primary" },
  { fg: "textMain", bg: "bgSecondary", label: "Text Main on Background Secondary" },
  { fg: "textMain", bg: "surface", label: "Text Main on Surface" },
  { fg: "textMuted", bg: "bgPrimary", label: "Text Muted on Background Primary" },
  { fg: "textMuted", bg: "surface", label: "Text Muted on Surface" },
  { fg: "primary", bg: "bgPrimary", label: "Primary on Background Primary" },
  { fg: "primary", bg: "surface", label: "Primary on Surface" },
  { fg: "accent", bg: "bgPrimary", label: "Accent on Background Primary" },
  { fg: "accent", bg: "surface", label: "Accent on Surface" },
  { fg: "white", bg: "primary", label: "White on Primary (button text)" },
  { fg: "black", bg: "accent", label: "Black on Accent (button text)" },
];

export function resolveColor(palette: Palette, key: string): string {
  if (key === "white") return "#FFFFFF";
  if (key === "black") return "#000000";
  const c = palette.colors.find((c) => c.role === key);
  return c?.hex ?? "#000000";
}

export function computeContrastReport(palette: Palette) {
  return CONTRAST_PAIRS.map((p) => {
    const fg = resolveColor(palette, p.fg);
    const bg = resolveColor(palette, p.bg);
    const ratio = contrastRatio(fg, bg);
    return {
      ...p,
      fgHex: fg,
      bgHex: bg,
      ratio,
      verdict: verdict(ratio),
      ...passes(ratio),
    };
  });
}
