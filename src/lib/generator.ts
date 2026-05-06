import type {
  ColorRole,
  GenerationOptions,
  HarmonyMode,
  Mood,
  Palette,
  PaletteColor,
} from "../types";
import { ROLE_META } from "../types";
import { adjustOklch, hexToOklchObject, mixHex, oklchToHex, rotateHue } from "./color";
import { contrastRatio } from "./contrast";

type RoleHexMap = Record<ColorRole, string>;

const MOOD_HUE_BIAS: Record<Mood, { primary: number; secondary: number; accent: number }> = {
  cyberNoir: { primary: 340, secondary: 200, accent: 45 },
  classicHacker: { primary: 130, secondary: 40, accent: 100 },
  googleCtf: { primary: 220, secondary: 10, accent: 50 },
  darkAcademic: { primary: 0, secondary: 230, accent: 40 },
  redTeam: { primary: 5, secondary: 220, accent: 25 },
  blueTeam: { primary: 220, secondary: 200, accent: 195 },
  vault: { primary: 45, secondary: 285, accent: 30 },
  cubicGlass: { primary: 290, secondary: 195, accent: 270 },
  puzzleCube: { primary: 330, secondary: 220, accent: 50 },
  retroCrt: { primary: 130, secondary: 35, accent: 180 },
  terminalWar: { primary: 90, secondary: 80, accent: 40 },
  neonMinimal: { primary: 330, secondary: 195, accent: 270 },
};

function moveHueTowards(currentHue: number, target: number, amount: number): number {
  const diff = ((target - currentHue + 540) % 360) - 180;
  return (((currentHue + diff * amount) % 360) + 360) % 360;
}

export function generatePalette(opts: {
  seed: string;
  mood: Mood;
  harmony: HarmonyMode;
  options: GenerationOptions;
  locked: Partial<RoleHexMap>;
  baseName?: string;
}): Palette {
  const { seed, mood, harmony, options, locked, baseName } = opts;
  const hues = harmonyHues(seed, harmony);
  const moodBias = MOOD_HUE_BIAS[mood];
  const seedOk = hexToOklchObject(seed);

  const isClassic = options.classicTone;
  const isMuted = options.mutedProfessional;
  const isHighContrast = options.highContrast;
  const isNeon = options.neonAccent;
  const isDark = options.darkOptimized;

  const bgL = isDark ? 0.08 : 0.18;
  const bgC = isClassic ? 0.012 : 0.02;
  const bgHue = moveHueTowards(seedOk.h ?? 240, 240, 0.4);

  const bgPrimary = oklchToHex(bgL, bgC, bgHue);
  const bgSecondary = oklchToHex(bgL + 0.04, bgC + 0.005, bgHue + 4);
  const surface = oklchToHex(bgL + 0.07, bgC + 0.01, bgHue + 2);
  const surfaceElevated = oklchToHex(bgL + 0.1, bgC + 0.012, bgHue);
  const border = oklchToHex(bgL + 0.05, bgC + 0.005, bgHue);

  const primaryC = isMuted ? 0.12 : isNeon ? 0.22 : 0.18;
  const primaryL = isHighContrast ? 0.55 : 0.5;
  let primaryHue = seedOk.h ?? moodBias.primary;
  primaryHue = moveHueTowards(primaryHue, moodBias.primary, 0.25);
  const primary = oklchToHex(primaryL, primaryC, primaryHue);

  let secondaryHue = hues[1] ?? primaryHue + 180;
  secondaryHue = moveHueTowards(secondaryHue, moodBias.secondary, 0.3);
  const secondaryL = 0.7;
  const secondaryC = isMuted ? 0.1 : 0.15;
  const secondary = oklchToHex(secondaryL, secondaryC, secondaryHue);

  let accentHue = hues[2] ?? primaryHue + 60;
  accentHue = moveHueTowards(accentHue, moodBias.accent, 0.4);
  const accentL = 0.7;
  const accentC = isMuted ? 0.1 : 0.16;
  const accent = oklchToHex(accentL, accentC, accentHue);

  const highlightHue = (primaryHue + 20) % 360;
  const highlight = oklchToHex(0.65, primaryC * 0.9, highlightHue);

  const textMainL = 0.94;
  const textMainC = isClassic ? 0.02 : 0.01;
  const textMain = oklchToHex(textMainL, textMainC, isClassic ? 75 : 80);
  const textMuted = oklchToHex(0.65, 0.015, bgHue + 30);

  const danger = oklchToHex(0.62, 0.18, 25);

  let map: RoleHexMap = {
    bgPrimary,
    bgSecondary,
    surface,
    surfaceElevated,
    primary,
    secondary,
    accent,
    highlight,
    textMain,
    textMuted,
    border,
    danger,
  };

  (Object.keys(locked) as ColorRole[]).forEach((role) => {
    if (locked[role]) map[role] = locked[role]!;
  });

  map = repairContrasts(map, locked);

  const colors: PaletteColor[] = (Object.keys(map) as ColorRole[]).map((role) => ({
    id: `${role}-${Math.random().toString(36).slice(2, 8)}`,
    role,
    label: ROLE_META[role].label,
    hex: map[role],
    locked: !!locked[role],
  }));

  const now = new Date().toISOString();
  return {
    id: `pal-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`,
    name: baseName ?? `Generated ${moodLabel(mood)}`,
    description: `Generated palette · ${moodLabel(mood)} · ${harmonyLabel(harmony)}`,
    mood,
    tags: ["generated", mood, harmony],
    colors,
    createdAt: now,
    updatedAt: now,
  };
}

