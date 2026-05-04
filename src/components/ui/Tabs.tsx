import { motion } from "framer-motion";
import { useState } from "react";

export type Tab = {
  id: string;
  label: string;
  icon?: React.ReactNode;
};

export function Tabs({
  tabs,
  value,
  onChange,
  size = "md",
}: {
  tabs: Tab[];
  value: string;
  onChange: (id: string) => void;
  size?: "sm" | "md";
}) {
  return (
    <div
      className={`border-white/8 relative flex flex-wrap items-center gap-1 rounded-xl border bg-black/30 p-1 ${size === "sm" ? "text-[11px]" : "text-xs"}`}
    >
      {tabs.map((t) => {
        const active = value === t.id;
        return (
          <button
            key={t.id}
            onClick={() => onChange(t.id)}
            className={`relative flex items-center gap-1.5 rounded-lg px-3 py-1.5 font-medium transition ${
              active ? "text-white" : "text-white/55 hover:text-white/80"
            }`}
          >
            {active && (
              <motion.span
                layoutId={`tabsbg-${tabs.map((x) => x.id).join("-")}`}
                className="absolute inset-0 rounded-lg bg-white/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]"
                transition={{ type: "spring", stiffness: 380, damping: 30 }}
              />
            )}
            <span className="relative z-10 flex items-center gap-1.5">
              {t.icon}
              {t.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}

export function useTabs(initial: string) {
  const [value, setValue] = useState(initial);
  return { value, setValue };
}
