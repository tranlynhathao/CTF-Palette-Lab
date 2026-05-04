import { Eye } from "lucide-react";
import { PaletteSwatches } from "./PaletteSwatches";
import { PreviewTabs } from "../preview/PreviewTabs";
import { ContrastMatrix } from "../inspector/ContrastMatrix";
import { PaletteComparison } from "./PaletteComparison";
import { ImageColorExtractor } from "../image/ImageColorExtractor";
import { MotifBuilder } from "../motifs/MotifBuilder";
import { TypographyPreview } from "../preview/TypographyPreview";
import { CvdSelector } from "./CvdSelector";

export function CenterWorkspace() {
  return (
    <div className="mx-auto w-full max-w-[1280px] space-y-5 p-4 lg:p-6">
      <Hero />
      <PaletteSwatches />
      <CvdSelector />
      <PreviewTabs />
      <ContrastMatrix />
      <PaletteComparison />
      <TypographyPreview />
      <div className="grid gap-5 lg:grid-cols-2">
        <ImageColorExtractor />
        <MotifBuilder />
      </div>
      <Footer />
    </div>
  );
}

function Hero() {
  return (
    <section className="border-white/8 relative overflow-hidden rounded-2xl border bg-gradient-to-br from-white/[0.04] via-transparent to-transparent p-5">
      <div className="absolute inset-0 bg-radial-spot opacity-60" />
      <div className="grid-bg absolute inset-0 opacity-30" />
      <div className="relative flex flex-col items-start justify-between gap-3 md:flex-row md:items-center">
        <div>
          <div className="flex items-center gap-2">
            <Eye size={13} className="text-white/55" />
            <span className="label-eyebrow">Workspace</span>
          </div>
          <h2 className="mt-1 text-xl font-semibold text-white md:text-2xl">
            Generate, preview, validate, and export serious CTF color systems.
          </h2>
          <p className="mt-1 max-w-2xl text-[13px] text-white/55">
            Designer-grade palette tooling for HCMUS CTF 2026. Build a confident visual identity for
            logo, poster, social, web, and terminal moments.
          </p>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="chip">Local-first</span>
          <span className="chip">No backend</span>
          <span className="chip">WCAG aware</span>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="py-6 text-center text-[11px] text-white/35">
      Built for HCMUS CTF 2026 · CTF Palette Lab · Press{" "}
      <kbd className="rounded border border-white/10 bg-white/5 px-1 font-mono text-[10px]">?</kbd>{" "}
      for shortcuts
    </footer>
  );
}
