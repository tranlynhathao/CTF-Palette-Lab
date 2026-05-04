import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { ExportPanel } from "./ExportPanel";
import { IllustratorExportPanel } from "./IllustratorExportPanel";

export function ExportModal({ open, onClose }: { open: boolean; onClose: () => void }) {
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
            initial={{ y: 12, scale: 0.97, opacity: 0 }}
            animate={{ y: 0, scale: 1, opacity: 1 }}
            exit={{ y: 8, scale: 0.97, opacity: 0 }}
            className="panel max-h-[90vh] w-[min(640px,94vw)] overflow-y-auto p-5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-3 flex items-center justify-between">
              <div>
                <div className="label-eyebrow">Export</div>
                <h3 className="mt-0.5 text-base font-semibold text-white">
                  Hand off your CTF colors
                </h3>
              </div>
              <button
                onClick={onClose}
                className="rounded-md p-1 text-white/50 hover:bg-white/5 hover:text-white"
              >
                <X size={16} />
              </button>
            </div>
            <div className="grid gap-3">
              <IllustratorExportPanel />
              <ExportPanel />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
