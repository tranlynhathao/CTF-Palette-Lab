import {
  Code2,
  FileJson,
  Palette as PaletteIcon,
  Brush,
  FileImage,
  Download,
  Upload,
  Copy,
  Check,
} from "lucide-react";
import { useRef, useState } from "react";
import { usePaletteStore } from "../../store/paletteStore";
import {
  downloadJsonPalette,
  downloadSvgSheet,
  illustratorList,
  parseImportedPalette,
  toCssVariables,
  toFigmaTokens,
  toTailwindConfig,
} from "../../lib/export";

export function ExportPanel() {
  const current = usePaletteStore((s) => s.current);
  const importPalette = usePaletteStore((s) => s.importPalette);
  const showToast = usePaletteStore((s) => s.showToast);
  const [active, setActive] = useState<"css" | "tw" | "json" | "figma" | "ai">("css");
  const fileRef = useRef<HTMLInputElement>(null);

  const text =
    active === "css"
      ? toCssVariables(current)
      : active === "tw"
        ? toTailwindConfig(current)
        : active === "json"
          ? JSON.stringify(current, null, 2)
          : active === "figma"
            ? toFigmaTokens(current)
            : illustratorList(current);

  const copy = async () => {
    await navigator.clipboard.writeText(text);
    showToast("Copied to clipboard");
  };

  const onFile = async (file: File) => {
    const text = await file.text();
    const p = parseImportedPalette(text);
    if (!p) {
      showToast("Invalid palette JSON");
      return;
    }
    importPalette(p);
  };

  return (
    <section className="panel p-4">
      <div className="mb-2 flex items-center justify-between">
        <span className="label-eyebrow">Export</span>
        <span className="text-[10px] text-white/40">Press E</span>
      </div>

      <div className="mb-2 flex flex-wrap gap-1">
        <FormatBtn
          icon={<Code2 size={11} />}
          label="CSS"
          on={active === "css"}
          onClick={() => setActive("css")}
        />
        <FormatBtn
          icon={<Brush size={11} />}
          label="Tailwind"
          on={active === "tw"}
          onClick={() => setActive("tw")}
        />
        <FormatBtn
          icon={<FileJson size={11} />}
          label="JSON"
          on={active === "json"}
          onClick={() => setActive("json")}
        />
        <FormatBtn
          icon={<PaletteIcon size={11} />}
          label="Figma"
          on={active === "figma"}
          onClick={() => setActive("figma")}
        />
        <FormatBtn
          icon={<FileImage size={11} />}
          label="Illustrator"
          on={active === "ai"}
          onClick={() => setActive("ai")}
        />
      </div>

      <div className="border-white/8 relative max-h-[260px] overflow-auto rounded-lg border bg-black/50">
        <pre className="m-0 whitespace-pre p-3 font-mono text-[11px] leading-relaxed text-white/80">
          {text}
        </pre>
      </div>

      <div className="mt-2 grid grid-cols-2 gap-1.5">
        <button onClick={copy} className="btn justify-center">
          <Copy size={12} /> Copy
        </button>
        {active === "json" && (
          <button onClick={() => downloadJsonPalette(current)} className="btn justify-center">
            <Download size={12} /> Download .json
          </button>
        )}
        {active !== "json" && (
          <button onClick={() => downloadSvgSheet(current)} className="btn justify-center">
            <Download size={12} /> SVG Sheet
          </button>
        )}
      </div>

      <div className="mt-2">
        <button onClick={() => fileRef.current?.click()} className="btn w-full justify-center">
          <Upload size={12} /> Import Palette JSON
        </button>
        <input
          ref={fileRef}
          type="file"
          accept="application/json,.json"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) onFile(f);
            e.target.value = "";
          }}
        />
      </div>

      {active === "ai" && (
        <p className="mt-2 text-[10.5px] text-white/45">
          Copy these HEX values into Adobe Illustrator Swatches. Each row pairs a label with its
          role and HEX.
        </p>
      )}
    </section>
  );
}

function FormatBtn({
  icon,
  label,
  on,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  on: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-1 rounded-md border px-2 py-1 text-[10.5px] font-medium transition ${
        on
          ? "border-white/15 bg-white/10 text-white"
          : "border-white/5 bg-white/[0.02] text-white/60 hover:bg-white/[0.05] hover:text-white/85"
      }`}
    >
      {icon}
      {label}
    </button>
  );
}

export function CopyOnly({ text, label }: { text: string; label: string }) {
  const [done, setDone] = useState(false);
  return (
    <button
      onClick={async () => {
        await navigator.clipboard.writeText(text);
        setDone(true);
        setTimeout(() => setDone(false), 1000);
      }}
      className="btn"
    >
      {done ? <Check size={12} /> : <Copy size={12} />} {label}
    </button>
  );
}
