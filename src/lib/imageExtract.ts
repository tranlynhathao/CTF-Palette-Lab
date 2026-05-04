import { rgbToHex } from "./color";

export type ExtractedColor = {
  hex: string;
  count: number;
  weight: number;
};

export async function extractColorsFromImage(file: File, k = 8): Promise<ExtractedColor[]> {
  const url = URL.createObjectURL(file);
  try {
    const img = await loadImage(url);
    const max = 220;
    const ratio = Math.min(max / img.width, max / img.height, 1);
    const w = Math.max(1, Math.floor(img.width * ratio));
    const h = Math.max(1, Math.floor(img.height * ratio));
    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("No 2D context");
    ctx.drawImage(img, 0, 0, w, h);
    const data = ctx.getImageData(0, 0, w, h).data;

    // Quantize using small histogram
    const buckets = new Map<string, { r: number; g: number; b: number; n: number }>();
    for (let i = 0; i < data.length; i += 4) {
      const a = data[i + 3];
      if (a < 100) continue;
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const key = `${r >> 4}-${g >> 4}-${b >> 4}`;
      const b0 = buckets.get(key);
      if (b0) {
        b0.r += r;
        b0.g += g;
        b0.b += b;
        b0.n++;
      } else {
        buckets.set(key, { r, g, b, n: 1 });
      }
    }

    const arr = Array.from(buckets.values())
      .map((b) => ({
        r: Math.round(b.r / b.n),
        g: Math.round(b.g / b.n),
        b: Math.round(b.b / b.n),
        n: b.n,
      }))
      .sort((a, b) => b.n - a.n);

    // De-duplicate similar colors
    const final: { r: number; g: number; b: number; n: number }[] = [];
    const minDist = 36;
    for (const c of arr) {
      if (final.length >= k) break;
      const close = final.find(
        (f) => Math.abs(f.r - c.r) + Math.abs(f.g - c.g) + Math.abs(f.b - c.b) < minDist,
      );
      if (!close) final.push(c);
    }

    const total = final.reduce((s, c) => s + c.n, 0) || 1;
    return final.map((c) => ({
      hex: rgbToHex(c.r, c.g, c.b),
      count: c.n,
      weight: c.n / total,
    }));
  } finally {
    URL.revokeObjectURL(url);
  }
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Image load failed"));
    img.src = src;
  });
}
