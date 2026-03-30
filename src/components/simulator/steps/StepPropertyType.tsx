import { PROPERTY_TYPES } from "../simulator-data";
import type { SimulationData } from "../simulator-types";
import type { Lang } from "@/i18n/translations";

type Props = {
  value: SimulationData["propertyType"];
  onChange: (v: SimulationData["propertyType"]) => void;
  lang: Lang;
};

const StepPropertyType = ({ value, onChange, lang }: Props) => (
  <div>
    <div className="text-center mb-8">
      <h2 className="text-2xl font-bold text-[hsl(var(--dash-fg))] font-display">
        🏠 {lang === "ar" ? "Type de bien" : "Select Property Type"}
      </h2>
      <p className="text-sm text-[hsl(var(--dash-muted-fg))] mt-2">
        {lang === "ar" ? "Choisissez le type de bien qui vous intéresse" : "Choose the type of property you are interested in"}
      </p>
    </div>
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
      {PROPERTY_TYPES.map((pt) => {
        const isVip = pt.value === "townhouse" || pt.value === "villa";
        return (
          <button
            key={pt.value}
            onClick={() => onChange(pt.value as SimulationData["propertyType"])}
            className={`relative flex flex-col items-center gap-2 px-4 py-5 rounded-2xl border-2 text-center transition-all ${
              value === pt.value
                ? "border-[hsl(var(--dash-accent))] bg-[hsl(var(--dash-accent)/.08)] shadow-md"
                : "border-[hsl(var(--dash-border))] bg-[hsl(var(--dash-card))] hover:border-[hsl(var(--dash-accent)/.3)] hover:shadow-sm"
            }`}
          >
            <span className="text-3xl">{pt.emoji}</span>
            <div>
              <span className="text-sm font-semibold text-[hsl(var(--dash-fg))] block">{pt.label}</span>
              <p className="text-xs text-[hsl(var(--dash-muted-fg))] mt-0.5">~{pt.sqft} sqft</p>
            </div>
            {isVip && (
              <span className="absolute top-2 right-2 text-[10px] font-bold px-2 py-0.5 rounded-full bg-[hsl(var(--dash-accent))] text-[hsl(var(--dash-accent-fg))]">VIP</span>
            )}
            {value === pt.value && (
              <div className="absolute top-2 left-2 w-5 h-5 rounded-full bg-[hsl(var(--dash-accent))] flex items-center justify-center">
                <svg className="w-3 h-3 text-[hsl(var(--dash-accent-fg))]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
            )}
          </button>
        );
      })}
    </div>
  </div>
);

export default StepPropertyType;
