import { colorHex, usePaletteStore } from "../../store/paletteStore";
import { withAlpha } from "../../lib/color";
import { CubeMotif, FlatCubeMotif, GridCubeMotif } from "../motifs/SvgMotifs";

export function PosterPreview() {
  const current = usePaletteStore((s) => s.current);
  const cvd = usePaletteStore((s) => s.cvd);

  const bg = colorHex(current, "bgPrimary");
  const bg2 = colorHex(current, "bgSecondary");
  const surface = colorHex(current, "surface");
  const tm = colorHex(current, "textMain");
  const tmu = colorHex(current, "textMuted");
  const pr = colorHex(current, "primary");
  const sc = colorHex(current, "secondary");
  const ac = colorHex(current, "accent");
  const border = colorHex(current, "border");
  const cvdClass = cvd === "normal" ? "" : cvd === "grayscale" ? "cvd-grayscale" : `cvd-${cvd}`;

  const cats = ["Web", "Pwn", "Crypto", "Reverse", "Forensics"];

  return (
    <div className={`mx-auto w-full max-w-[480px] ${cvdClass}`}>
      <div
        className="relative aspect-[3/4] overflow-hidden rounded-2xl border"
        style={{
          background: `radial-gradient(120% 80% at 80% 0%, ${withAlpha(pr, 0.25)}, transparent 50%), linear-gradient(180deg, ${bg}, ${bg2})`,
          borderColor: border,
        }}
      >
        {/* Decorative cube cluster */}
        <div className="absolute -right-6 -top-4 animate-floatY opacity-90">
          <CubeMotif primary={pr} secondary={sc} accent={ac} size={140} />
        </div>
        <div className="absolute bottom-12 left-4 opacity-75">
          <GridCubeMotif
            primary={withAlpha(sc, 0.6) as any}
            secondary={withAlpha(pr, 0.6) as any}
            accent={withAlpha(ac, 0.7) as any}
            size={64}
          />
        </div>
        {/* Grid */}
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `linear-gradient(${withAlpha(border, 0.5)} 1px, transparent 1px), linear-gradient(90deg, ${withAlpha(border, 0.5)} 1px, transparent 1px)`,
            backgroundSize: "32px 32px",
          }}
        />

        {/* Header */}
        <div className="relative px-5 pt-4">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase tracking-[0.2em]" style={{ color: tmu }}>
              HCMUS · 2026
            </span>
            <span
              className="rounded-full border px-2 py-0.5 text-[9px] font-medium uppercase tracking-wider"
              style={{ borderColor: withAlpha(ac, 0.5), color: ac }}
            >
              Cybersecurity
            </span>
          </div>
        </div>

        {/* Heading */}
        <div className="relative px-5 pt-5">
          <h2
            className="text-[40px] font-black leading-[0.95] tracking-tight"
            style={{ color: tm, fontStyle: "italic", transform: "skewX(-6deg)" }}
          >
            HCMUS
            <br />
            <span style={{ color: pr }}>CTF</span> <span style={{ color: ac }}>2026</span>
          </h2>
          <p className="mt-2 text-[12px]" style={{ color: tmu }}>
            Capture The Flag · Hồ Chí Minh University of Science
          </p>
        </div>

        {/* Info cards */}
        <div className="relative mt-5 grid grid-cols-2 gap-2 px-5">
          <InfoCard
            label="Qualifier"
            value="OCT 12"
            icon={<FlatCubeMotif primary={pr} secondary={sc} accent={ac} size={20} />}
            surface={surface}
            tm={tm}
            tmu={tmu}
            border={border}
          />
          <InfoCard
            label="Final"
            value="NOV 09"
            icon={<FlatCubeMotif primary={ac} secondary={pr} accent={sc} size={20} />}
            surface={surface}
            tm={tm}
            tmu={tmu}
            border={border}
          />
        </div>

        {/* Categories */}
        <div className="relative mt-3 flex flex-wrap gap-1.5 px-5">
          {cats.map((c, i) => (
            <span
              key={c}
              className="rounded-full border px-2 py-0.5 text-[9.5px] font-medium"
              style={{
                color: i % 2 === 0 ? tm : ac,
                borderColor: withAlpha(border, 0.8),
                background: withAlpha(surface, 0.6),
              }}
            >
              {c}
            </span>
          ))}
        </div>

        {/* CTA */}
        <div className="absolute inset-x-5 bottom-5">
          <button
            className="flex w-full items-center justify-between rounded-xl px-4 py-3 text-[12px] font-bold uppercase tracking-[0.16em] shadow-2xl"
            style={{
              background: pr,
              color: tm === "#FFFFFF" || tm.toLowerCase() === "#ffffff" ? "#000" : tm,
            }}
          >
            Register Now
            <span aria-hidden>→</span>
          </button>
          <div
            className="mt-2 text-center text-[9.5px] uppercase tracking-[0.2em]"
            style={{ color: tmu }}
          >
            hcmusctf.dev
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoCard({
  label,
  value,
  icon,
  surface,
  tm,
  tmu,
  border,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
  surface: string;
  tm: string;
  tmu: string;
  border: string;
}) {
  return (
    <div
      className="rounded-lg border p-3"
      style={{
        background: surface,
        borderColor: border,
      }}
    >
      <div className="flex items-center justify-between">
        <span className="text-[10px] uppercase tracking-wider" style={{ color: tmu }}>
          {label}
        </span>
        <span>{icon}</span>
      </div>
      <div className="mt-1 text-[18px] font-extrabold" style={{ color: tm }}>
        {value}
      </div>
    </div>
  );
}
