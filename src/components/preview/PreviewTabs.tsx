import { useRef, useState } from "react";
import {
  Award,
  Camera,
  Globe2,
  Image as ImageIcon,
  TerminalSquare,
  Cuboid,
  Download,
} from "lucide-react";
import { toPng } from "html-to-image";
import { Tabs } from "../ui/Tabs";
import { LogoPreview } from "./LogoPreview";
import { PosterPreview } from "./PosterPreview";
import { SocialPreview } from "./SocialPreview";
import { LandingPreview } from "./LandingPreview";
import { TerminalPreview } from "./TerminalPreview";
import { CubicMotifPreview } from "./CubicMotifPreview";
import { usePaletteStore } from "../../store/paletteStore";

export function PreviewTabs() {
  const [tab, setTab] = useState("logo");
  const ref = useRef<HTMLDivElement>(null);
  const showToast = usePaletteStore((s) => s.showToast);
  const current = usePaletteStore((s) => s.current);

  const tabs = [
    { id: "logo", label: "Logo", icon: <Award size={12} /> },
    { id: "poster", label: "Poster", icon: <ImageIcon size={12} /> },
    { id: "social", label: "Social", icon: <Camera size={12} /> },
    { id: "landing", label: "Landing", icon: <Globe2 size={12} /> },
    { id: "terminal", label: "Terminal", icon: <TerminalSquare size={12} /> },
    { id: "cubic", label: "Cubic Motifs", icon: <Cuboid size={12} /> },
  ];

  const exportPng = async () => {
    if (!ref.current) return;
    try {
      const dataUrl = await toPng(ref.current, {
        cacheBust: true,
        pixelRatio: 2,
        backgroundColor: "#06070C",
      });
      const a = document.createElement("a");
      a.href = dataUrl;
      a.download = `${current.name.replace(/[^a-z0-9]+/gi, "-").toLowerCase()}-${tab}.png`;
      a.click();
      showToast("Exported PNG");
    } catch {
      showToast("PNG export failed");
    }
  };

  return (
    <section className="panel p-5">
      <div className="mb-3 flex flex-wrap items-end justify-between gap-2">
        <div>
          <div className="label-eyebrow">Visual Preview</div>
          <h3 className="mt-1 text-base font-semibold text-white">How does this palette feel?</h3>
        </div>
        <div className="flex items-center gap-2">
          <Tabs tabs={tabs} value={tab} onChange={setTab} />
          <button onClick={exportPng} className="btn" title="Export current preview as PNG">
            <Download size={12} /> PNG
          </button>
        </div>
      </div>

      <div ref={ref} className="rounded-xl bg-transparent p-1">
        {tab === "logo" && <LogoPreview />}
        {tab === "poster" && <PosterPreview />}
        {tab === "social" && <SocialPreview />}
        {tab === "landing" && <LandingPreview />}
        {tab === "terminal" && <TerminalPreview />}
        {tab === "cubic" && <CubicMotifPreview />}
      </div>
    </section>
  );
}
