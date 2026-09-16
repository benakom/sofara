import { AlertTriangle } from "lucide-react";
import { STAGES, STAGE_RAMP, fr } from "@/lib/dashboard-data";

interface FunnelBarProps {
  counts: Record<string, number>;
  lang: string;
  onSelect?: (stageKey: string) => void;
  selected?: string | null;
}

/** Pipeline funnel: one lime ramp (light → dark) for progression, warning tone + icon for "unreachable". */
const FunnelBar = ({ counts, lang, onSelect, selected }: FunnelBarProps) => {
  const total = Object.values(counts).reduce((a, b) => a + b, 0);
  const ordered = STAGES.filter((s) => s.kind !== "lost");
  const lost = STAGES.find((s) => s.kind === "lost")!;
  const max = Math.max(1, ...ordered.map((s) => counts[s.key] ?? 0));

  return (
    <div>
      <div className="overflow-x-auto overflow-y-hidden -mx-2 px-2 pt-2 pb-1 [scrollbar-width:thin]">
      <div className="grid gap-2 min-w-[520px]" style={{ gridTemplateColumns: `repeat(${ordered.length}, minmax(0, 1fr))` }}>
        {ordered.map((s, i) => {
          const c = counts[s.key] ?? 0;
          const prev = i === 0 ? null : counts[ordered[i - 1].key] ?? 0;
          const conv = prev === null || prev === 0 ? null : Math.round((c / prev) * 100);
          const active = selected === s.key;
          return (
            <button
              key={s.key}
              type="button"
              onClick={() => onSelect?.(s.key)}
              title={`${fr(lang) ? s.fr : s.en}: ${c}`}
              className={`group text-left rounded-xl p-2 -mx-2 -mt-2 transition-colors ${onSelect ? "hover:bg-[hsl(var(--dash-muted)/.5)]" : "cursor-default"} ${active ? "bg-[hsl(var(--dash-muted)/.7)]" : ""}`}
            >
              <div className="h-16 flex items-end">
                <div
                  className="w-full rounded-t-[4px] rounded-b-[2px] transition-all duration-500"
                  style={{ height: `${Math.max(6, (c / max) * 100)}%`, background: STAGE_RAMP[s.step] }}
                />
              </div>
              <p className="mt-2 text-[18px] leading-none font-semibold text-[hsl(var(--dash-fg))]">{c}</p>
              <p className="mt-1 text-[11px] leading-tight text-[hsl(var(--dash-muted-fg))] truncate">{fr(lang) ? s.fr : s.en}</p>
              <p className="text-[10px] text-[hsl(var(--dash-muted-fg))] opacity-70">{conv === null ? (i === 0 ? (total ? `${Math.round((c / total) * 100)}%` : "") : "") : `${conv}% →`}</p>
            </button>
          );
        })}
      </div>
      </div>
      {(counts[lost.key] ?? 0) > 0 && (
        <div className="mt-3 inline-flex items-center gap-1.5 text-[11px] font-medium px-2 py-1 rounded-md" style={{ background: "hsl(38 92% 50% / .12)", color: "hsl(38 92% 60%)" }}>
          <AlertTriangle className="w-3 h-3" /> {counts[lost.key]} {fr(lang) ? lost.fr.toLowerCase() : lost.en.toLowerCase()}
        </div>
      )}
    </div>
  );
};

export default FunnelBar;
