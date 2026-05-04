import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  DEFAULT_GENERATION_OPTIONS,
  type CvdMode,
  type GenerationOptions,
  type HarmonyMode,
  type Mood,
  type Palette,
  type PaletteColor,
  type ColorRole,
} from "../types";
import { PRELOADED_PALETTES } from "../data/palettes";
import { generatePalette, regenerateUnlocked } from "../lib/generator";
import { STORAGE_KEY } from "../lib/storage";

type PaletteState = {
  current: Palette;
  saved: Palette[];
  selectedRole: ColorRole | null;
  seed: string;
  mood: Mood;
  harmony: HarmonyMode;
  options: GenerationOptions;
  comparison: string[]; // saved palette ids
  cvd: CvdMode;
  toast: { id: number; text: string } | null;

  setSeed: (hex: string) => void;
  setMood: (m: Mood) => void;
  setHarmony: (h: HarmonyMode) => void;
  toggleOption: (key: keyof GenerationOptions) => void;
  setOption: (key: keyof GenerationOptions, value: boolean) => void;

  selectRole: (r: ColorRole | null) => void;
  toggleLock: (role: ColorRole) => void;
  updateColor: (role: ColorRole, hex: string) => void;
  renameCurrent: (name: string) => void;

  generate: () => void;
  regenerateOne: (role: ColorRole) => void;
  randomizeSeed: () => void;
  resetToDefault: () => void;

  saveCurrent: () => void;
  loadSaved: (id: string) => void;
  deleteSaved: (id: string) => void;
  duplicateCurrent: () => void;
  importPalette: (p: Palette) => void;

  toggleCompare: (id: string) => void;
  clearComparison: () => void;

  setCvd: (m: CvdMode) => void;
  showToast: (text: string) => void;
};

const FINALIST = PRELOADED_PALETTES.find((p) => p.name === "Finalist Candidate")!;

const initialCurrent: Palette = JSON.parse(JSON.stringify(FINALIST));

let toastIdCounter = 0;

