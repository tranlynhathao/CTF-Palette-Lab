import { colorHex, usePaletteStore } from "../../store/paletteStore";
import { withAlpha } from "../../lib/color";
import { CompetitionLogo } from "../brand/CompetitionLogo";

/**
 * Terminal preview.
 *
 * The terminal window is intentionally kept terminal-y — no logo typeset
 * inside the shell prompt. The brand anchor sits ABOVE the window in a
 * small ribbon, rendered with the shared <CompetitionLogo/>.
 *
 * The "HCMUS{...}" strings inside the terminal output are CTF flag content
 * (the literal flag format `flag{...}` used in CTF challenges), not a
 * brand-mark approximation, so they remain as plain text.
 */
export function TerminalPreview() {
  const current = usePaletteStore((s) => s.current);
  const cvd = usePaletteStore((s) => s.cvd);

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
      {/* Brand ribbon — real logo, not retyped text */}
      <div
        className="flex items-center justify-between gap-3 rounded-xl border px-3 py-2"
        style={{
          borderColor: border,
          background: `linear-gradient(135deg, ${withAlpha(bg, 0.6)}, ${withAlpha(surface, 0.6)})`,
        }}
      >
        <CompetitionLogo width={170} ariaLabel="HCMUS CTF 2026 — terminal banner" />
        <span
          className="rounded-full border px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider"
          style={{ borderColor: withAlpha(ac, 0.5), color: ac }}
        >
          ● live · ssh
        </span>
      </div>

      {/* Terminal window */}
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
            hcmusctf-2026 — zsh — 120×30
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
          <span style={{ color: pr }}>~/ctf/hcmus2026</span> on{" "}
          <span style={{ color: ac }}>main</span>
          <span style={{ color: sc }}>$</span>{" "}
          <span style={{ color: tm }}>nc challenge.hcmusctf.dev 1337</span>
          {`> banner: welcome to hcmus ctf 2026`}
          {`> sending exploit (`}
          <span style={{ color: ac }}>1024 bytes</span>
          {`)`}
          {`> response received (`}
          <span style={{ color: ac }}>318 bytes</span>
          {`)`}
          {`> `}
          <span style={{ color: pr }}>shell escalated to root</span>
          <span style={{ color: sc }}>$</span> <span style={{ color: tm }}>cat /flag.txt</span>
          {`> `}
          <span style={{ color: ac }}>HCMUS{"{c"}</span>•<span style={{ color: ac }}>•</span>•
          <span style={{ color: ac }}>i</span>•<span style={{ color: ac }}>_</span>••
          <span style={{ color: ac }}>l</span>•_<span style={{ color: ac }}>•••</span>26
          <span style={{ color: ac }}>{"}"}</span>
          {`> `}
          <span style={{ color: pr }}>solved · +500 points · rank #3</span>
          <span style={{ color: sc }}>$</span>{" "}
          <span style={{ color: tm }}>./submit HCMUS{"{*****}"}</span>
          {`> `}
          <span style={{ color: ac }}>✓ correct</span>
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
