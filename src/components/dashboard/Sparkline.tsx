interface SparklineProps {
  points: number[];
  width?: number;
  height?: number;
  /** Stroke for the whole series (de-emphasis); the last point gets the accent dot. */
  stroke?: string;
  accent?: string;
  className?: string;
}

/** 12–14 point sparkline: 2px line, area tint, accent dot on the current period. */
const Sparkline = ({ points, width = 96, height = 32, stroke = "hsl(78 45% 45%)", accent = "hsl(68 88% 62%)", className }: SparklineProps) => {
  if (points.length < 2) return null;
  const max = Math.max(...points, 1);
  const padX = 4;
  const stepX = (width - padX * 2) / (points.length - 1);
  const pad = 4;
  const y = (v: number) => height - pad - (v / max) * (height - pad * 2);
  const coords = points.map((v, i) => [padX + i * stepX, y(v)] as const);
  const d = coords.map(([x, yy], i) => `${i === 0 ? "M" : "L"}${x.toFixed(1)},${yy.toFixed(1)}`).join(" ");
  const [lx, ly] = coords[coords.length - 1];
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className={className} style={{ overflow: "visible" }} aria-hidden="true">
      <path d={d} fill="none" stroke={stroke} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
      <circle cx={lx} cy={ly} r="3.5" fill={accent} stroke="hsl(var(--dash-card))" strokeWidth="2" />
    </svg>
  );
};

export default Sparkline;
