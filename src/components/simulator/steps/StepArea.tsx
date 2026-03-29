import { useState, useMemo } from "react";
import { Search } from "lucide-react";
import { AREAS } from "../simulator-data";
import type { Lang } from "@/i18n/translations";

type Props = {
  value: string;
  onChange: (area: string, label: string, priceSqft: number, roi: number) => void;
  lang: Lang;
};

const StepArea = ({ value, onChange, lang }: Props) => {
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    if (!search.trim()) return AREAS;
    const q = search.toLowerCase();
    return AREAS.filter((a) => a.label.toLowerCase().includes(q));
  }, [search]);

  return (
    <div>
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-[hsl(var(--dash-fg))] font-display">
          📍 {lang === "fr" ? "Choisissez la zone" : "Select Area"}
        </h2>
        <p className="text-sm text-[hsl(var(--dash-muted-fg))] mt-2">
          {lang === "fr" ? "Où souhaitez-vous investir à Dubaï ?" : "Where do you want to invest in Dubai?"}
        </p>
      </div>

      {/* Search */}
      <div className="relative mb-5">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[hsl(var(--dash-muted-fg))]" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={lang === "fr" ? "Rechercher une zone..." : "Search areas..."}
          className="w-full h-12 rounded-xl border-2 border-[hsl(var(--dash-border))] bg-white pl-11 pr-4 text-sm text-[hsl(var(--dash-fg))] placeholder:text-[hsl(var(--dash-muted-fg))] focus:outline-none focus:border-[hsl(var(--dash-accent))] transition-colors"
        />
      </div>

      {/* Area list */}
      <div className="space-y-2 max-h-[360px] overflow-y-auto pr-1">
        {filtered.map((area) => (
          <button
            key={area.value}
            onClick={() => onChange(area.value, area.label, area.avgPriceSqft, area.avgRoi)}
            className={`w-full flex items-center justify-between px-5 py-4 rounded-2xl border-2 text-left transition-all ${
              value === area.value
                ? "border-[hsl(var(--dash-accent))] bg-[hsl(var(--dash-accent)/.06)] shadow-md"
                : "border-[hsl(var(--dash-border))] bg-white hover:border-[hsl(var(--dash-accent)/.3)] hover:shadow-sm"
            }`}
          >
            <div>
              <span className="text-sm font-semibold text-[hsl(var(--dash-fg))]">{area.label}</span>
              {area.popular && (
                <span className="ml-2 text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">
                  {lang === "fr" ? "Populaire" : "Popular"}
                </span>
              )}
            </div>
            <div className="text-right">
              <p className="text-xs font-medium text-[hsl(var(--dash-fg))]">
                {area.avgPriceSqft.toLocaleString()} AED/sqft
              </p>
              <p className="text-[11px] text-emerald-600 font-semibold">{area.avgRoi}% ROI</p>
            </div>
          </button>
        ))}
        {filtered.length === 0 && (
          <p className="text-center text-sm text-[hsl(var(--dash-muted-fg))] py-8">
            {lang === "fr" ? "Aucune zone trouvée" : "No areas found"}
          </p>
        )}
      </div>
    </div>
  );
};

export default StepArea;
