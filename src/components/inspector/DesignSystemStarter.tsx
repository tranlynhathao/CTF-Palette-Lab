import { ChevronDown, BookOpenText } from "lucide-react";
import { useState } from "react";
import { usePaletteStore, colorHex } from "../../store/paletteStore";

const SECTIONS = [
  {
    id: "logo",
    title: "Logo",
    items: [
      ["Brand pink zone", "primary"],
      ["Wordmark light", "textMain"],
      ["Highlight detail", "accent"],
      ["Shadow / extrusion", "bgPrimary"],
      ["Stroke / outline", "border"],
    ],
  },
  {
    id: "poster",
    title: "Poster",
    items: [
      ["Background", "bgPrimary"],
      ["Main heading", "textMain"],
      ["Highlight words", "primary"],
      ["CTA", "accent"],
      ["Decorative cubes", "secondary"],
    ],
  },
  {
    id: "social",
    title: "Social",
    items: [
      ["Background", "bgSecondary"],
      ["Main title", "textMain"],
      ["CTA", "primary"],
      ["Highlights", "accent"],
    ],
  },
  {
    id: "website",
    title: "Website",
    items: [
      ["Hero background", "bgPrimary"],
      ["Cards", "surface"],
      ["Buttons", "primary"],
      ["Links", "secondary"],
      ["Borders", "border"],
    ],
  },
] as const;

export function DesignSystemStarter() {
  const current = usePaletteStore((s) => s.current);
  const [open, setOpen] = useState<string | null>("logo");

  return (
    <section className="panel p-4">
      <div className="mb-2 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <BookOpenText size={12} className="text-white/55" />
          <span className="label-eyebrow">Design System Starter</span>
        </div>
      </div>
      <div className="grid gap-1.5">
        {SECTIONS.map((s) => {
          const isOpen = open === s.id;
          return (
            <div
              key={s.id}
              className="overflow-hidden rounded-xl border border-white/5 bg-black/30"
            >
              <button
                onClick={() => setOpen(isOpen ? null : s.id)}
                className="flex w-full items-center justify-between px-3 py-2 text-[12.5px] font-medium text-white/85 hover:bg-white/[0.04]"
              >
                {s.title}
                <ChevronDown
                  size={13}
                  className={`text-white/40 transition ${isOpen ? "rotate-180" : ""}`}
                />
              </button>
              {isOpen && (
                <ul className="grid gap-1 border-t border-white/5 p-2.5">
                  {s.items.map(([k, role]) => {
                    const hex = colorHex(current, role as any);
                    return (
                      <li
                        key={k}
                        className="flex items-center gap-2 rounded-md px-2 py-1.5 hover:bg-white/[0.03]"
                      >
                        <span
                          className="h-3.5 w-3.5 rounded ring-1 ring-white/10"
                          style={{ background: hex }}
                        />
                        <span className="flex-1 text-[11.5px] text-white/70">{k}</span>
                        <span className="text-[10px] uppercase tracking-wider text-white/35">
                          {role}
                        </span>
                        <span className="font-mono text-[10.5px] text-white/55">
                          {hex.toUpperCase()}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
