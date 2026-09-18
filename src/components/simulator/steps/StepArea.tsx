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
          📍 {lang === "ar" ? "Choisissez la zone" : "Select Area"}
        </h2>
        <p className="text-sm text-[hsl(var(--dash-muted-fg))] mt-2">
          {lang === "ar" ? "Où souhaitez-vous investir à Dubaï ?" : "Where do you want to invest in Dubai?"}
        </p>
      </div>

      {/* Search */}
      <div className="relative mb-5">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[hsl(var(--dash-muted-fg))]" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={lang === "ar" ? "Rechercher une zone..." : "Search areas..."}
          className="w-full h-12 rounded-xl border-2 border-[hsl(var(--dash-border))] bg-[hsl(var(--dash-card))] pl-11 pr-4 text-sm text-[hsl(var(--dash-fg))] placeholder:text-[hsl(var(--dash-muted-fg))] focus:outline-none focus:border-[hsl(var(--dash-accent))] transition-colors"
        />
      </div>

      {/* Area grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 max-h-[400px] overflow-y-auto pr-1">
        {filtered.map((area) => (
          <button
            key={area.value}
            onClick={() => onChange(area.value, area.label, area.avgPriceSqft, area.avgRoi)}
            className={`relative flex flex-col items-center gap-1.5 px-3 py-4 rounded-2xl border-2 text-center transition-all ${
              value === area.value
                ? "border-[hsl(var(--dash-accent))] bg-[hsl(var(--dash-accent)/.08)] shadow-md"
                : "border-[hsl(var(--dash-border))] bg-[hsl(var(--dash-card))] hover:border-[hsl(var(--dash-accent)/.3)] hover:shadow-sm"
            }`}
          >
            <span className="text-sm font-semibold text-[hsl(var(--dash-fg))]">{area.label}</span>
            <p className="text-xs font-medium text-[hsl(var(--dash-muted-fg))]">
              {area.avgPriceSqft.toLocaleString()} AED/sqft
            </p>
            <p className="text-[11px] text-[hsl(var(--dash-accent-ink))] font-semibold">{area.avgRoi}% ROI</p>
            {area.popular && (
              <span className="absolute top-1.5 right-1.5 text-[8px] font-bold px-1.5 py-0.5 rounded-full bg-[hsl(var(--dash-accent))] text-[hsl(var(--dash-accent-fg))]">
                ★
              </span>
            )}
            {value === area.value && (
              <div className="absolute top-1.5 left-1.5 w-4 h-4 rounded-full bg-[hsl(var(--dash-accent))] flex items-center justify-center">
                <svg className="w-2.5 h-2.5 text-[hsl(var(--dash-accent-fg))]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
            )}
          </button>
        ))}
        {filtered.length === 0 && (
          <p className="col-span-full text-center text-sm text-[hsl(var(--dash-muted-fg))] py-8">
            {lang === "ar" ? "Aucune zone trouvée" : "No areas found"}
          </p>
        )}
      </div>
    </div>
  );
};

export default StepArea;
