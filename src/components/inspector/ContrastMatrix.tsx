import { usePaletteStore } from "../../store/paletteStore";
import { computeContrastReport } from "../../lib/contrast";
import { useMemo } from "react";

const VERDICT_COLORS: Record<string, string> = {
  Excellent: "bg-emerald-400/15 text-emerald-300 border-emerald-400/20",
  Good: "bg-sky-400/15 text-sky-300 border-sky-400/20",
  Risky: "bg-amber-400/15 text-amber-300 border-amber-400/20",
  Fail: "bg-rose-500/15 text-rose-300 border-rose-500/25",
};

export function ContrastMatrix() {
  const current = usePaletteStore((s) => s.current);
  const report = useMemo(() => computeContrastReport(current), [current]);

  return (
    <section className="panel p-5">
      <div className="mb-3 flex items-end justify-between">
        <div>
          <div className="label-eyebrow">Accessibility</div>
          <h3 className="mt-1 text-base font-semibold text-white">Contrast Matrix</h3>
          <p className="text-[11.5px] text-white/45">
            WCAG ratios for important text and brand pairs.
          </p>
        </div>
        <Legend />
      </div>

      <div className="grid grid-cols-1 gap-1.5 md:grid-cols-2">
        {report.map((r) => (
          <div
            key={r.label}
            className="flex items-center gap-2.5 rounded-xl border border-white/5 bg-black/30 p-2.5"
          >
            <div
              className="grid h-12 w-20 shrink-0 place-items-center rounded-md font-semibold"
              style={{ background: r.bgHex, color: r.fgHex }}
            >
              <span className="text-[12.5px]">Aa</span>
            </div>
            <div className="min-w-0 flex-1">
              <div className="truncate text-[11.5px] font-medium text-white/80">{r.label}</div>
              <div className="mt-0.5 flex items-center gap-1.5">
                <span className="font-mono text-[11px] text-white/60">{r.ratio.toFixed(2)}:1</span>
                <span
                  className={`rounded-full border px-1.5 py-px text-[9.5px] font-semibold uppercase tracking-wider ${VERDICT_COLORS[r.verdict]}`}
                >
                  {r.verdict}
                </span>
              </div>
              <div className="mt-1 flex flex-wrap gap-1 text-[9.5px]">
                <Pill ok={r.aaNormal} label="AA" />
                <Pill ok={r.aaLarge} label="AA Lg" />
                <Pill ok={r.aaaNormal} label="AAA" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function Pill({ ok, label }: { ok: boolean; label: string }) {
  return (
    <span
      className={`rounded px-1.5 py-0.5 ${
        ok ? "bg-emerald-400/15 text-emerald-300" : "bg-white/5 text-white/35 line-through"
      }`}
    >
      {label}
    </span>
  );
}

function Legend() {
  return (
    <div className="flex flex-wrap gap-1 text-[9.5px]">
      {(["Excellent", "Good", "Risky", "Fail"] as const).map((k) => (
        <span
          key={k}
          className={`rounded-full border px-1.5 py-px font-semibold uppercase tracking-wider ${VERDICT_COLORS[k]}`}
        >
          {k}
        </span>
      ))}
    </div>
  );
}
