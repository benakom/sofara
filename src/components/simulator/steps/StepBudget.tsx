import { BUDGET_RANGES } from "../simulator-data";
import type { Lang } from "@/i18n/translations";

type Props = {
  value: number;
  onChange: (v: number) => void;
  lang: Lang;
};

const fmt = (n: number) => new Intl.NumberFormat("en-AE", { maximumFractionDigits: 0 }).format(n);

const StepBudget = ({ value, onChange, lang }: Props) => (
  <div>
    <div className="text-center mb-8">
      <h2 className="text-2xl font-bold text-[hsl(var(--dash-fg))] font-display">
        💰 {lang === "ar" ? "Votre budget" : "Your Budget"}
      </h2>
      <p className="text-sm text-[hsl(var(--dash-muted-fg))] mt-2">
        {lang === "ar" ? "Sélectionnez votre budget d'investissement" : "Select your investment budget"}
      </p>
    </div>
    <div className="grid grid-cols-3 gap-3">
      {BUDGET_RANGES.map((b) => (
        <button
          key={b.value}
          onClick={() => onChange(b.value)}
          className={`px-4 py-4 rounded-2xl border-2 text-center transition-all ${
            value === b.value
              ? "border-[hsl(var(--dash-accent))] bg-[hsl(var(--dash-accent)/.08)] shadow-md"
              : "border-[hsl(var(--dash-border))] bg-[hsl(var(--dash-card))] hover:border-[hsl(var(--dash-accent)/.3)] hover:shadow-sm"
          }`}
        >
          <span className={`text-sm font-bold ${value === b.value ? "text-[hsl(var(--dash-accent-ink))]" : "text-[hsl(var(--dash-fg))]"}`}>
            {b.label}
          </span>
        </button>
      ))}
    </div>

    {/* Custom input */}
    <div className="mt-6">
      <label className="text-xs font-medium text-[hsl(var(--dash-muted-fg))] block mb-2">
        {lang === "ar" ? "Ou entrez un montant personnalisé (AED)" : "Or enter a custom amount (AED)"}
      </label>
      <input
        type="text"
        inputMode="numeric"
        value={value ? fmt(value) : ""}
        onChange={(e) => {
          const num = parseInt(e.target.value.replace(/[^0-9]/g, ""), 10);
          if (!isNaN(num)) onChange(num);
        }}
        placeholder="e.g. 2,500,000"
        className="w-full h-12 rounded-xl border-2 border-[hsl(var(--dash-border))] bg-[hsl(var(--dash-card))] px-4 text-base font-semibold text-[hsl(var(--dash-fg))] placeholder:text-[hsl(var(--dash-muted-fg))] focus:outline-none focus:border-[hsl(var(--dash-accent))] transition-colors"
      />
    </div>

    {/* Info box */}
    <div className="mt-6 p-4 rounded-xl bg-[hsl(var(--dash-accent)/.08)] border border-[hsl(var(--dash-accent)/.2)]">
      <h3 className="text-xs font-bold text-[hsl(var(--dash-accent-ink))] mb-1">💡 {lang === "ar" ? "لماذا هذا مهم؟" : "WHY DOES THIS MATTER?"}</h3>
      <p className="text-xs text-[hsl(var(--dash-muted-fg))] leading-relaxed">
        {lang === "ar"
          ? "Votre budget détermine les types de biens et zones accessibles. Le simulateur calculera le meilleur scénario d'investissement en fonction de ce montant."
          : "Your budget determines which property types and areas are accessible. The simulator will calculate the best investment scenario based on this amount."}
      </p>
    </div>
  </div>
);

export default StepBudget;