export const usePaletteStore = create<PaletteState>()(
  persist(
    (set, get) => ({
      current: initialCurrent,
      saved: PRELOADED_PALETTES,
      selectedRole: "primary",
      seed: "#D81B60",
      mood: "cyberNoir",
      harmony: "darkOptimized",
      options: DEFAULT_GENERATION_OPTIONS,
      comparison: [],
      cvd: "normal",
      toast: null,

      setSeed: (hex) => set({ seed: hex }),
      setMood: (m) => set({ mood: m }),
      setHarmony: (h) => set({ harmony: h }),
      toggleOption: (key) => set((s) => ({ options: { ...s.options, [key]: !s.options[key] } })),
      setOption: (key, value) => set((s) => ({ options: { ...s.options, [key]: value } })),

      selectRole: (r) => set({ selectedRole: r }),
      toggleLock: (role) =>
        set((s) => ({
          current: {
            ...s.current,
            updatedAt: new Date().toISOString(),
            colors: s.current.colors.map((c) =>
              c.role === role ? { ...c, locked: !c.locked } : c,
            ),
          },
        })),

      updateColor: (role, hex) =>
        set((s) => ({
          current: {
            ...s.current,
            updatedAt: new Date().toISOString(),
            colors: s.current.colors.map((c) => (c.role === role ? { ...c, hex } : c)),
          },
        })),

      renameCurrent: (name) =>
        set((s) => ({
          current: { ...s.current, name, updatedAt: new Date().toISOString() },
        })),

      generate: () => {
        const { seed, mood, harmony, options, current } = get();
        const next = regenerateUnlocked(current, { seed, mood, harmony, options });
        set({ current: next });
        get().showToast("New palette generated");
      },

      regenerateOne: (role) => {
        const { seed, mood, harmony, options, current } = get();
        // lock everything else, regenerate just this one
        const lockedMap: Partial<Record<ColorRole, string>> = {};
        current.colors.forEach((c) => {
          if (c.role !== role) lockedMap[c.role] = c.hex;
        });
        const fresh = generatePalette({
          seed,
          mood,
          harmony,
          options,
          locked: lockedMap,
        });
        const newColor = fresh.colors.find((c) => c.role === role);
        if (!newColor) return;
        set({
          current: {
            ...current,
            updatedAt: new Date().toISOString(),
            colors: current.colors.map((c) => (c.role === role ? { ...c, hex: newColor.hex } : c)),
          },
        });
      },

      randomizeSeed: () => {
        const h = Math.floor(Math.random() * 360);
        const s = 65 + Math.floor(Math.random() * 25);
        const l = 40 + Math.floor(Math.random() * 20);
        const seed = hslToHexLocal(h, s, l);
        set({ seed });
      },

      resetToDefault: () =>
        set({
          current: JSON.parse(JSON.stringify(FINALIST)),
          seed: "#D81B60",
          mood: "cyberNoir",
          harmony: "darkOptimized",
          options: DEFAULT_GENERATION_OPTIONS,
          selectedRole: "primary",
        }),

      saveCurrent: () => {
        const { current, saved } = get();
        const copy: Palette = JSON.parse(JSON.stringify(current));
        copy.id = `pal-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
        copy.createdAt = new Date().toISOString();
        copy.updatedAt = copy.createdAt;
        set({ saved: [copy, ...saved] });
        get().showToast("Palette saved");
      },

      loadSaved: (id) => {
        const found = get().saved.find((p) => p.id === id);
        if (found) {
          set({
            current: JSON.parse(JSON.stringify(found)),
            selectedRole: "primary",
          });
          get().showToast(`Loaded "${found.name}"`);
        }
      },

      deleteSaved: (id) =>
        set((s) => ({
          saved: s.saved.filter((p) => p.id !== id),
          comparison: s.comparison.filter((c) => c !== id),
        })),

      duplicateCurrent: () => {
        const { current, saved } = get();
        const copy: Palette = JSON.parse(JSON.stringify(current));
        copy.id = `pal-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
        copy.name = current.name + " Copy";
        copy.createdAt = new Date().toISOString();
        copy.updatedAt = copy.createdAt;
        set({ saved: [copy, ...saved], current: copy });
        get().showToast("Palette duplicated");
      },

      importPalette: (p) => {
        const copy: Palette = JSON.parse(JSON.stringify(p));
        copy.id = `pal-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
        copy.updatedAt = new Date().toISOString();
        set((s) => ({
          current: copy,
          saved: [copy, ...s.saved],
        }));
        get().showToast(`Imported "${copy.name}"`);
      },

      toggleCompare: (id) =>
        set((s) => {
          if (s.comparison.includes(id)) {
            return { comparison: s.comparison.filter((c) => c !== id) };
          }
          if (s.comparison.length >= 4) {
            return { comparison: [...s.comparison.slice(1), id] };
          }
          return { comparison: [...s.comparison, id] };
        }),

      clearComparison: () => set({ comparison: [] }),

      setCvd: (m) => set({ cvd: m }),

      showToast: (text) => {
        const id = ++toastIdCounter;
        set({ toast: { id, text } });
        setTimeout(() => {
          if (get().toast?.id === id) set({ toast: null });
        }, 2400);
      },
    }),
    {
      name: STORAGE_KEY,
      partialize: (s) => ({
        current: s.current,
        saved: s.saved,
        seed: s.seed,
        mood: s.mood,
        harmony: s.harmony,
        options: s.options,
        comparison: s.comparison,
        cvd: s.cvd,
        selectedRole: s.selectedRole,
      }),
    },
  ),
);

export function getColor(p: Palette, role: ColorRole): PaletteColor | undefined {
  return p.colors.find((c) => c.role === role);
}

export function colorHex(p: Palette, role: ColorRole, fallback = "#000000"): string {
  return p.colors.find((c) => c.role === role)?.hex ?? fallback;
}

function hslToHexLocal(h: number, s: number, l: number): string {
  s /= 100;
  l /= 100;
  const k = (n: number) => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  const to = (v: number) =>
    Math.round(v * 255)
      .toString(16)
      .padStart(2, "0");
  return `#${to(f(0))}${to(f(8))}${to(f(4))}`.toUpperCase();
}
