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
        🏠 {lang === "fr" ? "Type de bien" : "Select Property Type"}
      </h2>
      <p className="text-sm text-[hsl(var(--dash-muted-fg))] mt-2">
        {lang === "fr" ? "Choisissez le type de bien qui vous intéresse" : "Choose the type of property you are interested in"}
      </p>
    </div>
    <div className="grid grid-cols-1 gap-3">
      {PROPERTY_TYPES.map((pt) => {
        const isVip = pt.value === "townhouse" || pt.value === "villa";
        return (
          <button
            key={pt.value}
            onClick={() => onChange(pt.value as SimulationData["propertyType"])}
            className={`flex items-center gap-4 px-5 py-4 rounded-2xl border-2 text-left transition-all ${
              value === pt.value
                ? "border-[hsl(var(--dash-accent))] bg-[hsl(var(--dash-accent)/.06)] shadow-md"
                : "border-[hsl(var(--dash-border))] bg-white hover:border-[hsl(var(--dash-accent)/.3)] hover:shadow-sm"
            }`}
          >
            <span className="text-2xl">{pt.emoji}</span>
            <div className="flex-1">
              <span className="text-sm font-semibold text-[hsl(var(--dash-fg))]">{pt.label}</span>
              {isVip && (
                <span className="ml-2 text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-700">VIP</span>
              )}
              <p className="text-xs text-[hsl(var(--dash-muted-fg))] mt-0.5">~{pt.sqft} sqft</p>
            </div>
            {value === pt.value && (
              <div className="w-6 h-6 rounded-full bg-[hsl(var(--dash-accent))] flex items-center justify-center">
                <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
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
