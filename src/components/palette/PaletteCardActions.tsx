import { useState, useCallback } from "react";

export type PaletteCardAction = {
  id: string;
  icon: React.ReactNode;
  tooltip: string;
  ariaLabel: string;
  ariaPressed?: boolean;
  active?: boolean;
  disabled?: boolean;
  onClick: (e: React.MouseEvent) => void;
};

type Surfaces = {
  pillBg: string;
  pillBorder: string;
  hoverBg: string;
  activeBg: string;
};

const LIGHT: Surfaces = {
  pillBg: "rgba(255,255,255,0.16)",
  pillBorder: "rgba(255,255,255,0.22)",
  hoverBg: "rgba(255,255,255,0.18)",
  activeBg: "rgba(255,255,255,0.28)",
};

const DARK: Surfaces = {
  pillBg: "rgba(0,0,0,0.34)",
  pillBorder: "rgba(0,0,0,0.28)",
  hoverBg: "rgba(0,0,0,0.28)",
  activeBg: "rgba(0,0,0,0.42)",
};

export function PaletteCardActions({
  actions,
  fg,
  isLight,
}: {
  actions: PaletteCardAction[];
  fg: string;
  isLight: boolean;
}) {
  const surface = isLight ? LIGHT : DARK;

  // The tooltip layer is a sibling of the pill — both sit inside this
  // `relative inline-flex` wrapper. Tooltip layer uses the same gap +
  // horizontal padding as the pill, with one fixed-width cell per button,
  // so tooltips line up exactly above their target button without any
  // measurement code. The pill never needs `overflow: hidden`, so focus
  // rings (which we render inside the button via inset shadow) and tooltips
  // (which sit above) can both behave correctly without conflicting.
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);
  const [focusIdx, setFocusIdx] = useState<number | null>(null);
  const visibleTip = focusIdx ?? hoverIdx;

  return (
    <div
      className="relative inline-flex"
      onClick={(e) => e.stopPropagation()}
      onDoubleClick={(e) => e.stopPropagation()}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-full left-0 right-0 mb-1.5 flex justify-center gap-1 px-2 sm:gap-1.5 sm:px-2.5 [@media(hover:none)]:hidden"
      >
        {actions.map((a, i) => (
          <span key={a.id} className="flex h-7 w-7 items-end justify-center sm:h-8 sm:w-8">
            <span
              role="tooltip"
              className={`whitespace-nowrap rounded border border-white/10 bg-black/90 px-1.5 py-0.5 text-[9.5px] font-medium text-white shadow-lg backdrop-blur transition-opacity duration-150 ${
                visibleTip === i ? "opacity-100" : "opacity-0"
              }`}
            >
              {a.tooltip}
            </span>
          </span>
        ))}
      </div>

      <div
        className="inline-flex items-center gap-1 rounded-full border px-2 py-1 shadow-md backdrop-blur-md sm:gap-1.5 sm:px-2.5"
        style={{ background: surface.pillBg, borderColor: surface.pillBorder }}
      >
        {actions.map((a, i) => (
          <ActionButton
            key={a.id}
            action={a}
            fg={fg}
            hoverBg={surface.hoverBg}
            activeBg={surface.activeBg}
            setHover={setHoverIdx}
            setFocus={setFocusIdx}
            index={i}
          />
        ))}
      </div>
    </div>
  );
}

function ActionButton({
  action,
  fg,
  hoverBg,
  activeBg,
  setHover,
  setFocus,
  index,
}: {
  action: PaletteCardAction;
  fg: string;
  hoverBg: string;
  activeBg: string;
  setHover: (i: number | null) => void;
  setFocus: (i: number | null) => void;
  index: number;
}) {
  // Imperative hover bg keeps active/disabled states sticky without fighting
  // Tailwind's variant ordering. Focus ring is `inset` so it stays inside the
  // button's circle and never escapes the pill, regardless of curvature.
  const onPointerEnter = useCallback(() => {
    setHover(index);
  }, [setHover, index]);
  const onPointerLeave = useCallback(() => {
    setHover(null);
  }, [setHover]);
  const onFocus = useCallback(() => {
    setFocus(index);
  }, [setFocus, index]);
  const onBlur = useCallback(() => {
    setFocus(null);
  }, [setFocus]);

  return (
    <button
      type="button"
      onClick={action.onClick}
      aria-label={action.ariaLabel}
      aria-pressed={action.ariaPressed}
      disabled={action.disabled}
      onPointerEnter={onPointerEnter}
      onPointerLeave={onPointerLeave}
      onFocus={onFocus}
      onBlur={onBlur}
      onMouseEnter={(e) => {
        if (action.disabled || action.active) return;
        (e.currentTarget as HTMLButtonElement).style.background = hoverBg;
      }}
      onMouseLeave={(e) => {
        if (action.active) return;
        (e.currentTarget as HTMLButtonElement).style.background = "transparent";
      }}
      className="inline-flex aspect-square h-7 w-7 flex-none items-center justify-center rounded-full outline-none transition focus-visible:shadow-[inset_0_0_0_2px_rgba(255,255,255,0.6)] active:scale-95 disabled:cursor-not-allowed disabled:opacity-30 sm:h-8 sm:w-8"
      style={{
        background: action.active ? activeBg : "transparent",
        color: fg,
      }}
    >
      {action.icon}
    </button>
  );
}
