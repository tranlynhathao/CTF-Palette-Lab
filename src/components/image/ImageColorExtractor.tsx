import { Upload, Loader2, Sparkles, Image as ImageIcon, X } from "lucide-react";
import { useRef, useState } from "react";
import { extractColorsFromImage, type ExtractedColor } from "../../lib/imageExtract";
import { usePaletteStore } from "../../store/paletteStore";
import { hexToOklchObject } from "../../lib/color";
import type { ColorRole, Palette, PaletteColor } from "../../types";
import { ROLE_META } from "../../types";

export function ImageColorExtractor() {
  const [colors, setColors] = useState<ExtractedColor[]>([]);
  const [loading, setLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [filename, setFilename] = useState<string>("Image palette");
  const fileRef = useRef<HTMLInputElement>(null);
  const importPalette = usePaletteStore((s) => s.importPalette);
  const showToast = usePaletteStore((s) => s.showToast);

  const onFile = async (file: File) => {
    setLoading(true);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    setFilename(file.name.replace(/\.[^.]+$/, ""));
    try {
      const out = await extractColorsFromImage(file, 9);
      setColors(out);
    } catch {
      showToast("Could not read image");
    } finally {
      setLoading(false);
    }
  };

  const buildPalette = () => {
    if (colors.length === 0) return;
    const sorted = [...colors].sort(
      (a, b) => hexToOklchObject(a.hex).l - hexToOklchObject(b.hex).l,
    );
    const pick = (i: number) => sorted[Math.min(Math.max(i, 0), sorted.length - 1)].hex;

    const roles: ColorRole[] = [
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

    const positions: Record<ColorRole, string> = {
      bgPrimary: pick(0),
      bgSecondary: pick(1),
      surface: pick(2),
      surfaceElevated: pick(3),
      primary: mostChromatic(colors).hex,
      secondary: pick(Math.floor(sorted.length * 0.6)),
      accent: secondMostChromatic(colors).hex,
      highlight: pick(sorted.length - 2),
      textMain: pick(sorted.length - 1),
      textMuted: pick(Math.floor(sorted.length * 0.5)),
      border: pick(2),
      danger: "#EF4444",
    };

    const newColors: PaletteColor[] = roles.map((r) => ({
      id: `img-${r}`,
      role: r,
      label: ROLE_META[r].label,
      hex: positions[r],
      locked: false,
    }));

    const palette: Palette = {
      id: "img-" + Date.now().toString(36),
      name: filename + " (extracted)",
      description: `Generated from uploaded image · ${colors.length} dominant colors`,
      mood: "cyberNoir",
      tags: ["image", "extracted"],
      colors: newColors,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    importPalette(palette);
  };

  const reset = () => {
    setColors([]);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
  };

  return (
    <section className="panel p-5">
      <div className="mb-3 flex items-end justify-between">
        <div>
          <div className="label-eyebrow">Image Color Extraction</div>
          <h3 className="mt-1 text-base font-semibold text-white">Lift colors from a reference</h3>
          <p className="text-[11.5px] text-white/45">
            Upload a previous CTF poster or any visual reference. Processed locally on your device —
            nothing leaves your browser.
          </p>
        </div>
        {colors.length > 0 && (
          <button onClick={reset} className="btn">
            <X size={11} /> Clear
          </button>
        )}
      </div>

      {!previewUrl ? (
        <DropZone
          onFiles={(files) => files[0] && onFile(files[0])}
          onClick={() => fileRef.current?.click()}
        />
      ) : (
        <div className="grid gap-3 md:grid-cols-[1fr_1.2fr]">
          <div className="border-white/8 overflow-hidden rounded-xl border">
            <img src={previewUrl} alt="reference" className="h-44 w-full object-cover md:h-full" />
          </div>
          <div>
            {loading ? (
              <div className="flex h-44 items-center justify-center text-[12px] text-white/55">
                <Loader2 size={14} className="mr-2 animate-spin" /> Extracting dominant colors…
              </div>
            ) : (
              <>
                <div className="mb-2 flex flex-wrap gap-1.5">
                  {colors.map((c) => (
                    <button
                      key={c.hex}
                      onClick={() => navigator.clipboard.writeText(c.hex)}
                      className="border-white/8 group flex flex-col items-start gap-1 rounded-lg border p-1.5"
                      title={`${c.hex} · ${(c.weight * 100).toFixed(0)}%`}
                    >
                      <span className="h-12 w-16 rounded-md" style={{ background: c.hex }} />
                      <span className="font-mono text-[10px] text-white/65">{c.hex}</span>
                    </button>
                  ))}
                </div>
                <button
                  onClick={buildPalette}
                  className="mt-1 inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-gradient-to-b from-white/15 to-white/5 px-3 py-2 text-xs font-semibold text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.15)] hover:from-white/20 hover:to-white/10"
                >
                  <Sparkles size={12} /> Convert to role-based palette
                </button>
              </>
            )}
          </div>
        </div>
      )}

      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) onFile(f);
          e.target.value = "";
        }}
      />
    </section>
  );
}

function DropZone({ onFiles, onClick }: { onFiles: (files: File[]) => void; onClick: () => void }) {
  const [hover, setHover] = useState(false);
  return (
    <button
      onClick={onClick}
      onDragOver={(e) => {
        e.preventDefault();
        setHover(true);
      }}
      onDragLeave={() => setHover(false)}
      onDrop={(e) => {
        e.preventDefault();
        setHover(false);
        onFiles(Array.from(e.dataTransfer.files));
      }}
      className={`flex h-40 w-full flex-col items-center justify-center gap-2 rounded-xl border border-dashed text-center transition ${
        hover ? "border-white/30 bg-white/[0.05]" : "border-white/10 bg-black/30 hover:bg-black/40"
      }`}
    >
      <ImageIcon size={20} className="text-white/55" />
      <div className="text-[12.5px] font-medium text-white/85">
        Drop an image or click to upload
      </div>
      <div className="text-[10.5px] text-white/45">
        Posters, references, screenshots — processed entirely on-device
      </div>
      <span className="mt-1 inline-flex items-center gap-1 text-[10.5px] text-white/55">
        <Upload size={10} /> PNG · JPG · WebP
      </span>
    </button>
  );
}

function mostChromatic(arr: ExtractedColor[]) {
  return arr.reduce((best, c) =>
    hexToOklchObject(c.hex).c > hexToOklchObject(best.hex).c ? c : best,
  );
}

function secondMostChromatic(arr: ExtractedColor[]) {
  const m = mostChromatic(arr);
  const rest = arr.filter((c) => c.hex !== m.hex);
  if (rest.length === 0) return m;
  return mostChromatic(rest);
}

export type { ExtractedColor };
