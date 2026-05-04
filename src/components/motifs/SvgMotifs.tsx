import { simulateCvd } from "../../lib/color";
import { usePaletteStore } from "../../store/paletteStore";

type Common = {
  primary: string;
  secondary: string;
  accent: string;
  size?: number;
  className?: string;
};

function withCvd(hex: string) {
  const cvd = usePaletteStore.getState().cvd;
  return simulateCvd(hex, cvd);
}

export function CubeMotif({ primary, secondary, accent, size = 72 }: Common) {
  return (
    <svg viewBox="0 0 100 100" width={size} height={size}>
      <g fill="none" strokeLinejoin="round" strokeLinecap="round" strokeWidth="2.4">
        <path d="M50 12 L84 30 L84 70 L50 88 L16 70 L16 30 Z" stroke={primary} />
        <path d="M50 12 L50 50" stroke={accent} />
        <path d="M50 50 L84 30" stroke={secondary} />
        <path d="M50 50 L16 30" stroke={secondary} />
        <path d="M50 50 L50 88" stroke={secondary} opacity="0.55" />
      </g>
      <circle cx="50" cy="50" r="3.5" fill={accent} />
    </svg>
  );
}

export function FlatCubeMotif({ primary, secondary, accent, size = 72 }: Common) {
  return (
    <svg viewBox="0 0 100 100" width={size} height={size}>
      <polygon points="50,8 90,28 50,48 10,28" fill={primary} />
      <polygon points="10,28 50,48 50,92 10,72" fill={secondary} />
      <polygon points="90,28 50,48 50,92 90,72" fill={accent} />
    </svg>
  );
}

export function GridCubeMotif({ primary, secondary, accent, size = 80 }: Common) {
  const cells = [];
  for (let x = 0; x < 3; x++) {
    for (let y = 0; y < 3; y++) {
      const colors = [primary, secondary, accent];
      const c = colors[(x + y) % 3];
      cells.push(
        <rect
          key={`${x}-${y}`}
          x={10 + x * 26}
          y={10 + y * 26}
          width="22"
          height="22"
          rx="3"
          fill={c}
          opacity={0.85 - ((x + y) % 3) * 0.1}
        />,
      );
    }
  }
  return (
    <svg viewBox="0 0 100 100" width={size} height={size}>
      {cells}
    </svg>
  );
}

export function CubeClusterMotif({ primary, secondary, accent, size = 90 }: Common) {
  return (
    <svg viewBox="0 0 120 100" width={size} height={size}>
      <FlatCubeIso x={20} y={30} fill={primary} alt={secondary} side={accent} />
      <FlatCubeIso x={50} y={20} fill={secondary} alt={primary} side={accent} />
      <FlatCubeIso x={80} y={30} fill={accent} alt={primary} side={secondary} />
      <FlatCubeIso x={50} y={55} fill={primary} alt={accent} side={secondary} />
    </svg>
  );
}

function FlatCubeIso({
  x,
  y,
  fill,
  alt,
  side,
}: {
  x: number;
  y: number;
  fill: string;
  alt: string;
  side: string;
}) {
  return (
    <g transform={`translate(${x},${y})`}>
      <polygon points="0,8 16,0 32,8 16,16" fill={fill} />
      <polygon points="0,8 16,16 16,32 0,24" fill={alt} opacity="0.85" />
      <polygon points="32,8 16,16 16,32 32,24" fill={side} opacity="0.85" />
    </g>
  );
}

export function TranslucentCubeMotif({ primary, secondary, accent, size = 80 }: Common) {
  return (
    <svg viewBox="0 0 100 100" width={size} height={size}>
      <defs>
        <linearGradient id="trcube" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0" stopColor={primary} stopOpacity="0.8" />
          <stop offset="1" stopColor={secondary} stopOpacity="0.4" />
        </linearGradient>
      </defs>
      <polygon
        points="50,10 86,30 86,70 50,90 14,70 14,30"
        fill="url(#trcube)"
        stroke={accent}
        strokeWidth="1.6"
      />
      <path
        d="M50 10 L50 50 L86 30 M50 50 L14 30 M50 50 L50 90"
        stroke={accent}
        strokeWidth="1"
        fill="none"
        opacity="0.7"
      />
    </svg>
  );
}

