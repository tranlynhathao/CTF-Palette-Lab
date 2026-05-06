import { colorHex, usePaletteStore } from "../../store/paletteStore";
import { withAlpha } from "../../lib/color";
import { slugifyPaletteName } from "../../lib/download";
import { CompetitionLogo } from "../brand/CompetitionLogo";

export function TerminalPreview() {
  const current = usePaletteStore((s) => s.current);
  const cvd = usePaletteStore((s) => s.cvd);
  const projectName = usePaletteStore((s) => s.projectName);
  const projectSlug = slugifyPaletteName(projectName || "yourbrand");

  const bg = colorHex(current, "bgPrimary");
  const surface = colorHex(current, "surface");
  const tm = colorHex(current, "textMain");
  const tmu = colorHex(current, "textMuted");
  const pr = colorHex(current, "primary");
  const sc = colorHex(current, "secondary");
  const ac = colorHex(current, "accent");
  const dg = colorHex(current, "danger");
  const border = colorHex(current, "border");

  const cvdClass = cvd === "normal" ? "" : cvd === "grayscale" ? "cvd-grayscale" : `cvd-${cvd}`;

  return (
    <div className={`space-y-3 ${cvdClass}`}>
      <div
        className="flex items-center justify-between gap-3 rounded-xl border px-3 py-2"
        style={{
          borderColor: border,
          background: `linear-gradient(135deg, ${withAlpha(bg, 0.6)}, ${withAlpha(surface, 0.6)})`,
        }}
      >
        <CompetitionLogo width={170} />
        <span
          className="rounded-full border px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider"
          style={{ borderColor: withAlpha(ac, 0.5), color: ac }}
        >
          ● live · ssh
        </span>
      </div>

      <div
        className="overflow-hidden rounded-2xl border"
        style={{ borderColor: border, background: bg }}
      >
        <div
          className="flex items-center justify-between border-b px-3 py-2"
          style={{ borderColor: border, background: surface }}
        >
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full" style={{ background: dg }} />
            <span className="h-2.5 w-2.5 rounded-full" style={{ background: ac }} />
            <span className="h-2.5 w-2.5 rounded-full" style={{ background: sc }} />
          </div>
          <span className="font-mono text-[10.5px]" style={{ color: tmu }}>
            {projectSlug} — zsh — 120×30
          </span>
          <span className="text-[10px]" style={{ color: tmu }}>
            ⌘
          </span>
        </div>

        <pre
          className="overflow-x-auto px-4 py-3 font-mono text-[12px] leading-relaxed"
          style={{ color: tmu }}
        >
          {Line(`╭─`, sc)}
          <span style={{ color: pr }}>~/projects/{projectSlug}</span> on{" "}
          <span style={{ color: ac }}>main</span>
          <span style={{ color: sc }}>$</span> <span style={{ color: tm }}>npm run build</span>
          {`> bundling assets (`}
          <span style={{ color: ac }}>1024 modules</span>
          {`)`}
          {`> hashing output (`}
          <span style={{ color: ac }}>318 files</span>
          {`)`}
          {`> `}
          <span style={{ color: pr }}>build complete</span>
          <span style={{ color: sc }}>$</span>{" "}
          <span style={{ color: tm }}>cat dist/manifest.json</span>
          {`> `}
          <span style={{ color: ac }}>{`{ "version": "1.0.0", "build": `}</span>
          <span style={{ color: ac }}>"</span>
          <span style={{ color: ac }}>2026.05.05</span>
          <span style={{ color: ac }}>"</span>
          <span style={{ color: ac }}>{` }`}</span>
          {`> `}
          <span style={{ color: pr }}>checksum verified · 248 kB · gzip 78 kB</span>
          <span style={{ color: sc }}>$</span>{" "}
          <span style={{ color: tm }}>./deploy --tag release</span>
          {`> `}
          <span style={{ color: ac }}>✓ deployed</span>
          <span style={{ color: sc }}>$</span>{" "}
          <span className="inline-block h-3 w-1.5 align-middle" style={{ background: tm }} />
        </pre>
      </div>
    </div>
  );
}

function Line(s: string, color: string) {
  return <span style={{ color }}>{s}</span>;
}
