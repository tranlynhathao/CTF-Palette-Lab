import { X } from "lucide-react";
import { useMemo } from "react";
import { usePaletteStore } from "../../store/paletteStore";
import { computeContrastReport } from "../../lib/contrast";
import { CompetitionLogo } from "../brand/CompetitionLogo";
import { hexToOklchObject } from "../../lib/color";
import type { Palette } from "../../types";

export function PaletteComparison() {
  const saved = usePaletteStore((s) => s.saved);
  const ids = usePaletteStore((s) => s.comparison);
  const toggle = usePaletteStore((s) => s.toggleCompare);
  const clear = usePaletteStore((s) => s.clearComparison);
  const loadSaved = usePaletteStore((s) => s.loadSaved);

  const palettes = useMemo(
    () => ids.map((id) => saved.find((p) => p.id === id)).filter((p): p is Palette => Boolean(p)),
    [saved, ids],
  );

  if (palettes.length === 0) return null;

  return (
    <section className="panel p-5">
      <div className="mb-3 flex items-end justify-between gap-2">
        <div>
          <div className="label-eyebrow">Compare</div>
          <h3 className="mt-0.5 text-base font-semibold text-white">Palette Comparison</h3>
          <p className="text-[11.5px] text-white/45">
            Pick 2–4 from the saved list. Toggle in the left sidebar.
          </p>
        </div>
        <button onClick={clear} className="btn">
          Clear
        </button>
      </div>

      <div
        className="grid gap-3"
        style={{
          gridTemplateColumns: `repeat(${Math.min(palettes.length, 4)}, minmax(0,1fr))`,
        }}
      >
        {palettes.map((p) => (
          <PaletteCompareCard
            key={p.id}
            palette={p}
            onClose={() => toggle(p.id)}
            onLoad={() => loadSaved(p.id)}
          />
        ))}
      </div>

      <SummaryRow palettes={palettes} />
    </section>
  );
}

function PaletteCompareCard({
  palette,
  onClose,
  onLoad,
}: {
  palette: Palette;
  onClose: () => void;
  onLoad: () => void;
}) {
  const get = (r: string) => palette.colors.find((c) => c.role === r)?.hex ?? "#000";
  const bg = get("bgPrimary");
  const tm = get("textMain");
  const pr = get("primary");
  const ac = get("accent");

  return (
    <div
      className="border-white/8 relative overflow-hidden rounded-2xl border"
      style={{ background: bg }}
    >
      <button
        onClick={onClose}
        className="absolute right-2 top-2 z-10 rounded-md bg-black/40 p-1 text-white/60 hover:text-white"
      >
        <X size={12} />
      </button>
      <div className="p-4" style={{ color: tm }}>
        <div className="text-[10px] uppercase tracking-[0.18em] opacity-60">{palette.mood}</div>
        <div className="mt-0.5 text-sm font-semibold">{palette.name}</div>

        {/* Real competition wordmark, routed through the shared component
            with this card's palette + forced Palette-Aware mode so two
            compared palettes look distinctly different even when the user
            has selected Authentic globally. */}
        <div className="mt-3">
          <CompetitionLogo
            palette={palette}
            mode="paletteAware"
            width="100%"
            ariaLabel={`HCMUS CTF 2026 logo — ${palette.name}`}
          />
        </div>

        <div className="mt-3 flex h-4 overflow-hidden rounded">
          {palette.colors.slice(0, 8).map((c) => (
            <div key={c.id} className="flex-1" style={{ background: c.hex }} />
          ))}
        </div>

        <div className="mt-3 grid grid-cols-2 gap-1 text-[10px]">
          <Stat label="Primary" hex={pr} />
          <Stat label="Accent" hex={ac} />
        </div>

        <button
          onClick={onLoad}
          className="mt-3 w-full rounded-md border border-white/15 bg-white/10 py-1.5 text-[11px] font-medium text-white hover:bg-white/15"
        >
          Load as current
        </button>
      </div>
    </div>
  );
}

function Stat({ label, hex }: { label: string; hex: string }) {
  return (
    <div className="rounded-md bg-black/30 px-2 py-1 text-white/80">
      <div className="text-[9px] uppercase tracking-wider opacity-60">{label}</div>
      <div className="mt-0.5 flex items-center gap-1">
        <span className="h-2 w-2 rounded-full" style={{ background: hex }} />
        <span className="font-mono">{hex.toUpperCase()}</span>
      </div>
    </div>
  );
}

function SummaryRow({ palettes }: { palettes: Palette[] }) {
  if (palettes.length < 2) return null;

  const scored = palettes.map((p) => {
    const report = computeContrastReport(p);
    const main = report.find((r) => r.fg === "textMain" && r.bg === "bgPrimary");
    const get = (r: string) => p.colors.find((c) => c.role === r)?.hex ?? "#000";
    const primaryC = hexToOklchObject(get("primary")).c;
    const accentC = hexToOklchObject(get("accent")).c;
    return {
      palette: p,
      contrast: main?.ratio ?? 0,
      logoScore: primaryC * 4 + (main?.ratio ?? 0) * 0.4,
      posterScore: (main?.ratio ?? 0) + accentC * 3,
      websiteScore:
        (main?.ratio ?? 0) +
        report.filter((r) => r.fg === "textMuted").reduce((s, r) => s + Math.min(r.ratio, 6), 0) *
          0.3,
      classicScore:
        1 -
        Math.min(primaryC, 0.4) * 2 +
        (hexToOklchObject(get("textMain")).h > 30 && hexToOklchObject(get("textMain")).h < 90
          ? 1
          : 0),
      modernScore: primaryC + accentC,
      risky: report.filter((r) => r.verdict === "Fail" || r.verdict === "Risky").length,
    };
  });

  const winners = {
    logo: scored.reduce((a, b) => (a.logoScore > b.logoScore ? a : b)),
    poster: scored.reduce((a, b) => (a.posterScore > b.posterScore ? a : b)),
    website: scored.reduce((a, b) => (a.websiteScore > b.websiteScore ? a : b)),
    classic: scored.reduce((a, b) => (a.classicScore > b.classicScore ? a : b)),
    modern: scored.reduce((a, b) => (a.modernScore > b.modernScore ? a : b)),
    risky: scored.reduce((a, b) => (a.risky > b.risky ? a : b)),
  };

  const tags = [
    ["Best for logo", winners.logo.palette.name],
    ["Best for poster", winners.poster.palette.name],
    ["Best for website", winners.website.palette.name],
    ["Best for classic theme", winners.classic.palette.name],
    ["Best for modern theme", winners.modern.palette.name],
  ];

  return (
    <div className="mt-4 grid gap-1.5 sm:grid-cols-2 lg:grid-cols-3">
      {tags.map(([k, v]) => (
        <div
          key={k}
          className="flex items-center justify-between rounded-lg border border-white/5 bg-black/30 px-3 py-2 text-[11.5px]"
        >
          <span className="text-white/55">{k}</span>
          <span className="font-medium text-white">{v}</span>
        </div>
      ))}
      {winners.risky.risky > 0 && (
        <div className="flex items-center justify-between rounded-lg border border-amber-400/20 bg-amber-400/10 px-3 py-2 text-[11.5px]">
          <span className="text-amber-200/80">Risky for accessibility</span>
          <span className="font-medium text-amber-200">{winners.risky.palette.name}</span>
        </div>
      )}
    </div>
  );
}
