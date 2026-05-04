import { parse, formatHex, formatRgb, converter, oklch, hsl, rgb, type Color } from "culori";

const toOklch = converter("oklch");
const toHsl = converter("hsl");
const toRgb = converter("rgb");

export function safeHex(input: string): string {
  try {
    const c = parse(input);
    if (!c) return "#000000";
    return formatHex(c) ?? "#000000";
  } catch {
    return "#000000";
  }
}

export function isValidHex(input: string): boolean {
  if (!input) return false;
  return /^#?[0-9a-fA-F]{3}([0-9a-fA-F]{3})?$/.test(input.trim());
}

export function normalizeHex(input: string): string {
  let h = input.trim();
  if (!h.startsWith("#")) h = "#" + h;
  if (h.length === 4) {
    h = "#" + h[1] + h[1] + h[2] + h[2] + h[3] + h[3];
  }
  return h.toLowerCase();
}

export function hexToRgbString(hex: string): string {
  const c = parse(hex);
  if (!c) return "rgb(0, 0, 0)";
  return formatRgb(c) ?? "rgb(0, 0, 0)";
}

export function hexToRgbObject(hex: string): { r: number; g: number; b: number } {
  const c = toRgb(parse(hex));
  if (!c) return { r: 0, g: 0, b: 0 };
  return {
    r: Math.round((c.r ?? 0) * 255),
    g: Math.round((c.g ?? 0) * 255),
    b: Math.round((c.b ?? 0) * 255),
  };
}

export function hexToHslObject(hex: string): { h: number; s: number; l: number } {
  const c = toHsl(parse(hex));
  if (!c) return { h: 0, s: 0, l: 0 };
  return {
    h: Math.round(c.h ?? 0),
    s: Math.round((c.s ?? 0) * 100),
    l: Math.round((c.l ?? 0) * 100),
  };
}

export function hexToOklchObject(hex: string): { l: number; c: number; h: number } {
  const c = toOklch(parse(hex));
  if (!c) return { l: 0, c: 0, h: 0 };
  return {
    l: Number((c.l ?? 0).toFixed(3)),
    c: Number((c.c ?? 0).toFixed(3)),
    h: Number((c.h ?? 0).toFixed(1)),
  };
}

export function hslToHex(h: number, s: number, l: number): string {
  const c: Color = {
    mode: "hsl",
    h: ((h % 360) + 360) % 360,
    s: clamp01(s / 100),
    l: clamp01(l / 100),
  };
  return formatHex(c) ?? "#000000";
}

export function oklchToHex(l: number, c: number, h: number): string {
  const col: Color = { mode: "oklch", l: clamp01(l), c: Math.max(0, c), h };
  const r = toRgb(col);
  if (!r) return "#000000";
  return (
    formatHex({
      mode: "rgb",
      r: clamp01(r.r ?? 0),
      g: clamp01(r.g ?? 0),
      b: clamp01(r.b ?? 0),
    }) ?? "#000000"
  );
}

export function clamp01(n: number) {
  return Math.max(0, Math.min(1, n));
}

export function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

export function getRelativeLuminance(hex: string): number {
  const { r, g, b } = hexToRgbObject(hex);
  const sR = sRgbChannelToLinear(r / 255);
  const sG = sRgbChannelToLinear(g / 255);
  const sB = sRgbChannelToLinear(b / 255);
  return 0.2126 * sR + 0.7152 * sG + 0.0722 * sB;
}

function sRgbChannelToLinear(v: number) {
  return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
}

export function bestTextColor(hexBg: string): string {
  return getRelativeLuminance(hexBg) > 0.4 ? "#0A0C14" : "#F2EDE3";
}

export function lightenOklch(hex: string, dl: number): string {
  const { l, c, h } = hexToOklchObject(hex);
  return oklchToHex(clamp01(l + dl), c, h);
}

export function adjustOklch(
  hex: string,
  opts: { l?: number; c?: number; h?: number; dl?: number; dc?: number; dh?: number },
): string {
  const cur = hexToOklchObject(hex);
  const l = opts.l !== undefined ? opts.l : clamp01((cur.l ?? 0) + (opts.dl ?? 0));
  const c = opts.c !== undefined ? opts.c : Math.max(0, (cur.c ?? 0) + (opts.dc ?? 0));
  const h = opts.h !== undefined ? opts.h : ((cur.h ?? 0) + (opts.dh ?? 0) + 360) % 360;
  return oklchToHex(l, c, h);
}

export function rotateHue(hex: string, deg: number): string {
  const { l, c, h } = hexToOklchObject(hex);
  return oklchToHex(l, c, (h + deg + 360) % 360);
}

export function mixHex(a: string, b: string, t: number): string {
  const A = hexToRgbObject(a);
  const B = hexToRgbObject(b);
  const r = Math.round(A.r * (1 - t) + B.r * t);
  const g = Math.round(A.g * (1 - t) + B.g * t);
  const bl = Math.round(A.b * (1 - t) + B.b * t);
  return rgbToHex(r, g, bl);
}

export function rgbToHex(r: number, g: number, b: number): string {
  const t = (n: number) => clamp(Math.round(n), 0, 255).toString(16).padStart(2, "0");
  return `#${t(r)}${t(g)}${t(b)}`.toUpperCase();
}

export function withAlpha(hex: string, alpha: number): string {
  const { r, g, b } = hexToRgbObject(hex);
  return `rgba(${r}, ${g}, ${b}, ${clamp01(alpha)})`;
}

export function randomHex(): string {
  const h = Math.floor(Math.random() * 360);
  const s = 60 + Math.floor(Math.random() * 30);
  const l = 30 + Math.floor(Math.random() * 30);
  return hslToHex(h, s, l);
}

// Color blindness simulation (approximate matrices)
const CVD_MATRICES: Record<string, number[]> = {
  protanopia: [0.567, 0.433, 0, 0.558, 0.442, 0, 0, 0.242, 0.758],
  deuteranopia: [0.625, 0.375, 0, 0.7, 0.3, 0, 0, 0.3, 0.7],
  tritanopia: [0.95, 0.05, 0, 0, 0.433, 0.567, 0, 0.475, 0.525],
};

export function simulateCvd(hex: string, mode: string): string {
  if (mode === "normal" || !mode) return hex;
  if (mode === "grayscale") {
    const { r, g, b } = hexToRgbObject(hex);
    const y = Math.round(0.299 * r + 0.587 * g + 0.114 * b);
    return rgbToHex(y, y, y);
  }
  const m = CVD_MATRICES[mode];
  if (!m) return hex;
  const { r, g, b } = hexToRgbObject(hex);
  const nr = clamp(m[0] * r + m[1] * g + m[2] * b, 0, 255);
  const ng = clamp(m[3] * r + m[4] * g + m[5] * b, 0, 255);
  const nb = clamp(m[6] * r + m[7] * g + m[8] * b, 0, 255);
  return rgbToHex(nr, ng, nb);
}

export { rgb, hsl, oklch };
