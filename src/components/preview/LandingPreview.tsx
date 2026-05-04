import { colorHex, usePaletteStore } from "../../store/paletteStore";
import { withAlpha } from "../../lib/color";
import { CubeMotif, FlatCubeMotif } from "../motifs/SvgMotifs";

export function LandingPreview() {
  const current = usePaletteStore((s) => s.current);
  const cvd = usePaletteStore((s) => s.cvd);

  const bg = colorHex(current, "bgPrimary");
  const bg2 = colorHex(current, "bgSecondary");
  const surface = colorHex(current, "surface");
  const surfaceUp = colorHex(current, "surfaceElevated");
  const tm = colorHex(current, "textMain");
  const tmu = colorHex(current, "textMuted");
  const pr = colorHex(current, "primary");
  const sc = colorHex(current, "secondary");
  const ac = colorHex(current, "accent");
  const border = colorHex(current, "border");

  const cvdClass = cvd === "normal" ? "" : cvd === "grayscale" ? "cvd-grayscale" : `cvd-${cvd}`;

  return (
    <div
      className={`overflow-hidden rounded-2xl border ${cvdClass}`}
      style={{ borderColor: border, background: bg }}
    >
      {/* Nav */}
      <div
        className="flex items-center justify-between border-b px-6 py-3"
        style={{ borderColor: border, background: withAlpha(bg2, 0.5) }}
      >
        <div className="flex items-center gap-2">
          <FlatCubeMotif primary={pr} secondary={sc} accent={ac} size={26} />
          <span className="text-[12px] font-bold tracking-wide" style={{ color: tm }}>
            HCMUS <span style={{ color: pr }}>CTF</span> <span style={{ color: ac }}>2026</span>
          </span>
        </div>
        <nav className="hidden gap-5 text-[11px] md:flex">
          {["Challenges", "Schedule", "Rules", "Sponsors"].map((n) => (
            <span key={n} style={{ color: tmu }}>
              {n}
            </span>
          ))}
        </nav>
        <button
          className="rounded-md px-3 py-1.5 text-[11px] font-semibold"
          style={{ background: pr, color: tm.toLowerCase() === "#ffffff" ? "#000" : tm }}
        >
          Join
        </button>
      </div>

      {/* Hero */}
      <div
        className="relative grid gap-4 px-6 py-8 md:grid-cols-[1.1fr_1fr]"
        style={{
          background: `radial-gradient(60% 40% at 80% 0%, ${withAlpha(pr, 0.18)}, transparent 60%)`,
        }}
      >
        <div>
          <span className="text-[10px] uppercase tracking-[0.22em]" style={{ color: ac }}>
            Registration open · OCT 2026
          </span>
          <h2 className="mt-2 text-[28px] font-black leading-tight" style={{ color: tm }}>
            <span style={{ color: pr }}>Capture.</span> <span style={{ color: ac }}>Exploit.</span>{" "}
            <span>Solve.</span>
          </h2>
          <p className="mt-2 max-w-md text-[12px]" style={{ color: tmu }}>
            HCMUS CTF 2026 brings hundreds of teams together to chase flags across web, pwn, crypto,
            reverse and forensics. Build your team, sharpen your edge, and own the leaderboard.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <button
              className="rounded-md px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider"
              style={{ background: pr, color: tm.toLowerCase() === "#ffffff" ? "#000" : tm }}
            >
              Register team
            </button>
            <button
              className="rounded-md border px-3 py-1.5 text-[11px] font-medium"
              style={{ borderColor: border, color: sc }}
            >
              View challenges
            </button>
          </div>
        </div>
        <div className="relative grid place-items-center">
          <CubeMotif primary={pr} secondary={sc} accent={ac} size={160} />
        </div>
      </div>

      {/* Countdown */}
      <div className="grid grid-cols-4 gap-2 px-6 pb-4">
        {[
          ["12", "Days"],
          ["07", "Hours"],
          ["44", "Min"],
          ["09", "Sec"],
        ].map(([v, l]) => (
          <div
            key={l}
            className="rounded-lg border p-2 text-center"
            style={{ background: surface, borderColor: border }}
          >
            <div className="font-mono text-lg font-extrabold" style={{ color: tm }}>
              {v}
            </div>
            <div className="text-[9.5px] uppercase tracking-wider" style={{ color: tmu }}>
              {l}
            </div>
          </div>
        ))}
      </div>

      {/* Cards */}
      <div className="grid gap-2 px-6 md:grid-cols-3">
        {[
          ["Web", "12 challenges"],
          ["Pwn", "9 challenges"],
          ["Crypto", "8 challenges"],
        ].map(([k, v], i) => (
          <div
            key={k}
            className="rounded-xl border p-3"
            style={{
              background: i % 2 === 0 ? surface : surfaceUp,
              borderColor: border,
            }}
          >
            <div className="flex items-center justify-between">
              <span className="text-[12px] font-semibold" style={{ color: tm }}>
                {k}
              </span>
              <span className="text-[10px]" style={{ color: ac }}>
                LIVE
              </span>
            </div>
            <div className="mt-1 text-[11px]" style={{ color: tmu }}>
              {v}
            </div>
            <div
              className="mt-2 h-1 w-full overflow-hidden rounded-full"
              style={{ background: withAlpha(border, 0.6) }}
            >
              <div className="h-full" style={{ background: pr, width: `${30 + i * 25}%` }} />
            </div>
          </div>
        ))}
      </div>

      {/* Leaderboard + Terminal */}
      <div className="grid gap-2 px-6 py-6 md:grid-cols-2">
        <div className="rounded-xl border p-3" style={{ background: surface, borderColor: border }}>
          <div className="mb-2 text-[10.5px] uppercase tracking-wider" style={{ color: tmu }}>
            Leaderboard · Top 5
          </div>
          {["root@vault", "kernel-bandits", "0xCubic", "midnight-shell", "syscall-7"].map(
            (n, i) => (
              <div
                key={n}
                className="flex items-center justify-between border-t py-1.5 text-[11.5px]"
                style={{ borderColor: border, color: tm }}
              >
                <span style={{ color: i < 3 ? ac : tm }}>
                  {i + 1}. {n}
                </span>
                <span className="font-mono" style={{ color: tmu }}>
                  {(3000 - i * 220).toLocaleString()}
                </span>
              </div>
            ),
          )}
        </div>
        <div
          className="overflow-hidden rounded-xl border p-3 font-mono text-[11px] leading-relaxed"
          style={{ background: surface, borderColor: border, color: tmu }}
        >
          <div style={{ color: ac }}>$ nc challenge.hcmusctf.dev 1337</div>
          <div>
            <span style={{ color: sc }}>{">"} </span>exploit loaded
          </div>
          <div>
            <span style={{ color: sc }}>{">"} </span>shell obtained
          </div>
          <div style={{ color: pr }}>
            {">"} flag captured: HCMUS{"{"}c••i•_•••l_••26{"}"}
          </div>
        </div>
      </div>
    </div>
  );
}
