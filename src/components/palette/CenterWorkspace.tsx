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

function Footer() {
  return (
    <footer className="py-6 text-center text-[11px] text-white/35">
      Press{" "}
      <kbd className="rounded border border-white/10 bg-white/5 px-1 font-mono text-[10px]">?</kbd>{" "}
      for shortcuts
    </footer>
  );
}
