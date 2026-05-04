import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

const SHORTCUTS = [
  { keys: ["G"], desc: "Generate palette" },
  { keys: ["S"], desc: "Save current palette" },
  { keys: ["E"], desc: "Open export panel" },
  { keys: ["R"], desc: "Randomize seed" },
  { keys: ["C"], desc: "Copy selected color" },
  { keys: ["?"], desc: "Show this shortcuts help" },
];

export function ShortcutsModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-40 grid place-items-center bg-black/60 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            initial={{ y: 12, scale: 0.96, opacity: 0 }}
            animate={{ y: 0, scale: 1, opacity: 1 }}
            exit={{ y: 8, scale: 0.96, opacity: 0 }}
            className="panel w-[min(420px,90vw)] p-5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-3 flex items-center justify-between">
              <div>
                <div className="label-eyebrow">Keyboard Shortcuts</div>
                <h3 className="mt-1 text-lg font-semibold">Move faster</h3>
              </div>
              <button
                onClick={onClose}
                className="rounded-md p-1 text-white/50 hover:bg-white/5 hover:text-white"
              >
                <X size={16} />
              </button>
            </div>
            <ul className="grid gap-1.5">
              {SHORTCUTS.map((s) => (
                <li
                  key={s.desc}
                  className="flex items-center justify-between rounded-lg border border-white/5 bg-black/30 px-3 py-2"
                >
                  <span className="text-sm text-white/80">{s.desc}</span>
                  <span className="flex gap-1">
                    {s.keys.map((k) => (
                      <kbd
                        key={k}
                        className="min-w-[24px] rounded-md border border-white/10 bg-white/5 px-1.5 py-0.5 text-center font-mono text-[11px] text-white/80 shadow-[inset_0_-1px_0_rgba(0,0,0,0.4)]"
                      >
                        {k}
                      </kbd>
                    ))}
                  </span>
                </li>
              ))}
            </ul>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
