import { ArrowDownRight, ArrowUpRight, Minus, type LucideIcon } from "lucide-react";
import Sparkline from "./Sparkline";

interface StatTileProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  /** Signed percentage vs the previous period; null hides the delta. */
  deltaPct?: number | null;
  deltaLabel?: string;
  /** Whether an increase is good (commissions) or neutral. */
  upIsGood?: boolean;
  trend?: number[];
  onClick?: () => void;
  emphasis?: boolean;
}

/** Stat tile: label · value · delta vs named period · 14-point sparkline. */
const StatTile = ({ label, value, icon: Icon, deltaPct, deltaLabel, upIsGood = true, trend, onClick, emphasis = false }: StatTileProps) => {
  const hasDelta = deltaPct !== null && deltaPct !== undefined;
  const dir = !hasDelta || deltaPct === 0 ? "flat" : deltaPct > 0 ? "up" : "down";
  const good = dir === "flat" ? null : (dir === "up") === upIsGood;
  const DeltaIcon = dir === "up" ? ArrowUpRight : dir === "down" ? ArrowDownRight : Minus;

  return (
    <button
      type="button"
      onClick={onClick}
      className={`group text-left rounded-2xl border p-5 transition-all duration-200 hover:-translate-y-0.5 ${
        emphasis
          ? "bg-[hsl(var(--dash-accent))] border-transparent text-black shadow-[var(--dash-accent-glow)]"
          : "bg-[hsl(var(--dash-card))] border-[hsl(var(--dash-border))] text-[hsl(var(--dash-fg))] hover:border-[hsl(var(--dash-card-ring))]"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className={`text-[12px] font-medium truncate ${emphasis ? "text-black/60" : "text-[hsl(var(--dash-muted-fg))]"}`}>{label}</p>
          <p className="mt-2 text-[30px] leading-none font-semibold tracking-tight">{value}</p>
        </div>
        <span className={`shrink-0 w-9 h-9 rounded-xl flex items-center justify-center ${emphasis ? "bg-black/10" : "bg-[hsl(var(--dash-accent)/.12)]"}`}>
          <Icon className={`w-4 h-4 ${emphasis ? "text-black" : "text-[hsl(var(--dash-accent))]"}`} />
        </span>
      </div>
      <div className="mt-4 flex items-end justify-between gap-3">
        <div className="min-w-0">
          {hasDelta ? (
            <span className={`inline-flex items-center gap-1 text-[12px] font-semibold ${
              emphasis ? "text-black/75" : good === null ? "text-[hsl(var(--dash-muted-fg))]" : good ? "text-[hsl(var(--dash-accent))]" : "text-[hsl(var(--dash-warning))]"
            }`}>
              <DeltaIcon className="w-3.5 h-3.5" />
              {dir === "flat" ? "0%" : `${deltaPct > 0 ? "+" : ""}${deltaPct}%`}
              {deltaLabel && <span className={`font-normal ${emphasis ? "text-black/50" : "text-[hsl(var(--dash-muted-fg))]"}`}>{deltaLabel}</span>}
            </span>
          ) : deltaLabel ? (
            <span className={`text-[12px] ${emphasis ? "text-black/60" : "text-[hsl(var(--dash-muted-fg))]"}`}>{deltaLabel}</span>
          ) : null}
        </div>
        {trend && trend.length > 1 && (
          <Sparkline
            points={trend}
            stroke={emphasis ? "rgba(0,0,0,0.45)" : "hsl(68 40% 45%)"}
            accent={emphasis ? "#000" : "hsl(68 88% 62%)"}
            className="shrink-0 opacity-90 group-hover:opacity-100"
          />
        )}
      </div>
    </button>
  );
};

export default StatTile;