function harmonyHues(seed: string, harmony: HarmonyMode): number[] {
  const s = hexToOklchObject(seed);
  const h = s.h ?? 240;
  switch (harmony) {
    case "monochromatic":
      return [h, h, h, h];
    case "analogous":
      return [h, (h + 30) % 360, (h + 60) % 360, (h - 30 + 360) % 360];
    case "complementary":
      return [h, (h + 180) % 360, (h + 30) % 360, (h + 150) % 360];
    case "splitComplementary":
      return [h, (h + 150) % 360, (h + 210) % 360, (h + 30) % 360];
    case "triadic":
      return [h, (h + 120) % 360, (h + 240) % 360, (h + 60) % 360];
    case "tetradic":
      return [h, (h + 90) % 360, (h + 180) % 360, (h + 270) % 360];
    case "neonAccent":
      return [h, (h + 180) % 360, (h + 100) % 360];
    case "highContrast":
      return [h, (h + 200) % 360, (h + 40) % 360];
    case "mutedProfessional":
      return [h, (h + 25) % 360, (h + 55) % 360];
    case "classicNoir":
      return [h, (h + 200) % 360, 40];
    case "darkOptimized":
    default:
      return [h, (h + 170) % 360, (h + 50) % 360];
  }
}

function repairContrasts(map: RoleHexMap, locked: Partial<RoleHexMap>): RoleHexMap {
  const out = { ...map };

  if (!locked.textMain) {
    let attempts = 0;
    while (contrastRatio(out.textMain, out.bgPrimary) < 7 && attempts < 8) {
      out.textMain = adjustOklch(out.textMain, { dl: 0.04 });
      attempts++;
    }
  }

  if (!locked.textMuted) {
    let attempts = 0;
    while (contrastRatio(out.textMuted, out.bgPrimary) < 3.2 && attempts < 8) {
      out.textMuted = adjustOklch(out.textMuted, { dl: 0.03 });
      attempts++;
    }
  }

  if (!locked.primary) {
    let attempts = 0;
    while (contrastRatio(out.primary, out.bgPrimary) < 4 && attempts < 8) {
      out.primary = adjustOklch(out.primary, { dl: 0.03, dc: 0.005 });
      attempts++;
    }
  }

  if (!locked.accent) {
    let attempts = 0;
    while (contrastRatio(out.accent, out.bgPrimary) < 3.5 && attempts < 8) {
      out.accent = adjustOklch(out.accent, { dl: 0.03 });
      attempts++;
    }
  }

  if (!locked.border) {
    out.border = mixHex(out.bgPrimary, out.textMuted, 0.18);
  }

  return out;
}

export function moodLabel(mood: string): string {
  const m: Record<string, string> = {
    cyberNoir: "Cyber Noir",
    classicHacker: "Classic Hacker",
    googleCtf: "Multi-Color CTF",
    darkAcademic: "Dark Academic",
    redTeam: "Red Team",
    blueTeam: "Blue Team",
    vault: "Vault",
    cubicGlass: "Cubic Glass",
    puzzleCube: "Puzzle Cube",
    retroCrt: "Retro CRT",
    terminalWar: "Terminal War Room",
    neonMinimal: "Neon Minimal",
  };
  return m[mood] ?? mood;
}

export function harmonyLabel(h: HarmonyMode): string {
  const m: Record<HarmonyMode, string> = {
    monochromatic: "Monochromatic",
    analogous: "Analogous",
    complementary: "Complementary",
    splitComplementary: "Split Complementary",
    triadic: "Triadic",
    tetradic: "Tetradic",
    darkOptimized: "Dark Optimized",
    highContrast: "High Contrast",
    mutedProfessional: "Muted Professional",
    neonAccent: "Neon Accent",
    classicNoir: "Classic Noir",
  };
  return m[h];
}

export function regenerateUnlocked(
  current: Palette,
  opts: {
    seed: string;
    mood: Mood;
    harmony: HarmonyMode;
    options: GenerationOptions;
  },
): Palette {
  const lockedMap: Partial<RoleHexMap> = {};
  current.colors.forEach((c) => {
    if (c.locked) lockedMap[c.role] = c.hex;
  });
  const fresh = generatePalette({
    ...opts,
    locked: lockedMap,
    baseName: current.name,
  });
  fresh.id = current.id;
  fresh.createdAt = current.createdAt;
  fresh.colors = fresh.colors.map((c) => ({
    ...c,
    locked: !!lockedMap[c.role],
  }));
  return fresh;
}

export { rotateHue };
