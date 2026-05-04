import { Eye } from "lucide-react";
import { usePaletteStore } from "../../store/paletteStore";
import type { CvdMode } from "../../types";

const MODES: { value: CvdMode; label: string }[] = [
  { value: "normal", label: "Normal" },
  { value: "protanopia", label: "Protanopia" },
  { value: "deuteranopia", label: "Deuteranopia" },
  { value: "tritanopia", label: "Tritanopia" },
  { value: "grayscale", label: "Grayscale" },
];

export function CvdSelector() {
  const cvd = usePaletteStore((s) => s.cvd);
  const setCvd = usePaletteStore((s) => s.setCvd);

  return (
    <div className="flex items-center justify-between gap-3 rounded-xl border border-white/5 bg-black/30 px-4 py-2">
      <div className="flex items-center gap-1.5">
        <Eye size={13} className="text-white/55" />
        <span className="label-eyebrow">Color Vision Preview</span>
      </div>
      <div className="flex flex-wrap gap-1">
        {MODES.map((m) => {
          const active = cvd === m.value;
          return (
            <button
              key={m.value}
              onClick={() => setCvd(m.value)}
              className={`rounded-full px-2.5 py-1 text-[10.5px] font-medium transition ${
                active
                  ? "bg-white text-black"
                  : "bg-white/5 text-white/65 hover:bg-white/10 hover:text-white"
              }`}
            >
              {m.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
