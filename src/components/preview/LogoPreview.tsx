import { colorHex, usePaletteStore } from "../../store/paletteStore";
import { CubeMotif, FlatCubeMotif } from "../motifs/SvgMotifs";

export function LogoPreview() {
  const current = usePaletteStore((s) => s.current);
  const cvd = usePaletteStore((s) => s.cvd);

  const bg = colorHex(current, "bgPrimary");
  const surface = colorHex(current, "surface");
  const tm = colorHex(current, "textMain");
  const pr = colorHex(current, "primary");
  const sc = colorHex(current, "secondary");
  const ac = colorHex(current, "accent");
  const cvdClass = cvd === "normal" ? "" : cvd === "grayscale" ? "cvd-grayscale" : `cvd-${cvd}`;

  return (
    <div className="grid gap-4 lg:grid-cols-3">
      <LogoCard label="Dark" bg={bg} bgClass={cvdClass}>
        <Logo tm={tm} pr={pr} sc={sc} ac={ac} />
      </LogoCard>
      <LogoCard label="Surface" bg={surface} bgClass={cvdClass}>
        <Logo tm={tm} pr={pr} sc={sc} ac={ac} />
      </LogoCard>
      <LogoCard label="Transparent" transparent bgClass={cvdClass}>
        <Logo tm={tm} pr={pr} sc={sc} ac={ac} />
      </LogoCard>
    </div>
  );
}

function LogoCard({
  label,
  bg,
  transparent,
  children,
  bgClass,
}: {
  label: string;
  bg?: string;
  transparent?: boolean;
  children: React.ReactNode;
  bgClass?: string;
}) {
  return (
    <div className="border-white/8 overflow-hidden rounded-2xl border">
      <div className="border-b border-white/5 bg-black/30 px-3 py-1.5 text-[10.5px] uppercase tracking-wider text-white/55">
        {label} background
      </div>
      <div
        className={`relative grid h-56 place-items-center ${transparent ? "checker-bg" : ""} ${bgClass ?? ""}`}
        style={transparent ? undefined : { background: bg }}
      >
        {children}
      </div>
    </div>
  );
}

function Logo({ tm, pr, sc, ac }: { tm: string; pr: string; sc: string; ac: string }) {
  return (
    <div className="flex items-center gap-3">
      <CubeMotif primary={pr} secondary={sc} accent={ac} size={64} />
      <div className="flex flex-col leading-none">
        <div
          className="text-[34px] font-black"
          style={{
            color: pr,
            fontStyle: "italic",
            transform: "skewX(-8deg)",
            letterSpacing: "0.02em",
          }}
        >
          HCMUS
        </div>
        <div className="mt-1 flex items-baseline gap-1.5">
          <span className="text-[20px] font-extrabold tracking-wide" style={{ color: tm }}>
            CTF
          </span>
          <span className="text-[20px] font-extrabold" style={{ color: ac, fontStyle: "italic" }}>
            2026
          </span>
          <span
            className="text-[10px] uppercase tracking-[0.18em]"
            style={{ color: sc, opacity: 0.85 }}
          >
            · capture · exploit · solve
          </span>
        </div>
      </div>
    </div>
  );
}

export function LogoMini({
  primary,
  secondary,
  accent,
  textMain,
}: {
  primary: string;
  secondary: string;
  accent: string;
  textMain: string;
}) {
  return (
    <div className="flex items-center gap-2">
      <FlatCubeMotif primary={primary} secondary={secondary} accent={accent} size={28} />
      <div>
        <div
          className="text-xs font-extrabold"
          style={{
            color: primary,
            fontStyle: "italic",
            transform: "skewX(-8deg)",
            display: "inline-block",
          }}
        >
          HCMUS
        </div>
        <div className="text-[9px]" style={{ color: textMain }}>
          CTF <span style={{ color: accent }}>2026</span>
        </div>
      </div>
    </div>
  );
}
