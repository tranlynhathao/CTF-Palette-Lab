import { Lock, Unlock, Copy, RefreshCcw, Check } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import type { PaletteColor } from "../../types";
import { ROLE_META } from "../../types";
import { contrastRatio, verdict } from "../../lib/contrast";
import { bestTextColor, simulateCvd } from "../../lib/color";
import { usePaletteStore } from "../../store/paletteStore";

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

  const ratio = contrastBg ? contrastRatio(displayHex, contrastBg) : null;
  const v = ratio ? verdict(ratio) : null;

  const copy = async () => {
    await navigator.clipboard.writeText(color.hex);
    setCopied(true);
    showToast(`Copied ${color.hex}`);
    setTimeout(() => setCopied(false), 1200);
  };

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
      {/* Top row: role + lock */}
      <div className="flex items-start justify-between p-3">
        <div className="flex flex-col">
          <span
            className="text-[9.5px] font-semibold uppercase tracking-[0.18em] opacity-70"
            style={{ color: fg }}
          >
            {color.role}
          </span>
          <span className="mt-0.5 text-[12.5px] font-semibold" style={{ color: fg }}>
            {color.label}
          </span>
        </div>
        <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
          <IconBtn
            onClick={(e) => {
              e.stopPropagation();
              regenerate(color.role);
              showToast(`Regenerated ${meta.label}`);
            }}
            fg={fg}
            title="Regenerate"
            disabled={color.locked}
          >
            <RefreshCcw size={11} />
          </IconBtn>
          <IconBtn
            onClick={(e) => {
              e.stopPropagation();
              copy();
            }}
            fg={fg}
            title="Copy hex"
          >
            {copied ? <Check size={11} /> : <Copy size={11} />}
          </IconBtn>
          <IconBtn
            onClick={(e) => {
              e.stopPropagation();
              toggleLock(color.role);
            }}
            fg={fg}
            title={color.locked ? "Unlock" : "Lock"}
            active={color.locked}
          >
            {color.locked ? <Lock size={11} /> : <Unlock size={11} />}
          </IconBtn>
        </div>
      </div>

      {/* Lock badge always visible if locked */}
      {color.locked && (
        <span
          className="absolute right-3 top-3 grid h-5 w-5 place-items-center rounded-full"
          style={{
            background: fg === "#F2EDE3" ? "rgba(255,255,255,0.18)" : "rgba(0,0,0,0.2)",
            color: fg,
          }}
        >
          <Lock size={10} />
        </span>
      )}

      <div className="flex-1" />

      {/* Bottom info */}
      <div className="flex items-end justify-between p-3 text-[11.5px]" style={{ color: fg }}>
        <span className="font-mono opacity-90">{color.hex.toUpperCase()}</span>
        {v && (
          <span
            className="rounded-full px-1.5 py-0.5 text-[9.5px] font-medium uppercase tracking-wider"
            style={{
              background: fg === "#F2EDE3" ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.18)",
              color: fg,
            }}
            title={`${ratio?.toFixed(2)}:1 contrast vs background`}
          >
            {v}
          </span>
        )}
      </div>
    </motion.div>
  );
}

function IconBtn({
  children,
  onClick,
  fg,
  title,
  active,
  disabled,
}: {
  children: React.ReactNode;
  onClick: (e: React.MouseEvent) => void;
  fg: string;
  title: string;
  active?: boolean;
  disabled?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      title={title}
      disabled={disabled}
      className="grid h-6 w-6 place-items-center rounded-md backdrop-blur-md transition disabled:opacity-30"
      style={{
        background:
          fg === "#F2EDE3"
            ? active
              ? "rgba(255,255,255,0.22)"
              : "rgba(255,255,255,0.12)"
            : active
              ? "rgba(0,0,0,0.28)"
              : "rgba(0,0,0,0.16)",
        color: fg,
      }}
    >
      {children}
    </button>
  );
}
