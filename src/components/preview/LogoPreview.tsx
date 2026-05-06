import { AlertTriangle, Lock, Palette as PaletteIcon, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";
import { colorHex, usePaletteStore } from "../../store/paletteStore";
import type { LogoColorMode, Palette } from "../../types";
import { HCMUS_CTF_BRAND_PINK } from "./ExactCompetitionLogo";
import { CompetitionLogo } from "../brand/CompetitionLogo";

/**
 * Logo preview tab with three colour modes.
 *
 * - Authentic: master logo values, brand pink locked. Only the surrounding
 *   card backgrounds change with the palette.
 * - Palette-Aware (default): brand pink locked; light, outline and shadow
 *   bind to palette tokens so the wordmark visibly reacts to palette swaps.
 * - Experimental: brand pink is replaced by `palette.primary` for alternate
 *   brand exploration. A warning chip surfaces this.
 */

const MASTER = {
  pink: HCMUS_CTF_BRAND_PINK,
  light: "#FFFFFF",
  outline: "#232020",
  shadow: "#232020",
};

export type LogoColorSet = {
  pink: string;
  light: string;
  outline: string;
  shadow: string;
  accent?: string;
};

/**
 * Resolve the four (+1) colour zones for a given palette under a given mode.
 * Centralised so exports + previews + comparison cards all stay consistent.
 */
export function resolveLogoColors(palette: Palette, mode: LogoColorMode): LogoColorSet {
  if (mode === "authentic") return { ...MASTER };

  const tm = colorHex(palette, "textMain");
  const bg = colorHex(palette, "bgPrimary");
  const border = colorHex(palette, "border");
  const accent = colorHex(palette, "accent");

  if (mode === "experimental") {
    return {
      pink: colorHex(palette, "primary"),
      light: tm,
      outline: border,
      shadow: bg,
      accent,
    };
  }

  // paletteAware: brand pink stays locked, everything else binds to palette
  return {
    pink: HCMUS_CTF_BRAND_PINK,
    light: tm,
    outline: border,
    shadow: bg,
    accent,
  };
}

export function LogoPreview() {
  const palette = usePaletteStore((s) => s.current);
  const cvd = usePaletteStore((s) => s.cvd);
  const mode = usePaletteStore((s) => s.logoMode);

  const colors = resolveLogoColors(palette, mode);

  const bg = colorHex(palette, "bgPrimary");
  const surface = colorHex(palette, "surface");
  const surfaceElevated = colorHex(palette, "surfaceElevated");

  const cvdClass = cvd === "normal" ? "" : cvd === "grayscale" ? "cvd-grayscale" : `cvd-${cvd}`;

  // Per-card light overrides so the back face stays readable against the
  // card background. In Authentic the light stays white; in palette modes we
  // tweak it per card to maintain the 3D extruded effect everywhere.
  const lightForCard = (cardBg: string | "transparent") => {
    if (mode === "authentic") return colors.light;
    if (cardBg === "transparent") return colorHex(palette, "textMuted");
    if (cardBg === bg) return surface;
    if (cardBg === surface) return surfaceElevated;
    return colors.light;
  };

  return (
    <div className="space-y-3">
      <ModeBar />

      {/* Responsive: 1 column by default; 2 columns once cards have ~340px each;
          3 columns only on very wide screens where each card stays usable. */}
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2 2xl:grid-cols-3">
        <LogoCard label="Dark" sub="bgPrimary" bg={bg} bgClass={cvdClass} mode={mode}>
          <CompetitionLogo
            pink={colors.pink}
            light={lightForCard(bg)}
            outline={colors.outline}
            shadow={colors.shadow}
            width="86%"
            ariaLabel="Brand wordmark — dark card"
          />
        </LogoCard>

        <LogoCard label="Surface" sub="surface" bg={surface} bgClass={cvdClass} mode={mode}>
          <CompetitionLogo
            pink={colors.pink}
            light={lightForCard(surface)}
            outline={colors.outline}
            shadow={colors.shadow}
            width="86%"
            ariaLabel="Brand wordmark — surface card"
          />
        </LogoCard>

        <LogoCard label="Transparent" sub="checkerboard" transparent bgClass={cvdClass} mode={mode}>
          <CompetitionLogo
            pink={colors.pink}
            light={lightForCard("transparent")}
            outline={colors.outline}
            shadow={colors.shadow}
            width="86%"
            ariaLabel="Brand wordmark — transparent card"
          />
        </LogoCard>
      </div>
    </div>
  );
}

const MODES: { id: LogoColorMode; label: string; icon: React.ReactNode; tip: string }[] = [
  {
    id: "authentic",
    label: "Authentic",
    icon: <ShieldCheck size={11} />,
    tip: "Master logo values. Brand pink locked. Only the card backgrounds change.",
  },
  {
    id: "paletteAware",
    label: "Palette-Aware",
    icon: <PaletteIcon size={11} />,
    tip: "Brand pink locked. Light, outline and shadow zones bind to palette tokens.",
  },
  {
    id: "experimental",
    label: "Experimental",
    icon: <AlertTriangle size={11} />,
    tip: "Pink overridden by palette.primary. For exploration only — not the canonical brand.",
  },
];

function ModeBar() {
  const mode = usePaletteStore((s) => s.logoMode);
  const setMode = usePaletteStore((s) => s.setLogoMode);
  const active = MODES.find((m) => m.id === mode) ?? MODES[1];

  return (
    <div className="border-white/8 flex flex-wrap items-center justify-between gap-3 rounded-xl border bg-black/30 px-3 py-2">
      <div className="flex items-center gap-2">
        <span className="label-eyebrow">Color Mode</span>
        <div className="border-white/8 relative flex rounded-lg border bg-black/40 p-0.5">
          {MODES.map((m) => {
            const isActive = m.id === mode;
            return (
              <button
                key={m.id}
                onClick={() => setMode(m.id)}
                title={m.tip}
                className={`relative inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-[10.5px] font-medium transition ${
                  isActive ? "text-white" : "text-white/55 hover:text-white/85"
                }`}
              >
                {isActive && (
                  <motion.span
                    layoutId="logo-mode-pill"
                    className="absolute inset-0 rounded-md bg-white/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                <span className="relative z-10 flex items-center gap-1.5">
                  {m.icon}
                  {m.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex min-w-0 items-center gap-2">
        {mode === "experimental" ? (
          <span className="inline-flex items-center gap-1 rounded-full border border-amber-300/30 bg-amber-300/10 px-2 py-0.5 text-[10px] font-semibold text-amber-200">
            <AlertTriangle size={10} />
            Experimental — final brand pink should remain {HCMUS_CTF_BRAND_PINK}
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 text-[10.5px] text-white/45">
            <Lock size={10} className="text-pink-300" />
            Brand pink locked in {active.label} mode
          </span>
        )}
      </div>
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
  mode,
}: {
  label: string;
  sub?: string;
  bg?: string;
  transparent?: boolean;
  children: React.ReactNode;
  bgClass?: string;
  mode: LogoColorMode;
}) {
  const isExperimental = mode === "experimental";
  return (
    <div className="border-white/8 overflow-hidden rounded-2xl border">
      <div className="flex items-center justify-between border-b border-white/5 bg-black/30 px-3 py-1.5">
        <span className="text-[10.5px] uppercase tracking-wider text-white/60">{label}</span>
        {sub && <span className="font-mono text-[10px] text-white/35">{sub}</span>}
      </div>
      <div
        className={`relative grid min-h-[180px] place-items-center overflow-hidden px-6 py-6 sm:min-h-[220px] lg:min-h-[240px] xl:min-h-[260px] ${transparent ? "checker-bg" : ""} ${bgClass ?? ""}`}
        style={transparent ? undefined : { background: bg }}
      >
        {children}
      </div>
      <div className="flex items-center justify-between border-t border-white/5 bg-black/40 px-3 py-1.5">
        <span className="text-[9.5px] uppercase tracking-wider text-white/40">
          {isExperimental ? "Pink overridden" : "Brand pink locked"}
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
