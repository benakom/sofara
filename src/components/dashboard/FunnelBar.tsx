import { AlertTriangle, PauseCircle } from "lucide-react";
import { STAGES, STAGE_RAMP, fr } from "@/lib/dashboard-data";
import { LEAD_PHASES } from "@/lib/lead-stages";

interface FunnelBarProps {
  /** Counts per stage key. */
  counts: Record<string, number>;
  lang: string;
  /** Receives "phase:<key>" (usable as the pipeline `stage` filter). */
  onSelect?: (filterKey: string) => void;
  selected?: string | null;
  /** "auto": columns from the sm breakpoint up, bars below. "bars": always stacked bars (narrow containers). */
  variant?: "auto" | "bars";
}

/**
 * Pipeline funnel grouped by phase (contact → qualification → projects → offer → closing), one lime ramp
 * light → dark. Paused and lost leads are summarised under the funnel. Never scrolls.
 */
const FunnelBar = ({ counts, lang, onSelect, selected, variant = "auto" }: FunnelBarProps) => {
  const isFr = fr(lang);
  const phases = LEAD_PHASES.filter((p) => p.key !== "closed").map((p) => {
    const stages = STAGES.filter((s) => s.phase === p.key && s.step > 0);
    return { ...p, key: p.key, filter: `phase:${p.key}`, count: stages.reduce((a, s) => a + (counts[s.key] ?? 0), 0), step: stages[Math.floor(stages.length / 2)]?.step ?? 1 };
  });
  const total = Object.values(counts).reduce((a, b) => a + b, 0);
  const paused = STAGES.filter((s) => s.kind === "paused").reduce((a, s) => a + (counts[s.key] ?? 0), 0);
  const lost = STAGES.filter((s) => s.kind === "lost").reduce((a, s) => a + (counts[s.key] ?? 0), 0);
  const max = Math.max(1, ...phases.map((p) => p.count));
  const convOf = (i: number) => {
    const c = phases[i].count;
    if (i === 0) return total ? `${Math.round((c / total) * 100)}%` : "";
    const prev = phases[i - 1].count;
    return prev === 0 ? "" : `${Math.round((c / prev) * 100)}% →`;
  };
  const label = (p: (typeof phases)[0]) => (isFr ? p.fr : p.en);

  return (
    <div>
      {/* Wide: columns */}
      <div className={`${variant === "bars" ? "hidden" : "hidden sm:grid"} gap-2`} style={{ gridTemplateColumns: `repeat(${phases.length}, minmax(0, 1fr))` }}>
        {phases.map((p, i) => {
          const active = selected === p.filter;
          return (
            <button
              key={p.key}
              type="button"
              onClick={() => onSelect?.(p.filter)}
              title={`${label(p)}: ${p.count}`}
              className={`text-left rounded-xl p-2 transition-colors ${onSelect ? "hover:bg-[hsl(var(--dash-muted)/.5)]" : "cursor-default"} ${active ? "bg-[hsl(var(--dash-muted)/.7)]" : ""}`}
            >
              <div className="h-16 flex items-end">
                <div className="w-full rounded-t-[4px] rounded-b-[2px] transition-all duration-500" style={{ height: `${Math.max(6, (p.count / max) * 100)}%`, background: STAGE_RAMP[p.step] }} />
              </div>
              <p className="mt-2 text-[18px] leading-none font-semibold text-[hsl(var(--dash-fg))]">{p.count}</p>
              <p className="mt-1 text-[11px] leading-tight text-[hsl(var(--dash-muted-fg))] truncate">{label(p)}</p>
              <p className="text-[10px] text-[hsl(var(--dash-muted-fg))] opacity-70">{convOf(i)}</p>
            </button>
          );
        })}
      </div>

      {/* Narrow: stacked bars */}
      <ul className={`${variant === "bars" ? "" : "sm:hidden"} space-y-2`}>
        {phases.map((p, i) => {
          const active = selected === p.filter;
          return (
            <li key={p.key}>
              <button
                type="button"
                onClick={() => onSelect?.(p.filter)}
                className={`w-full text-left rounded-lg px-2 py-1.5 transition-colors ${onSelect ? "active:bg-[hsl(var(--dash-muted)/.5)]" : "cursor-default"} ${active ? "bg-[hsl(var(--dash-muted)/.7)]" : ""}`}
              >
                <div className="flex items-center justify-between text-[12px] mb-1">
                  <span className="text-[hsl(var(--dash-fg))] font-medium">{label(p)}</span>
                  <span className="text-[hsl(var(--dash-muted-fg))]"><span className="font-semibold text-[hsl(var(--dash-fg))]">{p.count}</span> <span className="opacity-70">{convOf(i)}</span></span>
                </div>
                <div className="h-2 rounded-full bg-[hsl(var(--dash-muted))] overflow-hidden">
                  <div className="h-full rounded-full transition-all duration-500" style={{ width: `${Math.max(2, (p.count / max) * 100)}%`, background: STAGE_RAMP[p.step] }} />
                </div>
              </button>
            </li>
          );
        })}
      </ul>

      {(paused > 0 || lost > 0) && (
        <div className="mt-3 flex flex-wrap gap-2">
          {paused > 0 && (
            <button type="button" onClick={() => onSelect?.("kind:paused")} className="inline-flex items-center gap-1.5 text-[11px] font-medium px-2 py-1 rounded-md" style={{ background: "hsl(38 92% 50% / .12)", color: "hsl(38 92% 60%)" }}>
              <PauseCircle className="w-3 h-3" /> {paused} {isFr ? "en pause / injoignable" : "on hold / unreachable"}
            </button>
          )}
          {lost > 0 && (
            <button type="button" onClick={() => onSelect?.("kind:lost")} className="inline-flex items-center gap-1.5 text-[11px] font-medium px-2 py-1 rounded-md" style={{ background: "hsl(0 72% 51% / .12)", color: "hsl(0 72% 60%)" }}>
              <AlertTriangle className="w-3 h-3" /> {lost} {isFr ? "perdu(s)" : "lost"}
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default FunnelBar;
