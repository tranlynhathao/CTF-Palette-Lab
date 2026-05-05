import { colorHex, usePaletteStore } from "../../store/paletteStore";
import { withAlpha } from "../../lib/color";
import {
  CubeMotif,
  FlatCubeMotif,
  GridCubeMotif,
  CubeClusterMotif,
  TranslucentCubeMotif,
  KeyholeCubeMotif,
  FlagCubeMotif,
} from "../motifs/SvgMotifs";
import { CompetitionLogo } from "../brand/CompetitionLogo";

/**
 * Cubic motifs preview.
 *
 * The real wordmark anchors the top of the panel via <CompetitionLogo/>.
 * The cube grid below is supporting decoration — alternative geometric
 * stamps that complement the brand mark, never replace it.
 */
export function CubicMotifPreview() {
  const current = usePaletteStore((s) => s.current);
  const cvd = usePaletteStore((s) => s.cvd);
  const bg = colorHex(current, "bgPrimary");
  const surface = colorHex(current, "surface");
  const tm = colorHex(current, "textMain");
  const tmu = colorHex(current, "textMuted");
  const pr = colorHex(current, "primary");
  const sc = colorHex(current, "secondary");
  const ac = colorHex(current, "accent");
  const border = colorHex(current, "border");
  const cvdClass = cvd === "normal" ? "" : cvd === "grayscale" ? "cvd-grayscale" : `cvd-${cvd}`;

  const items: { name: string; Comp: any }[] = [
    { name: "Wireframe", Comp: CubeMotif },
    { name: "Flat", Comp: FlatCubeMotif },
    { name: "Grid 3×3", Comp: GridCubeMotif },
    { name: "Cluster", Comp: CubeClusterMotif },
    { name: "Translucent", Comp: TranslucentCubeMotif },
    { name: "Keyhole", Comp: KeyholeCubeMotif },
    { name: "Flag Cube", Comp: FlagCubeMotif },
  ];

  return (
    <div
      className={`overflow-hidden rounded-2xl border ${cvdClass}`}
      style={{ background: bg, borderColor: border }}
    >
      {/* Brand anchor */}
      <div
        className="flex items-center justify-between gap-3 border-b px-4 py-3"
        style={{
          borderColor: border,
          background: `linear-gradient(135deg, ${withAlpha(surface, 0.6)}, transparent)`,
        }}
      >
        <CompetitionLogo width={170} ariaLabel="HCMUS CTF 2026 — cubic motifs panel" />
        <span className="text-[10px] uppercase tracking-[0.18em]" style={{ color: tmu }}>
          Supporting cubic motifs
        </span>
      </div>

      {/* Cube grid — supporting decoration only */}
      <div className="grid gap-3 p-3 sm:grid-cols-3 lg:grid-cols-4">
        {items.map(({ name, Comp }) => (
          <div
            key={name}
            className="flex flex-col items-center gap-2 rounded-xl border p-4"
            style={{ background: surface, borderColor: border }}
          >
            <div className="grid h-24 place-items-center">
              <Comp primary={pr} secondary={sc} accent={ac} size={84} />
            </div>
            <div className="text-[10px] uppercase tracking-[0.2em]" style={{ color: tmu }}>
              {name}
            </div>
            <div className="text-[12px] font-semibold" style={{ color: tm }}>
              Brand stamp
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
