import { colorHex, usePaletteStore } from "../../store/paletteStore";
import { withAlpha } from "../../lib/color";
import { CompetitionLogo } from "../brand/CompetitionLogo";

export function TypographyPreview() {
  const current = usePaletteStore((s) => s.current);
  const cvd = usePaletteStore((s) => s.cvd);
  const bg = colorHex(current, "bgPrimary");
  const surface = colorHex(current, "surface");
  const tm = colorHex(current, "textMain");
  const tmu = colorHex(current, "textMuted");
  const pr = colorHex(current, "primary");
  const ac = colorHex(current, "accent");
  const sc = colorHex(current, "secondary");
  const border = colorHex(current, "border");

  const cvdClass = cvd === "normal" ? "" : cvd === "grayscale" ? "cvd-grayscale" : `cvd-${cvd}`;

  return (
    <section className="panel p-5">
      <div className="mb-3">
        <div className="label-eyebrow">Typography</div>
        <h3 className="mt-1 text-base font-semibold text-white">Type System Preview</h3>
        <p className="text-[11.5px] text-white/45">
          Logo, headings, body, monospace, button and badge styles using the current palette.
        </p>
      </div>
      <div
        className={`grid gap-3 rounded-xl border p-5 sm:grid-cols-2 ${cvdClass}`}
        style={{
          background: `linear-gradient(135deg, ${bg}, ${surface})`,
          borderColor: border,
        }}
      >
        <Block label="Logo">
          {/* Real competition wordmark — never retyped */}
          <CompetitionLogo width={220} ariaLabel="HCMUS CTF 2026 — typography sample" />
        </Block>
        <Block label="Poster heading">
          <div className="text-[26px] font-black leading-tight" style={{ color: tm }}>
            Capture · <span style={{ color: ac }}>Exploit</span> · Solve.
          </div>
        </Block>
        <Block label="UI heading">
          <div className="text-[18px] font-bold" style={{ color: tm }}>
            Challenge: Bypass The Vault
          </div>
        </Block>
        <Block label="Body text">
          <p className="text-[13px]" style={{ color: tm }}>
            Web · Pwn · Crypto · Reverse · Forensics. The 2026 edition focuses on real-world
            exploitation with a competitive twist.
          </p>
        </Block>
        <Block label="Muted metadata">
          <div className="text-[11.5px]" style={{ color: tmu }}>
            Posted 2026-05-04 · 12 min read · #intro #ctf
          </div>
        </Block>
        <Block label="Terminal mono">
          <div
            className="rounded-md p-2 font-mono text-[12px]"
            style={{ background: withAlpha(border, 0.6), color: sc }}
          >
            $ nc challenge.hcmusctf.dev 1337
          </div>
        </Block>
        <Block label="Button">
          <div className="flex gap-2">
            <button
              className="rounded-md px-3 py-1.5 text-[12px] font-bold uppercase tracking-wider"
              style={{
                background: pr,
                color: tm.toLowerCase() === "#ffffff" ? "#000" : tm,
              }}
            >
              Register
            </button>
            <button
              className="rounded-md border px-3 py-1.5 text-[12px] font-medium"
              style={{ borderColor: border, color: sc }}
            >
              Learn more
            </button>
          </div>
        </Block>
        <Block label="Badge">
          <div className="flex flex-wrap gap-1.5">
            <span
              className="rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider"
              style={{ background: withAlpha(pr, 0.18), color: pr }}
            >
              Live
            </span>
            <span
              className="rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider"
              style={{ background: withAlpha(ac, 0.16), color: ac }}
            >
              Finalist
            </span>
            <span
              className="rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider"
              style={{ background: withAlpha(sc, 0.16), color: sc }}
            >
              Web
            </span>
          </div>
        </Block>
      </div>
    </section>
  );
}

function Block({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="label-eyebrow mb-1.5">{label}</div>
      {children}
    </div>
  );
}
