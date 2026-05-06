import { Lock, Unlock, Copy, RefreshCcw, Check } from "lucide-react";
import { motion } from "framer-motion";
import { useMemo, useState } from "react";
import type { PaletteColor } from "../../types";
import { ROLE_META } from "../../types";
import { contrastRatio, verdict } from "../../lib/contrast";
import { bestTextColor, simulateCvd } from "../../lib/color";
import { usePaletteStore } from "../../store/paletteStore";
import { PaletteCardActions, type PaletteCardAction } from "./PaletteCardActions";

export function SwatchCard({
  color,
  onSelect,
  contrastBg,
}: {
  color: PaletteColor;
  onSelect: () => void;
  contrastBg?: string;
}) {
  const toggleLock = usePaletteStore((s) => s.toggleLock);
  const regenerate = usePaletteStore((s) => s.regenerateOne);
  const showToast = usePaletteStore((s) => s.showToast);
  const cvd = usePaletteStore((s) => s.cvd);
  const selected = usePaletteStore((s) => s.selectedRole) === color.role;
  const [copied, setCopied] = useState(false);

  const meta = ROLE_META[color.role];
  const displayHex = simulateCvd(color.hex, cvd);
  const fg = bestTextColor(displayHex);
  const isLight = fg === "#F2EDE3";

  const ratio = contrastBg ? contrastRatio(displayHex, contrastBg) : null;
  const v = ratio ? verdict(ratio) : null;

  const badgeBg = isLight ? "rgba(255,255,255,0.18)" : "rgba(0,0,0,0.2)";
  const verdictBg = isLight ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.18)";

  const copy = async () => {
    await navigator.clipboard.writeText(color.hex);
    setCopied(true);
    showToast(`Copied ${color.hex}`);
    setTimeout(() => setCopied(false), 1200);
  };

  const actions = useMemo<PaletteCardAction[]>(
    () => [
      {
        id: "regenerate",
        icon: <RefreshCcw size={12} />,
        tooltip: "Regenerate",
        ariaLabel: `Regenerate ${meta.label}`,
        disabled: color.locked,
        onClick: (e) => {
          e.stopPropagation();
          regenerate(color.role);
          showToast(`Regenerated ${meta.label}`);
        },
      },
      {
        id: "copy",
        icon: copied ? <Check size={12} /> : <Copy size={12} />,
        tooltip: copied ? "Copied" : "Copy hex",
        ariaLabel: `Copy ${color.hex}`,
        onClick: (e) => {
          e.stopPropagation();
          copy();
        },
      },
      {
        id: "lock",
        icon: color.locked ? <Lock size={12} /> : <Unlock size={12} />,
        tooltip: color.locked ? "Unlock" : "Lock",
        ariaLabel: color.locked ? `Unlock ${meta.label}` : `Lock ${meta.label}`,
        ariaPressed: color.locked,
        active: color.locked,
        onClick: (e) => {
          e.stopPropagation();
          toggleLock(color.role);
        },
      },
    ],
    // `copy` is a stable enough closure for our purposes — recreating actions
    // when these inputs change is the intent.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [color.role, color.locked, color.hex, copied, meta.label],
  );

  return (
    <motion.div
      layout
      whileHover={{ y: -2 }}
      transition={{ type: "spring", stiffness: 320, damping: 24 }}
      onClick={onSelect}
      onDoubleClick={copy}
      className={`group relative flex h-44 cursor-pointer flex-col overflow-hidden rounded-2xl ring-1 transition ${
        selected
          ? "shadow-[0_0_0_3px_rgba(255,255,255,0.06)] ring-white/40"
          : "ring-white/8 hover:ring-white/20"
      }`}
      style={{ background: displayHex, color: fg }}
    >
      <div className="flex items-start justify-between p-3">
        <div className="flex min-w-0 flex-col">
          <span className="text-[9.5px] font-semibold uppercase tracking-[0.18em] opacity-70">
            {color.role}
          </span>
          <span className="mt-0.5 truncate text-[12.5px] font-semibold">{color.label}</span>
        </div>
        {color.locked && (
          <span
            aria-hidden
            title="Locked"
            className="pointer-events-none ml-2 grid h-5 w-5 shrink-0 place-items-center rounded-full transition-opacity duration-150 group-focus-within:opacity-0 group-hover:opacity-0 [@media(hover:none)]:!opacity-100"
            style={{ background: badgeBg, color: fg }}
          >
            <Lock size={10} />
          </span>
        )}
      </div>

      {/* `(hover: none)` keeps the action group always visible on touch.
          `pointer-events-none` while hidden so the area never intercepts the
          card's own onClick. The PaletteCardActions component handles the
          internal layout — this wrapper only deals with positioning + reveal. */}
      <div className="pointer-events-none absolute left-1/2 top-[46%] z-10 max-w-[calc(100%-1rem)] -translate-x-1/2 -translate-y-1/2 scale-95 opacity-0 transition duration-200 ease-out group-focus-within:pointer-events-auto group-focus-within:scale-100 group-focus-within:opacity-100 group-hover:pointer-events-auto group-hover:scale-100 group-hover:opacity-100 [@media(hover:none)]:!pointer-events-auto [@media(hover:none)]:!scale-100 [@media(hover:none)]:!opacity-100">
        <PaletteCardActions actions={actions} fg={fg} isLight={isLight} />
      </div>

      <div className="flex-1" />

      <div className="flex items-end justify-between gap-2 p-3 text-[11.5px]">
        <span className="truncate font-mono opacity-90">{color.hex.toUpperCase()}</span>
        {v && (
          <span
            className="shrink-0 rounded-full px-1.5 py-0.5 text-[9.5px] font-medium uppercase tracking-wider"
            style={{ background: verdictBg, color: fg }}
            title={`${ratio?.toFixed(2)}:1 contrast vs background`}
          >
            {v}
          </span>
        )}
      </div>
    </motion.div>
  );
}
