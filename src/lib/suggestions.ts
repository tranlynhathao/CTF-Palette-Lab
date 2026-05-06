import { computeContrastReport } from "./contrast";
import { hexToOklchObject } from "./color";
import type { Palette } from "../types";

export type Suggestion = {
  id: string;
  level: "info" | "warn" | "good";
  text: string;
};

export function generateSuggestions(palette: Palette): Suggestion[] {
  const out: Suggestion[] = [];
  const report = computeContrastReport(palette);
  const get = (role: string) => palette.colors.find((c) => c.role === role)?.hex ?? "#000";

  const primaryOk = hexToOklchObject(get("primary"));
  const accentOk = hexToOklchObject(get("accent"));
  const bgOk = hexToOklchObject(get("bgPrimary"));
  const textMain = get("textMain");

  const mainOnBg = report.find((r) => r.fg === "textMain" && r.bg === "bgPrimary");
  const mutedOnBg = report.find((r) => r.fg === "textMuted" && r.bg === "bgPrimary");
  const primaryOnBg = report.find((r) => r.fg === "primary" && r.bg === "bgPrimary");
  const accentOnBg = report.find((r) => r.fg === "accent" && r.bg === "bgPrimary");

  if (mainOnBg && mainOnBg.ratio >= 8) {
    out.push({
      id: "text-good",
      level: "good",
      text: "Text Main has excellent contrast on Background Primary — strong for body copy and posters.",
    });
  } else if (mainOnBg && mainOnBg.ratio < 4.5) {
    out.push({
      id: "text-fail",
      level: "warn",
      text: "Text Main fails AA contrast on Background Primary. Body copy will be hard to read.",
    });
  }

  if (mutedOnBg && mutedOnBg.ratio < 3) {
    out.push({
      id: "muted-fail",
      level: "warn",
      text: "Muted text fails contrast on Background Primary. Captions and metadata will be illegible.",
    });
  }

  if (primaryOnBg && primaryOnBg.ratio < 3.5) {
    out.push({
      id: "primary-weak",
      level: "warn",
      text: "Primary color does not stand out on the Background Primary. Increase lightness or chroma.",
    });
  } else if (primaryOnBg && primaryOnBg.ratio >= 5) {
    out.push({
      id: "primary-good",
      level: "good",
      text: "Primary color stands out cleanly on the dark background — strong for logo and CTAs.",
    });
  }

  if (accentOk.c > 0.2 && primaryOk.c > 0.2) {
    out.push({
      id: "accent-saturated",
      level: "warn",
      text: "Accent and Primary are both highly saturated. Use accent sparingly to avoid visual clash.",
    });
  }

  if (accentOnBg && accentOnBg.ratio < 3) {
    out.push({
      id: "accent-faded",
      level: "info",
      text: "Accent color reads softly against the background — best used for decorative cubes and motifs at large size.",
    });
  }

  // Stylistic guidance
  if (textMain.toLowerCase() === "#ffffff") {
    out.push({
      id: "ivory-tip",
      level: "info",
      text: "Use ivory (#F2EDE3) instead of pure white for a more classic, premium tone.",
    });
  }

  if (bgOk.l < 0.12 && primaryOk.h !== undefined) {
    if (primaryOk.h > 320 || primaryOk.h < 20) {
      out.push({
        id: "noir-feel",
        level: "good",
        text: "This palette has a strong cyber noir feeling — well suited for serious brand exploration.",
      });
    }
  }

  out.push({
    id: "primary-usage",
    level: "info",
    text: "Use Primary only for logo, CTA, and important highlights. Reserve Accent for badges and decorative cube motifs.",
  });

  if (primaryOk.c < 0.08) {
    out.push({
      id: "primary-flat",
      level: "info",
      text: "Primary color is low-chroma. The palette will read as restrained and editorial — strong for posters, weak for hype moments.",
    });
  }

  return out;
}
