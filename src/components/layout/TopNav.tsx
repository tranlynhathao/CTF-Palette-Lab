import { Sparkles, Save, Download, RotateCcw, Cuboid, Keyboard } from "lucide-react";
import { usePaletteStore } from "../../store/paletteStore";

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

  return (
    <header className="sticky top-0 z-30 border-b border-white/5 bg-black/40 backdrop-blur-xl">
      <div className="mx-auto flex h-14 items-center justify-between gap-4 px-4 lg:px-6">
        <div className="flex min-w-0 items-center gap-3">
          <div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-white/5 ring-1 ring-white/10">
            <Cuboid size={16} className="text-white/80" />
          </div>
          <h1 className="truncate text-[13px] font-semibold tracking-wide text-white/90">
            Palette Workspace
          </h1>
        </div>

        <div className="flex shrink-0 items-center gap-1.5">
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
          <button onClick={onOpenShortcuts} className="btn" title="Keyboard shortcuts (?)">
            <Keyboard size={13} />
          </button>
        </div>
      </div>
    </header>
  );
}
