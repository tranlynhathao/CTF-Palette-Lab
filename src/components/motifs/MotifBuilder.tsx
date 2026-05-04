import { Copy, Download, Check } from "lucide-react";
import { useState } from "react";
import { colorHex, usePaletteStore } from "../../store/paletteStore";
import {
  CubeMotif,
  FlatCubeMotif,
  GridCubeMotif,
  CubeClusterMotif,
  TranslucentCubeMotif,
  KeyholeCubeMotif,
  FlagCubeMotif,
  TerminalPromptMotif,
  CircuitMotif,
  LockCoreMotif,
  BracketMarkMotif,
} from "./SvgMotifs";

const MOTIFS = [
  { id: "wire", name: "Wireframe Cube", Comp: CubeMotif },
  { id: "flat", name: "Flat Cube", Comp: FlatCubeMotif },
  { id: "grid", name: "Grid Cube 3×3", Comp: GridCubeMotif },
  { id: "cluster", name: "Cube Cluster", Comp: CubeClusterMotif },
  { id: "trans", name: "Translucent Cube", Comp: TranslucentCubeMotif },
  { id: "key", name: "Keyhole Cube", Comp: KeyholeCubeMotif },
  { id: "flag", name: "Flag Cube", Comp: FlagCubeMotif },
  { id: "term", name: "Terminal Prompt", Comp: TerminalPromptMotif },
  { id: "circ", name: "Circuit Line", Comp: CircuitMotif },
  { id: "lock", name: "Lock Core", Comp: LockCoreMotif },
  { id: "brk", name: "Bracket Mark", Comp: BracketMarkMotif },
];

export function MotifBuilder() {
  const current = usePaletteStore((s) => s.current);
  const showToast = usePaletteStore((s) => s.showToast);
  const [active, setActive] = useState(MOTIFS[0].id);

  const pr = colorHex(current, "primary");
  const sc = colorHex(current, "secondary");
  const ac = colorHex(current, "accent");
  const surface = colorHex(current, "surface");
  const border = colorHex(current, "border");

  const motif = MOTIFS.find((m) => m.id === active)!;

  const copySvg = async () => {
    const node = document.getElementById("motif-render");
    const svg = node?.querySelector("svg");
    if (!svg) return;
    await navigator.clipboard.writeText(svg.outerHTML);
    showToast("SVG copied");
  };

  const downloadSvg = () => {
    const node = document.getElementById("motif-render");
    const svg = node?.querySelector("svg");
    if (!svg) return;
    const blob = new Blob([svg.outerHTML], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${motif.id}-motif.svg`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  return (
    <section className="panel p-5">
      <div className="mb-3">
        <div className="label-eyebrow">CTF Motif Builder</div>
        <h3 className="mt-1 text-base font-semibold text-white">
          Simple SVG accents using current palette
        </h3>
      </div>

      <div className="mb-3 flex flex-wrap gap-1">
        {MOTIFS.map((m) => (
          <button
            key={m.id}
            onClick={() => setActive(m.id)}
            className={`rounded-full px-2.5 py-1 text-[10.5px] font-medium transition ${
              active === m.id
                ? "bg-white text-black"
                : "bg-white/5 text-white/65 hover:bg-white/10 hover:text-white"
            }`}
          >
            {m.name}
          </button>
        ))}
      </div>

      <div
        id="motif-render"
        className="grid place-items-center rounded-xl border p-8"
        style={{ background: surface, borderColor: border }}
      >
        <motif.Comp primary={pr} secondary={sc} accent={ac} size={140} />
      </div>

      <div className="mt-2 flex flex-wrap gap-1.5">
        <button onClick={copySvg} className="btn">
          <Copy size={12} /> Copy SVG
        </button>
        <button onClick={downloadSvg} className="btn">
          <Download size={12} /> Download SVG
        </button>
      </div>

      <p className="mt-2 text-[10.5px] text-white/40">
        Inline-friendly for posters, slides, and brand stamps.
      </p>
    </section>
  );
}

export function CopiedBadge() {
  return (
    <span className="inline-flex items-center gap-1 rounded-md bg-emerald-400/15 px-1.5 py-0.5 text-[10px] font-medium text-emerald-300">
      <Check size={10} /> Copied
    </span>
  );
}
