export type ColorRole =
  | "bgPrimary"
  | "bgSecondary"
  | "surface"
  | "surfaceElevated"
  | "primary"
  | "secondary"
  | "accent"
  | "highlight"
  | "textMain"
  | "textMuted"
  | "border"
  | "danger";

export const ROLE_ORDER: ColorRole[] = [
  "bgPrimary",
  "bgSecondary",
  "surface",
  "surfaceElevated",
  "primary",
  "secondary",
  "accent",
  "highlight",
  "textMain",
  "textMuted",
  "border",
  "danger",
];

export const ROLE_META: Record<
  ColorRole,
  {
    label: string;
    usage: string;
    group: "background" | "brand" | "text" | "system";
  }
> = {
  bgPrimary: {
    label: "Background Primary",
    usage: "Main page / poster / app background.",
    group: "background",
  },
  bgSecondary: {
    label: "Background Secondary",
    usage: "Sections, secondary surfaces, headers.",
    group: "background",
  },
  surface: {
    label: "Surface",
    usage: "Cards, panels, modals.",
    group: "background",
  },
  surfaceElevated: {
    label: "Surface Elevated",
    usage: "Elevated cards, popovers, hover states.",
    group: "background",
  },
  primary: {
    label: "Primary",
    usage: "Logo highlight, CTAs, brand accent.",
    group: "brand",
  },
  secondary: {
    label: "Secondary",
    usage: "Links, secondary actions, motif details.",
    group: "brand",
  },
  accent: {
    label: "Accent",
    usage: "Highlights, badges, special callouts.",
    group: "brand",
  },
  highlight: {
    label: "Highlight",
    usage: "Selection, hover glow, emphasis.",
    group: "brand",
  },
  textMain: {
    label: "Text Main",
    usage: "Primary readable text.",
    group: "text",
  },
  textMuted: {
    label: "Text Muted",
    usage: "Secondary text, metadata, captions.",
    group: "text",
  },
  border: {
    label: "Border",
    usage: "Dividers, subtle outlines, hairlines.",
    group: "system",
  },
  danger: {
    label: "Danger",
    usage: "Errors, warnings, destructive actions.",
    group: "system",
  },
};

export type PaletteColor = {
  id: string;
  role: ColorRole;
  label: string;
  hex: string;
  locked: boolean;
};

export type Palette = {
  id: string;
  name: string;
  description: string;
  mood: string;
  tags: string[];
  colors: PaletteColor[];
  createdAt: string;
  updatedAt: string;
};

export type HarmonyMode =
  | "monochromatic"
  | "analogous"
  | "complementary"
  | "splitComplementary"
  | "triadic"
  | "tetradic"
  | "darkOptimized"
  | "highContrast"
  | "mutedProfessional"
  | "neonAccent"
  | "classicNoir";

export const HARMONY_MODES: { value: HarmonyMode; label: string }[] = [
  { value: "darkOptimized", label: "Dark Optimized" },
  { value: "highContrast", label: "High Contrast" },
  { value: "mutedProfessional", label: "Muted Professional" },
  { value: "neonAccent", label: "Neon Accent" },
  { value: "classicNoir", label: "Classic Noir" },
  { value: "monochromatic", label: "Monochromatic" },
  { value: "analogous", label: "Analogous" },
  { value: "complementary", label: "Complementary" },
  { value: "splitComplementary", label: "Split Complementary" },
  { value: "triadic", label: "Triadic" },
  { value: "tetradic", label: "Tetradic" },
];

export type Mood =
  | "cyberNoir"
  | "classicHacker"
  | "googleCtf"
  | "darkAcademic"
  | "redTeam"
  | "blueTeam"
  | "vault"
  | "cubicGlass"
  | "puzzleCube"
  | "retroCrt"
  | "terminalWar"
  | "neonMinimal";

export const MOODS: { value: Mood; label: string; hint: string }[] = [
  {
    value: "cyberNoir",
    label: "Cyber Noir",
    hint: "Premium dark, magenta + gold",
  },
  {
    value: "classicHacker",
    label: "Classic Hacker",
    hint: "Phosphor green, terminal",
  },
  {
    value: "googleCtf",
    label: "Multi-Color CTF",
    hint: "Restrained primary colors",
  },
  { value: "darkAcademic", label: "Dark Academic", hint: "Ink navy, burgundy" },
  { value: "redTeam", label: "Red Team", hint: "Offensive, tactical" },
  { value: "blueTeam", label: "Blue Team", hint: "Defensive, cobalt grid" },
  { value: "vault", label: "Vault Gold", hint: "Final round, prestige" },
  { value: "cubicGlass", label: "Cubic Glass", hint: "Translucent, modern" },
  { value: "puzzleCube", label: "Puzzle Cube", hint: "Geometric primaries" },
  { value: "retroCrt", label: "Retro CRT", hint: "Phosphor, amber" },
  { value: "terminalWar", label: "Terminal War Room", hint: "Matte, military" },
  { value: "neonMinimal", label: "Neon Minimal", hint: "Restrained cyber" },
];

export type GenerationOptions = {
  darkOptimized: boolean;
  mutedProfessional: boolean;
  highContrast: boolean;
  neonAccent: boolean;
  classicTone: boolean;
};

export const DEFAULT_GENERATION_OPTIONS: GenerationOptions = {
  darkOptimized: true,
  mutedProfessional: false,
  highContrast: true,
  neonAccent: false,
  classicTone: false,
};

export type CvdMode = "normal" | "protanopia" | "deuteranopia" | "tritanopia" | "grayscale";

/**
 * How the Logo preview tab interprets palette colors.
 *
 * - `authentic`     — All zones stay at the original master values. Brand
 *                     pink #E42175 locked. Only the surrounding card
 *                     background changes.
 * - `paletteAware`  — Brand pink locked. Other zones (light back-face,
 *                     dark outline, dark shadow) bind to palette tokens.
 *                     The default — most useful for actually testing
 *                     palettes against the real logo.
 * - `experimental`  — Even the brand pink is overridden by palette.primary.
 *                     Surfaces a warning. Useful for exploring alternate
 *                     brand directions; never the canonical preview.
 */
export type LogoColorMode = "authentic" | "paletteAware" | "experimental";
