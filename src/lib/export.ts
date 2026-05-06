import type { Palette, PaletteColor } from "../types";
import { usePaletteStore } from "../store/paletteStore";

const ROLE_TO_TOKEN: Record<string, string[]> = {
  bgPrimary: ["background", "primary"],
  bgSecondary: ["background", "secondary"],
  surface: ["surface", "DEFAULT"],
  surfaceElevated: ["surface", "elevated"],
  primary: ["primary", "DEFAULT"],
  secondary: ["secondary", "DEFAULT"],
  accent: ["accent", "DEFAULT"],
  highlight: ["highlight", "DEFAULT"],
  textMain: ["text", "main"],
  textMuted: ["text", "muted"],
  border: ["border", "DEFAULT"],
  danger: ["danger", "DEFAULT"],
};

function kebab(role: string) {
  return role.replace(/[A-Z]/g, (m) => "-" + m.toLowerCase());
}

export function toCssVariables(palette: Palette): string {
  const lines = palette.colors
    .map((c) => `  --brand-${kebab(c.role)}: ${c.hex.toLowerCase()};`)
    .join("\n");
  return `/* ${palette.name} */\n:root {\n${lines}\n}\n`;
}

export function toTailwindConfig(palette: Palette): string {
  const tree: any = {};
  palette.colors.forEach((c) => {
    const [a, b] = ROLE_TO_TOKEN[c.role] ?? [c.role, "DEFAULT"];
    if (!tree[a]) tree[a] = {};
    tree[a][b] = c.hex.toLowerCase();
  });
  const obj = JSON.stringify({ brand: tree }, null, 2)
    .replace(/"([a-zA-Z_][a-zA-Z0-9_]*)":/g, "$1:")
    .replace(/"/g, '"');

  return `// ${palette.name}\nmodule.exports = {\n  theme: {\n    extend: {\n      colors: ${obj}\n    }\n  }\n};\n`;
}

export function toFigmaTokens(palette: Palette): string {
  const tree: any = { color: {} };
  palette.colors.forEach((c) => {
    const [a, b] = ROLE_TO_TOKEN[c.role] ?? [c.role, "DEFAULT"];
    if (!tree.color[a]) tree.color[a] = {};
    tree.color[a][b] = { value: c.hex.toLowerCase(), type: "color" };
  });
  return JSON.stringify(tree, null, 2);
}

export function toPaletteJson(palette: Palette): string {
  return JSON.stringify(palette, null, 2);
}

export function illustratorList(palette: Palette): string {
  return palette.colors
    .map((c) => `${pad(c.label, 22)} ${pad(c.role, 18)} ${c.hex.toUpperCase()}`)
    .join("\n");
}

function pad(s: string, n: number) {
  if (s.length >= n) return s;
  return s + " ".repeat(n - s.length);
}

export function paletteSheetSvg(palette: Palette): string {
  const W = 1200;
  const H = 720;
  const colors = palette.colors;
  const cols = 4;
  const rows = Math.ceil(colors.length / cols);
  const cellW = (W - 80) / cols;
  const cellH = (H - 220) / rows;
  let cells = "";
  colors.forEach((c, i) => {
    const cx = 40 + (i % cols) * cellW;
    const cy = 180 + Math.floor(i / cols) * cellH;
    cells += `
      <g>
        <rect x="${cx}" y="${cy}" width="${cellW - 12}" height="${cellH - 12}" rx="14" fill="${c.hex}" />
        <text x="${cx + 14}" y="${cy + cellH - 38}" font-family="Inter, sans-serif" font-size="14" font-weight="600" fill="${textOn(c.hex)}">${escapeXml(c.label)}</text>
        <text x="${cx + 14}" y="${cy + cellH - 22}" font-family="Inter, sans-serif" font-size="11" fill="${textOn(c.hex)}" opacity="0.65">${c.role}</text>
        <text x="${cx + cellW - 24}" y="${cy + 24}" text-anchor="end" font-family="JetBrains Mono, monospace" font-size="12" fill="${textOn(c.hex)}" opacity="0.85">${c.hex.toUpperCase()}</text>
      </g>`;
  });

  const projectName = usePaletteStore.getState().projectName;
  const eyebrow = (projectName ? `${projectName} · ` : "") + "Palette Workspace";

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#07080D"/>
      <stop offset="100%" stop-color="#11162A"/>
    </linearGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#bg)"/>
  <text x="40" y="70" font-family="Inter, sans-serif" font-size="32" font-weight="800" fill="#F2EDE3">${escapeXml(palette.name)}</text>
  <text x="40" y="100" font-family="Inter, sans-serif" font-size="14" fill="#8E95A8">${escapeXml(palette.description)}</text>
  <text x="40" y="140" font-family="Inter, sans-serif" font-size="11" letter-spacing="2" fill="#8E95A8" text-transform="uppercase">${escapeXml(eyebrow)}</text>
  ${cells}
  <text x="40" y="${H - 20}" font-family="Inter, sans-serif" font-size="11" fill="#8E95A8" opacity="0.7">Mood · ${palette.mood} · Tags · ${palette.tags.join(", ")}</text>
</svg>`;
}

function textOn(hex: string): string {
  // approximate sRGB luminance
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  const lin = (v: number) => (v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4));
  const Y = 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
  return Y > 0.4 ? "#0A0C14" : "#F2EDE3";
}

function escapeXml(s: string): string {
  return s.replace(/[<>&"']/g, (c) =>
    c === "<" ? "&lt;" : c === ">" ? "&gt;" : c === "&" ? "&amp;" : c === '"' ? "&quot;" : "&apos;",
  );
}

export function downloadFile(filename: string, content: string, mime = "text/plain") {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function downloadJsonPalette(palette: Palette) {
  const safe = palette.name.replace(/[^a-z0-9]+/gi, "-").toLowerCase();
  downloadFile(`${safe}.palette.json`, toPaletteJson(palette), "application/json");
}

export function downloadSvgSheet(palette: Palette) {
  const safe = palette.name.replace(/[^a-z0-9]+/gi, "-").toLowerCase();
  downloadFile(`${safe}.palette.svg`, paletteSheetSvg(palette), "image/svg+xml");
}

export function parseImportedPalette(json: string): Palette | null {
  try {
    const data = JSON.parse(json);
    if (!data || !Array.isArray(data.colors) || !data.name) return null;
    return data as Palette;
  } catch {
    return null;
  }
}

export type { PaletteColor };
