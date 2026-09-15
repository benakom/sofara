import { useState } from "react";
import { Check, Crown, Loader2, ShieldCheck } from "lucide-react";
import { useSubscription, PRO_PRICING, type ProPlan } from "@/hooks/useSubscription";
import { useToast } from "@/hooks/use-toast";

interface ProPricingProps {
  lang: string;
  /** Called after checkout redirect starts, e.g. to close a dialog. */
  onCheckoutStart?: () => void;
}

/** Plan selector (monthly / yearly with 2 months free) + Stripe checkout button. */
const ProPricing = ({ lang, onCheckoutStart }: ProPricingProps) => {
  const { startCheckout, checkoutLoading } = useSubscription();
  const { toast } = useToast();
  const [plan, setPlan] = useState<ProPlan>("yearly");
  const fr = lang === "ar";

  const handleCheckout = async () => {
    try {
      onCheckoutStart?.();
      await startCheckout(plan);
    } catch (e) {
      toast({
        variant: "destructive",
        title: fr ? "Paiement indisponible" : "Checkout unavailable",
        description: (e as Error).message || (fr ? "Réessayez dans un instant." : "Please try again in a moment."),
      });
    }
  };

  const options: { key: ProPlan; title: string; price: string; sub: string; badge?: string }[] = [
    {
      key: "monthly",
      title: fr ? "Mensuel" : "Monthly",
      price: `${PRO_PRICING.monthly.label}`,
      sub: fr ? "par mois, sans engagement" : "per month, cancel anytime",
    },
    {
      key: "yearly",
      title: fr ? "Annuel" : "Yearly",
      price: `${PRO_PRICING.yearly.label}`,
      sub: fr ? `par an, soit ${PRO_PRICING.yearly.perMonth} / mois` : `per year, i.e. ${PRO_PRICING.yearly.perMonth.replace(",", ".")} / month`,
      badge: fr ? "2 mois offerts" : "2 months free",
    },
  ];

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
        {options.map((o) => {
          const active = plan === o.key;
          return (
            <button
              key={o.key}
              type="button"
              onClick={() => setPlan(o.key)}
              className={`relative text-left rounded-2xl p-4 border transition-all ${
                active ? "border-[#D2F34C] bg-[#D2F34C]/10 shadow-[0_0_0_1px_#D2F34C]" : "border-white/10 bg-white/5 hover:border-white/25"
              }`}
            >
              {o.badge && (
                <span className="absolute -top-2.5 right-3 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#D2F34C] text-black">
                  {o.badge}
                </span>
              )}
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-semibold text-white">{o.title}</span>
                <span className={`w-4 h-4 rounded-full border flex items-center justify-center ${active ? "bg-[#D2F34C] border-[#D2F34C]" : "border-white/30"}`}>
                  {active && <Check className="w-3 h-3 text-black" />}
                </span>
              </div>
              <p className="text-2xl font-display font-black text-white leading-none">{o.price}</p>
              <p className="text-[11px] text-white/50 mt-1.5">{o.sub}</p>
            </button>
          );
        })}
      </div>

      <button
        type="button"
        onClick={handleCheckout}
        disabled={checkoutLoading !== null}
        className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-[#D2F34C] text-black font-bold text-sm py-3.5 hover:bg-[#c4e63d] disabled:opacity-60 transition-colors"
      >
        {checkoutLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Crown className="w-4 h-4" />}
        {fr
          ? plan === "yearly" ? "Passer Pro — 990 $ / an" : "Passer Pro — 99 $ / mois"
          : plan === "yearly" ? "Go Pro — $990 / year" : "Go Pro — $99 / month"}
      </button>
      <p className="flex items-center justify-center gap-1.5 text-[11px] text-white/45 mt-3">
        <ShieldCheck className="w-3.5 h-3.5" />
        {fr ? "Paiement sécurisé par Stripe · Résiliable à tout moment" : "Secure payment by Stripe · Cancel anytime"}
      </p>
    </div>
  );
};

export default ProPricing;
