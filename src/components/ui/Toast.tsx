import { AnimatePresence, motion } from "framer-motion";
import { Check } from "lucide-react";
import { usePaletteStore } from "../../store/paletteStore";

export function Toast() {
  const toast = usePaletteStore((s) => s.toast);
  return (
    <div className="pointer-events-none fixed bottom-6 left-1/2 z-50 -translate-x-1/2">
      <AnimatePresence>
        {toast && (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 12, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            transition={{ type: "spring", stiffness: 320, damping: 26 }}
            className="pointer-events-auto flex items-center gap-2 rounded-full border border-white/10 bg-black/80 px-4 py-2 text-sm text-white shadow-2xl backdrop-blur-md"
          >
            <span className="grid h-5 w-5 place-items-center rounded-full bg-emerald-500/20 text-emerald-400">
              <Check size={12} />
            </span>
            {toast.text}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
