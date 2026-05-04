import { colorHex, usePaletteStore } from "../../store/paletteStore";
import { ExactCompetitionLogo, HCMUS_CTF_BRAND_PINK } from "./ExactCompetitionLogo";

/**
 * Logo preview tab.
 *
 * The wordmark rendered here is the source-faithful HCMUS CTF 2026 logo,
 * extracted from `logo-ctf26.ai`. The brand pink (#E42175) is intentionally
 * fixed and is NOT a palette token — only the dark "ink" outline and the
 * "back face" of the extruded letterforms respond to palette changes, so
 * we can simulate how real palette combinations sit against the real logo.
 */
export function LogoPreview() {
  const current = usePaletteStore((s) => s.current);
  const cvd = usePaletteStore((s) => s.cvd);

  const bg = colorHex(current, "bgPrimary");
  const surface = colorHex(current, "surface");
  const surfaceElevated = colorHex(current, "surfaceElevated");
  const tm = colorHex(current, "textMain");
  const tmu = colorHex(current, "textMuted");

  const cvdClass = cvd === "normal" ? "" : cvd === "grayscale" ? "cvd-grayscale" : `cvd-${cvd}`;

  return (
    <div className="grid gap-4 lg:grid-cols-3">
      <LogoCard label="Dark" sub="bgPrimary" bg={bg} bgClass={cvdClass}>
        {/* On the dark canvas, ink = textMain (high-contrast outline),
            back = surface (slightly lighter so the 3D extrusion reads). */}
        <ExactCompetitionLogo ink={tm} back={surface} width="86%" />
      </LogoCard>

      <LogoCard label="Surface" sub="surface" bg={surface} bgClass={cvdClass}>
        {/* On surface, lift back to surfaceElevated for separation. */}
        <ExactCompetitionLogo ink={tm} back={surfaceElevated} width="86%" />
      </LogoCard>

      <LogoCard label="Transparent" sub="checkerboard" transparent bgClass={cvdClass}>
        {/* On transparent, ink stays high-contrast; back uses textMuted so
            the back face reads against any underlying surface. */}
        <ExactCompetitionLogo ink={tm} back={tmu} width="86%" />
      </LogoCard>
    </div>
  );
}

function LogoCard({
  label,
  sub,
  bg,
  transparent,
  children,
  bgClass,
}: {
  label: string;
  sub?: string;
  bg?: string;
  transparent?: boolean;
  children: React.ReactNode;
  bgClass?: string;
}) {
  return (
    <div className="border-white/8 overflow-hidden rounded-2xl border">
      <div className="flex items-center justify-between border-b border-white/5 bg-black/30 px-3 py-1.5">
        <span className="text-[10.5px] uppercase tracking-wider text-white/60">{label}</span>
        {sub && <span className="font-mono text-[10px] text-white/35">{sub}</span>}
      </div>
      <div
        className={`relative grid h-56 place-items-center px-6 ${transparent ? "checker-bg" : ""} ${bgClass ?? ""}`}
        style={transparent ? undefined : { background: bg }}
      >
        {children}
      </div>
      <div className="flex items-center justify-between border-t border-white/5 bg-black/40 px-3 py-1.5">
        <span className="text-[9.5px] uppercase tracking-wider text-white/40">
          Brand pink locked
        </span>
        <span
          className="inline-flex items-center gap-1 font-mono text-[9.5px]"
          style={{ color: HCMUS_CTF_BRAND_PINK }}
        >
          <span className="h-2 w-2 rounded-full" style={{ background: HCMUS_CTF_BRAND_PINK }} />
          {HCMUS_CTF_BRAND_PINK}
        </span>
      </div>
    </div>
  );
}

/**
 * Compact wordmark used inside palette comparison cards. Same source-faithful
 * SVG, just rendered at a small size.
 */
export function LogoMini({
  textMain,
  surface,
}: {
  /** Used for the dark outline / cube front. */
  textMain: string;
  /** Used for the back face of the extruded letterforms. */
  surface: string;
} & {
  // Legacy props kept for backwards compatibility with existing call sites.
  primary?: string;
  secondary?: string;
  accent?: string;
}) {
  return <ExactCompetitionLogo ink={textMain} back={surface} width={120} />;
}
