import { AlertTriangle } from "lucide-react";
import { STAGES, STAGE_RAMP, fr } from "@/lib/dashboard-data";

interface FunnelBarProps {
  counts: Record<string, number>;
  lang: string;
  onSelect?: (stageKey: string) => void;
  selected?: string | null;
  /** "auto": columns from the sm breakpoint up, bars below. "bars": always stacked bars (narrow containers). */
  variant?: "auto" | "bars";
}

/**
 * Pipeline funnel: one lime ramp (light → dark) for progression, warning tone + icon for "unreachable".
 * Columns on wide screens, stacked horizontal bars on narrow screens. Never scrolls.
 */
const FunnelBar = ({ counts, lang, onSelect, selected, variant = "auto" }: FunnelBarProps) => {
  const total = Object.values(counts).reduce((a, b) => a + b, 0);
  const ordered = STAGES.filter((s) => s.kind !== "lost");
  const lost = STAGES.find((s) => s.kind === "lost")!;
  const max = Math.max(1, ...ordered.map((s) => counts[s.key] ?? 0));
  const convOf = (i: number) => {
    const c = counts[ordered[i].key] ?? 0;
    if (i === 0) return total ? `${Math.round((c / total) * 100)}%` : "";
    const prev = counts[ordered[i - 1].key] ?? 0;
    return prev === 0 ? "" : `${Math.round((c / prev) * 100)}% →`;
  };
  const label = (s: (typeof ordered)[0]) => (fr(lang) ? s.fr : s.en);

  return (
    <div>
      {/* Wide: columns */}
      <div className={`${variant === "bars" ? "hidden" : "hidden sm:grid"} gap-2`} style={{ gridTemplateColumns: `repeat(${ordered.length}, minmax(0, 1fr))` }}>
        {ordered.map((s, i) => {
          const c = counts[s.key] ?? 0;
          const active = selected === s.key;
          return (
            <button
              key={s.key}
              type="button"
              onClick={() => onSelect?.(s.key)}
              title={`${label(s)}: ${c}`}
              className={`text-left rounded-xl p-2 transition-colors ${onSelect ? "hover:bg-[hsl(var(--dash-muted)/.5)]" : "cursor-default"} ${active ? "bg-[hsl(var(--dash-muted)/.7)]" : ""}`}
            >
              <div className="h-16 flex items-end">
                <div className="w-full rounded-t-[4px] rounded-b-[2px] transition-all duration-500" style={{ height: `${Math.max(6, (c / max) * 100)}%`, background: STAGE_RAMP[s.step] }} />
              </div>
              <p className="mt-2 text-[18px] leading-none font-semibold text-[hsl(var(--dash-fg))]">{c}</p>
              <p className="mt-1 text-[11px] leading-tight text-[hsl(var(--dash-muted-fg))] truncate">{label(s)}</p>
              <p className="text-[10px] text-[hsl(var(--dash-muted-fg))] opacity-70">{convOf(i)}</p>
            </button>
          );
        })}
      </div>

      {/* Narrow: stacked bars */}
      <ul className={`${variant === "bars" ? "" : "sm:hidden"} space-y-2`}>
        {ordered.map((s, i) => {
          const c = counts[s.key] ?? 0;
          const active = selected === s.key;
          return (
            <li key={s.key}>
              <button
                type="button"
                onClick={() => onSelect?.(s.key)}
                className={`w-full text-left rounded-lg px-2 py-1.5 transition-colors ${onSelect ? "active:bg-[hsl(var(--dash-muted)/.5)]" : "cursor-default"} ${active ? "bg-[hsl(var(--dash-muted)/.7)]" : ""}`}
              >
                <div className="flex items-center justify-between text-[12px] mb-1">
                  <span className="text-[hsl(var(--dash-fg))] font-medium">{label(s)}</span>
                  <span className="text-[hsl(var(--dash-muted-fg))]"><span className="font-semibold text-[hsl(var(--dash-fg))]">{c}</span> <span className="opacity-70">{convOf(i)}</span></span>
                </div>
                <div className="h-2 rounded-full bg-[hsl(var(--dash-muted))] overflow-hidden">
                  <div className="h-full rounded-full transition-all duration-500" style={{ width: `${Math.max(2, (c / max) * 100)}%`, background: STAGE_RAMP[s.step] }} />
                </div>
              </button>
            </li>
          );
        })}
      </ul>

      {(counts[lost.key] ?? 0) > 0 && (
        <div className="mt-3 inline-flex items-center gap-1.5 text-[11px] font-medium px-2 py-1 rounded-md" style={{ background: "hsl(38 92% 50% / .12)", color: "hsl(38 92% 60%)" }}>
          <AlertTriangle className="w-3 h-3" /> {counts[lost.key]} {fr(lang) ? lost.fr.toLowerCase() : lost.en.toLowerCase()}
        </div>
      )}
    </div>
  );
};

export default FunnelBar;
