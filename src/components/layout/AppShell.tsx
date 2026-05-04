import { useEffect, useState } from "react";
import { TopNav } from "./TopNav";
import { Sidebar } from "./Sidebar";
import { RightPanel } from "./RightPanel";
import { CenterWorkspace } from "../palette/CenterWorkspace";
import { Toast } from "../ui/Toast";
import { CvdFilters } from "../ui/CvdFilters";
import { ShortcutsModal } from "../ui/ShortcutsModal";
import { ExportModal } from "../export/ExportModal";
import { usePaletteStore } from "../../store/paletteStore";
import { ChevronLeft, ChevronRight, PanelRight } from "lucide-react";

export function AppShell() {
  const [exportOpen, setExportOpen] = useState(false);
  const [shortcutsOpen, setShortcutsOpen] = useState(false);
  const [leftOpen, setLeftOpen] = useState(true);
  const [rightOpen, setRightOpen] = useState(true);
  const generate = usePaletteStore((s) => s.generate);
  const save = usePaletteStore((s) => s.saveCurrent);
  const randomize = usePaletteStore((s) => s.randomizeSeed);
  const selected = usePaletteStore((s) => s.selectedRole);
  const current = usePaletteStore((s) => s.current);
  const showToast = usePaletteStore((s) => s.showToast);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const k = e.key.toLowerCase();
      if (k === "g") {
        e.preventDefault();
        generate();
      } else if (k === "s") {
        e.preventDefault();
        save();
      } else if (k === "e") {
        e.preventDefault();
        setExportOpen(true);
      } else if (k === "r") {
        e.preventDefault();
        randomize();
      } else if (k === "?") {
        e.preventDefault();
        setShortcutsOpen(true);
      } else if (k === "c") {
        if (selected) {
          const c = current.colors.find((x) => x.role === selected);
          if (c) {
            navigator.clipboard.writeText(c.hex);
            showToast(`Copied ${c.hex}`);
          }
        }
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [generate, save, randomize, selected, current, showToast]);

  return (
    <div className="relative flex min-h-screen flex-col bg-transparent">
      <CvdFilters />
      <BackgroundDecor />
      <TopNav
        onOpenExport={() => setExportOpen(true)}
        onOpenShortcuts={() => setShortcutsOpen(true)}
      />

      <div className="relative flex min-h-[calc(100vh-3.5rem)] w-full">
        {/* Left sidebar */}
        <div
          className={`hidden shrink-0 border-r border-white/5 bg-black/20 transition-all duration-300 lg:block ${
            leftOpen ? "w-[300px]" : "w-0 overflow-hidden"
          }`}
        >
          <Sidebar />
        </div>
        <button
          onClick={() => setLeftOpen((v) => !v)}
          className="absolute left-0 top-3 z-20 hidden translate-x-0 rounded-r-md border border-l-0 border-white/10 bg-black/40 p-1 text-white/50 hover:bg-black/60 hover:text-white lg:block"
          style={{ left: leftOpen ? 300 : 0 }}
          title={leftOpen ? "Hide left panel" : "Show left panel"}
        >
          {leftOpen ? <ChevronLeft size={14} /> : <ChevronRight size={14} />}
        </button>

        {/* Center workspace */}
        <main className="flex-1 overflow-y-auto">
          {/* Mobile sections */}
          <div className="lg:hidden">
            <details className="border-b border-white/5">
              <summary className="cursor-pointer px-4 py-3 text-xs uppercase tracking-wider text-white/60">
                Controls
              </summary>
              <div className="bg-black/30">
                <Sidebar />
              </div>
            </details>
          </div>

          <CenterWorkspace />

          <div className="lg:hidden">
            <details className="border-t border-white/5">
              <summary className="cursor-pointer px-4 py-3 text-xs uppercase tracking-wider text-white/60">
                Inspector & Export
              </summary>
              <div className="bg-black/30">
                <RightPanel />
              </div>
            </details>
          </div>
        </main>

        {/* Right panel */}
        <button
          onClick={() => setRightOpen((v) => !v)}
          className="absolute right-0 top-3 z-20 hidden rounded-l-md border border-r-0 border-white/10 bg-black/40 p-1 text-white/50 hover:bg-black/60 hover:text-white lg:block"
          style={{ right: rightOpen ? 360 : 0 }}
          title={rightOpen ? "Hide right panel" : "Show right panel"}
        >
          <PanelRight size={14} />
        </button>
        <div
          className={`hidden shrink-0 border-l border-white/5 bg-black/20 transition-all duration-300 lg:block ${
            rightOpen ? "w-[360px]" : "w-0 overflow-hidden"
          }`}
        >
          <RightPanel />
        </div>
      </div>

      <Toast />
      <ExportModal open={exportOpen} onClose={() => setExportOpen(false)} />
      <ShortcutsModal open={shortcutsOpen} onClose={() => setShortcutsOpen(false)} />
    </div>
  );
}

function BackgroundDecor() {
  return (
    <>
      <div className="grid-bg pointer-events-none fixed inset-0 -z-10 opacity-40" />
      <div className="pointer-events-none fixed inset-0 -z-10 bg-radial-spot" />
      <CubicDecor />
    </>
  );
}

function CubicDecor() {
  return (
    <svg
      className="pointer-events-none fixed inset-x-0 top-0 -z-10 h-[60vh] w-full opacity-[0.05]"
      viewBox="0 0 1200 600"
    >
      <defs>
        <pattern id="cubeP" width="80" height="80" patternUnits="userSpaceOnUse">
          <path
            d="M40 10 L70 28 L70 62 L40 80 L10 62 L10 28 Z"
            fill="none"
            stroke="white"
            strokeWidth="0.6"
          />
          <path d="M40 10 L40 45 M40 45 L70 28 M40 45 L10 28" stroke="white" strokeWidth="0.6" />
        </pattern>
      </defs>
      <rect width="1200" height="600" fill="url(#cubeP)" />
    </svg>
  );
}
