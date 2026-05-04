import { Sparkles, Save, Download, RotateCcw, Cuboid, Keyboard } from "lucide-react";
import { usePaletteStore } from "../../store/paletteStore";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function TopNav({
  onOpenExport,
  onOpenShortcuts,
}: {
  onOpenExport: () => void;
  onOpenShortcuts: () => void;
}) {
  const generate = usePaletteStore((s) => s.generate);
  const save = usePaletteStore((s) => s.saveCurrent);
  const reset = usePaletteStore((s) => s.resetToDefault);
  const current = usePaletteStore((s) => s.current);

  return (
    <header className="sticky top-0 z-30 border-b border-white/5 bg-black/40 backdrop-blur-xl">
      <div className="mx-auto flex h-14 items-center justify-between px-4 lg:px-6">
        <div className="flex items-center gap-3">
          <div className="relative grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-white/10 to-white/0 ring-1 ring-white/10">
            <Cuboid size={18} className="text-white/90" />
            <span className="absolute -bottom-0.5 -right-0.5 h-2 w-2 rounded-full bg-pink-500 shadow-[0_0_8px_rgba(236,72,153,0.7)]" />
          </div>
          <div className="flex items-baseline gap-3">
            <h1 className="text-sm font-semibold tracking-wide text-white">CTF Palette Lab</h1>
            <span className="hidden rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] font-medium uppercase tracking-[0.18em] text-white/60 sm:inline">
              HCMUS CTF 2026
            </span>
            <span className="hidden text-[11px] text-white/35 lg:inline">
              · Local-first design tool
            </span>
          </div>
        </div>

        <div className="hidden items-center gap-4 md:flex">
          <CurrentName name={current.name} />
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={generate}
            className="btn-primary"
            aria-label="Generate (G)"
            title="Generate (G)"
          >
            <Sparkles size={13} />
            <span className="hidden sm:inline">Generate</span>
          </button>
          <button onClick={save} className="btn" title="Save palette (S)">
            <Save size={13} />
            <span className="hidden sm:inline">Save</span>
          </button>
          <button onClick={onOpenExport} className="btn" title="Export (E)">
            <Download size={13} />
            <span className="hidden sm:inline">Export</span>
          </button>
          <button onClick={reset} className="btn" title="Reset to default">
            <RotateCcw size={13} />
            <span className="hidden lg:inline">Reset</span>
          </button>
          <button onClick={onOpenShortcuts} className="btn" title="Keyboard shortcuts">
            <Keyboard size={13} />
          </button>
        </div>
      </div>
    </header>
  );
}

function CurrentName({ name }: { name: string }) {
  const [pulse, setPulse] = useState(name);
  if (pulse !== name) {
    setTimeout(() => setPulse(name), 0);
  }
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={name}
        initial={{ opacity: 0, y: -4 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 4 }}
        className="text-[12px] uppercase tracking-[0.18em] text-white/45"
      >
        Current · <span className="text-white/85">{name}</span>
      </motion.div>
    </AnimatePresence>
  );
}
