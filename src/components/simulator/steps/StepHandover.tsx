import { HANDOVER_YEARS } from "../simulator-data";
import type { Lang } from "@/i18n/translations";

type Props = {
  value: number;
  onChange: (v: number) => void;
  lang: Lang;
};

const StepHandover = ({ value, onChange, lang }: Props) => (
  <div>
    <div className="text-center mb-8">
      <h2 className="text-2xl font-bold text-[hsl(var(--dash-fg))] font-display">
        📅 {lang === "ar" ? "تاريخ التسليم" : "Expected Handover"}
      </h2>
      <p className="text-sm text-[hsl(var(--dash-muted-fg))] mt-2">
        {lang === "ar" ? "متى تتوقع استلام عقارك؟" : "When do you expect to receive your property?"}
      </p>
    </div>
    <div className="grid grid-cols-3 gap-3">
      {HANDOVER_YEARS.map((year) => (
        <button
          key={year}
          onClick={() => onChange(year)}
          className={`py-5 rounded-2xl border-2 text-center transition-all ${
            value === year
              ? "border-[hsl(var(--dash-accent))] bg-[hsl(var(--dash-accent)/.06)] shadow-md"
              : "border-[hsl(var(--dash-border))] bg-white hover:border-[hsl(var(--dash-accent)/.3)] hover:shadow-sm"
          }`}
        >
          <span className={`text-xl font-black ${value === year ? "text-[hsl(var(--dash-accent))]" : "text-[hsl(var(--dash-fg))]"}`}>
            {year}
          </span>
        </button>
      ))}
    </div>

    <div className="mt-6 p-4 rounded-xl bg-blue-50 border border-blue-100">
      <h3 className="text-xs font-bold text-blue-800 mb-1">💡 {lang === "ar" ? "لماذا هذا مهم؟" : "WHY DOES THIS MATTER?"}</h3>
      <p className="text-xs text-blue-700 leading-relaxed">
        {lang === "ar"
          ? "La date de livraison détermine quand vous commencerez à percevoir des revenus locatifs. Jusque-là, votre capital est investi pendant la construction sans rendement. Cela aide à calculer votre rendement réel plus précisément."
          : "The handover date determines when you can start earning rental income. Until then, your capital is invested during construction with no returns. This helps calculate your actual cash-on-cash return more accurately."}
      </p>
    </div>
  </div>
);

export default StepHandover;
