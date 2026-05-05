import { colorHex, usePaletteStore } from "../../store/paletteStore";
import { withAlpha } from "../../lib/color";
import { CubeMotif, GridCubeMotif } from "../motifs/SvgMotifs";
import { CompetitionLogo } from "../brand/CompetitionLogo";

/**
 * 1:1 social media preview.
 *
 * The brand identity uses the shared <CompetitionLogo/> — the real extracted
 * artwork. "ARE YOU READY?" and "Capture · Exploit · Solve" are editable
 * marketing copy, not brand-mark text.
 */
export function SocialPreview() {
  const current = usePaletteStore((s) => s.current);
  const cvd = usePaletteStore((s) => s.cvd);

  const bg = colorHex(current, "bgPrimary");
  const bg2 = colorHex(current, "bgSecondary");
  const tmu = colorHex(current, "textMuted");
  const pr = colorHex(current, "primary");
  const sc = colorHex(current, "secondary");
  const ac = colorHex(current, "accent");

  const cvdClass = cvd === "normal" ? "" : cvd === "grayscale" ? "cvd-grayscale" : `cvd-${cvd}`;

  return (
    <div className={`mx-auto w-full max-w-[480px] ${cvdClass}`}>
      <div
        className="relative aspect-square overflow-hidden rounded-2xl border border-white/10"
        style={{
          background: `radial-gradient(80% 60% at 0% 100%, ${withAlpha(sc, 0.25)}, transparent 60%), radial-gradient(80% 60% at 100% 0%, ${withAlpha(pr, 0.3)}, transparent 60%), linear-gradient(180deg, ${bg2}, ${bg})`,
        }}
      >
        {/* Decorative cubes — supporting graphic only */}
        <div className="pointer-events-none absolute -right-6 -top-6 opacity-50">
          <CubeMotif primary={pr} secondary={sc} accent={ac} size={150} />
        </div>
        <div className="pointer-events-none absolute -bottom-2 -left-2 opacity-45">
          <GridCubeMotif primary={pr} secondary={sc} accent={ac} size={60} />
        </div>

        <div className="relative flex h-full flex-col p-6">
          <span className="text-[10px] uppercase tracking-[0.22em]" style={{ color: tmu }}>
            Capture The Flag · 2026 edition
          </span>

          {/* Hype headline (editable copy, not the brand mark) */}
          <div
            className="mt-3 text-[42px] font-black leading-[0.95] tracking-tight"
            style={{ color: ac, fontStyle: "italic", transform: "skewX(-6deg)" }}
          >
            ARE YOU READY?
          </div>

          {/* Real competition wordmark */}
          <div className="mt-3">
            <CompetitionLogo width="92%" ariaLabel="HCMUS CTF 2026 — social post" />
          </div>

          <div
            className="mt-3 text-[13px] font-medium uppercase tracking-[0.18em]"
            style={{ color: tmu }}
          >
            Capture · Exploit · Solve
          </div>

          <div className="mt-auto flex items-end justify-between">
            <div
              className="rounded-xl border px-3 py-2 text-[10px] uppercase tracking-[0.16em]"
              style={{ borderColor: withAlpha(ac, 0.5), color: ac }}
            >
              Register Now ↗
            </div>
            <div className="text-right font-mono text-[10px]" style={{ color: tmu }}>
              hcmusctf.dev
              <br />
              {"@hcmusctf"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
