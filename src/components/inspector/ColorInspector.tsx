import { Copy, Check } from "lucide-react";
import { useMemo, useState } from "react";
import { usePaletteStore } from "../../store/paletteStore";
import {
  bestTextColor,
  hexToHslObject,
  hexToOklchObject,
  hexToRgbObject,
  isValidHex,
  normalizeHex,
} from "../../lib/color";
import { ROLE_META } from "../../types";

export function ColorInspector() {
  const current = usePaletteStore((s) => s.current);
  const selected = usePaletteStore((s) => s.selectedRole);
  const updateColor = usePaletteStore((s) => s.updateColor);
  const showToast = usePaletteStore((s) => s.showToast);

  const color = useMemo(() => current.colors.find((c) => c.role === selected), [current, selected]);

  if (!color) {
    return (
      <div className="panel p-4 text-center text-xs text-white/40">Select a swatch to inspect.</div>
    );
  }

  return (
    <Inspector
      key={color.role}
      hex={color.hex}
      role={color.role}
      update={updateColor}
      showToast={showToast}
    />
  );
}

function Inspector({
  hex,
  role,
  update,
  showToast,
}: {
  hex: string;
  role: any;
  update: (role: any, hex: string) => void;
  showToast: (s: string) => void;
}) {
  const meta = ROLE_META[role as keyof typeof ROLE_META];
  const rgb = hexToRgbObject(hex);
  const hsl = hexToHslObject(hex);
  const ok = hexToOklchObject(hex);
  const [opacity, setOpacity] = useState(100);
  const [draft, setDraft] = useState(hex);
  const fg = bestTextColor(hex);

  // Keep draft synced when role changes
  if (draft.toLowerCase() !== hex.toLowerCase() && draft !== hex) {
    // only sync if user not typing — best effort
  }

  const onHexChange = (v: string) => {
    setDraft(v);
    if (isValidHex(v)) update(role, normalizeHex(v));
  };

  const onHsl = (h: number, s: number, l: number) => {
    const k = (n: number) => (n + h / 30) % 12;
    const a = (s / 100) * Math.min(l / 100, 1 - l / 100);
    const f = (n: number) => l / 100 - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
    const to = (v: number) =>
      Math.round(v * 255)
        .toString(16)
        .padStart(2, "0");
    const next = `#${to(f(0))}${to(f(8))}${to(f(4))}`.toUpperCase();
    update(role, next);
    setDraft(next);
  };

  const copy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    showToast(`Copied ${label}`);
  };

  return (
    <div className="panel overflow-hidden p-0">
      {/* Header preview */}
      <div className="relative overflow-hidden" style={{ background: hex, color: fg }}>
        <div className="grid-bg absolute inset-0 opacity-40 mix-blend-overlay" />
        <div className="relative px-4 pb-3 pt-4">
          <div className="text-[10px] font-semibold uppercase tracking-[0.2em] opacity-70">
            {role}
          </div>
          <div className="mt-1 flex items-baseline justify-between">
            <span className="text-lg font-semibold">{meta.label}</span>
            <span className="font-mono text-[12px] opacity-80">{hex.toUpperCase()}</span>
          </div>
          <p className="mt-1 max-w-md text-[11.5px] opacity-75">{meta.usage}</p>
        </div>
      </div>

      <div className="space-y-3 p-4">
        <Row label="Hex">
          <input
            value={draft}
            onChange={(e) => onHexChange(e.target.value)}
            className="input-base font-mono text-[12px] uppercase"
            spellCheck={false}
          />
          <CopyBtn onClick={() => copy(hex, "HEX")} />
        </Row>

        <Row label="RGB">
          <ReadValue value={`rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`} />
          <CopyBtn onClick={() => copy(`rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`, "RGB")} />
        </Row>
        <Row label="HSL">
          <ReadValue value={`hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`} />
          <CopyBtn onClick={() => copy(`hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`, "HSL")} />
        </Row>
        <Row label="OKLCH">
          <ReadValue value={`oklch(${ok.l} ${ok.c} ${ok.h})`} />
          <CopyBtn onClick={() => copy(`oklch(${ok.l} ${ok.c} ${ok.h})`, "OKLCH")} />
        </Row>

        <div className="space-y-2 rounded-xl border border-white/5 bg-black/30 p-3">
          <SliderRow
            label="Hue"
            value={hsl.h}
            min={0}
            max={360}
            unit="°"
            onChange={(v) => onHsl(v, hsl.s, hsl.l)}
          />
          <SliderRow
            label="Saturation"
            value={hsl.s}
            min={0}
            max={100}
            unit="%"
            onChange={(v) => onHsl(hsl.h, v, hsl.l)}
          />
          <SliderRow
            label="Lightness"
            value={hsl.l}
            min={0}
            max={100}
            unit="%"
            onChange={(v) => onHsl(hsl.h, hsl.s, v)}
          />
          <SliderRow
            label="Opacity (preview)"
            value={opacity}
            min={0}
            max={100}
            unit="%"
            onChange={setOpacity}
          />
        </div>

        <div className="rounded-xl border border-white/5 bg-black/40 p-3">
          <div className="label-eyebrow mb-2">Overlay Preview</div>
          <div className="checker-bg overflow-hidden rounded-lg">
            <div
              className="grid h-16 place-items-center text-xs font-medium"
              style={{
                backgroundColor: hex,
                opacity: opacity / 100,
                color: bestTextColor(hex),
              }}
            >
              Color × Opacity
            </div>
          </div>
        </div>

        <Recommendations hex={hex} />
      </div>
    </div>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2">
      <span className="w-12 shrink-0 text-[10.5px] uppercase tracking-wider text-white/40">
        {label}
      </span>
      <div className="flex flex-1 items-center gap-1.5">{children}</div>
    </div>
  );
}

