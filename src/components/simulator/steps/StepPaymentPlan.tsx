import { PAYMENT_PLANS } from "../simulator-data";
import type { SimulationData } from "../simulator-types";
import type { Lang } from "@/i18n/translations";

type Props = {
  value: SimulationData["paymentPlan"];
  onChange: (v: SimulationData["paymentPlan"]) => void;
  lang: Lang;
};

const StepPaymentPlan = ({ value, onChange, lang }: Props) => (
  <div>
    <div className="text-center mb-8">
      <h2 className="text-2xl font-bold text-[hsl(var(--dash-fg))] font-display">
        📋 {lang === "ar" ? "Plan de paiement" : "Payment Plan"}
      </h2>
      <p className="text-sm text-[hsl(var(--dash-muted-fg))] mt-2">
        {lang === "ar" ? "Comment souhaitez-vous répartir les paiements ?" : "How would you like to split your payments?"}
      </p>
    </div>
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {PAYMENT_PLANS.map((plan) => (
        <button
          key={plan.value}
          onClick={() => onChange(plan.value)}
          className={`relative flex flex-col items-center gap-3 px-4 py-6 rounded-2xl border-2 text-center transition-all ${
            value === plan.value
              ? "border-[hsl(var(--dash-accent))] bg-[hsl(var(--dash-accent)/.08)] shadow-md"
              : "border-[hsl(var(--dash-border))] bg-[hsl(var(--dash-card))] hover:border-[hsl(var(--dash-accent)/.3)] hover:shadow-sm"
          }`}
        >
          <div className={`w-14 h-14 rounded-xl flex items-center justify-center text-lg font-black ${
            value === plan.value
              ? "bg-[hsl(var(--dash-accent))] text-[hsl(var(--dash-accent-fg))]"
              : "bg-[hsl(var(--dash-muted))] text-[hsl(var(--dash-fg))]"
          }`}>
            {plan.label}
          </div>
          <div>
            <p className="text-xs font-semibold text-[hsl(var(--dash-fg))]">{plan.constructionPct}% / {plan.handoverPct}%</p>
            <div className="w-full h-1.5 rounded-full bg-[hsl(var(--dash-muted))] overflow-hidden mt-2">
              <div
                className="h-full rounded-full bg-[hsl(var(--dash-accent))]"
                style={{ width: `${plan.constructionPct}%` }}
              />
            </div>
          </div>
          {value === plan.value && (
            <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-[hsl(var(--dash-accent))] flex items-center justify-center">
              <svg className="w-3 h-3 text-[hsl(var(--dash-accent-fg))]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
          )}
        </button>
      ))}
    </div>

    <div className="mt-6 p-4 rounded-xl bg-[hsl(var(--dash-accent)/.08)] border border-[hsl(var(--dash-accent)/.2)]">
      <h3 className="text-xs font-bold text-[hsl(var(--dash-accent))] mb-1">💡 {lang === "ar" ? "لماذا هذا مهم؟" : "WHY DOES THIS MATTER?"}</h3>
      <p className="text-xs text-[hsl(var(--dash-muted-fg))] leading-relaxed">
        {lang === "ar"
          ? "Le plan de paiement détermine combien vous payez pendant la construction et combien à la remise des clés. Un plan 60/40 est le plus courant à Dubaï."
          : "The payment plan determines how much you pay during construction vs on handover. A 60/40 plan is the most common in Dubai."}
      </p>
    </div>
  </div>
);

export default StepPaymentPlan;
