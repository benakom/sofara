import { useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Crown, Loader2, CheckCircle2, Settings2, Sparkles } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";
import { useSubscription } from "@/hooks/useSubscription";
import { useToast } from "@/hooks/use-toast";
import ProBenefits from "@/components/dashboard/ProBenefits";
import ProPricing from "@/components/dashboard/ProPricing";

/** /dashboard/pro — Sofara Pro pricing page for basic members, subscription hub for Pro members. */
const SofaraPro = () => {
  const { lang } = useLanguage();
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();
  const { toast } = useToast();
  const { isPro, subscribed, plan, subscription_end, cancel_at_period_end, source, loading, refresh, openPortal, portalLoading } = useSubscription();
  const fr = lang === "ar";

  // Back from Stripe checkout: re-sync and greet.
  useEffect(() => {
    const status = params.get("checkout");
    if (!status) return;
    if (status === "success") {
      refresh();
      toast({ title: fr ? "Bienvenue dans Sofara Pro !" : "Welcome to Sofara Pro!", description: fr ? "Votre abonnement est actif. Vos outils Pro sont débloqués." : "Your subscription is active. Your Pro tools are unlocked." });
    } else if (status === "cancel") {
      toast({ title: fr ? "Paiement annulé" : "Checkout cancelled", description: fr ? "Aucun montant n'a été débité." : "Nothing was charged." });
    }
    params.delete("checkout");
    setParams(params, { replace: true });
  }, [params, setParams, refresh, toast, fr]);

  const endDate = subscription_end
    ? new Date(subscription_end).toLocaleDateString(fr ? "fr-FR" : "en-GB", { day: "2-digit", month: "long", year: "numeric" })
    : null;

  if (loading) {
    return <div className="flex justify-center py-20"><Loader2 className="w-6 h-6 animate-spin text-[hsl(var(--dash-accent))]" /></div>;
  }

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="max-w-5xl">
      {/* Hero */}
      <div className="relative overflow-hidden rounded-3xl bg-[hsl(0,0%,7%)] p-6 sm:p-10 mb-6 shadow-lg">
        <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-[#D2F34C]/10 blur-3xl pointer-events-none" />
        <div className="relative">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D2F34C]/15 border border-[#D2F34C]/30 mb-4">
            <Crown className="w-3.5 h-3.5 text-[#D2F34C]" />
            <span className="text-[#D2F34C] text-[11px] font-semibold uppercase tracking-wider">Sofara Pro</span>
          </div>

          {isPro ? (
            <>
              <h1 className="text-3xl sm:text-4xl font-display font-extrabold text-white tracking-tight mb-3">
                {fr ? "Vous êtes membre Pro" : "You are a Pro member"}
              </h1>
              <p className="text-white/60 max-w-2xl mb-6">
                {source === "manual" || !subscribed
                  ? (fr ? "Accès Pro accordé par l'équipe Sofara." : "Pro access granted by the Sofara team.")
                  : fr
                    ? `Abonnement ${plan === "yearly" ? "annuel" : "mensuel"} actif${endDate ? `, ${cancel_at_period_end ? "se termine le" : "prochain renouvellement le"} ${endDate}` : ""}.`
                    : `${plan === "yearly" ? "Yearly" : "Monthly"} subscription active${endDate ? `, ${cancel_at_period_end ? "ends on" : "renews on"} ${endDate}` : ""}.`}
              </p>
              <div className="flex flex-wrap gap-3">
                <button onClick={() => navigate("/dashboard/ai-hub")} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#D2F34C] text-black text-sm font-bold hover:bg-[#c4e63d]">
                  <Sparkles className="w-4 h-4" /> {fr ? "Ouvrir mes outils Pro" : "Open my Pro tools"}
                </button>
                {subscribed && source === "stripe" && (
                  <button onClick={() => openPortal().catch((e) => toast({ variant: "destructive", title: "Error", description: (e as Error).message }))} disabled={portalLoading} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/10 text-white text-sm font-semibold hover:bg-white/15 disabled:opacity-60">
                    {portalLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Settings2 className="w-4 h-4" />} {fr ? "Gérer mon abonnement" : "Manage subscription"}
                  </button>
                )}
              </div>
            </>
          ) : (
            <>
              <h1 className="text-3xl sm:text-4xl font-display font-extrabold text-white tracking-tight mb-3">
                {fr ? "Qualifiez, présentez, closez. Gagnez plus." : "Qualify, present, close. Earn more."}
              </h1>
              <p className="text-white/60 max-w-2xl mb-6">
                {fr
                  ? "Sofara Pro est fait pour les agents immobiliers et les passionnés de l'immobilier à Dubai qui veulent qualifier leurs leads, présenter les projets comme des pros et toucher une commission supplémentaire. Inclus : Oleadoo CRM, WhatsApp AI, campagnes marketing IA et agent IA."
                  : "Sofara Pro is built for real estate agents and Dubai property enthusiasts who want to qualify their leads, present projects like pros and earn an extra commission. Included: Oleadoo CRM, WhatsApp AI, AI marketing campaigns and an AI agent."}
              </p>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-w-2xl">
                {(fr
                  ? ["CRM Oleadoo inclus", "WhatsApp AI qui qualifie vos leads 24/7", "Campagnes marketing générées par l'IA", "Commission majorée sur chaque vente"]
                  : ["Oleadoo CRM included", "WhatsApp AI qualifying your leads 24/7", "AI-generated marketing campaigns", "Boosted commission on every closing"]
                ).map((t) => (
                  <li key={t} className="flex items-center gap-2 text-sm text-white/85"><CheckCircle2 className="w-4 h-4 text-[#D2F34C] shrink-0" /> {t}</li>
                ))}
              </ul>
            </>
          )}
        </div>
      </div>

      {/* Pricing */}
      {!isPro && (
        <div className="rounded-3xl bg-[hsl(0,0%,7%)] p-6 sm:p-8 mb-6 shadow-lg">
          <h2 className="text-xl font-display font-bold text-white mb-1">{fr ? "Choisissez votre formule" : "Choose your plan"}</h2>
          <p className="text-sm text-white/55 mb-5">{fr ? "99 $ par mois, ou 990 $ par an avec 2 mois offerts." : "$99 per month, or $990 per year with 2 months free."}</p>
          <ProPricing lang={lang} />
        </div>
      )}

      {/* Benefits */}
      <div className="rounded-3xl bg-[hsl(0,0%,7%)] p-6 sm:p-8 shadow-lg">
        <h2 className="text-xl font-display font-bold text-white mb-1">{fr ? "Tout ce que Sofara Pro vous apporte" : "Everything Sofara Pro gives you"}</h2>
        <p className="text-sm text-white/55 mb-5">{fr ? "Des outils qu'une agence facture des milliers de dirhams, inclus dans votre abonnement." : "Tools an agency charges thousands of dirhams for, included in your subscription."}</p>
        <ProBenefits lang={lang} />
      </div>
    </motion.div>
  );
};

export default SofaraPro;
