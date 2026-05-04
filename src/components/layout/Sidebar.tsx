import { Shuffle, Pipette, Sparkles, Layers3, Trash2, CheckSquare, Square } from "lucide-react";
import { usePaletteStore, colorHex } from "../../store/paletteStore";
import { HARMONY_MODES, MOODS } from "../../types";
import { isValidHex, normalizeHex } from "../../lib/color";
import { useState } from "react";

export function Sidebar() {
  const seed = usePaletteStore((s) => s.seed);
  const setSeed = usePaletteStore((s) => s.setSeed);
  const mood = usePaletteStore((s) => s.mood);
  const setMood = usePaletteStore((s) => s.setMood);
  const harmony = usePaletteStore((s) => s.harmony);
  const setHarmony = usePaletteStore((s) => s.setHarmony);
  const options = usePaletteStore((s) => s.options);
  const toggleOption = usePaletteStore((s) => s.toggleOption);
  const generate = usePaletteStore((s) => s.generate);
  const randomize = usePaletteStore((s) => s.randomizeSeed);
  const saved = usePaletteStore((s) => s.saved);
  const loadSaved = usePaletteStore((s) => s.loadSaved);
  const deleteSaved = usePaletteStore((s) => s.deleteSaved);
  const compare = usePaletteStore((s) => s.comparison);
  const toggleCompare = usePaletteStore((s) => s.toggleCompare);
  const current = usePaletteStore((s) => s.current);

  const [seedDraft, setSeedDraft] = useState(seed);

  const onSeedChange = (v: string) => {
    setSeedDraft(v);
    if (isValidHex(v)) setSeed(normalizeHex(v));
  };

  return (
    <aside className="flex h-full flex-col gap-4 overflow-y-auto p-4 lg:p-5">
      <Section
        title="Seed Color"
        icon={<Pipette size={12} />}
        action={
          <button
            onClick={() => {
              randomize();
              const ns = usePaletteStore.getState().seed;
              setSeedDraft(ns);
            }}
            className="chip hover:bg-white/10"
            title="Random seed (R)"
          >
            <Shuffle size={11} /> Random
          </button>
        }
      >
        <div className="flex items-center gap-2">
          <label className="relative grid h-10 w-10 shrink-0 place-items-center overflow-hidden rounded-lg ring-1 ring-white/10">
            <input
              type="color"
              value={isValidHex(seedDraft) ? normalizeHex(seedDraft) : "#000000"}
              onChange={(e) => onSeedChange(e.target.value)}
              className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
            />
            <div
              className="h-full w-full"
              style={{ background: isValidHex(seedDraft) ? normalizeHex(seedDraft) : "#000" }}
            />
          </label>
          <input
            value={seedDraft}
            onChange={(e) => onSeedChange(e.target.value)}
            placeholder="#D81B60"
            className="input-base font-mono text-[13px] uppercase"
            spellCheck={false}
          />
        </div>
        <button
          onClick={generate}
          className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-lg border border-white/10 bg-gradient-to-b from-pink-500/30 to-fuchsia-500/10 py-2 text-xs font-semibold text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.15)] transition hover:from-pink-500/40 hover:to-fuchsia-500/20"
        >
          <Sparkles size={13} /> Generate Palette
        </button>
      </Section>

      <Section title="Mood Preset">
        <div className="grid grid-cols-2 gap-1.5">
          {MOODS.map((m) => {
            const active = mood === m.value;
            return (
              <button
                key={m.value}
                onClick={() => setMood(m.value)}
                className={`group flex flex-col items-start gap-0.5 rounded-lg border px-2.5 py-2 text-left transition ${
                  active
                    ? "border-white/20 bg-white/10 text-white"
                    : "border-white/5 bg-white/[0.02] text-white/65 hover:border-white/10 hover:bg-white/5"
                }`}
              >
                <span className="text-[11px] font-semibold">{m.label}</span>
                <span className="text-[10px] text-white/40">{m.hint}</span>
              </button>
            );
          })}
        </div>
      </Section>

      <Section title="Harmony Mode">
        <div className="flex flex-wrap gap-1">
          {HARMONY_MODES.map((h) => {
            const active = harmony === h.value;
            return (
              <button
                key={h.value}
                onClick={() => setHarmony(h.value)}
                className={`rounded-full px-2.5 py-1 text-[10.5px] font-medium transition ${
                  active
                    ? "bg-white text-black"
                    : "bg-white/5 text-white/65 hover:bg-white/10 hover:text-white"
                }`}
              >
                {h.label}
              </button>
            );
          })}
        </div>
      </Section>

      <Section title="Generation Options">
        <div className="grid gap-1.5">
          <Toggle
            label="Dark Optimized"
            on={options.darkOptimized}
            onClick={() => toggleOption("darkOptimized")}
          />
          <Toggle
            label="Muted / Professional"
            on={options.mutedProfessional}
            onClick={() => toggleOption("mutedProfessional")}
          />
          <Toggle
            label="High Contrast"
            on={options.highContrast}
            onClick={() => toggleOption("highContrast")}
          />
          <Toggle
            label="Neon Accent"
            on={options.neonAccent}
            onClick={() => toggleOption("neonAccent")}
          />
          <Toggle
            label="Classic Tone"
            on={options.classicTone}
            onClick={() => toggleOption("classicTone")}
          />
        </div>
      </Section>

      <Section
        title="Saved Palettes"
        icon={<Layers3 size={12} />}
        action={<span className="text-[10px] text-white/40">{saved.length} total</span>}
      >
        <div className="grid gap-1.5">
          {saved.map((p) => {
            const isCompared = compare.includes(p.id);
            const isCurrent = p.name === current.name;
            return (
              <div
                key={p.id}
                className={`group rounded-xl border p-2 transition ${
                  isCurrent
                    ? "border-white/15 bg-white/[0.04]"
                    : "border-white/5 bg-white/[0.02] hover:border-white/10 hover:bg-white/[0.04]"
                }`}
              >
                <button onClick={() => loadSaved(p.id)} className="block w-full text-left">
                  <div className="mb-1.5 flex items-center justify-between">
                    <span className="truncate text-[11.5px] font-semibold text-white/90">
                      {p.name}
                    </span>
                    <span className="ml-2 shrink-0 text-[9.5px] uppercase tracking-wider text-white/30">
                      {p.mood}
                    </span>
                  </div>
                  <div className="flex h-5 w-full overflow-hidden rounded-md ring-1 ring-white/5">
                    {p.colors.slice(0, 8).map((c) => (
                      <div
                        key={c.id}
                        className="flex-1"
                        style={{ background: c.hex }}
                        title={`${c.label} ${c.hex}`}
                      />
                    ))}
                  </div>
                </button>
                <div className="mt-1.5 flex items-center justify-between gap-1">
                  <button
                    onClick={() => toggleCompare(p.id)}
                    className={`inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[10px] transition ${
                      isCompared
                        ? "bg-white/10 text-white"
                        : "text-white/45 hover:bg-white/5 hover:text-white/80"
                    }`}
                  >
                    {isCompared ? <CheckSquare size={10} /> : <Square size={10} />}
                    Compare
                  </button>
                  <button
                    onClick={() => deleteSaved(p.id)}
                    className="rounded-md p-1 text-white/30 opacity-0 transition hover:bg-red-500/10 hover:text-red-400 group-hover:opacity-100"
                    title="Delete"
                  >
                    <Trash2 size={11} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </Section>

      <CurrentSeedPreview hex={colorHex(current, "primary")} />
    </aside>
  );
}

function Section({
  title,
  icon,
  action,
  children,
}: {
  title: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="panel p-3.5">
      <div className="mb-2.5 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          {icon}
          <span className="label-eyebrow">{title}</span>
        </div>
        {action}
      </div>
      {children}
    </div>
  );
}

function Toggle({ label, on, onClick }: { label: string; on: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center justify-between rounded-lg border border-white/5 bg-black/30 px-3 py-2 text-left transition hover:bg-black/40"
    >
      <span className="text-[12px] text-white/80">{label}</span>
      <span
        className={`relative h-4 w-7 rounded-full transition ${
          on ? "bg-pink-500/70" : "bg-white/10"
        }`}
      >
        <span
          className={`absolute top-0.5 h-3 w-3 rounded-full bg-white shadow transition ${
            on ? "left-3.5" : "left-0.5"
          }`}
        />
      </span>
    </button>
  );
}

function CurrentSeedPreview({ hex }: { hex: string }) {
  return (
    <div className="panel relative overflow-hidden p-4">
      <div className="label-eyebrow mb-2">Current Primary</div>
      <div
        className="relative h-16 w-full overflow-hidden rounded-lg ring-1 ring-white/5"
        style={{
          background: `linear-gradient(135deg, ${hex}, ${hex}cc 60%, ${hex}66)`,
        }}
      >
        <div className="grid-bg absolute inset-0 opacity-40 mix-blend-overlay" />
      </div>
      <div className="mt-2 font-mono text-[11px] uppercase text-white/50">{hex}</div>
    </div>
  );
}