export function KeyholeCubeMotif({ primary, secondary, accent, size = 80 }: Common) {
  return (
    <svg viewBox="0 0 100 100" width={size} height={size}>
      <rect x="14" y="14" width="72" height="72" rx="14" fill={primary} />
      <circle cx="50" cy="42" r="10" fill={secondary} />
      <rect x="46" y="48" width="8" height="22" rx="2" fill={secondary} />
      <rect
        x="14"
        y="14"
        width="72"
        height="72"
        rx="14"
        fill="none"
        stroke={accent}
        strokeWidth="2"
      />
    </svg>
  );
}

export function FlagCubeMotif({ primary, secondary, accent, size = 80 }: Common) {
  return (
    <svg viewBox="0 0 100 100" width={size} height={size}>
      <rect x="14" y="14" width="72" height="72" rx="12" fill={primary} />
      <path d="M30 26 L30 78" stroke={accent} strokeWidth="3" />
      <path
        d="M30 26 L70 30 L60 42 L70 54 L30 50 Z"
        fill={secondary}
        stroke={accent}
        strokeWidth="1.4"
      />
    </svg>
  );
}

export function TerminalPromptMotif({ primary, secondary, accent, size = 80 }: Common) {
  return (
    <svg viewBox="0 0 100 60" width={size} height={(size * 60) / 100}>
      <rect x="8" y="8" width="84" height="44" rx="8" fill={primary} />
      <text
        x="20"
        y="36"
        fontFamily="ui-monospace, Menlo, monospace"
        fontSize="22"
        fontWeight="800"
        fill={accent}
      >
        &gt;_
      </text>
      <rect x="50" y="22" width="30" height="14" rx="2" fill={secondary} opacity="0.9" />
    </svg>
  );
}

export function CircuitMotif({ primary, secondary, accent, size = 96 }: Common) {
  return (
    <svg viewBox="0 0 120 60" width={size} height={(size * 60) / 120}>
      <g stroke={primary} strokeWidth="2" fill="none">
        <path d="M0 30 H30 L40 20 H60 L70 30 H120" />
      </g>
      <circle cx="30" cy="30" r="3" fill={accent} />
      <circle cx="60" cy="20" r="3" fill={secondary} />
      <circle cx="70" cy="30" r="3" fill={accent} />
      <rect x="40" y="14" width="20" height="12" fill="none" stroke={secondary} strokeWidth="1.5" />
    </svg>
  );
}

export function LockCoreMotif({ primary, secondary, accent, size = 80 }: Common) {
  return (
    <svg viewBox="0 0 100 100" width={size} height={size}>
      <circle cx="50" cy="50" r="36" fill={primary} />
      <circle cx="50" cy="50" r="22" fill={secondary} />
      <circle cx="50" cy="50" r="10" fill={accent} />
      <rect x="46" y="20" width="8" height="14" fill={accent} />
      <rect x="46" y="66" width="8" height="14" fill={accent} />
    </svg>
  );
}

export function BracketMarkMotif({ primary, secondary, accent, size = 90 }: Common) {
  return (
    <svg viewBox="0 0 120 60" width={size} height={(size * 60) / 120}>
      <text
        x="10"
        y="44"
        fontFamily="ui-monospace, Menlo, monospace"
        fontSize="34"
        fontWeight="800"
        fill={primary}
      >
        {"{"}
      </text>
      <text
        x="56"
        y="40"
        fontFamily="Inter, sans-serif"
        fontSize="18"
        fontWeight="800"
        fill={accent}
      >
        CTF
      </text>
      <text
        x="100"
        y="44"
        fontFamily="ui-monospace, Menlo, monospace"
        fontSize="34"
        fontWeight="800"
        fill={secondary}
      >
        {"}"}
      </text>
    </svg>
  );
}

export function MotifWithCvd(props: Common & { Comp: React.ComponentType<Common> }) {
  const cvd = usePaletteStore((s) => s.cvd);
  const p = simulateCvd(props.primary, cvd);
  const s = simulateCvd(props.secondary, cvd);
  const a = simulateCvd(props.accent, cvd);
  const { Comp } = props;
  return <Comp {...props} primary={p} secondary={s} accent={a} />;
}

export { withCvd };
