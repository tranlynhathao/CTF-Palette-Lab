import { Lightbulb, AlertTriangle, CheckCircle2 } from "lucide-react";
import { useMemo } from "react";
import { usePaletteStore } from "../../store/paletteStore";
import { generateSuggestions } from "../../lib/suggestions";

export function SmartSuggestions() {
  const current = usePaletteStore((s) => s.current);
  const suggestions = useMemo(() => generateSuggestions(current), [current]);

  return (
    <section className="panel p-4">
      <div className="mb-3 flex items-center justify-between">
        <div>
          <div className="label-eyebrow">Insights</div>
          <h3 className="mt-0.5 text-[13px] font-semibold text-white">Smart Suggestions</h3>
        </div>
        <span className="chip">{suggestions.length} tips</span>
      </div>
      <ul className="grid gap-1.5">
        {suggestions.map((s) => {
          const Icon =
            s.level === "warn" ? AlertTriangle : s.level === "good" ? CheckCircle2 : Lightbulb;
          const color =
            s.level === "warn"
              ? "text-amber-300"
              : s.level === "good"
                ? "text-emerald-300"
                : "text-sky-300";
          return (
            <li
              key={s.id}
              className="flex items-start gap-2 rounded-lg border border-white/5 bg-black/30 p-2.5 text-[11.5px] text-white/75"
            >
              <Icon size={13} className={`mt-0.5 shrink-0 ${color}`} />
              <span>{s.text}</span>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
