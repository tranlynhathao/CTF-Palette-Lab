import { motion, AnimatePresence } from "framer-motion";
import { Edit3 } from "lucide-react";
import { useState } from "react";
import { usePaletteStore, colorHex } from "../../store/paletteStore";
import { SwatchCard } from "./SwatchCard";

export function PaletteSwatches() {
  const current = usePaletteStore((s) => s.current);
  const selectRole = usePaletteStore((s) => s.selectRole);
  const renameCurrent = usePaletteStore((s) => s.renameCurrent);
  const [editingName, setEditingName] = useState(false);
  const [draftName, setDraftName] = useState(current.name);

  const bgPrimary = colorHex(current, "bgPrimary");

  return (
    <section className="panel relative overflow-hidden p-5">
      <div className="mb-4 flex items-end justify-between gap-4">
        <div>
          <div className="label-eyebrow">Current Palette</div>
          {editingName ? (
            <input
              autoFocus
              value={draftName}
              onChange={(e) => setDraftName(e.target.value)}
              onBlur={() => {
                renameCurrent(draftName.trim() || "Untitled");
                setEditingName(false);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  renameCurrent(draftName.trim() || "Untitled");
                  setEditingName(false);
                }
              }}
              className="mt-1 w-full rounded-md border border-white/10 bg-black/30 px-2 py-1 text-2xl font-semibold text-white outline-none"
            />
          ) : (
            <button
              onClick={() => {
                setDraftName(current.name);
                setEditingName(true);
              }}
              className="group mt-1 flex items-center gap-2 text-left text-2xl font-semibold text-white"
              title="Rename palette"
            >
              {current.name}
              <Edit3 size={14} className="opacity-0 transition-opacity group-hover:opacity-50" />
            </button>
          )}
          <p className="mt-1 max-w-2xl text-[12.5px] text-white/55">{current.description}</p>
        </div>
        <div className="hidden flex-wrap items-center gap-1.5 sm:flex">
          {current.tags.slice(0, 4).map((t) => (
            <span key={t} className="chip">
              {t}
            </span>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-6">
        <AnimatePresence mode="popLayout">
          {current.colors.map((c) => (
            <motion.div
              key={c.id + c.role}
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.94 }}
              transition={{ duration: 0.18 }}
            >
              <SwatchCard
                color={c}
                onSelect={() => selectRole(c.role)}
                contrastBg={c.role.startsWith("text") ? bgPrimary : undefined}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </section>
  );
}
