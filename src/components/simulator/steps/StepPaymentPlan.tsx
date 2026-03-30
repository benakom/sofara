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
    <div className="grid grid-cols-1 gap-3">
      {PAYMENT_PLANS.map((plan) => (
        <button
          key={plan.value}
          onClick={() => onChange(plan.value)}
          className={`flex items-center gap-4 px-5 py-5 rounded-2xl border-2 text-left transition-all ${
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
          <div className="flex-1">
            <p className="text-sm font-semibold text-[hsl(var(--dash-fg))]">{plan.description}</p>
            <div className="flex gap-3 mt-2">
              <div className="flex-1 h-2 rounded-full bg-[hsl(var(--dash-muted))] overflow-hidden">
                <div
                  className="h-full rounded-full bg-[hsl(var(--dash-accent))]"
                  style={{ width: `${plan.constructionPct}%` }}
                />
              </div>
              <span className="text-[10px] font-medium text-[hsl(var(--dash-muted-fg))] whitespace-nowrap">
                {plan.constructionPct}% / {plan.handoverPct}%
              </span>
            </div>
          </div>
          {value === plan.value && (
            <div className="w-6 h-6 rounded-full bg-[hsl(var(--dash-accent))] flex items-center justify-center flex-shrink-0">
              <svg className="w-3.5 h-3.5 text-[hsl(var(--dash-accent-fg))]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
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