function ReadValue({ value }: { value: string }) {
  return <div className="input-base flex-1 truncate font-mono text-[12px]">{value}</div>;
}

function CopyBtn({ onClick }: { onClick: () => void }) {
  const [done, setDone] = useState(false);
  return (
    <button
      onClick={() => {
        onClick();
        setDone(true);
        setTimeout(() => setDone(false), 1000);
      }}
      className="grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-white/10 bg-black/40 text-white/60 hover:bg-black/60 hover:text-white"
    >
      {done ? <Check size={13} /> : <Copy size={13} />}
    </button>
  );
}

function SliderRow({
  label,
  value,
  min,
  max,
  unit,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  unit: string;
  onChange: (v: number) => void;
}) {
  return (
    <div>
      <div className="mb-1 flex items-center justify-between text-[10.5px] uppercase tracking-wider text-white/45">
        <span>{label}</span>
        <span className="font-mono text-white/65">
          {Math.round(value)}
          {unit}
        </span>
      </div>
      <input
        type="range"
        value={value}
        min={min}
        max={max}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-pink-400"
      />
    </div>
  );
}

function Recommendations({ hex }: { hex: string }) {
  const { l } = hexToOklchObject(hex);
  const { c } = hexToOklchObject(hex);
  const tips: string[] = [];
  if (l < 0.18) tips.push("Background or canvas color.");
  else if (l < 0.45 && c < 0.06) tips.push("Border, divider, or surface tone.");
  else if (l > 0.85) tips.push("Body text or hero text.");
  else if (c > 0.14) tips.push("Brand accent — logo, CTA, badges.");
  else if (c > 0.06) tips.push("Secondary action or motif color.");
  else tips.push("Muted text or secondary surface.");

  const fg = bestTextColor(hex);
  tips.push(`Best legible text on this color: ${fg === "#0A0C14" ? "deep ink" : "ivory"}.`);

  return (
    <div className="rounded-xl border border-white/5 bg-black/30 p-3">
      <div className="label-eyebrow mb-1.5">Recommended Use</div>
      <ul className="grid gap-1 text-[11.5px] text-white/70">
        {tips.map((t, i) => (
          <li key={i} className="flex items-start gap-1.5">
            <span className="mt-1 inline-block h-1 w-1 shrink-0 rounded-full bg-white/40" />
            {t}
          </li>
        ))}
      </ul>
    </div>
  );
}
